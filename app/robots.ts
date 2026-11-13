import type { MetadataRoute } from "next";

import { ambilUrlSitus } from "@/lib/situs";

export default function robots(): MetadataRoute.Robots {
  const urlSitus = ambilUrlSitus();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/hasil/"],
    },
    sitemap: new URL("/sitemap.xml", urlSitus).toString(),
    host: urlSitus.origin,
  };
}
