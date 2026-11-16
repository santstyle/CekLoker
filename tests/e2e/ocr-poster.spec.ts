import { expect, test } from "@playwright/test";

/**
 * Regresi OCR: contoh poster lowongan resmi (public/contoh-poster-lowongan.png,
 * digambar scripts/buat-contoh-poster.mjs) harus menghasilkan teks yang
 * memuat frasa-frasa kunci di textarea #teks-lowongan.
 *
 * Poster memuat indikator mencurigakan fiktif (uang muka wajib) supaya
 * pengguna langsung melihat siklus: pindai -> teks -> evaluasi.
 */
test.describe("OCR contoh poster lowongan", () => {
  test.setTimeout(180_000);

  test("tombol contoh mengekstrak frasa kunci ke textarea", async ({
    page,
  }) => {
    const galatKonsol: string[] = [];
    page.on("console", (pesan) => {
      if (pesan.type() !== "error") return;
      const teksGalat = pesan.text();
      // Bising Tesseract WASM; bukan kegagalan aplikasi.
      if (/Estimating resolution/.test(teksGalat)) return;
      galatKonsol.push(teksGalat);
    });
    page.on("pageerror", (e) => galatKonsol.push(`pageerror: ${e.message}`));

    await page.goto("/cek");
    await page.getByRole("tab", { name: "Pindai Poster (OCR)" }).click();
    await page
      .getByRole("button", { name: /Coba Ekstrak Contoh Poster Lowongan/ })
      .click();

    await expect(page.getByText(/Teks berhasil diekstraksi/)).toBeVisible({
      timeout: 150_000,
    });

    const teks = await page.locator("#teks-lowongan").inputValue();
    const kecil = teks.toLowerCase();
    for (const frasa of [
      "DIBUTUHKAN",
      "STAFF ADMINISTRASI",
      "CONTOH MAKMUR SENTOSA",
      "contoh.example",
      "0811-0000-0000",
      "500.000",
    ]) {
      expect(kecil).toContain(frasa.toLowerCase());
    }
    expect(galatKonsol).toEqual([]);
  });
});
