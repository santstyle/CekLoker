import { evaluasiLowongan, EVALUATOR_VERSION } from "./evaluate";
import { KASUS_ACUAN, type KasusAcuan } from "./kasus-acuan";
import type { Band } from "./types";

/**
 * Uji konsistensi deterministik atas kasus acuan.
 *
 * Fungsi ini menjalankan mesin evaluasi pada setiap kasus acuan lalu
 * membandingkan keluarannya dengan nilai yang dikunci. Hasilnya dipakai oleh
 * halaman publik `/uji-konsistensi` sebagai bukti keterbukaan: jumlah kasus,
 * konsistensi per rentang risiko, dan daftar ketidakkonsistenan bila ada.
 *
 * Ini mengukur konsistensi terhadap kasus acuan sintetis — bukan akurasi
 * pada iklan nyata, yang belum pernah diuji (lihat halaman Uji Konsistensi).
 *
 * Karena evaluator bersifat deterministik, keluaran fungsi ini juga
 * deterministik untuk himpunan kasus yang sama.
 */

/** Urutan tampil rentang risiko dari paling ringan ke paling berat. */
export const URUTAN_BAND: readonly Band[] = ["rendah", "perlu_dicek", "tinggi"];

export interface HasilKasusAcuan {
  id: string;
  catatan: string;
  expectedBand: Band;
  band: Band;
  expectedSkor: number;
  skor: number;
  expectedRuleIds: readonly string[];
  ruleIds: readonly string[];
  /** Benar bila band, skor, dan himpunan aturan semuanya cocok. */
  cocok: boolean;
}

export interface RingkasanBand {
  band: Band;
  total: number;
  cocok: number;
}

export interface RingkasanUjiKonsistensi {
  /** Versi mesin evaluasi yang diuji. */
  versi: string;
  total: number;
  jumlahCocok: number;
  /** Persentase kecocokan dibulatkan ke bilangan bulat (0–100). */
  persenCocok: number;
  /** Rekap per rentang risiko berdasarkan band yang diharapkan. */
  perBand: readonly RingkasanBand[];
  tidakCocok: readonly HasilKasusAcuan[];
  kasus: readonly HasilKasusAcuan[];
}

function samaUrutan(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((nilai, indeks) => nilai === b[indeks]);
}

export function ujiKonsistensi(
  kasus: readonly KasusAcuan[] = KASUS_ACUAN,
): RingkasanUjiKonsistensi {
  const hasil: HasilKasusAcuan[] = kasus.map((butir) => {
    const keluaran = evaluasiLowongan({
      teksLowongan: butir.teks,
      ...(butir.lokasi ? { lokasi: butir.lokasi } : {}),
    });

    const ruleIds = keluaran.temuan.map((temuan) => temuan.ruleId).sort();
    const expectedRuleIds = [...butir.expectedRuleIds].sort();
    const cocok =
      keluaran.band === butir.expectedBand &&
      keluaran.skor === butir.expectedSkor &&
      samaUrutan(ruleIds, expectedRuleIds);

    return {
      id: butir.id,
      catatan: butir.catatan,
      expectedBand: butir.expectedBand,
      band: keluaran.band,
      expectedSkor: butir.expectedSkor,
      skor: keluaran.skor,
      expectedRuleIds,
      ruleIds,
      cocok,
    };
  });

  const jumlahCocok = hasil.filter((butir) => butir.cocok).length;

  const perBand: RingkasanBand[] = URUTAN_BAND.map((band) => {
    const kelompok = hasil.filter((butir) => butir.expectedBand === band);
    return {
      band,
      total: kelompok.length,
      cocok: kelompok.filter((butir) => butir.cocok).length,
    };
  });

  return {
    versi: EVALUATOR_VERSION,
    total: hasil.length,
    jumlahCocok,
    persenCocok:
      hasil.length === 0 ? 0 : Math.round((jumlahCocok / hasil.length) * 100),
    perBand,
    tidakCocok: hasil.filter((butir) => !butir.cocok),
    kasus: hasil,
  };
}
