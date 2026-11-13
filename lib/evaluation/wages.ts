/**
 * Pencarian upah minimum regional.
 *
 * Data upah sengaja dikosongkan sampai sumber resmi terverifikasi. Selama
 * daftar kosong, aturan upah di bawah minimum tidak pernah menyala; ini
 * disengaja agar aplikasi tidak pernah menampilkan angka karangan.
 */

import { normalizeText } from "./normalize";
import { matchProvinsi } from "./provinces";
import type { RegionalWage } from "./types";

export const DATA_UPAH: readonly RegionalWage[] = [];

/** Apakah data upah minimum resmi sudah dimuat dan siap dipakai. */
export const DATA_UPAH_TERSEDIA = DATA_UPAH.length > 0;

/**
 * Keterangan status data upah untuk ditampilkan di antarmuka.
 *
 * Menjaga agar aplikasi tidak menyiratkan perbandingan UMP yang belum
 * benar-benar dijalankan.
 */
export const CATATAN_DATA_UPAH = DATA_UPAH_TERSEDIA
  ? "Perbandingan upah terhadap UMP/UMK aktif memakai data resmi yang terverifikasi."
  : "Perbandingan upah terhadap UMP/UMK belum aktif karena data upah resmi belum dimuat, sehingga hasil hanya mencakup indikator lain.";

/** Memilih data terbaru; bila tahun sama, nominal tertinggi yang dipakai. */
export function getUpahMinimum(
  provinsi: string | null | undefined,
  data: readonly RegionalWage[] = DATA_UPAH,
): RegionalWage | null {
  if (!provinsi) return null;

  const kunci = normalizeText(provinsi);
  const kandidat = data.filter(
    (baris) => normalizeText(baris.provinsi) === kunci,
  );
  if (kandidat.length === 0) return null;

  const terurut = [...kandidat].sort((a, b) => {
    if (a.tahun !== b.tahun) return b.tahun - a.tahun;
    if (a.upahBulanan !== b.upahBulanan) return b.upahBulanan - a.upahBulanan;
    const kiri = normalizeText(a.provinsi);
    const kanan = normalizeText(b.provinsi);
    return kiri < kanan ? -1 : kiri > kanan ? 1 : 0;
  });

  return terurut[0] ?? null;
}

/** Menebak provinsi dari teks lokasi, lalu mencari upah minimumnya. */
export function cariUpahUntukLokasi(
  lokasi: string | null | undefined,
  data: readonly RegionalWage[] = DATA_UPAH,
): RegionalWage | null {
  return getUpahMinimum(matchProvinsi(lokasi), data);
}
