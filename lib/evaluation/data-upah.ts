/**
 * Data upah minimum regional (UMP/UMK) per provinsi.
 *
 * Nilai UMP 2026 diisi dari penetapan resmi (dasar hukum: PP Nomor 49 Tahun
 * 2025, perubahan kedua PP 36/2021 tentang Pengupahan). Angka tidak boleh
 * ditebak: baris dengan upahBulanan atau tahun null otomatis tidak aktif,
 * sehingga mesin tidak pernah memakai angka karangan dan aturan
 * upah-dibawah-minimum tetap sunyi untuk daerah yang belum terisi.
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
  /** Nilai upah minimum bulanan dari sumber resmi (null = TODO). */
  upahBulanan: number | null;
  /** Tahun berlaku (null = TODO). */
  tahun: number | null;
  /** URL sumber resmi (null = TODO). */
  sumberUrl: string | null;
  /** Tanggal verifikasi sumber, format ISO YYYY-MM-DD (null = TODO). */
  tanggalVerifikasi: string | null;
}

/**
 * Sumber resmi UMP 2026. Satu rujukan Kemnaker dipakai untuk semua baris;
 * penetapan gubernur per provinsi adalah dasar hukum utama dan akan
 * ditautkan terpisah bila dokumennya sudah terkumpul.
 */
export const SUMBER_UMP_2026 = "https://satudata.kemnaker.go.id/infografik/105";

/**
 * Tanggal verifikasi data UMP 2026. Dipakai bersama oleh seluruh baris dan
 * oleh label "Terakhir diperbarui" di antarmuka, sehingga tanggal yang
 * tampil tidak pernah menyimpang dari tanggal sumber yang benar-benar dicek.
 */
export const TANGGAL_VERIFIKASI_UMP_2026 = "2026-11-17";

export const DATA_UPAH_MENTAH: readonly BarisDataUpah[] = [
  {
    provinsi: "Aceh",
    upahBulanan: 3_932_552,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Sumatera Utara",
    upahBulanan: 3_228_949,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Sumatera Barat",
    upahBulanan: 3_182_955,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Riau",
    upahBulanan: 3_780_495,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Kepulauan Riau",
    upahBulanan: 3_879_520,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Jambi",
    upahBulanan: 3_471_497,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Bengkulu",
    upahBulanan: 2_827_250,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Sumatera Selatan",
    upahBulanan: 3_942_963,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Kepulauan Bangka Belitung",
    upahBulanan: 4_035_000,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Lampung",
    upahBulanan: 3_047_734,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Banten",
    upahBulanan: 3_100_881.4,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "DKI Jakarta",
    upahBulanan: 5_729_876,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Jawa Barat",
    upahBulanan: 2_317_601,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Jawa Tengah",
    upahBulanan: 2_327_386.07,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "DI Yogyakarta",
    upahBulanan: 2_417_495,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Jawa Timur",
    upahBulanan: 2_446_880,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Bali",
    upahBulanan: 3_207_459,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Nusa Tenggara Barat",
    upahBulanan: 2_673_861,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Nusa Tenggara Timur",
    upahBulanan: 2_455_898,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Kalimantan Barat",
    upahBulanan: 3_054_552,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Kalimantan Tengah",
    upahBulanan: 3_686_138,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Kalimantan Selatan",
    upahBulanan: 3_725_000,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Kalimantan Timur",
    upahBulanan: 3_762_431,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Kalimantan Utara",
    upahBulanan: 3_775_243,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Sulawesi Utara",
    upahBulanan: 4_002_630,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Sulawesi Tengah",
    upahBulanan: 3_179_565,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Sulawesi Selatan",
    upahBulanan: 3_921_088,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Sulawesi Tenggara",
    upahBulanan: 3_306_496.18,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Gorontalo",
    upahBulanan: 3_405_144,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Sulawesi Barat",
    upahBulanan: 3_315_934,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Maluku",
    upahBulanan: 3_334_490,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Maluku Utara",
    upahBulanan: 3_510_240,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Papua",
    upahBulanan: 4_436_283,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Papua Barat",
    upahBulanan: 3_841_000,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Papua Barat Daya",
    upahBulanan: 3_766_000,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Papua Tengah",
    upahBulanan: 4_285_848,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Papua Pegunungan",
    upahBulanan: 4_508_714,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
  {
    provinsi: "Papua Selatan",
    upahBulanan: 4_508_100,
    tahun: 2026,
    sumberUrl: SUMBER_UMP_2026,
    tanggalVerifikasi: TANGGAL_VERIFIKASI_UMP_2026,
  },
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
