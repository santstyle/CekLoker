/**
 * Agregat data pemeriksaan untuk dashboard /tren.
 *
 * Seluruh fungsi di sini murni dan deterministik: masukan berupa baris
 * `checks` mentah (data agregat anonim — tanpa teks iklan, nama, maupun
 * kontak), keluarannya berupa ringkasan siap render. Tidak ada Date.now(),
 * Math.random(), maupun akses jaringan.
 *
 * Ambang sampel: satu kelompok (bulan atau wilayah) hanya ditampilkan bila
 * menyumbang minimal `BATAS_MIN_SAMPEL` pemeriksaan. Kelompok di bawah
 * ambang disembunyikan agar persentase dari segelintir data tidak dikira
 * tren.
 */

import type { Band } from "@/lib/evaluation/types";

/** Jumlah minimum pemeriksaan agar satu kelompok layak ditampilkan. */
export const BATAS_MIN_SAMPEL = 10;

/** Baris `checks` sebagaimana dibaca dari basis data (agregat anonim). */
export interface BarisTrenMentah {
  dibuatPada: Date;
  region: string | null;
  band: Band;
  kodeAturan: readonly string[];
}

/** Satu bulan pada diagram tren. */
export interface BarisBulan {
  /** Kunci kronologis "YYYY-MM" (UTC). */
  kunci: string;
  /** Label Bahasa Indonesia, mis. "November 2026". */
  label: string;
  total: number;
  rendah: number;
  perluDicek: number;
  tinggi: number;
}

/** Satu aturan yang paling sering menyala. */
export interface HitunganAturan {
  kode: string;
  /** Judul aturan bila dikenali; null bila kode tidak ditemukan. */
  judul: string | null;
  jumlah: number;
}

/** Satu wilayah pada sebaran regional. */
export interface BarisWilayah {
  wilayah: string;
  total: number;
  bandDominan: Band;
  /** Persentase band dominan terhadap total wilayah (0–100, bulat). */
  persenDominan: number;
}

export interface RingkasanTren {
  total: number;
  rendah: number;
  perluDicek: number;
  tinggi: number;
  persenRendah: number;
  persenPerluDicek: number;
  persenTinggi: number;
}

const NAMA_BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

/** Pengelompokan bulan memakai UTC agar tidak bergantung pada server. */
export function kunciBulan(dari: Date): string {
  return dari.toISOString().slice(0, 7);
}

export function labelBulan(kunci: string): string {
  const tahun = Number(kunci.slice(0, 4));
  const bulan = Number(kunci.slice(5, 7));
  if (!Number.isInteger(tahun) || !Number.isInteger(bulan)) return kunci;
  if (bulan < 1 || bulan > 12) return kunci;
  return `${NAMA_BULAN[bulan - 1]} ${tahun}`;
}

/** Hitungan band dalam kumpulan baris, untuk penjumlahan. */
function hitungBand(daftar: readonly BarisTrenMentah[]): Record<Band, number> {
  const hitung: Record<Band, number> = {
    rendah: 0,
    perlu_dicek: 0,
    tinggi: 0,
  };
  for (const satu of daftar) hitung[satu.band] += 1;
  return hitung;
}

function persen(bagian: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((bagian / total) * 100);
}

/** Ringkasan keseluruhan sampel. */
export function ringkasanTren(
  baris: readonly BarisTrenMentah[],
): RingkasanTren {
  const hitung = hitungBand(baris);
  const total = baris.length;
  return {
    total,
    rendah: hitung.rendah,
    perluDicek: hitung.perlu_dicek,
    tinggi: hitung.tinggi,
    persenRendah: persen(hitung.rendah, total),
    persenPerluDicek: persen(hitung.perlu_dicek, total),
    persenTinggi: persen(hitung.tinggi, total),
  };
}

/**
 * Tren bulanan kronologis. Bulan dengan sampel di bawah ambang
 * disembunyikan seluruhnya, bukan ditampilkan sebagian.
 */
