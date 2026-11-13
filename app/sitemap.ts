import type { MetadataRoute } from "next";

import { ambilUrlSitus, HALAMAN_PUBLIK } from "@/lib/situs";

export default function sitemap(): MetadataRoute.Sitemap {
  const urlSitus = ambilUrlSitus();

  // `lastModified` sengaja dilepas: nilainya non-deterministik dan akan
  // menggagalkan prerender di bawah `cacheComponents`.
  return HALAMAN_PUBLIK.map((halaman) => ({
    url: new URL(halaman.jalur, urlSitus).toString(),
    changeFrequency: halaman.frekuensi,
    priority: halaman.prioritas,
  }));
}
