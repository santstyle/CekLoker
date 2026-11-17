/**
 * Metadata versi katalog aturan evaluasi.
 *
 * `EVALUATOR_VERSION` (di evaluate.ts) menandai versi mesin secara umum,
 * sedangkan `VERSI_ATURAN` khusus menandai katalog aturan: daftar aturan,
 * bobot, ambang, dan rujukan hukumnya. Keduanya dipisah agar perbaikan mesin
 * yang tidak mengubah aturan tidak menaikkan versi aturan.
 *
 * Setiap kenaikan `VERSI_ATURAN` wajib disertai entri baru di
 * `CHANGELOG-ATURAN.md`; tes penjaga memastikan versi teratas changelog
 * selalu sama dengan konstanta ini.
 */

export const VERSI_ATURAN = "1.0.0";

/** Tanggal pembaruan katalog aturan, format ISO YYYY-MM-DD. */
export const DIPERBARUI_ATURAN = "2026-11-16";

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

/**
 * Ubah tanggal ISO (YYYY-MM-DD) menjadi bentuk ramah baca Bahasa Indonesia,
 * mis. "16 November 2026". Tanggal yang tidak valid dikembalikan apa adanya.
 */
export function formatTanggalAturan(iso: string): string {
  const cocok = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!cocok) return iso;

  const [, tahun, bulan, hari] = cocok;
  const namaBulan = NAMA_BULAN[Number(bulan) - 1];
  if (!namaBulan) return iso;

  return `${Number(hari)} ${namaBulan} ${tahun}`;
}
