import { defineConfig, devices } from "@playwright/test";

/**
 * Konfigurasi E2E Playwright untuk CekLoker.
 *
 * Menjalankan server produksi (`next start`) di port 3211, lalu menjalankan
 * tes alur inti: /cek → POST /api/evaluasi (dimock) → /hasil/<id>.
 *
 * CATATAN: Database Neon TIDAK ditulis karena POST /api/evaluasi diintersepsi
 * oleh `page.route()` dan dikembalikan respons palsu yang deterministik.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3211",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm start --port 3211",
    url: "http://localhost:3211",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
