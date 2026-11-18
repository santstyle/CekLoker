import { beforeEach, describe, expect, it, vi } from "vitest";

const { insert, values } = vi.hoisted(() => {
  const values = vi.fn<(nilai: Record<string, unknown>) => Promise<void>>();
  values.mockResolvedValue(undefined);
  const insert = vi.fn(() => ({ values }));
  return { insert, values };
});

vi.mock("@/lib/db/client", () => ({
  getDb: () => ({ insert }),
}));

import { POST } from "@/app/api/evaluasi/route";

const TEKS_VALID =
  "Lowongan kerja admin online. Gaji 5 juta per bulan. Hubungi WA 081234567890.";

/** Membangun permintaan POST dengan alamat klien unik per pengujian. */
function permintaan(
  body: unknown,
  alamat = "203.0.113.1",
  mentah = false,
): Request {
  // Klien HTTP sungguhan (mis. curl) selalu mengirim content-length;
  // undici tidak melakukannya otomatis, jadi di-set manual di sini.
  const badan = mentah ? String(body) : JSON.stringify(body);
  return new Request("https://cekloker.example/api/evaluasi", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": alamat,
      "content-length": String(Buffer.byteLength(badan)),
    },
    body: badan,
  });
}

beforeEach(() => {
  insert.mockClear();
  values.mockClear();
  values.mockResolvedValue(undefined);
});

