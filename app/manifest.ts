import type { MetadataRoute } from "next";

import { DESKRIPSI_SITUS, NAMA_SITUS } from "@/lib/situs";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${NAMA_SITUS} — Cek Risiko Lowongan Kerja`,
    short_name: NAMA_SITUS,
    description: DESKRIPSI_SITUS,
    lang: "id",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    categories: ["business", "productivity", "utilities"],
    icons: [
      { src: "/favicon-64x64.png", sizes: "64x64", type: "image/png" },
      { src: "/favicon-128x128.png", sizes: "128x128", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
