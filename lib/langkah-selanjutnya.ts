/**
 * Kartu "Langkah selanjutnya" di halaman hasil.
 *
 * Seluruh konten bersifat statis dan berbeda per level risiko. Tidak ada
 * teks iklan pengguna maupun data pribadi yang masuk ke sini, dan salinan
 * tidak pernah menuduh perusahaan sebagai penipu — hanya indikasi risiko.
 *
 * Kanal resmi disimpan sebagai data di bawah (diekspor untuk pengujian).
 * Karena belum ada URL resmi yang diverifikasi, seluruh kanal berstatus
 * "perlu verifikasi". Data ini sengaja TIDAK dirender di kartu hasil,
 * PDF, maupun /cek — kanal pelaporan hanya ditunjuk di /bantuan.
 */

import type { Band } from "@/lib/evaluation/types";
import type { SumberVerifikasi } from "@/lib/verifikasi";

export interface LangkahSelanjutnya {
  /** Tindakan singkat yang bisa langsung dilakukan pengguna. */
  tindakan: readonly string[];
  /** Template pesan konfirmasi ke perusahaan; tombol "Salin" memakai ini. */
  templatePesan: string;
}

export const LANGKAH_SELANJUTNYA: Readonly<Record<Band, LangkahSelanjutnya>> = {
  rendah: {
    tindakan: [
      "Simpan bukti iklan (tangkapan layar atau tautan) sebagai arsip.",
      "Konfirmasi detail kontrak, jam kerja, dan komponen gaji secara tertulis.",
      "Cek nama perusahaan pada kanal resminya sebelum melamar.",
    ],
    templatePesan:
      "Halo Tim Rekrutmen,\n\nSaya tertarik dengan lowongan yang Bapak/Ibu bagikan. Sebelum melanjutkan, izinkan saya konfirmasi: berapa kisaran upah pastinya, bagaimana struktur kontrak, dan kapan jadwal seleksinya?\n\nTerima kasih.",
  },
  perlu_dicek: {
    tindakan: [
      "Jangan kirim KTP, NPWP, rekening, atau uang apa pun dulu.",
      "Simpan seluruh bukti obrolan dan tangkapan layar iklan.",
      "Minta konfirmasi tertulis atas setiap poin yang mencurigakan.",
      "Verifikasi perusahaan melalui kanal resmi yang terdaftar.",
    ],
    templatePesan:
      "Halo Tim Rekrutmen,\n\nSaya menemukan beberapa hal yang perlu dikonfirmasi sebelum melanjutkan: [sebutkan poin yang diragukan]. Mohon penjelasan resminya melalui surat atau kanal perusahaan terverifikasi.\n\nTerima kasih.",
  },
  tinggi: {
    tindakan: [
      "Berhenti berkomunikasi bila diminta transfer atau data rekening.",
      "Jangan kirim KTP, NPWP, atau dokumen pribadi apa pun.",
      "Simpan semua bukti: tangkapan layar, nomor rekening, dan riwayat pesan.",
      "Verifikasi identitas perusahaan lewat situs atau nomor resminya sendiri sebelum melanjutkan.",
    ],
    templatePesan:
      "Halo Tim Rekrutmen,\n\nSaya meminta konfirmasi resmi atas lowongan ini karena beberapa poinnya tidak lazim. Mohon tanggapan melalui kanal perusahaan terverifikasi; sampai saat itu saya tidak akan mengirim data pribadi atau melakukan pembayaran.\n\nTerima kasih.",
  },
} as const;

/**
 * Satu kanal resmi verifikasi/pengaduan.
 *
 * Status verifikasi tidak disimpan sebagai bidang terpisah — ia diturunkan
 * dari `url` dan `tanggalVerifikasi` lewat `statusVerifikasi()` di
 * `lib/verifikasi.ts`. Dengan begitu data tidak mungkin menyatakan
 * "terverifikasi" sementara URL-nya belum ada.
 */
export interface KanalResmi extends SumberVerifikasi {
  id: string;
  nama: string;
  keterangan: string;
  /** URL kanal resmi yang sudah diverifikasi; null bila belum. */
  url: string | null;
  /** Tanggal verifikasi URL, format ISO YYYY-MM-DD; null bila belum. */
  tanggalVerifikasi: string | null;
}

export const KANAL_RESMI: readonly KanalResmi[] = [
  {
    id: "pengaduan-ketenagakerjaan",
    nama: "Pengaduan ketenagakerjaan",
    keterangan:
      "Kanal resmi pemerintah untuk pengaduan dan sengketa ketenagakerjaan.",
    url: null,
    tanggalVerifikasi: null, // TODO: isi setelah URL resmi diverifikasi
  },
  {
    id: "kepolisian-siber",
    nama: "Kepolisian siber",
    keterangan: "Laporan dugaan tindak pidana penipuan daring.",
    url: null,
    tanggalVerifikasi: null, // TODO: isi setelah URL resmi diverifikasi
  },
  {
    id: "cek-rekening",
    nama: "Cek rekening",
    keterangan:
      "Verifikasi nama pemilik rekening sebelum melakukan transfer apa pun.",
    url: null,
    tanggalVerifikasi: null, // TODO: isi setelah URL resmi diverifikasi
  },
  {
    id: "cek-badan-usaha",
    nama: "Cek badan usaha",
    keterangan: "Verifikasi keberadaan badan usaha dan izin usahanya.",
    url: null,
    tanggalVerifikasi: null, // TODO: isi setelah URL resmi diverifikasi
  },
] as const;
