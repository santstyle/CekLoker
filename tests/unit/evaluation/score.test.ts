import { describe, expect, it } from "vitest";

import {
  BATAS_BAND,
  bandDariSkor,
  bandTerburuk,
  hitungSkor,
} from "@/lib/evaluation/score";
import type { Band, KategoriRule, Kekuatan, Temuan } from "@/lib/evaluation/types";

function buatTemuan(kontribusi: number): Temuan {
  return {
    ruleId: `uji_${kontribusi}`,
    judul: "Aturan uji",
    kategori: "lainnya" satisfies KategoriRule,
    kekuatan: "sedang" satisfies Kekuatan,
    faktor: 1,
    kontribusi,
    bukti: ["kata kunci"],
    penjelasan: "Penjelasan uji.",
  };
}

type KasusHitungSkor = {
  nama: string;
  kontribusi: readonly number[];
  harapan: number;
};

const KASUS_HITUNG_SKOR: readonly KasusHitungSkor[] = [
  {
    nama: "mengembalikan 0 untuk daftar temuan kosong",
    kontribusi: [],
    harapan: 0,
  },
  {
    nama: "menjumlahkan seluruh kontribusi temuan",
    kontribusi: [8, 4, 3],
    harapan: 15,
  },
  {
    nama: "membulatkan 14,6 menjadi 15",
    kontribusi: [14.6],
    harapan: 15,
  },
  {
    nama: "membulatkan 14,4 menjadi 14",
    kontribusi: [14.4],
    harapan: 14,
  },
  {
    nama: "membulatkan 2,5 ke atas menjadi 3",
    kontribusi: [2.5],
    harapan: 3,
  },
  {
    nama: "membatasi skor maksimal 100",
    kontribusi: [60, 40, 20],
    harapan: 100,
  },
];

describe("hitungSkor", () => {
  it.each(KASUS_HITUNG_SKOR)("$nama", ({ kontribusi, harapan }) => {
    expect(hitungSkor(kontribusi.map(buatTemuan))).toBe(harapan);
  });

  it("tidak pernah mengembalikan skor negatif untuk daftar kosong", () => {
    expect(hitungSkor([])).toBe(0);
  });
});

type KasusBandDariSkor = {
  nama: string;
  skor: number;
  harapan: Band;
};

const KASUS_BAND_DARI_SKOR: readonly KasusBandDariSkor[] = [
  { nama: "skor 0 berada di rentang rendah", skor: 0, harapan: "rendah" },
  { nama: "skor di bawah batas pertama masih rendah", skor: 14, harapan: "rendah" },
  {
    nama: "skor tepat di batas pertama masuk perlu dicek",
    skor: 15,
    harapan: "perlu_dicek",
  },
  {
    nama: "skor di bawah batas kedua masih perlu dicek",
    skor: 44,
    harapan: "perlu_dicek",
  },
  {
    nama: "skor tepat di batas kedua masuk tinggi",
    skor: 45,
    harapan: "tinggi",
  },
  { nama: "skor maksimal tetap tinggi", skor: 100, harapan: "tinggi" },
  { nama: "skor negatif diperlakukan sebagai rendah", skor: -1, harapan: "rendah" },
];

describe("bandDariSkor", () => {
  it.each(KASUS_BAND_DARI_SKOR)("$nama", ({ skor, harapan }) => {
    expect(bandDariSkor(skor)).toBe(harapan);
  });

  it("membaca batas rentang dari BATAS_BAND", () => {
    expect(BATAS_BAND.perluDicek).toBe(15);
    expect(BATAS_BAND.tinggi).toBe(45);
    expect(bandDariSkor(BATAS_BAND.perluDicek - 1)).toBe("rendah");
    expect(bandDariSkor(BATAS_BAND.tinggi - 1)).toBe("perlu_dicek");
  });
});

type KasusBandTerburuk = {
  nama: string;
  a: Band;
  b: Band;
  harapan: Band;
};

const KASUS_BAND_TERBURUK: readonly KasusBandTerburuk[] = [
  { nama: "rendah dengan rendah", a: "rendah", b: "rendah", harapan: "rendah" },
  {
    nama: "rendah dengan perlu dicek",
    a: "rendah",
    b: "perlu_dicek",
    harapan: "perlu_dicek",
  },
  { nama: "rendah dengan tinggi", a: "rendah", b: "tinggi", harapan: "tinggi" },
  {
    nama: "perlu dicek dengan rendah",
    a: "perlu_dicek",
    b: "rendah",
    harapan: "perlu_dicek",
  },
  {
    nama: "perlu dicek dengan perlu dicek",
    a: "perlu_dicek",
    b: "perlu_dicek",
    harapan: "perlu_dicek",
  },
  {
    nama: "perlu dicek dengan tinggi",
    a: "perlu_dicek",
    b: "tinggi",
    harapan: "tinggi",
  },
  { nama: "tinggi dengan rendah", a: "tinggi", b: "rendah", harapan: "tinggi" },
  {
    nama: "tinggi dengan perlu dicek",
    a: "tinggi",
    b: "perlu_dicek",
    harapan: "tinggi",
  },
  { nama: "tinggi dengan tinggi", a: "tinggi", b: "tinggi", harapan: "tinggi" },
];

describe("bandTerburuk", () => {
  it.each(KASUS_BAND_TERBURUK)("$nama", ({ a, b, harapan }) => {
    expect(bandTerburuk(a, b)).toBe(harapan);
  });

  it("memberi hasil sama tanpa memedulikan urutan argumen", () => {
    for (const { a, b } of KASUS_BAND_TERBURUK) {
      expect(bandTerburuk(a, b)).toBe(bandTerburuk(b, a));
    }
  });

  it("mengembalikan argumen pertama saat kedua rentang setara", () => {
    expect(bandTerburuk("rendah", "rendah")).toBe("rendah");
    expect(bandTerburuk("perlu_dicek", "perlu_dicek")).toBe("perlu_dicek");
    expect(bandTerburuk("tinggi", "tinggi")).toBe("tinggi");
  });
});
