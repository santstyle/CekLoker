import { expect, test } from "@playwright/test";

import { pilihSoalKuis, SOAL_PER_KUIS } from "../../lib/edukasi/kuis";

/**
 * Kuis edukasi di /edukasi/kuis — berjalan sepenuhnya di peramban.
 * Tidak ada permintaan jaringan ke API maupun database; jawaban tidak
 * pernah meninggalkan klien.
 *
 * `?set=` memasang seed agar set soal deterministik dan tes dapat
 * memprediksi soal mana yang tampil.
 */
const SEED = 7;
const SET_SOAL = pilihSoalKuis(SEED);

test.describe("Kuis edukasi /edukasi/kuis", () => {
  test("alur lengkap: tombol nonaktif, jawab semua benar, hasil tampil, ulangi", async ({
    page,
  }) => {
    await page.goto(`/edukasi/kuis?set=${SEED}`);

    await expect(
      page.getByRole("heading", { name: /Ukur pemahaman/i }),
    ).toBeVisible();

    // Hanya satu set soal yang tampil, bukan seluruh bank.
    await expect(page.getByRole("group")).toHaveCount(SOAL_PER_KUIS);

    // Tombol hasil nonaktif hingga seluruh soal terjawab.
    const tombolHasil = page.getByRole("button", { name: /Lihat Hasil/i });
    await expect(tombolHasil).toBeDisabled();

    // Jawab seluruh soal dengan benar.
    for (let i = 0; i < SET_SOAL.length; i += 1) {
      const butir = SET_SOAL[i];
      await page
        .getByRole("group", {
          name: new RegExp(`Soal ${i + 1} dari ${SOAL_PER_KUIS}`),
        })
        .getByRole("radio", {
          name: butir.pilihan[butir.jawaban],
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
    await expect(
      status.getByText(new RegExp(`/ ${SOAL_PER_KUIS} benar`)),
    ).toBeVisible();

    // Ulangi kuis kembali ke keadaan awal.
    await page.getByRole("button", { name: /Ulangi Kuis/i }).click();
    await expect(page.getByRole("status")).toHaveCount(0);
    await expect(tombolHasil).toBeDisabled();
  });

  test("jawaban salah menampilkan jawaban benar dan penjelasan", async ({
    page,
  }) => {
    await page.goto(`/edukasi/kuis?set=${SEED}`);

    for (let i = 0; i < SET_SOAL.length; i += 1) {
      const butir = SET_SOAL[i];
      const indeksSalah = butir.jawaban === 0 ? 1 : 0;
      await page
        .getByRole("group", {
          name: new RegExp(`Soal ${i + 1} dari ${SOAL_PER_KUIS}`),
        })
        .getByRole("radio", {
          name: butir.pilihan[indeksSalah],
          exact: true,
        })
        .check();
    }

    await page.getByRole("button", { name: /Lihat Hasil/i }).click();
    const status = page.getByRole("status");
    await expect(status).toContainText("Perlu Dipelajari Lagi");
    await expect(status.getByText(/Jawaban benar:/)).toHaveCount(SOAL_PER_KUIS);
  });

  test("seed berbeda menampilkan susunan soal berbeda", async ({ page }) => {
    const soalSeed1 = pilihSoalKuis(1);
    const soalSeed2 = pilihSoalKuis(2);

    // Hidrasi me-render dulu snapshot server (seed 0), lalu menerapkan
    // seed dari URL — jadi tes menunggu soal seed yang sebenarnya tampil.
    await page.goto("/edukasi/kuis?set=1");
    await expect(
      page.getByRole("group", {
        name: new RegExp(`Soal 1 dari ${SOAL_PER_KUIS}`),
      }),
    ).toContainText(soalSeed1[0]!.pertanyaan);
    const seed1 = await page
      .getByRole("group")
      .locator("p")
      .allTextContents();

    await page.goto("/edukasi/kuis?set=2");
    await expect(
      page.getByRole("group", {
        name: new RegExp(`Soal 1 dari ${SOAL_PER_KUIS}`),
      }),
    ).toContainText(soalSeed2[0]!.pertanyaan);
    const seed2 = await page
      .getByRole("group")
      .locator("p")
      .allTextContents();

    expect(seed1).not.toEqual(seed2);
  });
});
