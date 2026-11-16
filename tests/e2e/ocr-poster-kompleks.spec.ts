import { expect, test } from "@playwright/test";

/**
 * Regresi OCR kelas "poster padat": gradasi gelap + blob foto + blok QR +
 * teks putih di atas biru + pita peringatan — pola khas poster rekrutmen
 * BUMN yang sering beredar lewat WhatsApp. Poster sederhana (satu latar)
 * sudah dijaga ocr-poster.spec.ts; berkas ini menjaga bahwa binerisasi Otsu
 * tidak runtuh saat latar tidak seragam.
 *
 * Catatan ambang: Tesseract WASM di peramban dapat berbeda 1 baris antar
 * run (pengukuran berulang menemukan 5/6 dan 6/6 frasa kunci). Test ini
 * menuntut minimal 5 dari 6 frasa terbaca — di bawah itu pipeline benar-
 * benar rusak dan layak memblokir rilis, bukan sekadar bising OCR.
 */

const FRASE_KUNCI = [
  "REKRUTMEN EKSTERNAL",
  "PT KERETA API INDONESIA",
  "TAHUN 2026",
  "kaiter.kai.id",
  "tidak dipungut biaya",
  "SEPTEMBER 2026",
] as const;

test.describe("OCR poster padat (gaya rekrutmen BUMN)", () => {
  test.setTimeout(240_000);

  test("pipeline Otsu membaca mayoritas frasa kunci", async ({ page }) => {
    const galatKonsol: string[] = [];
    page.on("console", (pesan) => {
      if (pesan.type() !== "error") return;
      const teksGalat = pesan.text();
      if (/Estimating resolution/.test(teksGalat)) return;
      galatKonsol.push(teksGalat);
    });
    page.on("pageerror", (e) => galatKonsol.push(`pageerror: ${e.message}`));

    // Render poster sintetis deterministik (PRNG LCG ber-seed) di canvas
    // peramban; isi tidak disimpan ke disk.
    await page.goto("/cek");
    const dataUrl = await page.evaluate(async () => {
      let seed = 987654321;
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1520;
      const ctx = canvas.getContext("2d")!;

      const grad = ctx.createLinearGradient(0, 0, 1080, 1520);
      grad.addColorStop(0, "#06172e");
      grad.addColorStop(0.35, "#0b3d91");
      grad.addColorStop(0.62, "#123f6d");
      grad.addColorStop(1, "#0a2540");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1520);

      // Blob "foto lokomotif"
      for (let i = 0; i < 26; i++) {
        const x = rand() * 1080;
        const y = rand() * 620 + 80;
        const r = 30 + rand() * 110;
        const g2 = ctx.createRadialGradient(x, y, 0, x, y, r);
        g2.addColorStop(0, `rgba(255,255,255,${0.05 + rand() * 0.12})`);
        g2.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Blok logo kiri atas
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 40px Arial";
      ctx.fillText("KAI", 72, 96);
      ctx.fillRect(72, 108, 150, 6);
      ctx.font = "26px Arial";
      ctx.fillStyle = "#f2b234";
      ctx.fillText("Danantara", 72, 158);

      // Headline putih di atas gelap
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "bold 78px Arial";
      ctx.fillText("REKRUTMEN EKSTERNAL", 540, 330);
      ctx.font = "bold 44px Arial";
      ctx.fillText("TINGKAT SLTA, D3 DAN D4/S1", 540, 420);
      ctx.font = "bold 64px Arial";
      ctx.fillText("TAHUN 2026", 540, 520);
      ctx.font = "bold 38px Arial";
      ctx.fillText("PT KERETA API INDONESIA (PERSERO) GROUP", 540, 600);

      // Blok QR (matriks acak + finder squares)
      const qr = 168;
      const qx = 836;
      const qy = 62;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(qx - 8, qy - 8, qr + 16, qr + 16);
      ctx.fillStyle = "#000000";
      const sel = 21;
      const s = qr / sel;
      for (let r = 0; r < sel; r++) {
        for (let c = 0; c < sel; c++) {
          const finder =
            (r < 7 && c < 7) ||
            (r < 7 && c >= sel - 7) ||
            (r >= sel - 7 && c < 7);
          if (finder) continue;
          if (rand() < 0.42) {
            ctx.fillRect(qx + c * s, qy + r * s, s, s);
          }
        }
      }
      const finder = (fx: number, fy: number) => {
        ctx.fillStyle = "#000";
        ctx.fillRect(qx + fx * s, qy + fy * s, 7 * s, 7 * s);
        ctx.fillStyle = "#fff";
        ctx.fillRect(qx + (fx + 1) * s, qy + (fy + 1) * s, 5 * s, 5 * s);
        ctx.fillStyle = "#000";
        ctx.fillRect(qx + (fx + 2) * s, qy + (fy + 2) * s, 3 * s, 3 * s);
      };
      finder(0, 0);
      finder(sel - 7, 0);
      finder(0, sel - 7);

      // Panel putih berisi tanggal
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 700, 1080, 330);
      ctx.fillStyle = "#0b3d91";
      ctx.font = "bold 40px Arial";
      ctx.fillText("Mulai Registrasi:", 540, 790);
      ctx.fillStyle = "#c62828";
      ctx.font = "bold 46px Arial";
      ctx.fillText("SEPTEMBER 2026", 540, 860);
      ctx.fillStyle = "#0b3d91";
      ctx.font = "bold 40px Arial";
      ctx.fillText("Apply Lamaran: 7-10 SEPTEMBER 2026", 540, 950);

      // Pita peringatan merah (teks putih kecil)
      ctx.fillStyle = "#c62828";
      ctx.fillRect(0, 1030, 1080, 150);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px Arial";
      ctx.fillText("Website resmi rekrutmen KAI Group:", 540, 1098);
      ctx.font = "bold 34px Arial";
      ctx.fillText("kaiter.kai.id", 540, 1148);

      // Baris peringatan anti-penipuan
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px Arial";
      ctx.fillText("Waspada Penipuan! Rekrutmen", 540, 1255);
      ctx.fillText("tidak dipungut biaya", 540, 1300);

      // Baris ikon subsidi
      const warna = ["#f2b234", "#ffffff", "#7cc4ff", "#ffb3b3", "#b3ffc0"];
      const ikon = [
        "KAI Services",
        "KAI",
        "KAI Commuter",
        "KAI Logistik",
        "KAI Properti",
        "kai.id",
      ];
      ctx.font = "22px Arial";
      let x = 60;
      for (let i = 0; i < ikon.length; i++) {
        ctx.fillStyle = warna[i % warna.length];
        ctx.fillText(ikon[i], x, 1430);
        x += ctx.measureText(ikon[i]).width + 44;
      }

      ctx.textAlign = "left";
      return canvas.toDataURL("image/png");
    });

    await page.getByRole("tab", { name: "Pindai Poster (OCR)" }).click();
    await page.locator('input[type="file"]').setInputFiles({
      name: "poster-padat.png",
      mimeType: "image/png",
      buffer: Buffer.from(dataUrl.split(",")[1], "base64"),
    });

    await expect(
      page.getByText(/Teks berhasil diekstraksi|tidak dapat terbaca/),
    ).toBeVisible({ timeout: 150_000 });

    const teks = (
      await page.locator("#teks-lowongan").inputValue()
    ).toLowerCase();
    const ketemu = FRASE_KUNCI.filter((f) =>
      teks.includes(f.toLowerCase()),
    ).length;

    expect(
      ketemu,
      `Hanya ${ketemu}/${FRASE_KUNCI.length} frasa kunci terbaca: ${teks}`,
    ).toBeGreaterThanOrEqual(5);
    expect(galatKonsol).toEqual([]);
  });
});
