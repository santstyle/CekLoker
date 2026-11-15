import { describe, expect, it } from "vitest";

import { KUIS_PERTANYAAN, nilaiKuis } from "@/lib/edukasi/kuis";

const JUMLAH = KUIS_PERTANYAAN.length;

/** Jawaban benar seluruh soal, selaras dengan kontrak data kuis. */
function jawabanBenarSemua(): number[] {
  return KUIS_PERTANYAAN.map((soal) => soal.jawaban);
}

describe("himpunan soal kuis", () => {
  it("memakai id yang unik", () => {
    const id = KUIS_PERTANYAAN.map((soal) => soal.id);
    expect(new Set(id).size).toBe(id.length);
  });

  it("memiliki minimal empat pilihan dan indeks jawaban dalam jangkauan", () => {
    for (const soal of KUIS_PERTANYAAN) {
      expect(soal.pilihan.length).toBeGreaterThanOrEqual(4);
      expect(soal.jawaban).toBeGreaterThanOrEqual(0);
      expect(soal.jawaban).toBeLessThan(soal.pilihan.length);
    }
  });

  it("menyertakan penjelasan pada setiap soal", () => {
    for (const soal of KUIS_PERTANYAAN) {
      expect(soal.penjelasan.trim().length).toBeGreaterThan(0);
    }
  });

  it("tidak menyebut nama perusahaan atau nomor telepon nyata", () => {
    const teks = KUIS_PERTANYAAN.flatMap((s) => [
      s.pertanyaan,
      ...s.pilihan,
      s.penjelasan,
    ]).join(" ");
    expect(teks).not.toMatch(/08\d{2}/);
    expect(teks).not.toMatch(/@[a-z0-9_.]+\.(com|co\.id|id)/i);
  });
});

describe("nilaiKuis", () => {
  it("menghitung seluruh jawaban benar menjadi 100%", () => {
    const hasil = nilaiKuis(jawabanBenarSemua());
    expect(hasil.benar).toBe(JUMLAH);
    expect(hasil.salah).toBe(0);
    expect(hasil.kosong).toBe(0);
    expect(hasil.skorPersen).toBe(100);
    expect(hasil.kategori).toBe("sangat_baik");
  });

  it("menghitung seluruh jawaban salah menjadi 0%", () => {
    const salahSemua = KUIS_PERTANYAAN.map((soal) =>
      soal.jawaban === 0 ? 1 : 0,
    );
    const hasil = nilaiKuis(salahSemua);
    expect(hasil.benar).toBe(0);
    expect(hasil.salah).toBe(JUMLAH);
    expect(hasil.skorPersen).toBe(0);
    expect(hasil.kategori).toBe("perlu_dipelajari");
  });

  it("membulatkan skor persen ke bilangan bulat terdekat", () => {
    const jawaban = jawabanBenarSemua();
    jawaban[0] = jawaban[0] === 0 ? 1 : 0;
    const hasil = nilaiKuis(jawaban);
    const harapan = Math.round(((JUMLAH - 1) / JUMLAH) * 100);
    expect(hasil.skorPersen).toBe(harapan);
  });

  it("menghitung jawaban kosong sebagai belum dijawab, bukan salah", () => {
    const hasil = nilaiKuis(Array.from({ length: JUMLAH }, () => undefined));
    expect(hasil.benar).toBe(0);
    expect(hasil.salah).toBe(0);
    expect(hasil.kosong).toBe(JUMLAH);
    expect(hasil.skorPersen).toBe(0);
  });

  it("menolak indeks pilihan di luar jangkauan sebagai kosong", () => {
    const hasil = nilaiKuis(Array.from({ length: JUMLAH }, () => 99));
    expect(hasil.kosong).toBe(JUMLAH);
  });

  it("menentukan kategori cukup baik pada skor 50%", () => {
    const jawaban = jawabanBenarSemua();
    const setengah = Math.floor(JUMLAH / 2);
    for (let i = 0; i < setengah; i += 1) {
      jawaban[i] = jawaban[i] === 0 ? 1 : 0;
    }
    const hasil = nilaiKuis(jawaban);
    expect(hasil.kategori).toBe("cukup_baik");
  });

  it("deterministik: panggilan berulang menghasilkan nilai sama", () => {
    const jawaban = jawabanBenarSemua();
    expect(nilaiKuis(jawaban)).toEqual(nilaiKuis(jawaban));
  });
});
