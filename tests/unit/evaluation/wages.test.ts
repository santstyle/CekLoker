import { describe, expect, it } from "vitest";

import { PROVINSI } from "@/lib/evaluation/provinces";
import { DATA_UPAH_MENTAH, barisAktif } from "@/lib/evaluation/data-upah";
import type { BarisDataUpah } from "@/lib/evaluation/data-upah";
import {
  CATATAN_DATA_UPAH,
  DATA_UPAH,
  DATA_UPAH_TERSEDIA,
  LABEL_DATA_UPAH_BELUM_TERSEDIA,
  cariUpahUntukLokasi,
  getUpahMinimum,
  statusDataUpah,
} from "@/lib/evaluation/wages";
import type { RegionalWage } from "@/lib/evaluation/types";

const DATA_CONTOH: readonly RegionalWage[] = [
  { provinsi: "DKI Jakarta", upahBulanan: 5_000_000, tahun: 2024 },
  { provinsi: "DKI Jakarta", upahBulanan: 5_400_000, tahun: 2025 },
  { provinsi: "Jawa Barat", upahBulanan: 2_000_000, tahun: 2025 },
  { provinsi: "Jawa Barat", upahBulanan: 2_200_000, tahun: 2025 },
  { provinsi: "Jawa Timur", upahBulanan: 2_100_000, tahun: 2025 },
  { provinsi: "Jawa Timur", upahBulanan: 2_100_000, tahun: 2025 },
  { provinsi: "Bali", upahBulanan: 2_900_000, tahun: 2024 },
];

type KasusPemilihan = {
  nama: string;
  provinsi: string;
  harapan: RegionalWage | null;
};

const KASUS_PEMILIHAN: readonly KasusPemilihan[] = [
  {
    nama: "memilih tahun terbaru",
    provinsi: "DKI Jakarta",
    harapan: { provinsi: "DKI Jakarta", upahBulanan: 5_400_000, tahun: 2025 },
  },
  {
    nama: "memilih nominal tertinggi pada tahun yang sama",
    provinsi: "Jawa Barat",
    harapan: { provinsi: "Jawa Barat", upahBulanan: 2_200_000, tahun: 2025 },
  },
  {
    nama: "mengabaikan entri tahun lama meski nominalnya lebih besar",
    provinsi: "Bali",
    harapan: { provinsi: "Bali", upahBulanan: 2_900_000, tahun: 2024 },
  },
  {
    nama: "mengenali provinsi tanpa memedulikan huruf besar",
    provinsi: "DKI JAKARTA",
    harapan: { provinsi: "DKI Jakarta", upahBulanan: 5_400_000, tahun: 2025 },
  },
  {
    nama: "mengenali provinsi dengan spasi berlebih",
    provinsi: "  dki   jakarta  ",
    harapan: { provinsi: "DKI Jakarta", upahBulanan: 5_400_000, tahun: 2025 },
  },
  {
    nama: "mengembalikan null untuk provinsi yang tidak ada",
    provinsi: "Sulawesi Utara",
    harapan: null,
  },
  {
    nama: "mengembalikan null karena nama kota bukan nama provinsi",
    provinsi: "Jakarta Selatan",
    harapan: null,
  },
];

describe("getUpahMinimum", () => {
  it.each(KASUS_PEMILIHAN)("$nama", ({ provinsi, harapan }) => {
    expect(getUpahMinimum(provinsi, DATA_CONTOH)).toEqual(harapan);
  });

  it("mengembalikan salah satu baris secara konsisten saat entri duplikat", () => {
    const pertama = getUpahMinimum("Jawa Timur", DATA_CONTOH);
    const kedua = getUpahMinimum("Jawa Timur", DATA_CONTOH);

    expect(pertama).not.toBeNull();
    expect(pertama).toEqual({
      provinsi: "Jawa Timur",
      upahBulanan: 2_100_000,
      tahun: 2025,
    });
    expect(kedua).toEqual(pertama);
  });

  it("mengembalikan null untuk provinsi kosong, null, atau undefined", () => {
    expect(getUpahMinimum("", DATA_CONTOH)).toBeNull();
    expect(getUpahMinimum(null, DATA_CONTOH)).toBeNull();
    expect(getUpahMinimum(undefined, DATA_CONTOH)).toBeNull();
  });

  it("mengembalikan null saat data kosong", () => {
    expect(getUpahMinimum("DKI Jakarta", [])).toBeNull();
  });
});

describe("DATA_UPAH", () => {
  it("memuat satu baris aktif per provinsi kanonik", () => {
    expect(DATA_UPAH).toHaveLength(PROVINSI.length);
  });

  it("menandai data upah tersedia", () => {
    expect(DATA_UPAH_TERSEDIA).toBe(true);
  });

  it("menyatakan sumber terverifikasi pada catatan antarmuka", () => {
    expect(CATATAN_DATA_UPAH).toContain("terverifikasi");
    expect(CATATAN_DATA_UPAH).not.toContain("belum aktif");
  });

  it("mencari upah memakai data bawaan untuk ibu kota", () => {
    const upah = getUpahMinimum("DKI Jakarta");
    expect(upah).not.toBeNull();
    expect(upah?.tahun).toBe(2026);
    expect(cariUpahUntukLokasi("Jakarta Selatan")?.provinsi).toBe(
      "DKI Jakarta",
    );
  });
});

