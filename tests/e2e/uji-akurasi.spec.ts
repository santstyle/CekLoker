import { expect, test } from "@playwright/test";

/**
 * Halaman uji akurasi publik (Fase A #5).
 *
 * Halaman bersifat statis dan deterministik; tidak ada permintaan jaringan ke
 * API atau database. Pengujian memastikan ringkasan tampil, seluruh kasus acuan
 * terdaftar, dan tidak ada kasus yang tidak cocok.
 */
test.describe("Halaman /uji-akurasi", () => {
  test("menampilkan ringkasan kecocokan dan daftar kasus acuan", async ({
    page,
  }) => {
    await page.goto("/uji-akurasi");

    await expect(
      page.getByRole("heading", { name: /Diuji terbuka/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Ringkasan Hasil/i }),
    ).toBeVisible();

    // Tabel kasus memuat puluhan baris; minimal 30 sesuai himpunan acuan.
    const baris = page.locator("table tbody tr");
    expect(await baris.count()).toBeGreaterThanOrEqual(30);

    // Tidak ada ketidakcocokan yang dilaporkan.
    await expect(page.getByTestId("tanpa-ketidakcocokan")).toBeVisible();
    await expect(page.getByTestId("daftar-ketidakcocokan")).toHaveCount(0);
    await expect(page.getByText("Tidak cocok", { exact: true })).toHaveCount(0);

    // Tingkat kecocokan 100%.
    await expect(page.getByText("100%")).toBeVisible();
  });
});
