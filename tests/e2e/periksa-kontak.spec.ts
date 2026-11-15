import { expect, test } from "@playwright/test";

/**
 * Pemeriksaan kontak & domain di halaman /cek — seluruhnya di peramban,
 * tanpa permintaan jaringan eksternal.
 */
test.describe("Pemeriksaan kontak & domain di klien", () => {
  test.beforeEach(async ({ page }) => {
    // Intersepsi POST /api/evaluasi agar mengetik di form tidak pernah
    // menyentuh basis data maupun layanan eksternal.
    await page.route("**/api/evaluasi", async (rute) => {
      await rute.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: "uji-e2e-00001",
          hasil: {
            band: "rendah",
            skor: 0,
            temuan: [],
            saran: [],
            ringkasan: "Tidak ada indikator ditemukan. Rentang risiko: Rendah.",
            versi: "e2e-mock",
          },
        }),
      });
    });
  });

  test("menganalisis kontak secara live saat teks diketik", async ({
    page,
  }) => {
    await page.goto("/cek");

    await page
      .locator("#teks-lowongan")
      .fill(
        "Dibutuhkan staf administrasi untuk PT Sentosa Maju Bersama. Lamar ke rekrut.sentosa@gmail.com atau hubungi 0812-9876-5432.",
      );

    const panel = page.locator("#periksa-kontak");
    await expect(panel.getByText("Domain layanan gratis")).toBeVisible();
    await expect(panel.getByText("rekrut.sentosa@gmail.com")).toBeVisible();
    await expect(panel.getByText("081298765432")).toBeVisible();
  });

  test("mengecek kesesuaian domain dengan nama perusahaan yang diketik", async ({
    page,
  }) => {
    await page.goto("/cek");

    await page
      .getByRole("button", { name: "Contoh Iklan Risiko Rendah" })
      .click();
    await page.locator("#perusahaan").fill("PT Nusantara Berkat Abadi");

    const panel = page.locator("#periksa-kontak");
    await expect(panel.getByText("karir@nusantaraberkat.co.id")).toBeVisible();
    await expect(
      panel.getByText("Domain menyerupai nama perusahaan"),
    ).toBeVisible();
  });

  test("mengingatkan bila kontak hanya berupa nomor telepon", async ({
    page,
  }) => {
    await page.goto("/cek");

    await page
      .locator("#teks-lowongan")
      .fill(
        "Dibutuhkan kurir area Jakarta. Hubungi 0813-1111-2222 setiap hari kerja pukul 08 sampai 17.",
      );

    await expect(page.getByRole("status")).toContainText(
      /kontak hanya berupa nomor telepon/i,
    );
  });

  test("tidak ada permintaan jaringan eksternal saat mengetik di form", async ({
    page,
  }) => {
    const permintaanKeEksternal: string[] = [];
    page.on("request", (permintaan) => {
      const url = permintaan.url();
      if (!url.startsWith("http://localhost:3211")) {
        permintaanKeEksternal.push(url);
      }
    });

    await page.goto("/cek");

    await page.locator("#perusahaan").fill("PT Nusantara Berkat Abadi");
    await page
      .locator("#teks-lowongan")
      .fill(
        "Dibutuhkan staf data entry. Lamar ke karir@nusantaraberkat.co.id atau www.nusantaraberkat.co.id/karir.",
      );

    await expect(
      page.getByText("Domain menyerupai nama perusahaan"),
    ).toBeVisible();

    expect(permintaanKeEksternal).toEqual([]);
  });
});
