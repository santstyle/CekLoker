import { expect, test } from "@playwright/test";

import { KUIS_PERTANYAAN } from "../../lib/edukasi/kuis";

/**
 * Kuis edukasi di /edukasi/kuis — berjalan sepenuhnya di peramban.
 * Tidak ada permintaan jaringan ke API maupun database; jawaban tidak
 * pernah meninggalkan klien.
 */
test.describe("Kuis edukasi /edukasi/kuis", () => {
  test("alur lengkap: tombol nonaktif, jawab semua benar, hasil tampil, ulangi", async ({
    page,
  }) => {
    await page.goto("/edukasi/kuis");

    await expect(
      page.getByRole("heading", { name: /Ukur pemahaman/i }),
    ).toBeVisible();

    // Tombol hasil nonaktif hingga seluruh soal terjawab.
    const tombolHasil = page.getByRole("button", { name: /Lihat Hasil/i });
    await expect(tombolHasil).toBeDisabled();

    // Jawab seluruh soal dengan benar.
    for (const soal of KUIS_PERTANYAAN) {
      await page
        .getByRole("radio", {
          name: soal.pilihan[soal.jawaban],
          exact: true,
        })
        .check();
    }
    await expect(tombolHasil).toBeEnabled();

    // Kirim dan lihat hasil.
    await tombolHasil.click();
    const status = page.getByRole("status");
    await expect(status.getByText(/Skor 100%/)).toBeVisible();
    await expect(status.getByText("Sangat Baik")).toBeVisible();

    // Ulangi kuis kembali ke keadaan awal.
    await page.getByRole("button", { name: /Ulangi Kuis/i }).click();
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(tombolHasil).toBeDisabled();
  });

  test("jawaban salah menampilkan jawaban benar dan penjelasan", async ({
    page,
  }) => {
    await page.goto("/edukasi/kuis");

    for (const soal of KUIS_PERTANYAAN) {
      const indeksSalah = soal.jawaban === 0 ? 1 : 0;
      await page
        .getByRole("radio", {
          name: soal.pilihan[indeksSalah],
          exact: true,
        })
        .check();
    }

    await page.getByRole("button", { name: /Lihat Hasil/i }).click();
    const status = page.getByRole("status");
    await expect(status).toContainText("Perlu Dipelajari Lagi");
    await expect(status.getByText(/Jawaban benar:/)).toHaveCount(
      KUIS_PERTANYAAN.length,
    );
  });
});
