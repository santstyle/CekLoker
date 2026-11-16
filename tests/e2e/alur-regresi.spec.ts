import { expect, test, type Page } from "@playwright/test";

/**
 * Cakupan regresi alur /cek dan /bantuan.
 * API diejek dengan page.route — tidak ada jaringan keluar.
 *
 * - Alur band "tinggi": badge Keyakinan tampil, kanal pelaporan tidak ada
 *   di halaman hasil (pemisahan lingkup), tanpa error konsol.
 * - API gagal (500): pengguna melihat pesan kendala yang ramah.
 * - Teks terlalu pendek: tombol kirim nonaktif.
 * - /bantuan: interaksi penuh tanpa satu pun permintaan /api.
 */

const RESPONS_TINGGI = {
  id: "uji-retest-tinggi-0001",
  hasil: {
    band: "tinggi",
    skor: 62,
    temuan: [
      {
        ruleId: "klausul-diskriminasi",
        judul: "Klausul diskriminatif pada iklan",
        kategori: "diskriminasi",
        kekuatan: "kuat",
        faktor: 1.5,
        kontribusi: 18,
        bukti: ["hanya wanita"],
        penjelasan: "Persyaratan membatasi jenis kelamin tertentu.",
      },
      {
        ruleId: "upaya-biaya-admin",
        judul: "Meminta biaya administrasi di muka",
        kategori: "seleksi",
        kekuatan: "sedang",
        faktor: 1,
        kontribusi: 12,
        bukti: ["biaya admin"],
        penjelasan: "Lowongan memungut biaya pada calon pekerja.",
      },
    ],
    saran: [
      "Jangan transfer uang apa pun ke siapa pun.",
      "Verifikasi legalitas perusahaan ke dinas ketenagakerjaan setempat.",
    ],
    ringkasan: "2 indikator ditemukan. Rentang risiko: Tinggi.",
    versi: "retest-mock",
  },
};

async function pasangPemantau(page: Page) {
  const galat: string[] = [];
  page.on("console", (pesan) => {
    if (pesan.type() === "error") galat.push(pesan.text());
  });
  page.on("pageerror", (e) => galat.push(`pageerror: ${e.message}`));
  return galat;
}

test.describe("Retest /cek", () => {
  test("alur tinggi: badge Keyakinan, ringkasan, tanpa kanal, tanpa error konsol", async ({
    page,
  }) => {
    const galat = await pasangPemantau(page);
    await page.route("**/api/evaluasi", async (rute) => {
      await rute.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(RESPONS_TINGGI),
      });
    });

    await page.goto("/cek");
    await page
      .locator("#teks-lowongan")
      .fill(
        "Dicari staf khusus perempuan. Wajib transfer biaya admin Rp 500.000 sebelum wawancara.",
      );
    await page.locator("#lokasi").fill("Jakarta Selatan");
    await page.getByRole("button", { name: /Periksa lowongan/ }).click();
    await page.waitForURL(/\/hasil\//);

    // Band & ringkasan
    await expect(page.getByText(/Rentang Risiko: Tinggi/)).toBeVisible();
    // Badge Keyakinan
    await expect(page.getByText("Keyakinan: Bobot Kuat")).toBeVisible();
    await expect(page.getByText("Keyakinan: Bobot Sedang")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Yang kami cek dan tidak cek" }),
    ).toBeVisible();
    // Kutipan bukti tampil
    await expect(page.getByText("hanya wanita")).toBeVisible();
    // Dua saran tampil
    await expect(
      page.getByText("Jangan transfer uang apa pun ke siapa pun."),
    ).toBeVisible();

    // Pemisahan lingkup: tidak ada kanal pelaporan di halaman hasil
    const badan = (await page.locator("body").innerText()).toLowerCase();
    for (const terlarang of [
      "cekrekening",
      "1500 630",
      "kp2mi",
      "laporkan",
      "aduan",
      "perlu verifikasi",
    ]) {
      expect(badan).not.toContain(terlarang);
    }
    expect(galat).toEqual([]);
  });

  test("API gagal 500: pesan kendala ramah tampil", async ({ page }) => {
    const galat = await pasangPemantau(page);
    await page.route("**/api/evaluasi", async (rute) => {
      await rute.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Mesin evaluasi sedang bermasalah." }),
      });
    });

    await page.goto("/cek");
    await page
      .locator("#teks-lowongan")
      .fill("Dibutuhkan staf administrasi untuk asuransi di Jakarta.");
    await page.getByRole("button", { name: /Periksa lowongan/ }).click();

    const peringatan = page
      .getByRole("alert")
      .filter({ hasText: "Kendala Evaluasi" });
    await expect(peringatan).toBeVisible();
    await expect(peringatan).toContainText("Mesin evaluasi sedang bermasalah.");
    // Log "Failed to load resource" berasal dari peramban untuk HTTP 500,
    // bukan dari aplikasi; aplikasi menanganinya secara elegan.
    const aplikasi = galat.filter((g) => !/Failed to load resource/.test(g));
    expect(aplikasi).toEqual([]);
  });

  test("teks terlalu pendek: tombol kirim nonaktif", async ({ page }) => {
    await page.goto("/cek");
    const kirim = page.getByRole("button", { name: /Periksa lowongan/ });
    await expect(kirim).toBeDisabled();
    await page.locator("#teks-lowongan").fill("pendek");
    await expect(kirim).toBeDisabled();
  });
});

test.describe("Retest /bantuan", () => {
  test("interaksi penuh tanpa permintaan /api dan tanpa error konsol", async ({
    page,
  }) => {
    const galat = await pasangPemantau(page);
    const permintaanApi: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/")) permintaanApi.push(req.url());
    });

    await page.goto("/bantuan");

    // Checklist: pilih situasi transfer -> langkah bank muncul
    await page.getByRole("checkbox", { name: "Sudah transfer uang" }).check();
    await expect(
      page.getByText(/hubungi bank sesegera mungkin/i),
    ).toBeVisible();
    // Hapus semua data -> kembali kosong
    await page.getByRole("button", { name: "Hapus semua data" }).click();
    await expect(
      page.getByRole("checkbox", { name: "Sudah transfer uang" }),
    ).not.toBeChecked();

    // Penunjuk kanal: kategori rekening -> kanal tampil + status jujur
    await page.getByRole("button", { name: /Rekening penipu/ }).click();
    await expect(page.getByText("CekRekening.id (Komdigi)")).toBeVisible();
    await expect(page.getByText("Belum diverifikasi").first()).toBeVisible();

    // Kronologi: isi formulir -> teks tersusun, tanpa keluar jaringan
    await page.getByLabel(/Pihak yang mengaku/).fill("PT Contoh Berkat");
    await page
      .getByLabel("Kejadian", { exact: true })
      .fill("Diminta transfer biaya admin");
    await expect(page.getByLabel("Hasil teks kronologi")).toContainText(
      "PT Contoh Berkat",
    );

    expect(permintaanApi).toEqual([]);
    expect(galat).toEqual([]);
  });
});