describe("cariUpahUntukLokasi", () => {
  it("menebak provinsi dari nama kota", () => {
    expect(cariUpahUntukLokasi("Jakarta Selatan", DATA_CONTOH)).toEqual({
      provinsi: "DKI Jakarta",
      upahBulanan: 5_400_000,
      tahun: 2025,
    });
  });

  it("menebak provinsi dari nama kota di luar ibu kota", () => {
    expect(cariUpahUntukLokasi("Kota Bandung", DATA_CONTOH)).toEqual({
      provinsi: "Jawa Barat",
      upahBulanan: 2_200_000,
      tahun: 2025,
    });
  });

  it("mengembalikan null untuk lokasi yang tidak dikenali", () => {
    expect(cariUpahUntukLokasi("Antah Berantah", DATA_CONTOH)).toBeNull();
  });

  it("mengembalikan null untuk lokasi kosong, null, atau undefined", () => {
    expect(cariUpahUntukLokasi("", DATA_CONTOH)).toBeNull();
    expect(cariUpahUntukLokasi(null, DATA_CONTOH)).toBeNull();
    expect(cariUpahUntukLokasi(undefined, DATA_CONTOH)).toBeNull();
  });
});

describe("DATA_UPAH_MENTAH (data UMP 2026)", () => {
  it("mencakup satu baris per provinsi kanonik", () => {
    expect(DATA_UPAH_MENTAH).toHaveLength(PROVINSI.length);

    const nama = new Set(DATA_UPAH_MENTAH.map((baris) => baris.provinsi));
    for (const provinsi of PROVINSI) {
      expect(nama.has(provinsi)).toBe(true);
    }
  });

  it("mengisi setiap baris tanpa angka tebakan: nilai, tahun, sumber, tanggal", () => {
    for (const baris of DATA_UPAH_MENTAH) {
      expect(baris.upahBulanan).toBeGreaterThan(0);
      expect(baris.tahun).toBe(2026);
      expect(baris.sumberUrl).toMatch(/^https:\/\//);
      expect(baris.tanggalVerifikasi).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("barisAktif", () => {
  it("menyaring baris TODO dan mempertahankan baris lengkap", () => {
    const mentah: readonly BarisDataUpah[] = [
      {
        provinsi: "Contoh A",
        upahBulanan: null,
        tahun: null,
        sumberUrl: null,
        tanggalVerifikasi: null,
      },
      {
        provinsi: "Contoh B",
        upahBulanan: 1_000_000,
        tahun: 2025,
        sumberUrl: null,
        tanggalVerifikasi: null,
      },
    ];

    expect(barisAktif(mentah)).toEqual([
      { provinsi: "Contoh B", upahBulanan: 1_000_000, tahun: 2025 },
    ]);
  });

  it("membawa sumberUrl dan tanggalVerifikasi bila terisi", () => {
    const mentah: readonly BarisDataUpah[] = [
      {
        provinsi: "Contoh B",
        upahBulanan: 1_000_000,
        tahun: 2025,
        sumberUrl: "https://sumber-resmi.contoh/ump-2025",
        tanggalVerifikasi: "2026-01-01",
      },
    ];

    expect(barisAktif(mentah)[0]).toMatchObject({
      sumberUrl: "https://sumber-resmi.contoh/ump-2025",
      tanggalVerifikasi: "2026-01-01",
    });
  });
});

describe("statusDataUpah", () => {
  it("menyatakan data belum tersedia bila lokasi tidak dikenali", () => {
    expect(statusDataUpah("Antah Berantah")).toBe(
      LABEL_DATA_UPAH_BELUM_TERSEDIA,
    );
  });

  it("menyatakan tersedia untuk provinsi yang datanya terisi", () => {
    const status = statusDataUpah("Bandung");
    expect(status).toContain("Jawa Barat");
    expect(status).toContain("2026");
    expect(status).toContain("tersedia");
    expect(status).not.toContain(LABEL_DATA_UPAH_BELUM_TERSEDIA);
  });

  it("menyatakan tersedia bila datanya lengkap", () => {
    const data: readonly RegionalWage[] = [
      { provinsi: "Jawa Barat", upahBulanan: 2_000_000, tahun: 2025 },
    ];
    expect(statusDataUpah("Bandung", data)).toContain("tersedia");
  });

  it("tetap jujur saat data sengaja kosong", () => {
    expect(statusDataUpah("Jakarta Selatan", [])).toContain(
      LABEL_DATA_UPAH_BELUM_TERSEDIA,
    );
  });
});

describe("kejujuran klaim data upah", () => {
  it("catatan antarmuka memakai frasa data resmi terverifikasi", () => {
    expect(CATATAN_DATA_UPAH).toContain("data resmi yang terverifikasi");
  });
});
