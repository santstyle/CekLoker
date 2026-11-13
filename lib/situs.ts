/**
 * Identitas situs yang dipakai bersama oleh metadata, sitemap, robots,
 * manifest, dan gambar Open Graph.
 *
 * Semua teks dalam Bahasa Indonesia sesuai konvensi proyek.
 */
import type { Metadata } from "next";

export const NAMA_SITUS = "CekLoker";

export const JUDUL_SITUS = "CekLoker — Cek Risiko Lowongan Kerja Indonesia";

export const DESKRIPSI_SITUS =
  "CekLoker menilai iklan lowongan kerja Indonesia terhadap standar ketenagakerjaan dan indikator penipuan. Hasil berupa rentang risiko, kutipan bukti, dan rujukan hukum resmi — tanpa vonis dan tanpa menyimpan teks lowongan Anda.";

export const ALT_GAMBAR_OG =
  "CekLoker — Cek risiko lowongan kerja Indonesia sebelum melamar";

const URL_FALLBACK = "http://localhost:3000";

/**
 * URL absolut situs dari `NEXT_PUBLIC_SITE_URL`. Bila kosong atau tidak valid,
 * dipakai fallback lokal agar build dan pratinjau tetap berjalan.
 */
export function ambilUrlSitus(): URL {
  const mentah = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (mentah) {
    try {
      return new URL(mentah);
    } catch {
      // Nilai tidak valid: lanjut ke fallback.
    }
  }

  return new URL(URL_FALLBACK);
}

type MetadataHalaman = {
  judul: string;
  deskripsi: string;
  jalur: `/${string}`;
};

/**
 * Metadata halaman publik: judul (dengan template root), deskripsi, canonical,
 * dan kartu berbagi Open Graph/Twitter. Semua URL relatif diselesaikan
 * terhadap `metadataBase` di layout akar.
 */
export function metadataHalaman({
  judul,
  deskripsi,
  jalur,
}: MetadataHalaman): Metadata {
  return {
    title: judul,
    description: deskripsi,
    alternates: { canonical: jalur },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: NAMA_SITUS,
      url: jalur,
      title: judul,
      description: deskripsi,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: ALT_GAMBAR_OG,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: judul,
      description: deskripsi,
      images: ["/twitter-image"],
    },
  };
}

/** Halaman publik beserta bobot sitemap. */
export const HALAMAN_PUBLIK = [
  { jalur: "/", prioritas: 1, frekuensi: "monthly" },
  { jalur: "/cek", prioritas: 0.9, frekuensi: "monthly" },
  { jalur: "/edukasi", prioritas: 0.8, frekuensi: "monthly" },
  { jalur: "/metodologi", prioritas: 0.8, frekuensi: "monthly" },
  { jalur: "/tentang", prioritas: 0.6, frekuensi: "yearly" },
  { jalur: "/kebijakan-privasi", prioritas: 0.3, frekuensi: "yearly" },
  { jalur: "/syarat-ketentuan", prioritas: 0.3, frekuensi: "yearly" },
  { jalur: "/disclaimer", prioritas: 0.3, frekuensi: "yearly" },
] as const;
