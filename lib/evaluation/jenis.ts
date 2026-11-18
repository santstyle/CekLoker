/**
 * Jenis dasar sebuah aturan evaluasi, diturunkan dari `rujukanHukumIds`.
 *
 * - `hukum`: aturan yang merujuk peraturan resmi (UU, Permenaker, dst.).
 * - `pola`: indikator umum risiko rekrutmen tanpa rujukan pasal spesifik.
 *
 * Diturunkan (bukan disimpan sebagai field) agar tidak mungkin melenceng
 * dari data aturan itu sendiri.
 */

import type { Rule } from "./types";

export const JENIS_RULE = ["hukum", "pola"] as const;

export type JenisRule = (typeof JENIS_RULE)[number];

/** Label tampilan untuk tiap jenis aturan. */
export const LABEL_JENIS_RULE: Readonly<Record<JenisRule, string>> = {
  hukum: "Dasar hukum",
  pola: "Pola indikator",
};

type RuleDenganRujukan = Pick<Rule, "rujukanHukumIds">;

/** Menentukan jenis aturan dari rujukan hukumnya. */
export function jenisAturan(rule: RuleDenganRujukan): JenisRule {
  return rule.rujukanHukumIds.length > 0 ? "hukum" : "pola";
}

export interface RingkasanJenis {
  hukum: number;
  pola: number;
}

/** Menghitung jumlah aturan per jenis. */
export function hitungJenis(
  rules: readonly RuleDenganRujukan[],
): RingkasanJenis {
  let hukum = 0;
  for (const rule of rules) {
    if (jenisAturan(rule) === "hukum") hukum += 1;
  }
  return { hukum, pola: rules.length - hukum };
}
