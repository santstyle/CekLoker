import type { NextConfig } from "next";

/**
 * Header keamanan yang dipasang untuk seluruh rute.
 *
 * CSP diterapkan hanya di production. React development mode memakai
 * `eval()` untuk fitur debugging, jadi CSP dilonggarkan saat `next dev`.
 * Di production CSP ketat berjalan: worker WASM tesseract dimuat dari
 * origin sendiri (blob + self), `'wasm-unsafe-eval'` diperlukan untuk
 * kompilasi WebAssembly.
 */
const isProduction = process.env.NODE_ENV === "production";

const HEADER_KEAMANAN = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  ...(isProduction
    ? [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "font-src 'self'",
            "connect-src 'self'",
            "worker-src 'self' blob:",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // 85 untuk foto kartu liputan; bawaan Next 16 hanya 75
    qualities: [75, 85],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: HEADER_KEAMANAN,
      },
    ];
  },
  async redirects() {
    return [
      {
        // Rute lama /uji-akurasi sudah diganti /uji-konsistensi.
        source: "/uji-akurasi",
        destination: "/uji-konsistensi",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
