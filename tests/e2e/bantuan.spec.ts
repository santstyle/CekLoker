import { expect, test } from "@playwright/test";

/**
 * Halaman /bantuan — panduan langkah untuk orang yang merasa telah
 * menjadi korban penipuan lowongan kerja.
 *
 * Jaminan yang dijaga tes ini:
 * - Disclaimer "bukan lembaga pelaporan" selalu tampil.
 * - URL "TODO" tidak pernah dirender sebagai tautan.
 * - Checklist beradaptasi dengan situasi dan "Hapus semua data"
 *   mengosongkan status di peramban.
 * - Kronologi dibangun sepenuhnya di peramban; tidak ada jaringan.
 * - Satu-satunya tautan ke /bantuan berada di navbar dan footer.
 */
test.describe("Bantuan korban /bantuan", () => {
  test("menampilkan disclaimer, tanpa vonis, tanpa URL TODO", async ({
    page,
  }) => {
    await page.goto("/bantuan");

    await expect(
      page.getByRole("heading", { name: /Sudah terlanjur tertipu/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/CekLoker bukan lembaga pelaporan/).first(),
    ).toBeVisible();
    await expect(
      page
        .getByText(/tidak mengirim laporan atas nama Anda/i)
        .first(),
    ).toBeVisible();

    // Tidak ada tautan maupun teks mentah "TODO" yang lolos ke layar.
    await expect(page.locator('a[href="TODO"]')).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("TODO");
  });

  test("checklist: langkah muncul sesuai situasi; hapus data mengosongkan", async ({
    page,
  }) => {
    await page.goto("/bantuan");

    // Langkah umum selalu tampil; langkah transfer belum.
    await expect(
      page.getByText(/Hentikan kontak dan jangan transfer lagi/),
    ).toBeVisible();
    await expect(
      page.getByText(/hubungi bank sesegera mungkin/i),
    ).toHaveCount(0);

    // Memilih "sudah transfer" memunculkan langkah bank.
    await page.getByRole("checkbox", { name: "Sudah transfer uang" }).check();
    await expect(
      page.getByText(/hubungi bank sesegera mungkin/i),
    ).toBeVisible();

    // "Hapus semua data" mengosongkan status checklist di peramban.
    await page.getByRole("button", { name: "Hapus semua data" }).click();
    await expect(
      page.getByRole("checkbox", { name: "Sudah transfer uang" }),
    ).not.toBeChecked();
    await expect(
      page.getByText(/hubungi bank sesegera mungkin/i),
    ).toHaveCount(0);
  });

  test("penunjuk kanal: kasus rekening menampilkan kanal dan status jujur", async ({
    page,
  }) => {
    await page.goto("/bantuan");

    await page
      .getByRole("button", { name: /Rekening penipu/ })
      .click();

    await expect(
      page.getByText("CekRekening.id (Komdigi)"),
    ).toBeVisible();
    // Seluruh kanal belum diverifikasi — status harus jujur, bukan klaim.
    await expect(
      page.getByText("Belum diverifikasi").first(),
    ).toBeVisible();
  });

  test("penunjuk kanal: URL TODO tampil sebagai teks, bukan tautan", async ({
    page,
  }) => {
    await page.goto("/bantuan");

    await page
      .getByRole("button", { name: /Lowongan luar negeri/ })
      .click();

    await expect(
      page.getByText("Tautan resmi belum tersedia", { exact: true }),
    ).toBeVisible();
    await expect(page.locator('a[href="TODO"]')).toHaveCount(0);
  });

  test("kronologi: teks dibangun dari formulir sepenuhnya di peramban", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/bantuan");

    await page.getByLabel(/Tanggal kejadian pertama/).fill("2026-11-01");
    await page.getByLabel(/Platform \/ sumber iklan/).fill("Instagram");
    await page.getByLabel(/Pihak yang mengaku/).fill("PT Contoh Sukses");
    await page.getByRole("textbox", { name: /Kontak pelaku/ }).fill("0811000000");
    await page.getByLabel(/Nomor rekening tujuan/).fill("0001234567");
    await page.getByLabel(/Nominal kerugian/).fill("Rp2.000.000");
    await page.getByLabel("Kejadian", { exact: true }).fill(
      "Diminta transfer biaya admin",
    );
    await page.getByRole("checkbox", { name: "Bukti transfer", exact: true }).check();

    const hasil = page.getByLabel("Hasil teks kronologi");
    await expect(hasil).toContainText("PT Contoh Sukses");
    await expect(hasil).toContainText("0001234567");
    await expect(hasil).toContainText("Diminta transfer biaya admin");

    // Tombol salin menyalin teks kronologi ke papan klip.
    await page.getByRole("button", { name: "Salin teks" }).click();
    await expect(
      page.getByRole("button", { name: /Tersalin/ }),
    ).toBeVisible();
    const tersalin = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(tersalin).toContain("PT Contoh Sukses");
  });

  test("navbar dan footer memuat tautan 'Sudah terlanjur? Bantuan'", async ({
    page,
  }) => {
    await page.goto("/");

    const tautan = page.getByRole("link", {
      name: "Sudah terlanjur? Bantuan",
    });
    // Tepat dua: satu di navbar, satu di footer. Tidak ada di kartu hasil.
    await expect(tautan).toHaveCount(2);
  });
});
