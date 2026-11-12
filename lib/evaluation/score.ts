/**
 * Penghitungan skor dan penentuan rentang risiko.
 *
 * Skor adalah jumlah kontribusi seluruh temuan, dibulatkan dan dibatasi 100.
 */

import type { Band, Temuan } from "./types";

/** Batas bawah tiap rentang; nilai di bawah batas pertama berarti rendah. */
export const BATAS_BAND = {
  perluDicek: 15,
  tinggi: 45,
} as const;

export function hitungSkor(temuan: readonly Temuan[]): number {
  const total = temuan.reduce((jumlah, butir) => jumlah + butir.kontribusi, 0);
  return Math.min(100, Math.round(total));
}

export function bandDariSkor(skor: number): Band {
  if (skor < BATAS_BAND.perluDicek) return "rendah";
  if (skor < BATAS_BAND.tinggi) return "perlu_dicek";
  return "tinggi";
}

const PERINGKAT_BAND: Record<Band, number> = {
  rendah: 0,
  perlu_dicek: 1,
  tinggi: 2,
};

/** Memilih rentang yang paling berat di antara dua kandidat. */
export function bandTerburuk(a: Band, b: Band): Band {
  return PERINGKAT_BAND[b] > PERINGKAT_BAND[a] ? b : a;
}
