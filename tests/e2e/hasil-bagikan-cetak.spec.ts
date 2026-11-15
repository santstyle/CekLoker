import { expect, test } from "@playwright/test";

/**
 * Kontrol bagikan & cetak di halaman hasil (Fase A #3).
 *
 * Respons palsu deterministik untuk POST /api/evaluasi; database Neon TIDAK
 * ditulis karena permintaan diintersepsi di sini.
 */
const RESPONS_MOCK = {
  id: "uji-e2e-00002",
  hasil: {
    band: "perlu_dicek",
    skor: 42,
    temuan: [
      {
        ruleId: "upah-di-bawah-ump",
        judul: "Upah di bawah UMP",
        kategori: "upah",
        kekuatan: "kuat",
        faktor: 1.5,
        kontribusi: 15,
        bukti: ["Rp 1.000.000"],
        penjelasan: "Upah di bawah upah minimum provinsi.",
      },
    ],
    saran: ["Verifikasi upah minimum provinsi."],
    ringkasan: "Ada indikator perlu dicek: Kompensasi & Upah.",
    versi: "e2e-mock",
  },
};

test.describe("Kartu hasil: Unduh PNG / Bagikan / Cetak", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/evaluasi", async (rute) => {
      await rute.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(RESPONS_MOCK),
      });
    });
  });

  test("menampilkan tiga tombol aksi di halaman hasil", async ({ page }) => {
    await page.goto("/cek");
    await page
      .locator("#teks-lowongan")
      .fill("Dibutuhkan staf administrasi. Upah Rp 1.000.000 per bulan.");
    await page.locator("#lokasi").fill("Jakarta Selatan");

    await Promise.all([
      page.waitForURL(/\/hasil\/uji-e2e-00002/),
      page.getByRole("button", { name: "Periksa lowongan sekarang" }).click(),
    ]);

    await expect(page.getByTestId("tombol-unduh-png")).toBeVisible();
    await expect(page.getByTestId("tombol-bagikan")).toBeVisible();
    await expect(page.getByTestId("tombol-cetak")).toBeVisible();

    // Ringkasan dan skor ikut tampil pada kartu yang akan diunduh.
    await expect(page.getByText(/Skor 42\/100/).first()).toBeVisible();
    await expect(
      page.getByText(/Estimasi risiko deterministik berbasis teks/i).first(),
    ).toBeVisible();
  });

  test("mengunduh berkas PNG setelah tombol Unduh diklik", async ({ page }) => {
    await page.goto("/cek");
    await page
      .locator("#teks-lowongan")
      .fill("Dibutuhkan staf administrasi. Upah Rp 1.000.000 per bulan.");
    await page.locator("#lokasi").fill("Jakarta Selatan");

    await Promise.all([
      page.waitForURL(/\/hasil\/uji-e2e-00002/),
      page.getByRole("button", { name: "Periksa lowongan sekarang" }).click(),
    ]);

    // Tangkap peristiwa unduh berkas; html2canvas butuh beberapa detik.
    const unduhan = page.waitForEvent("download", { timeout: 60000 });
    await page.getByTestId("tombol-unduh-png").click();
    const berkas = await unduhan;

    expect(berkas.suggestedFilename()).toMatch(
      /^cekloker-hasil-perlu_dicek-\d{8}-\d{4}-ujie2e00\.png$/,
    );
  });

  test("tombol Cetak memanggil window.print", async ({ page }) => {
    await page.goto("/cek");
    await page
      .locator("#teks-lowongan")
      .fill("Dibutuhkan staf administrasi. Upah Rp 1.000.000 per bulan.");
    await page.locator("#lokasi").fill("Jakarta Selatan");

    await Promise.all([
      page.waitForURL(/\/hasil\/uji-e2e-00002/),
      page.getByRole("button", { name: "Periksa lowongan sekarang" }).click(),
    ]);

    // Pasang spy sebelum klik agar tidak memicu dialog cetak asli.
    await page.evaluate(() => {
      (window as unknown as { __printDipanggil?: boolean }).__printDipanggil =
        false;
      window.print = () => {
        (window as unknown as { __printDipanggil?: boolean }).__printDipanggil =
          true;
      };
    });

    await page.getByTestId("tombol-cetak").click();
    const dipanggil = await page.evaluate(
      () =>
        (window as unknown as { __printDipanggil?: boolean }).__printDipanggil,
    );
    expect(dipanggil).toBe(true);
  });
});
