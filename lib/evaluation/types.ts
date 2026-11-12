/**
 * Tipe dan konstanta bersama untuk mesin evaluasi lowongan.
 *
 * Seluruh nilai di sini bersifat deterministik: tidak ada Date.now(),
 * Math.random(), atau operasi yang bergantung pada locale.
 */

export const BAND = ["rendah", "perlu_dicek", "tinggi"] as const;

export type Band = (typeof BAND)[number];

export const KEKUATAN = ["lemah", "sedang", "kuat"] as const;

export type Kekuatan = (typeof KEKUATAN)[number];

/** Pengali kontribusi skor untuk tiap tingkat kekuatan temuan. */
export const KEKUATAN_NILAI: Record<Kekuatan, number> = {
  lemah: 0.5,
  sedang: 1,
  kuat: 1.5,
};

export const KATEGORI_RULE = [
  "upah",
  "kontak",
  "identitas",
  "dokumen",
  "seleksi",
  "tekanan",
  "diskriminasi",
  "penempatan",
  "lainnya",
] as const;

export type KategoriRule = (typeof KATEGORI_RULE)[number];

export const TIPE_RULE = ["pola", "ambang"] as const;

export type TipeRule = (typeof TIPE_RULE)[number];

/** Definisi satu aturan pemeriksaan. */
export interface Rule {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: KategoriRule;
  tipe: TipeRule;
  /** Bobot dasar 1-10 sebelum dikalikan faktor kekuatan. */
  bobot: number;
  kekuatan: Kekuatan;
  /** Band minimum bila aturan ini cocok; null berarti hanya menambah skor. */
  hasilJikaCocok: Band | null;
  /** Id rujukan hukum resmi; kosong bila aturan murni heuristik. */
  rujukanHukumIds: readonly string[];
  /** Kata kunci yang dicari pada teks yang sudah dinormalisasi. */
  pola: readonly string[];
  /** Ambang numerik untuk aturan bertipe "ambang". */
  ambangBatas: number | null;
}

/** Satu temuan hasil pemeriksaan. */
export interface Temuan {
  ruleId: string;
  judul: string;
  kategori: KategoriRule;
  kekuatan: Kekuatan;
  faktor: number;
  kontribusi: number;
  /** Kata kunci pendek yang cocok; tidak pernah berisi teks lowongan penuh. */
  bukti: string[];
  penjelasan: string;
}

export interface HasilEvaluasi {
  band: Band;
  skor: number;
  temuan: Temuan[];
  saran: string[];
  ringkasan: string;
  versi: string;
}

/** Satu baris data upah minimum regional. */
export interface RegionalWage {
  provinsi: string;
  daerah?: string;
  upahBulanan: number;
  tahun: number;
  sumberRujukan?: string;
}

/** Konteks yang diteruskan ke setiap detektor aturan. */
export interface KonteksDeteksi {
  /** Teks lowongan setelah normalisasi. */
  teks: string;
  /** Teks lowongan apa adanya. */
  teksMentah: string;
  lokasi?: string;
  perusahaan?: string;
  /** Provinsi yang berhasil dikenali, null bila tidak diketahui. */
  provinsi: string | null;
  /** Upah bulanan terendah yang wajar, null bila tidak terurai. */
  gajiBulanan: number | null;
  /** Upah minimum provinsi yang berlaku, null bila data belum tersedia. */
  upahMinimum: RegionalWage | null;
}

/** Detektor mengembalikan daftar bukti pendek; kosong berarti tidak cocok. */
export interface Detektor {
  ruleId: string;
  deteksi: (konteks: KonteksDeteksi) => string[];
}
