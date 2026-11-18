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

import { POST } from "@/app/api/masukan/route";

/** Membangun permintaan POST dengan alamat klien unik per pengujian. */
function permintaan(
  body: unknown,
  alamat = "203.0.113.1",
  mentah = false,
): Request {
  // Klien HTTP sungguhan (mis. curl) selalu mengirim content-length;
  // undici tidak melakukannya otomatis, jadi di-set manual di sini.
  const badan = mentah ? String(body) : JSON.stringify(body);
  return new Request("https://cekloker.example/api/masukan", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": alamat,
      "content-length": String(Buffer.byteLength(badan)),
    },
    body: badan,
  });
}

const MASUKAN_VALID = { checkId: "sesi-uji-01", alasan: "temuan_keliru" };

beforeEach(() => {
  insert.mockClear();
  values.mockClear();
  values.mockResolvedValue(undefined);
});

describe("POST /api/masukan", () => {
  it("mengembalikan 201 dan mencatat masukan tanpa ruleCode", async () => {
    const respons = await POST(permintaan(MASUKAN_VALID));

    expect(respons.status).toBe(201);
    await expect(respons.json()).resolves.toEqual({ ok: true });

    expect(insert).toHaveBeenCalledTimes(1);
    expect(values.mock.calls[0][0]).toEqual({
      checkId: "sesi-uji-01",
      alasan: "temuan_keliru",
      ruleCode: null,
    });
  });

  it("menerima ruleCode yang dikenal mesin evaluasi", async () => {
    const respons = await POST(
      permintaan({ ...MASUKAN_VALID, ruleCode: "upah_dibawah_umr" }),
    );

    expect(respons.status).toBe(201);
    expect(values.mock.calls[0][0].ruleCode).toBe("upah_dibawah_umr");
  });

  it("memperlakukan ruleCode kosong sebagai null", async () => {
    await POST(permintaan({ ...MASUKAN_VALID, ruleCode: "  " }));

    expect(values.mock.calls[0][0].ruleCode).toBeNull();
  });

  it("menolak ruleCode yang tidak dikenal dengan 400", async () => {
    const respons = await POST(
      permintaan({ ...MASUKAN_VALID, ruleCode: "aturan_karangan" }),
    );

    expect(respons.status).toBe(400);
    await expect(respons.json()).resolves.toMatchObject({
      error: expect.stringContaining("tidak dikenal"),
    });
    expect(insert).not.toHaveBeenCalled();
  });

  it("menolak body yang bukan JSON dengan 400", async () => {
    const respons = await POST(permintaan("bukan json", "203.0.113.2", true));

    expect(respons.status).toBe(400);
    await expect(respons.json()).resolves.toMatchObject({
      error: expect.stringContaining("JSON"),
    });
    expect(insert).not.toHaveBeenCalled();
  });

  it("menolak alasan yang tidak terdaftar dengan 400", async () => {
    const respons = await POST(
      permintaan({ ...MASUKAN_VALID, alasan: "entah" }),
    );

    expect(respons.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("menolak checkId kosong dengan 400", async () => {
    const respons = await POST(permintaan({ ...MASUKAN_VALID, checkId: "  " }));

    expect(respons.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("memasang header pembatas laju pada respons sukses", async () => {
    const respons = await POST(permintaan(MASUKAN_VALID, "203.0.113.200"));

    expect(respons.headers.get("X-RateLimit-Limit")).toBe("10");
    expect(Number(respons.headers.get("X-RateLimit-Remaining"))).toBe(9);
    expect(Number(respons.headers.get("X-RateLimit-Reset"))).toBeGreaterThan(0);
  });

  it("membalas 503 saat penyimpanan masukan gagal", async () => {
    const peringatan = vi.spyOn(console, "warn").mockImplementation(() => {});
    values.mockRejectedValueOnce(new Error("database tidak terjangkau"));

    const respons = await POST(permintaan(MASUKAN_VALID, "203.0.113.9"));

    expect(respons.status).toBe(503);
    await expect(respons.json()).resolves.toMatchObject({
      error: expect.stringContaining("belum dapat disimpan"),
    });
    peringatan.mockRestore();
  });

  it("membalas 429 dengan Retry-After setelah kuota terlampaui", async () => {
    const alamat = "198.51.100.77";

    for (let i = 0; i < 10; i += 1) {
      const respons = await POST(permintaan(MASUKAN_VALID, alamat));
      expect(respons.status).toBe(201);
    }

    const ditolak = await POST(permintaan(MASUKAN_VALID, alamat));

    expect(ditolak.status).toBe(429);
    expect(ditolak.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(Number(ditolak.headers.get("Retry-After"))).toBeGreaterThan(0);
    await expect(ditolak.json()).resolves.toMatchObject({
      error: expect.stringContaining("Terlalu banyak permintaan"),
    });
  });

  it("tidak mencatat masukan saat permintaan ditolak", async () => {
    const alamat = "198.51.100.88";

    for (let i = 0; i < 10; i += 1) {
      await POST(permintaan(MASUKAN_VALID, alamat));
    }

    const sebelum = insert.mock.calls.length;
    await POST(permintaan(MASUKAN_VALID, alamat));

    expect(insert.mock.calls.length).toBe(sebelum);
  });

  it("membalas 413 sebelum kuota terpakai bila body melampaui batas", async () => {
    const respons = await POST(
      permintaan(
        { ...MASUKAN_VALID, checkId: "C".repeat(20_000) },
        "203.0.113.55",
      ),
    );

    expect(respons.status).toBe(413);
    const json = await respons.json();
    expect(json.error).toContain("16 KB");
    expect(insert).not.toHaveBeenCalled();

    // Guard berjalan sebelum pembatas laju: kuota klien tidak terkuras.
    const lanjutan = await POST(permintaan(MASUKAN_VALID, "203.0.113.55"));
    expect(lanjutan.status).toBe(201);
  });

  it("menolak checkId di luar alfabet nanoid dengan 400", async () => {
    const respons = await POST(
      permintaan({ ...MASUKAN_VALID, checkId: "sesi<uji>01" }),
    );

    expect(respons.status).toBe(400);
    await expect(respons.json()).resolves.toMatchObject({
      error: expect.stringContaining("Id sesi tidak valid"),
    });
    expect(insert).not.toHaveBeenCalled();
  });
});

describe("POST /api/masukan — log", () => {
  it("tidak membocorkan pesan galat driver ke log saat penyimpanan gagal", async () => {
    const PENANDA = "MASUKAN_PENANDA_RAHASIA_7c1d2e";
    const peringatan = vi.spyOn(console, "warn").mockImplementation(() => {});
    values.mockRejectedValueOnce(new Error(`kolom check_id ${PENANDA}`));

    const respons = await POST(permintaan(MASUKAN_VALID, "203.0.113.210"));

    expect(respons.status).toBe(503);
    const keluaran = peringatan.mock.calls
      .flat()
      .map((nilai) => String(nilai))
      .join(" ");
    expect(keluaran).not.toContain(PENANDA);
    expect(keluaran).not.toContain("check_id");

    peringatan.mockRestore();
  });
});
