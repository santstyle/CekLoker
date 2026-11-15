import { z } from "zod";

/**
 * Kontrak masukan pengguna atas hasil evaluasi ("Hasil ini keliru?").
 *
 * Masukan bersifat kategorikal: hanya pilihan alasan dan (opsional) kode temuan
 * yang dipersoalkan. Tidak ada catatan bebas, sehingga teks iklan pengguna
 * tidak pernah tersimpan di server. Seluruh teks dalam Bahasa Indonesia sesuai
 * konvensi proyek.
 */

export const ALASAN_MASUKAN = [
  "temuan_keliru",
  "temuan_terlewat",
  "kutipan_tidak_sesuai",
  "rentang_tidak_sesuai",
  "alasan_lain",
] as const;

export type AlasanMasukan = (typeof ALASAN_MASUKAN)[number];

export const LABEL_ALASAN_MASUKAN: Readonly<Record<AlasanMasukan, string>> = {
  temuan_keliru: "Temuan tidak tepat",
  temuan_terlewat: "Ada indikator risiko yang terlewat",
  kutipan_tidak_sesuai: "Kutipan bukti tidak sesuai iklan",
  rentang_tidak_sesuai: "Rentang risiko tidak sesuai",
  alasan_lain: "Alasan lain",
};

export const KETERANGAN_ALASAN_MASUKAN: Readonly<
  Record<AlasanMasukan, string>
> = {
  temuan_keliru: "Ada indikator yang ditandai padahal menurut Anda wajar.",
  temuan_terlewat: "Ada tanda risiko yang seharusnya ikut terdeteksi.",
  kutipan_tidak_sesuai: "Potongan bukti tidak cocok dengan teks iklan.",
  rentang_tidak_sesuai: "Hasil keseluruhan terlalu tinggi atau terlalu rendah.",
  alasan_lain: "Alasan berbeda dari pilihan di atas.",
};

/** Skema validasi body POST /api/masukan. */
export const skemaMasukan = z.object(
  {
    checkId: z
      .string("Id sesi wajib diisi.")
      .trim()
      .min(1, "Id sesi wajib diisi.")
      .max(64, "Id sesi tidak valid.")
      // Alfabet nanoid: id yang dibuat mesin evaluasi hanya memakai
      // A-Z, a-z, 0-9, "-", dan "_". Karakter lain ditolak.
      .regex(/^[A-Za-z0-9_-]{1,64}$/, "Id sesi tidak valid."),
    alasan: z.enum(ALASAN_MASUKAN, {
      error: "Pilih salah satu alasan yang tersedia.",
    }),
    ruleCode: z
      .string("Kode temuan harus berupa teks.")
      .trim()
      .max(80, "Kode temuan tidak valid.")
      .optional(),
  },
  { error: "Body permintaan harus berupa objek JSON." },
);

export type InputMasukan = z.infer<typeof skemaMasukan>;

/**
 * Kunci penanda di sessionStorage bahwa masukan untuk satu sesi sudah dikirim.
 * Dipakai untuk menampilkan ucapan terima kasih tanpa mengirim ulang.
 */
export function kunciSimpananMasukan(checkId: string): string {
  return `cekloker-masukan-${checkId}`;
}
