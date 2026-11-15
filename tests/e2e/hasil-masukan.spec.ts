import { expect, test } from "@playwright/test";

/**
 * Kartu masukan "Hasil ini keliru?" di halaman hasil (Fase A #4).
 *
 * Respons palsu deterministik untuk POST /api/evaluasi dan POST /api/masukan;
 * database Neon TIDAK ditulis karena kedua permintaan diintersepsi di sini.
 */
const RESPONS_EVALUASI = {
  id: "uji-e2e-masukan",
  hasil: {
    band: "perlu_dicek",
    skor: 42,
    temuan: [
      {
        ruleId: "upah_dibawah_umr",
        judul: "Upah di bawah UMR",
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

test.describe("Kartu hasil: masukan 'Hasil ini keliru?'", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/evaluasi", async (rute) => {
      await rute.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(RESPONS_EVALUASI),
      });
    });
    await page.route("**/api/masukan", async (rute) => {
      await rute.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
  });

  async function bukaHasil(page: import("@playwright/test").Page) {
    await page.goto("/cek");
    await page
      .locator("#teks-lowongan")
      .fill("Dibutuhkan staf administrasi. Upah Rp 1.000.000 per bulan.");
    await page.locator("#lokasi").fill("Jakarta Selatan");

    await Promise.all([
      page.waitForURL(/\/hasil\/uji-e2e-masukan/),
      page.getByRole("button", { name: "Periksa lowongan sekarang" }).click(),
    ]);
  }

  test("menampilkan lima pilihan alasan dan tombol kirim nonaktif", async ({
    page,
  }) => {
    await bukaHasil(page);

    await expect(
      page.getByRole("heading", { name: /Hasil ini keliru\?/i }),
    ).toBeVisible();
    await expect(page.getByTestId("form-masukan")).toBeVisible();
    await expect(page.getByTestId("pilih-temuan-masukan")).toBeVisible();

    for (const kode of [
      "temuan_keliru",
      "temuan_terlewat",
      "kutipan_tidak_sesuai",
      "rentang_tidak_sesuai",
      "alasan_lain",
    ]) {
      await expect(page.getByTestId(`alasan-${kode}`)).toBeVisible();
    }

    await expect(page.getByTestId("tombol-kirim-masukan")).toBeDisabled();
  });

  test("mengirim masukan lalu menampilkan ucapan terima kasih", async ({
    page,
  }) => {
    await bukaHasil(page);

    await page.getByTestId("alasan-temuan_keliru").check();
    await expect(page.getByTestId("tombol-kirim-masukan")).toBeEnabled();
    await page.getByTestId("tombol-kirim-masukan").click();

    await expect(page.getByTestId("status-masukan")).toHaveText(
      /Masukan terkirim/i,
    );
    await expect(page.getByTestId("form-masukan")).toHaveCount(0);
    await expect(
      page.getByText(/Terima kasih, masukan Anda tercatat/i),
    ).toBeVisible();
  });
});