describe("POST /api/evaluasi", () => {
  it("mengembalikan 201 beserta id dan hasil evaluasi", async () => {
    const respons = await POST(
      permintaan({ teksLowongan: TEKS_VALID, lokasi: "Jakarta" }),
    );

    expect(respons.status).toBe(201);
    const json = await respons.json();
    expect(json.id).toHaveLength(21);
    expect(json.hasil.band).toBeDefined();
    expect(Array.isArray(json.hasil.temuan)).toBe(true);
  });

  it("mencatat agregat anonim tanpa menyimpan teks lowongan", async () => {
    await POST(permintaan({ teksLowongan: TEKS_VALID, lokasi: "Bandung" }));

    expect(insert).toHaveBeenCalledTimes(1);
    const tersimpan = values.mock.calls[0][0];

    expect(tersimpan.region).toBe("Bandung");
    expect(tersimpan.inputLength).toBe(TEKS_VALID.length);
    expect(tersimpan.usedAi).toBe(false);
    expect(Array.isArray(tersimpan.triggeredRuleCodes)).toBe(true);

    const kunci = Object.keys(tersimpan);
    expect(kunci).not.toContain("teksLowongan");
    expect(kunci).not.toContain("text");
    expect(JSON.stringify(tersimpan)).not.toContain("081234567890");
  });

  it("menyimpan null sebagai region bila lokasi kosong", async () => {
    await POST(permintaan({ teksLowongan: TEKS_VALID }));

    expect(values.mock.calls[0][0].region).toBeNull();
  });

  it("memasang header pembatas laju pada respons sukses", async () => {
    const respons = await POST(
      permintaan({ teksLowongan: TEKS_VALID }, "203.0.113.200"),
    );

    expect(respons.headers.get("X-RateLimit-Limit")).toBe("20");
    expect(Number(respons.headers.get("X-RateLimit-Remaining"))).toBe(19);
    expect(Number(respons.headers.get("X-RateLimit-Reset"))).toBeGreaterThan(0);
  });

  it("menolak body yang bukan JSON dengan 400", async () => {
    const respons = await POST(permintaan("bukan json", "203.0.113.2", true));

    expect(respons.status).toBe(400);
    const json = await respons.json();
    expect(json.error).toContain("JSON");
    expect(insert).not.toHaveBeenCalled();
  });

  it("menolak teks lowongan yang terlalu pendek dengan 400", async () => {
    const respons = await POST(permintaan({ teksLowongan: "terlalu pendek" }));

    expect(respons.status).toBe(400);
    const json = await respons.json();
    expect(json.error).toContain("30 karakter");
    expect(insert).not.toHaveBeenCalled();
  });

  it("tetap mengirim hasil bila pencatatan agregat gagal", async () => {
    const peringatan = vi.spyOn(console, "warn").mockImplementation(() => {});
    values.mockRejectedValueOnce(new Error("database tidak terjangkau"));

    const respons = await POST(permintaan({ teksLowongan: TEKS_VALID }));

    expect(respons.status).toBe(201);
    expect(peringatan).toHaveBeenCalledOnce();
    peringatan.mockRestore();
  });

  it("membalas 429 dengan Retry-After setelah kuota terlampaui", async () => {
    const alamat = "198.51.100.77";

    for (let i = 0; i < 20; i += 1) {
      const respons = await POST(
        permintaan({ teksLowongan: TEKS_VALID }, alamat),
      );
      expect(respons.status).toBe(201);
    }

    const ditolak = await POST(
      permintaan({ teksLowongan: TEKS_VALID }, alamat),
    );

    expect(ditolak.status).toBe(429);
    expect(ditolak.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(Number(ditolak.headers.get("Retry-After"))).toBeGreaterThan(0);
    const json = await ditolak.json();
    expect(json.error).toContain("Terlalu banyak permintaan");
  });

  it("tidak menghitung ulang pencatatan saat permintaan ditolak", async () => {
    const alamat = "198.51.100.88";

    for (let i = 0; i < 20; i += 1) {
      await POST(permintaan({ teksLowongan: TEKS_VALID }, alamat));
    }

    const sebelum = insert.mock.calls.length;
    await POST(permintaan({ teksLowongan: TEKS_VALID }, alamat));

    expect(insert.mock.calls.length).toBe(sebelum);
  });

  it("membalas 413 sebelum kuota terpakai bila body melampaui batas", async () => {
    const respons = await POST(
      permintaan({ teksLowongan: "A".repeat(70_000) }, "203.0.113.55"),
    );

    expect(respons.status).toBe(413);
    const json = await respons.json();
    expect(json.error).toContain("64 KB");
    expect(insert).not.toHaveBeenCalled();

    // Guard berjalan sebelum pembatas laju: kuota klien tidak terkuras.
    const lanjutan = await POST(
      permintaan({ teksLowongan: TEKS_VALID }, "203.0.113.55"),
    );
    expect(lanjutan.status).toBe(201);
  });
});

describe("POST /api/evaluasi — privasi", () => {
  const PENANDA = "TEKS_PENANDA_RAHASIA_9f8e7d";
  const TEKS_PENANDA = `Lowongan kerja admin online. ${PENANDA}. Gaji 5 juta per bulan.`;

  function tangkapLog() {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    return { log, warn, error };
  }

  function semuaLogTerkumpul(tangkapan: ReturnType<typeof tangkapLog>) {
    return [
      ...tangkapan.log.mock.calls,
      ...tangkapan.warn.mock.calls,
      ...tangkapan.error.mock.calls,
    ]
      .flat()
      .map((nilai) => String(nilai))
      .join(" ");
  }

  it("tidak pernah menulis teks lowongan ke log (jalur sukses)", async () => {
    const tangkapan = tangkapLog();

    const respons = await POST(
      permintaan({ teksLowongan: TEKS_PENANDA }, "203.0.113.201"),
    );

    expect(respons.status).toBe(201);
    expect(semuaLogTerkumpul(tangkapan)).not.toContain(PENANDA);

    tangkapan.log.mockRestore();
    tangkapan.warn.mockRestore();
    tangkapan.error.mockRestore();
  });

  it("tidak pernah menulis teks lowongan ke log saat pencatatan gagal", async () => {
    const tangkapan = tangkapLog();
    // Pesan galat driver sengaja memuat penanda: log tidak boleh mengutipnya.
    values.mockRejectedValueOnce(new Error(`query gagal untuk ${PENANDA}`));

    const respons = await POST(
      permintaan({ teksLowongan: TEKS_PENANDA }, "203.0.113.202"),
    );

    expect(respons.status).toBe(201);
    expect(semuaLogTerkumpul(tangkapan)).not.toContain(PENANDA);

    tangkapan.log.mockRestore();
    tangkapan.warn.mockRestore();
    tangkapan.error.mockRestore();
  });

  it("tidak memanggil fetch ke layanan eksternal saat evaluasi", async () => {
    const tiruanFetch = vi.fn();
    vi.stubGlobal("fetch", tiruanFetch);

    try {
      const respons = await POST(
        permintaan({ teksLowongan: TEKS_PENANDA }, "203.0.113.203"),
      );

      expect(respons.status).toBe(201);
      expect(tiruanFetch).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("mengabaikan nama perusahaan yang dikirim (hanya menerima penanda)", async () => {
    const tangkapan = tangkapLog();
    const NAMA_RAHASIA = "PT KARAKTERSERAHASIAUTAMA Tbk";

    const respons = await POST(
      permintaan(
        { teksLowongan: TEKS_PENANDA, perusahaan: NAMA_RAHASIA },
        "203.0.113.204",
      ),
    );

    expect(respons.status).toBe(201);
    // Penanda dikirim sebagai string tak dikenal skema: diarsipkan zod,
    // tidak pernah masuk agregat maupun log.
    expect(JSON.stringify(values.mock.calls)).not.toContain(NAMA_RAHASIA);
    expect(semuaLogTerkumpul(tangkapan)).not.toContain(NAMA_RAHASIA);

    tangkapan.log.mockRestore();
    tangkapan.warn.mockRestore();
    tangkapan.error.mockRestore();
  });

  it("perusahaanDiisi: true mematikan aturan tanpa_nama_perusahaan", async () => {
    const tanpa = await POST(
      permintaan({ teksLowongan: TEKS_PENANDA }, "203.0.113.205"),
    );
    const jsonTanpa = await tanpa.json();
    const kodeTanpa = jsonTanpa.hasil.temuan.map(
      (t: { ruleId: string }) => t.ruleId,
    );
    expect(kodeTanpa).toContain("tanpa_nama_perusahaan");

    const dengan = await POST(
      permintaan(
        { teksLowongan: TEKS_PENANDA, perusahaanDiisi: true },
        "203.0.113.206",
      ),
    );
    const jsonDengan = await dengan.json();
    const kodeDengan = jsonDengan.hasil.temuan.map(
      (t: { ruleId: string }) => t.ruleId,
    );
    expect(kodeDengan).not.toContain("tanpa_nama_perusahaan");
  });
});
