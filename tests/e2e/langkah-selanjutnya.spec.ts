import { expect, test, type Page } from "@playwright/test";

/**
 * Kartu "Langkah selanjutnya" di halaman hasil. Respons palsu disimpan di
 * sessionStorage sebelum halaman dimuat — tidak ada panggilan jaringan.
 */
const ID_TINGGI = "uji-langkah-tinggi";
const ID_RENDAH = "uji-langkah-rendah";

const HASIL_TINGGI = {
  band: "tinggi",
  skor: 85,
  temuan: [],
  saran: ["Jangan membayar biaya apa pun."],
  ringkasan: "Ditemukan indikator berisiko tinggi. Rentang risiko: Tinggi.",
  versi: "e2e-mock",
};

const HASIL_RENDAH = {
  band: "rendah",
  skor: 5,
  temuan: [],
  saran: [],
  ringkasan: "Tidak ada indikator. Rentang risiko: Rendah.",
  versi: "e2e-mock",
};

async function muatHasil(page: Page, id: string, hasil: object) {
  await page.addInitScript(
    ([idLokal, payload]) => {
      window.sessionStorage.setItem(
        `cekloker-hasil-${idLokal}`,
        JSON.stringify({ hasil: payload }),
      );
    },
    [id, hasil] as const,
  );
  await page.goto(`/hasil/${id}`);
}

test.describe("Kartu Langkah selanjutnya", () => {
  test("band tinggi: menampilkan tindakan, template, dan badge perlu verifikasi pada kanal", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await muatHasil(page, ID_TINGGI, HASIL_TINGGI);

    const kartu = page.getByRole("region", {
      name: "Langkah selanjutnya",
    });
    await expect(kartu).toBeVisible();
    await expect(kartu.getByText("Rentang: Tinggi")).toBeVisible();
    await expect(
      kartu.getByText(/Berhenti berkomunikasi bila diminta transfer/),
    ).toBeVisible();

    // Empat kanal resmi tampil dengan status perlu verifikasi, bukan tautan.
    const badge = kartu.getByText("Perlu verifikasi", { exact: true });
    await expect(badge).toHaveCount(4);
    await expect(kartu.getByRole("link")).toHaveCount(0);

    // Tombol salin menyalin template pesan band tinggi.
    await kartu.getByRole("button", { name: "Salin pesan" }).click();
    await expect(kartu.getByText("Tersalin!")).toBeVisible();
    const tersalin = await page.evaluate(() => navigator.clipboard.readText());
    expect(tersalin).toContain("konfirmasi resmi");
  });

  test("band rendah: konten disesuaikan dengan rentang risiko", async ({
    page,
  }) => {
    await muatHasil(page, ID_RENDAH, HASIL_RENDAH);

    const kartu = page.getByRole("region", {
      name: "Langkah selanjutnya",
    });
    await expect(kartu).toBeVisible();
    await expect(kartu.getByText("Rentang: Rendah")).toBeVisible();
    await expect(kartu.getByText(/Simpan bukti iklan/)).toBeVisible();
  });
});
