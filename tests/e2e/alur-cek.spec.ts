import { expect, test } from "@playwright/test";

/**
 * Respons palsu deterministik untuk POST /api/evaluasi.
 *
 * Database Neon TIDAK ditulis karena permintaan diintersepsi di sini;
 * tidak ada akses jaringan ke server sama sekali.
 */
const RESPONS_MOCK = {
  id: "uji-e2e-00001",
  hasil: {
    band: "rendah",
    skor: 0,
    temuan: [],
    saran: [],
    ringkasan: "Tidak ada indikator ditemukan. Rentang risiko: Rendah.",
    versi: "e2e-mock",
  },
};

test.describe("Alur inti: /cek → /hasil/<id>", () => {
  test.beforeEach(async ({ page }) => {
    // Intersepsi POST /api/evaluasi; kembalikan respons palsu deterministik.
    await page.route("**/api/evaluasi", async (rute) => {
      await rute.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(RESPONS_MOCK),
      });
    });
  });

  test("mengirim teks lowongan dan menampilkan hasil di /hasil/<id>", async ({
    page,
  }) => {
    await page.goto("/cek");

    // Isi teks lowongan secara manual.
    await page
      .locator("#teks-lowongan")
      .fill("Dibutuhkan staf administrasi. Upah Rp 2.000.000 per bulan.");
    await page.locator("#lokasi").fill("Jakarta Selatan");

    // Kirim formulir; tunggu navigasi secara atomik agar tidak terlewat.
    await Promise.all([
      page.waitForURL(/\/hasil\/uji-e2e-00001/),
      page.getByRole("button", { name: "Periksa lowongan sekarang" }).click(),
    ]);

    // Band "Rendah" tampil di halaman hasil (badge, cocok persih case-sensitive).
    await expect(
      page.getByText("Rentang Risiko: Rendah", { exact: true }),
    ).toBeVisible();
  });

  test("tombol contoh mengisi textarea dan state aktif terlihat", async ({
    page,
  }) => {
    await page.goto("/cek");

    // Muat contoh risiko tinggi.
    await page
      .getByRole("button", { name: "Contoh Iklan Risiko Tinggi" })
      .click();

    // Teks terisi otomatis.
    const teks = await page.locator("#teks-lowongan").inputValue();
    expect(teks.length).toBeGreaterThan(0);

    // Tombol contoh risiko tinggi menampilkan state aktif (aria-pressed=true).
    const tombolTinggi = page.getByRole("button", {
      name: "Contoh Iklan Risiko Tinggi",
    });
    await expect(tombolTinggi).toHaveAttribute("aria-pressed", "true");

    // Contoh risiko rendah tidak aktif.
    await expect(
      page.getByRole("button", { name: "Contoh Iklan Risiko Rendah" }),
    ).toHaveAttribute("aria-pressed", "false");

    // Ketik manual mereset state aktif.
    await page.locator("#teks-lowongan").fill("Tulis manual");
    await expect(tombolTinggi).toHaveAttribute("aria-pressed", "false");
  });

  test("privasi: teks lowongan tidak dikirim ke server eksternal", async ({
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
    await page
      .locator("#teks-lowongan")
      .fill("PT Rahasia mencari staf. Upah Rp 5.000.000.");
    await Promise.all([
      page.waitForURL(/\/hasil\//),
      page.getByRole("button", { name: "Periksa lowongan sekarang" }).click(),
    ]);

    // Tidak ada permintaan ke domain di luar localhost.
    expect(permintaanKeEksternal).toEqual([]);
  });
});
