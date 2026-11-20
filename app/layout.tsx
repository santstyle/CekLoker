import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Mono,
  Inter_Tight,
  Plus_Jakarta_Sans,
} from "next/font/google";

import {
  ambilUrlSitus,
  DESKRIPSI_SITUS,
  JUDUL_SITUS,
  NAMA_SITUS,
} from "@/lib/situs";

import "./globals.css";

// JSON-LD structured data untuk SEO & rich results
function generateJsonLd() {
  const url = ambilUrlSitus();
  const base = url.toString().replace(/\/$/, "");

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: NAMA_SITUS,
    url: base,
    description: DESKRIPSI_SITUS,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/cek?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: NAMA_SITUS,
    url: base,
    logo: `${base}/icon-512.png`,
    sameAs: [],
    description: DESKRIPSI_SITUS,
  };

  // FAQPage dari halaman utama (opsional, di-render inline di page.tsx juga bisa)
  // Di sini hanya struktur dasar; FAQ lengkap di halaman utama.
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Apakah CekLoker menyimpan teks lowongan yang saya periksa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tidak. CekLoker tidak menyimpan teks lowongan Anda di server. Evaluasi berjalan di sisi klien dan hasil disimpan sementara di sessionStorage peramban Anda saja.",
        },
      },
      {
        "@type": "Question",
        name: "Bagaimana CekLoker menilai risiko lowongan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CekLoker menggunakan 17 aturan deterministik berbasis UU 13/2003, Permenaker 39/2016, UU 27/2022, dan UU 18/2017. Setiap aturan memiliki bobot, kategori, dan kekuatan yang transparan di halaman Metodologi.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah hasil CekLoker merupakan vonis hukum?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tidak. Hasil berupa rentang risiko estimasi (rendah/perlu dicek/tinggi) dengan bukti dan rujukan hukum, bukan vonis penipuan atau keaslian.",
        },
      },
    ],
  };

  return [website, organization, faqPage];
}

// Sistem tiga keluarga: Inter Tight (ExtraBold untuk display, reguler untuk
// body), IBM Plex Mono untuk label/data ala dokumen resmi, dan Plus Jakarta
// Sans untuk kicker lembut yang tidak sekaku mono.
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

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
      { url: "/favicon.svg", type: "image/svg+xml" },
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
  const jsonLd = generateJsonLd();

  return (
    <html
      lang="id"
      className={`${interTight.variable} ${plexMono.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
