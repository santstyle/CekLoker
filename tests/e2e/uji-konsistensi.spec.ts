import { expect, test } from "@playwright/test";

/**
 * Halaman uji konsistensi publik.
 *
 * Halaman bersifat statis dan deterministik; tidak ada permintaan jaringan ke
 * API atau database. Pengujian memastikan ringkasan tampil, seluruh kasus acuan
 * terdaftar, dan tidak ada kasus yang tidak konsisten. Halaman ini mengukur
 * konsistensi terhadap kasus acuan sintetis — bukan akurasi pada iklan nyata.
 */
test.describe("Halaman /uji-konsistensi", () => {
  test("menampilkan ringkasan konsistensi dan daftar kasus acuan", async ({
    page,
  }) => {
    await page.goto("/uji-konsistensi");

    await expect(
      page.getByRole("heading", { name: /Diuji terbuka/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Ringkasan Hasil/i }),
    ).toBeVisible();

    // Target kejujuran halaman: jumlah konsisten dengan acuan tampil dinamis.
    await expect(
      page.getByText(/\d+\/\d+ konsisten dengan acuan/i),
    ).toBeVisible();

    // Status jujur untuk evaluasi iklan nyata.
    await expect(
      page.getByRole("heading", { name: /Evaluasi dengan iklan nyata/i }),
    ).toBeVisible();
    await expect(page.getByText("Belum dilakukan")).toBeVisible();

    // Tabel kasus memuat puluhan baris; minimal 30 sesuai himpunan acuan.
    const baris = page.locator("table tbody tr");
    expect(await baris.count()).toBeGreaterThanOrEqual(30);

    // Tidak ada ketidakkonsistenan yang dilaporkan.
    await expect(page.getByTestId("tanpa-ketidakcocokan")).toBeVisible();
    await expect(page.getByTestId("daftar-ketidakcocokan")).toHaveCount(0);
    await expect(
      page.getByText("Tidak konsisten", { exact: true }),
    ).toHaveCount(0);
  });

  test("rute lama /uji-akurasi dialihkan permanen", async ({ request }) => {
    const response = await request.get("/uji-akurasi", {
      maxRedirects: 0,
    });
    expect([301, 308]).toContain(response.status());
    expect(response.headers()["location"]).toContain("/uji-konsistensi");
  });
});