export function trenBulanan(baris: readonly BarisTrenMentah[]): BarisBulan[] {
  const perBulan = new Map<string, BarisTrenMentah[]>();
  for (const satu of baris) {
    const kunci = kunciBulan(satu.dibuatPada);
    const daftar = perBulan.get(kunci);
    if (daftar) daftar.push(satu);
    else perBulan.set(kunci, [satu]);
  }

  const hasil: BarisBulan[] = [];
  for (const [kunci, milikBulan] of perBulan) {
    if (milikBulan.length < BATAS_MIN_SAMPEL) continue;
    const hitung = hitungBand(milikBulan);
    hasil.push({
      kunci,
      label: labelBulan(kunci),
      total: milikBulan.length,
      rendah: hitung.rendah,
      perluDicek: hitung.perlu_dicek,
      tinggi: hitung.tinggi,
    });
  }

  // Urut kronologis naik; tie-break kunci string ("YYYY-MM") sudah stabil.
  hasil.sort((a, b) => (a.kunci < b.kunci ? -1 : a.kunci > b.kunci ? 1 : 0));
  return hasil;
}

/**
 * Aturan paling sering menyala, terbanyak dahulu. Tie-break: kode aturan
 * secara leksikografis agar urutan selalu sama untuk data yang sama.
 */
export function aturanTeratas(
  baris: readonly BarisTrenMentah[],
  judulAturan: Readonly<Record<string, string>>,
  maksimum = 10,
): HitunganAturan[] {
  const hitung = new Map<string, number>();
  for (const satu of baris) {
    for (const kode of satu.kodeAturan) {
      hitung.set(kode, (hitung.get(kode) ?? 0) + 1);
    }
  }

  return [...hitung.entries()]
    .sort((a, b) => (a[1] === b[1] ? (a[0] < b[0] ? -1 : 1) : b[1] - a[1]))
    .slice(0, maksimum)
    .map(([kode, jumlah]) => ({
      kode,
      judul: judulAturan[kode] ?? null,
      jumlah,
    }));
}

/** Label untuk baris tanpa wilayah tercatat. */
export const LABEL_WILAYAH_KOSONG = "Tanpa wilayah";
function wilayahBagi(region: string | null): string {
  const bersih = region?.trim();
  return bersih && bersih.length > 0 ? bersih : LABEL_WILAYAH_KOSONG;
}

/**
 * Sebaran per wilayah, terbanyak dahulu. Wilayah dengan sampel di bawah
 * ambang disembunyikan. Band dominan dipecah dengan urutan BAND bila seri.
 */
export function trenWilayah(baris: readonly BarisTrenMentah[]): BarisWilayah[] {
  const perWilayah = new Map<string, BarisTrenMentah[]>();
  for (const satu of baris) {
    const nama = wilayahBagi(satu.region);
    const daftar = perWilayah.get(nama);
    if (daftar) daftar.push(satu);
    else perWilayah.set(nama, [satu]);
  }

  const urutanBand: readonly Band[] = ["rendah", "perlu_dicek", "tinggi"];

  const hasil: BarisWilayah[] = [];
  for (const [wilayah, milikWilayah] of perWilayah) {
    if (milikWilayah.length < BATAS_MIN_SAMPEL) continue;

    const hitung = hitungBand(milikWilayah);
    let dominan: Band = "rendah";
    for (const band of urutanBand) {
      if (hitung[band] > hitung[dominan]) dominan = band;
    }

    hasil.push({
      wilayah,
      total: milikWilayah.length,
      bandDominan: dominan,
      persenDominan: persen(hitung[dominan], milikWilayah.length),
    });
  }

  hasil.sort((a, b) =>
    a.total === b.total ? (a.wilayah < b.wilayah ? -1 : 1) : b.total - a.total,
  );
  return hasil;
}
