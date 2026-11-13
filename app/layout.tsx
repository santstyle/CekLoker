import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter_Tight } from "next/font/google";

import {
  ambilUrlSitus,
  DESKRIPSI_SITUS,
  JUDUL_SITUS,
  NAMA_SITUS,
} from "@/lib/situs";

import "./globals.css";

// Sistem dua keluarga: Inter Tight (ExtraBold untuk display, reguler untuk
// body) dan IBM Plex Mono untuk label/data ala dokumen resmi.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: ambilUrlSitus(),
  title: {
    default: JUDUL_SITUS,
    template: `%s — ${NAMA_SITUS}`,
  },
  description: DESKRIPSI_SITUS,
  applicationName: NAMA_SITUS,
  category: "ketenagakerjaan",
  keywords: [
    "cek lowongan kerja",
    "lowongan kerja berisiko",
    "indikator penipuan lowongan",
    "hak pekerja Indonesia",
    "upah minimum",
    "ketenagakerjaan",
  ],
  authors: [{ name: NAMA_SITUS }],
  creator: NAMA_SITUS,
  publisher: NAMA_SITUS,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: NAMA_SITUS,
    title: JUDUL_SITUS,
    description: DESKRIPSI_SITUS,
  },
  twitter: {
    card: "summary_large_image",
    title: JUDUL_SITUS,
    description: DESKRIPSI_SITUS,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-64x64.png", type: "image/png", sizes: "64x64" },
      { url: "/favicon-128x128.png", type: "image/png", sizes: "128x128" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${interTight.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
