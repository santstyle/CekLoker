import { expect, test } from "@playwright/test";

/**
 * Klaim jujur data upah: UMP 2026 yang sudah terverifikasi ditampilkan
 * sebagai tersedia, dan katalog menghitung aturan aktif secara dinamis.
 */
test.describe("Status data upah di antarmuka", () => {
  test("/cek menyatakan data UMP tersedia untuk lokasi yang dipilih", async ({
    page,
  }) => {
    await page.goto("/cek");
    await page.locator("#lokasi").fill("Bandung");
    const status = page.getByText("Data UMP Jawa Barat tahun 2026 tersedia.");
    await status.scrollIntoViewIfNeeded();
    await expect(status).toBeVisible();
  });

  test("/cek menampilkan catatan netral bila lokasi kosong", async ({
    page,
  }) => {
    await page.goto("/cek");
    await expect(
      page.getByText(/Perbandingan upah terhadap UMP\/UMK aktif/),
    ).toBeVisible();
  });

  test("/metodologi menandai aturan upah aktif dan menghitung aturan aktif dinamis", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/metodologi");

    const badge = page.getByText("Tersedia & Aktif", { exact: true });
    await badge.scrollIntoViewIfNeeded();
    await expect(badge).toBeVisible();

    await expect(page.getByText(/Seluruh \d+ aturan aktif\./)).toBeVisible();
  });
});
