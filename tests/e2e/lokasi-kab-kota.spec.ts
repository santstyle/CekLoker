import { expect, test } from "@playwright/test";

/**
 * Dropdown lokasi memuat seluruh 514 kabupaten/kota resmi Indonesia.
 * Kueri kosong hanya menampilkan provinsi; cukup ketik untuk mencari.
 */
test.describe("Daftar kota lengkap", () => {
  test("kueri kosong hanya menampilkan 38 provinsi", async ({ page }) => {
    await page.goto("/cek");

    await page.locator("#lokasi").click();
    await expect(page.getByRole("option")).toHaveCount(38);
    await expect(
      page.getByRole("option", { name: /Kabupaten Aceh Selatan/ }),
    ).toHaveCount(0);
  });

  test("mengetik kota jarang memunculkan opsi dengan provinsi induknya", async ({
    page,
  }) => {
    await page.goto("/cek");

    const lokasi = page.locator("#lokasi");
    await lokasi.click();
    await lokasi.fill("tual");

    const opsi = page.getByRole("option", { name: /Kota Tual/ });
    await expect(opsi).toBeVisible();
    await expect(opsi).toContainText("Maluku");

    await opsi.click();
    await expect(lokasi).toHaveValue("Kota Tual");
  });

  test("mengetik kota Sorong membawa ke provinsi Papua Barat Daya", async ({
    page,
  }) => {
    await page.goto("/cek");

    const lokasi = page.locator("#lokasi");
    await lokasi.click();
    await lokasi.fill("sorong");

    // "sorong" sebagai potongan teks menemukan Kabupaten Sorong dan Kota
    // Sorong; keduanya tercatat sebagai Papua Barat Daya.
    const kotaSorong = page.getByRole("option", { name: /Kota Sorong/ });
    await expect(kotaSorong).toContainText("Papua Barat Daya");
  });
});
