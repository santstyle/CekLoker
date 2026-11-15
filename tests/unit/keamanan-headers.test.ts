import { describe, expect, it, vi } from "vitest";

/**
 * Kebijakan header keamanan di next.config.ts.
 *
 * CSP hanya dipasang saat NODE_ENV=production, jadi modul dimpor ulang
 * setelah variabel lingkungan disandarkan — tanpa resetModules, cache
 * modul membuat pengujian membaca konfigurasi mode pengembangan.
 */
describe("Header keamanan produksi", () => {
  it("CSP melarang penanaman objek dan framing lintas asal", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.resetModules();

    const { default: konfigurasi } = await import("../../next.config");
    const beranda = await konfigurasi.headers?.();
    const csp = beranda
      ?.flatMap((r) => r.headers)
      .find((h) => h.key === "Content-Security-Policy")?.value;

    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");

    vi.unstubAllEnvs();
  });
});
