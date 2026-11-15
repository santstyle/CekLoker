import { describe, expect, it } from "vitest";

import {
  BATAS_MIN_SAMPEL,
  aturanTeratas,
  kunciBulan,
  labelBulan,
  ringkasanTren,
  trenBulanan,
  trenWilayah,
  LABEL_WILAYAH_KOSONG,
  type BarisTrenMentah,
} from "@/lib/tren/agregat";

/** Baris buatan dengan waktu tetap (deterministik). */
function baris(
  band: BarisTrenMentah["band"],
  region: string | null,
  dibuatPada: Date,
  kodeAturan: string[] = [],
): BarisTrenMentah {
  return { band, region, dibuatPada, kodeAturan };
}

/** Buat n baris pada satu bulan UTC tertentu. */
function kumpulanBulan(
  band: BarisTrenMentah["band"],
  region: string | null,
  tahun: number,
  bulanIndex: number, // 0-based
  n: number,
): BarisTrenMentah[] {
  const hasil: BarisTrenMentah[] = [];
  for (let i = 0; i < n; i++) {
    hasil.push(
      baris(band, region, new Date(Date.UTC(tahun, bulanIndex, 15, i))),
    );
  }
  return hasil;
}

describe("kunciBulan / labelBulan", () => {
  it("memakai UTC dan format YYYY-MM", () => {
    expect(kunciBulan(new Date(Date.UTC(2026, 10, 30, 23, 59)))).toBe(
      "2026-11",
    );
    expect(kunciBulan(new Date(Date.UTC(2026, 0, 1, 0, 0)))).toBe("2026-01");
  });

  it("memberi label Bahasa Indonesia", () => {
    expect(labelBulan("2026-11")).toBe("November 2026");
    expect(labelBulan("2026-01")).toBe("Januari 2026");
    expect(labelBulan("2026-12")).toBe("Desember 2026");
  });

  it("mengembalikan kunci apa adanya bila tidak valid", () => {
    expect(labelBulan("bukan-bulan")).toBe("bukan-bulan");
    expect(labelBulan("2026-99")).toBe("2026-99");
  });
});

describe("ringkasanTren", () => {
  it("menjumlahkan band dan menghitung persen bulat", () => {
    const data = [
      ...Array(6)
        .fill(null)
        .map(() =>
          baris("rendah", "DKI Jakarta", new Date(Date.UTC(2026, 10, 1))),
        ),
      ...Array(3)
        .fill(null)
        .map(() =>
          baris("perlu_dicek", "DKI Jakarta", new Date(Date.UTC(2026, 10, 2))),
        ),
      ...Array(1)
        .fill(null)
        .map(() =>
          baris("tinggi", "DKI Jakarta", new Date(Date.UTC(2026, 10, 3))),
        ),
    ];

    const hasil = ringkasanTren(data);
    expect(hasil).toEqual({
      total: 10,
      rendah: 6,
      perluDicek: 3,
      tinggi: 1,
      persenRendah: 60,
      persenPerluDicek: 30,
      persenTinggi: 10,
    });
  });

  it("aman untuk kumpulan kosong", () => {
    const hasil = ringkasanTren([]);
    expect(hasil.total).toBe(0);
    expect(hasil.persenRendah).toBe(0);
    expect(hasil.persenPerluDicek).toBe(0);
    expect(hasil.persenTinggi).toBe(0);
  });
});

describe("trenBulanan", () => {
  it("mengurutkan kronologis dan mengelompokkan per bulan UTC", () => {
    const data = [
      ...kumpulanBulan("tinggi", "DKI Jakarta", 2026, 9, BATAS_MIN_SAMPEL), // Oktober 2026 (index 9)
      ...kumpulanBulan("rendah", "DKI Jakarta", 2026, 10, BATAS_MIN_SAMPEL), // November 2026
    ];

    const hasil = trenBulanan(data);
    expect(hasil.map((b) => b.kunci)).toEqual(["2026-10", "2026-11"]);
    expect(hasil[0].tinggi).toBe(BATAS_MIN_SAMPEL);
    expect(hasil[1].rendah).toBe(BATAS_MIN_SAMPEL);
  });

  it("menyembunyikan bulan di bawah ambang", () => {
    const data = [
      ...kumpulanBulan("rendah", "DKI Jakarta", 2026, 10, BATAS_MIN_SAMPEL - 1),
      ...kumpulanBulan("tinggi", "Jawa Timur", 2026, 9, BATAS_MIN_SAMPEL),
    ];

    const hasil = trenBulanan(data);
    expect(hasil.map((b) => b.kunci)).toEqual(["2026-10"]);
  });

  it("label memakai Bahasa Indonesia", () => {
    const data = kumpulanBulan(
      "rendah",
      "DKI Jakarta",
      2026,
      10,
      BATAS_MIN_SAMPEL,
    );
    expect(trenBulanan(data)[0].label).toBe("November 2026");
  });
});

