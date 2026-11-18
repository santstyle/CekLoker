/**
 * Penjelasan sumber penetapan level (rentang risiko) sebuah hasil evaluasi.
 *
 * Dipakai bersama oleh halaman hasil, kartu bagikan, dan laporan PDF agar
 * kalimatnya selalu sama. Fungsi murni: tidak membaca data eksternal.
 */

import { RULES } from "./rules";
import type { HasilEvaluasi } from "./types";

const PETA_RULE = new Map(RULES.map((rule) => [rule.id, rule]));

/**
 * Kalimat penjelas dari mana rentang risiko akhir berasal.
 *
 * - `aturan_penentu`: level dinaikkan langsung oleh indikator terkuat,
 *   bukan oleh akumulasi skor.
 * - `skor`: level murni dari akumulasi skor.
 * - tidak ada informasinya (hasil lama tersimpan di sesi): kalimat generik.
 */
export function penjelasanPenentuLevel(hasil: HasilEvaluasi): string {
  if (
    hasil.penentu_level === "aturan_penentu" &&
    hasil.id_aturan_penentu !== undefined
  ) {
    const aturan = PETA_RULE.get(hasil.id_aturan_penentu);
    const nama = aturan?.judul ?? hasil.id_aturan_penentu;
    return `Level ini ditetapkan langsung oleh indikator “${nama}”, meskipun skor total ${hasil.skor}. Indikator terkuat dapat menaikkan rentang, berapa pun skornya.`;
  }

  if (hasil.penentu_level === "skor") {
    return `Level ini ditetapkan oleh akumulasi skor indikator (skor total ${hasil.skor}).`;
  }

  return "Level dapat ditetapkan langsung oleh indikator terkuat, berapa pun skornya.";
}
