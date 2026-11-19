import { expect, test } from "@playwright/test";

/**
 * Dashboard /tren (Fase B #8).
 *
 * Halaman memakai data agregat anonim dari tabel checks dan bersifat
 * force-dynamic. Pengujian TIDAK menulis basis data: ia hanya memastikan
 * kepala halaman, penjelasan ambang, dan salah satu dari dua keadaan
 * deterministik tampil — "sampel belum cukup" (termasuk bila basis data
 * tidak terjangkau) atau ringkasan lengkap.
 */
test.describe("Halaman /tren", () => {
  test("menampilkan judul, penjelasan ambang, dan salah satu keadaan data", async ({
    page,
  }) => {
    await page.goto("/tren");

    await expect(
      page.getByRole("heading", { name: /tren pemeriksaan/i }),
    ).toBeVisible();

    // Penjelasan ambang selalu tampil di kepala halaman.
    await expect(page.getByText(/minimal 10 sampel/i)).toBeVisible();
    await expect(page.getByText(/agregat dan anonim/i)).toBeVisible();

    // Keadaan deterministik: sampel belum cukup ATAU ringkasan lengkap.
    const belumCukup = page.getByTestId("tren-belum-cukup");
    const adaRingkasan = page.getByRole("heading", {
      name: /ringkasan pemeriksaan/i,
    });
    const jumlahKeadaan =
      (await belumCukup.count()) + (await adaRingkasan.count());
    expect(jumlahKeadaan).toBeGreaterThan(0);

    // Bila sampel cukup, seluruh bagian dashboard tampil.
    if ((await adaRingkasan.count()) > 0) {
      await expect(
        page.getByRole("heading", { name: /distribusi per bulan/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: /aturan yang paling sering menyala/i,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /sebaran per wilayah/i }),
      ).toBeVisible();
    }
  });

  test("dapat dicapai dari navigasi utama", async ({ page }) => {
    await page.goto("/");

    // Di desktop, Tren berada di dropdown "Transparansi".
    const dropdown = page.getByRole("button", { name: /transparansi/i });
    if (await dropdown.isVisible()) {
      await dropdown.click();
      await expect(
        page.getByRole("menu").getByRole("menuitem", { name: "Tren" }),
      ).toBeVisible();
      return;
    }

    // Di mobile, Tren muncul sebagai item daftar di bawah menu hamburger.
    const hamburger = page.getByRole("button", { name: /menu navigasi/i });
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await expect(
        page
          .getByRole("navigation", { name: "Navigasi mobile" })
          .getByRole("link", {
            name: "Tren",
          }),
      ).toBeVisible();
    }
  });
});