describe("aturanTeratas", () => {
  it("mengurutkan dari yang terbanyak, batasi maksimum", () => {
    const judulAturan = { tanpa_nama_perusahaan: "Tanpa nama perusahaan" };
    const data = [
      ...Array(5)
        .fill(null)
        .map(() =>
          baris("tinggi", "DKI Jakarta", new Date(Date.UTC(2026, 10, 1)), [
            "tanpa_nama_perusahaan",
            "kontak_hanya_telepon",
          ]),
        ),
      ...Array(2)
        .fill(null)
        .map(() =>
          baris("perlu_dicek", "Jawa Timur", new Date(Date.UTC(2026, 10, 2)), [
            "kontak_hanya_telepon",
          ]),
        ),
    ];

    const hasil = aturanTeratas(data, judulAturan, 2);
    expect(hasil).toHaveLength(2);
    // kontak_hanya_telepon: 5 + 2 = 7 (terbanyak); tanpa_nama_perusahaan: 5.
    expect(hasil[0]).toEqual({
      kode: "kontak_hanya_telepon",
      judul: null,
      jumlah: 7,
    });
    expect(hasil[1]).toEqual({
      kode: "tanpa_nama_perusahaan",
      judul: "Tanpa nama perusahaan",
      jumlah: 5,
    });
  });

  it("tie-break memakai kode leksikografis", () => {
    const data = [
      ...Array(3)
        .fill(null)
        .map(() =>
          baris("tinggi", "DKI Jakarta", new Date(Date.UTC(2026, 10, 1)), [
            "zzz_aturan",
            "aaa_aturan",
          ]),
        ),
    ];

    const hasil = aturanTeratas(data, {});
    expect(hasil.map((h) => h.kode)).toEqual(["aaa_aturan", "zzz_aturan"]);
    expect(hasil.every((h) => h.jumlah === 3)).toBe(true);
  });

  it("aman untuk masukan kosong", () => {
    expect(aturanTeratas([], {})).toEqual([]);
  });
});

describe("trenWilayah", () => {
  it("menyembunyikan wilayah di bawah ambang", () => {
    const data = [
      ...kumpulanBulan("rendah", "DKI Jakarta", 2026, 10, BATAS_MIN_SAMPEL),
      ...kumpulanBulan("tinggi", "Jawa Timur", 2026, 10, BATAS_MIN_SAMPEL - 1),
    ];

    const hasil = trenWilayah(data);
    expect(hasil.map((w) => w.wilayah)).toEqual(["DKI Jakarta"]);
  });

  it("mengelompokkan wilayah kosong sebagai LABEL_WILAYAH_KOSONG", () => {
    const data = [
      ...kumpulanBulan("tinggi", null, 2026, 10, BATAS_MIN_SAMPEL),
      ...kumpulanBulan("tinggi", "   ", 2026, 10, 2),
    ];

    const hasil = trenWilayah(data);
    expect(hasil).toHaveLength(1);
    expect(hasil[0].wilayah).toBe(LABEL_WILAYAH_KOSONG);
    expect(hasil[0].total).toBe(BATAS_MIN_SAMPEL + 2);
  });

  it("band dominan dipilih dari mayoritas, imbang dipecah urutan rendah → perlu_dicek → tinggi", () => {
    // 5 rendah, 5 perlu_dicek pada satu wilayah — imbang rendah vs perlu_dicek → rendah menang.
    const data: BarisTrenMentah[] = [
      ...Array(5)
        .fill(null)
        .map(() =>
          baris("rendah", "DKI Jakarta", new Date(Date.UTC(2026, 10, 1))),
        ),
      ...Array(5)
        .fill(null)
        .map(() =>
          baris("perlu_dicek", "DKI Jakarta", new Date(Date.UTC(2026, 10, 2))),
        ),
    ];

    const hasil = trenWilayah(data);
    expect(hasil[0].bandDominan).toBe("rendah");
    expect(hasil[0].persenDominan).toBe(50);

    // 4 rendah, 6 tinggi — tinggi mayoritas.
    const dataTinggi: BarisTrenMentah[] = [
      ...Array(4)
        .fill(null)
        .map(() =>
          baris("rendah", "DKI Jakarta", new Date(Date.UTC(2026, 10, 1))),
        ),
      ...Array(6)
        .fill(null)
        .map(() =>
          baris("tinggi", "DKI Jakarta", new Date(Date.UTC(2026, 10, 2))),
        ),
    ];

    const hasilTinggi = trenWilayah(dataTinggi);
    expect(hasilTinggi[0].bandDominan).toBe("tinggi");
    expect(hasilTinggi[0].persenDominan).toBe(60);
  });

  it("mengurutkan dari wilayah terbanyak, tie-break nama leksikografis", () => {
    const data = [
      ...kumpulanBulan("rendah", "Banten", 2026, 10, BATAS_MIN_SAMPEL),
      ...kumpulanBulan("rendah", "Aceh", 2026, 10, BATAS_MIN_SAMPEL),
      ...kumpulanBulan("rendah", "DKI Jakarta", 2026, 10, 12),
    ];

    const hasil = trenWilayah(data);
    expect(hasil.map((w) => w.wilayah)).toEqual([
      "DKI Jakarta",
      "Aceh",
      "Banten",
    ]);
  });
});
