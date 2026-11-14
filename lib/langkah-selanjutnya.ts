/**
 * Kartu "Langkah selanjutnya" di halaman hasil.
 *
 * Seluruh konten bersifat statis dan berbeda per level risiko. Tidak ada
 * teks iklan pengguna atau data pribadi yang masuk ke sini, dan salinan
 * tidak pernah menuduh perusahaan sebagai penipu — hanya indikasi risiko.
 *
 * Kanal resmi disimpan sebagai data. Karena belum ada URL resmi yang
 * diverifikasi (tidak ada di repo dan belum diberikan pemilik), seluruh
 * kanal berstatus perlu_verifikasi dengan url null; antarmuka menampilkan
 * statusnya, bukan tautan karangan.
 */

import type { Band } from "@/lib/evaluation/types";

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
      "Laporkan melalui kanal resmi berikut bila sudah terjadi kerugian.",
    ],
    templatePesan:
      "Halo Tim Rekrutmen,\n\nSaya meminta konfirmasi resmi atas lowongan ini karena beberapa poinnya tidak lazim. Mohon tanggapan melalui kanal perusahaan terverifikasi; sampai saat itu saya tidak akan mengirim data pribadi atau melakukan pembayaran.\n\nTerima kasih.",
  },
} as const;

export interface KanalResmi {
  id: string;
  nama: string;
  keterangan: string;
  /** TODO: isi URL kanal resmi yang sudah diverifikasi; null bila belum. */
  url: string | null;
  /** Selalu true sampai URL diverifikasi oleh pemilik proyek. */
  perlu_verifikasi: true;
  /** Tanggal verifikasi URL, format ISO YYYY-MM-DD; null bila belum. */
  tanggal_verifikasi: string | null;
}

export const KANAL_RESMI: readonly KanalResmi[] = [
  {
    id: "pengaduan-ketenagakerjaan",
    nama: "Pengaduan ketenagakerjaan",
    keterangan:
      "Kanal resmi pemerintah untuk pengaduan dan sengketa ketenagakerjaan.",
    url: null,
    perlu_verifikasi: true,
    tanggal_verifikasi: null, // TODO: isi setelah URL resmi diverifikasi
  },
  {
    id: "kepolisian-siber",
    nama: "Kepolisian siber",
    keterangan: "Laporan dugaan tindak pidana penipuan daring.",
    url: null,
    perlu_verifikasi: true,
    tanggal_verifikasi: null, // TODO: isi setelah URL resmi diverifikasi
  },
  {
    id: "cek-rekening",
    nama: "Cek rekening",
    keterangan:
      "Verifikasi nama pemilik rekening sebelum melakukan transfer apa pun.",
    url: null,
    perlu_verifikasi: true,
    tanggal_verifikasi: null, // TODO: isi setelah URL resmi diverifikasi
  },
  {
    id: "cek-badan-usaha",
    nama: "Cek badan usaha",
    keterangan: "Verifikasi keberadaan badan usaha dan izin usahanya.",
    url: null,
    perlu_verifikasi: true,
    tanggal_verifikasi: null, // TODO: isi setelah URL resmi diverifikasi
  },
] as const;
