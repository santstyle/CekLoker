import { expect, test } from "@playwright/test";

/**
 * Klaim jujur data upah: kerangka TODO menampilkan "Data belum tersedia",
 * bukan hasil palsu, dan katalog menghitung aturan aktif secara dinamis.
 */
test.describe("Status data upah di antarmuka", () => {
  test("/cek menyatakan data belum tersedia untuk lokasi yang dipilih", async ({
    page,
  }) => {
    await page.goto("/cek");
    await page.locator("#lokasi").fill("Bandung");
    await page
      .getByText("Data belum tersedia untuk Jawa Barat.")
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByText("Data belum tersedia untuk Jawa Barat."),
    ).toBeVisible();
  });

  test("/cek menampilkan catatan netral bila lokasi kosong", async ({
    page,
  }) => {
    await page.goto("/cek");
    await expect(
      page.getByText(/Perbandingan upah terhadap UMP\/UMK belum aktif/),
    ).toBeVisible();
  });

  test("/metodologi menandai aturan upah belum aktif dan menghitung aturan aktif dinamis", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/metodologi");

    const badge = page.getByText("Data belum tersedia", { exact: true });
    await badge.scrollIntoViewIfNeeded();
    await expect(badge).toBeVisible();

    await expect(
      page.getByText(
        /aturan aktif; aturan perbandingan upah menunggu data resmi/,
      ),
    ).toBeVisible();
  });
});
