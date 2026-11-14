/**
 * Data upah minimum regional (UMP/UMK) per provinsi.
 *
 * SELURUH NILAI MASIH KOSONG (TODO) — menunggu pengisian oleh pemilik
 * proyek dari sumber resmi per daerah. Jangan menebak angka: baris dengan
 * upahBulanan atau tahun null otomatis tidak aktif, sehingga mesin tidak
 * pernah memakai angka karangan dan aturan upah-dibawah-minimum tetap
 * sunyi sampai data benar-benar diisi.
 *
 * Struktur per baris:
 * - provinsi: nama provinsi sesuai PROVINSI di provinces.ts
 * - daerah: opsional, nama kabupaten/kota bila upahnya berbeda dari provinsi
 * - upahBulanan: nilai upah minimum per bulan (null = TODO)
 * - tahun: tahun berlaku (null = TODO)
 * - sumberUrl: URL sumber resmi nilai upah (null = TODO)
 * - tanggalVerifikasi: tanggal verifikasi sumber, format ISO YYYY-MM-DD (null = TODO)
 */

import type { RegionalWage } from "./types";

export interface BarisDataUpah {
  provinsi: string;
  daerah?: string;
  /** TODO: nilai upah minimum bulanan dari sumber resmi. */
  upahBulanan: number | null;
  /** TODO: tahun berlaku. */
  tahun: number | null;
  /** TODO: URL sumber resmi. */
  sumberUrl: string | null;
  /** TODO: tanggal verifikasi sumber (YYYY-MM-DD). */
  tanggalVerifikasi: string | null;
}

export const DATA_UPAH_MENTAH: readonly BarisDataUpah[] = [
  {
    provinsi: "Aceh",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Sumatera Utara",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Sumatera Barat",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Riau",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Kepulauan Riau",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Jambi",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Bengkulu",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Sumatera Selatan",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Kepulauan Bangka Belitung",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Lampung",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Banten",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "DKI Jakarta",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Jawa Barat",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Jawa Tengah",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "DI Yogyakarta",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Jawa Timur",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Bali",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Nusa Tenggara Barat",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Nusa Tenggara Timur",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Kalimantan Barat",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Kalimantan Tengah",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Kalimantan Selatan",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Kalimantan Timur",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Kalimantan Utara",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Sulawesi Utara",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Sulawesi Tengah",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Sulawesi Selatan",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Sulawesi Tenggara",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Gorontalo",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Sulawesi Barat",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Maluku",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Maluku Utara",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Papua",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Papua Barat",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Papua Barat Daya",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Papua Tengah",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Papua Pegunungan",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
  {
    provinsi: "Papua Selatan",
    upahBulanan: null,
    tahun: null,
    sumberUrl: null,
    tanggalVerifikasi: null,
  }, // TODO
] as const satisfies readonly BarisDataUpah[];

/**
 * Menyaring baris lengkap saja: baris dengan nilai TODO (null) tidak pernah
 * aktif, jadi mesin tidak mungkin memakai angka yang belum diverifikasi.
 */
export function barisAktif(
  data: readonly BarisDataUpah[],
): readonly RegionalWage[] {
  return data.flatMap((baris) => {
    if (baris.upahBulanan === null || baris.tahun === null) return [];

    const aktif: RegionalWage = {
      provinsi: baris.provinsi,
      upahBulanan: baris.upahBulanan,
      tahun: baris.tahun,
    };
    if (baris.daerah) aktif.daerah = baris.daerah;
    if (baris.sumberUrl) aktif.sumberUrl = baris.sumberUrl;
    if (baris.tanggalVerifikasi)
      aktif.tanggalVerifikasi = baris.tanggalVerifikasi;

    return [aktif];
  });
}
