import { describe, expect, it } from "vitest";

import {
  CATATAN_DATA_UPAH,
  DATA_UPAH,
  DATA_UPAH_TERSEDIA,
  cariUpahUntukLokasi,
  getUpahMinimum,
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
  it("sengaja kosong sampai sumber resmi terverifikasi", () => {
    expect(DATA_UPAH).toHaveLength(0);
  });

  it("menandai data upah belum tersedia", () => {
    expect(DATA_UPAH_TERSEDIA).toBe(false);
  });

  it("menyatakan keterbatasan pada catatan antarmuka", () => {
    expect(CATATAN_DATA_UPAH).toContain("belum aktif");
  });

  it("membuat pencarian dengan data bawaan selalu null", () => {
    expect(getUpahMinimum("DKI Jakarta")).toBeNull();
    expect(cariUpahUntukLokasi("Jakarta Selatan")).toBeNull();
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
