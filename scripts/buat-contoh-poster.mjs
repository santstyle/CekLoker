/**
 * Generator aset contoh poster lowongan (fiktif) untuk fitur OCR /cek.
 *
 * Sebelum skrip ini, public/contoh-poster-lowongan.png adalah banner promo
 * CekLoker — bukan poster lowongan — sehingga tombol "Coba Ekstrak Contoh
 * Poster Lowongan" menghasilkan teks pemasaran, bukan lowongan. Skrip ini
 * menggambar poster lowongan fiktif di canvas peramban (Playwright) lalu
 * menyimpannya sebagai PNG. Seluruh data bersifat fiktif aturan privasi:
 * PT "Contoh*", domain .example, nomor 08x...0000-0000.
 *
 * Jalankan: node scripts/buat-contoh-poster.mjs
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const TUJUAN = path.resolve("public/contoh-poster-lowongan.png");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });

const dataUrl = await page.evaluate(async () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");

  // Latar biru gradien khas poster rekrutmen
  const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
  grad.addColorStop(0, "#0b3d91");
  grad.addColorStop(1, "#1e88e5");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1350);

  // Kartu putih isi
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(40, 40, 1000, 1270);

  // Kepala poster
  ctx.fillStyle = "#0b3d91";
  ctx.font = "bold 58px Arial";
  ctx.fillText("DIBUTUHKAN SEGERA", 80, 150);
  ctx.font = "bold 46px Arial";
  ctx.fillText("STAFF ADMINISTRASI", 80, 240);

  // Nama perusahaan fiktif pada pita merah
  ctx.fillStyle = "#c62828";
  ctx.fillRect(80, 280, 920, 84);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px Arial";
  ctx.fillText("PT CONTOH MAKMUR SENTOSA", 100, 336);

  // Isi lowongan
  ctx.fillStyle = "#111111";
  ctx.font = "34px Arial";
  ctx.fillText("Penempatan: Jakarta Selatan", 80, 440);
  ctx.fillText("Upah: Rp 2.000.000 per bulan", 80, 500);

  // Indikator mencurigakan (dipakai demo evaluasi): uang muka wajib
  ctx.fillStyle = "#c62828";
  ctx.fillRect(80, 540, 920, 76);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px Arial";
  ctx.fillText("Uang muka Rp 500.000 (wajib transfer)", 100, 588);

  ctx.fillStyle = "#111111";
  ctx.font = "32px Arial";
  ctx.fillText("Kirim CV ke karir@contoh.example", 80, 680);
  ctx.fillText("Kontak: 0811-0000-0000 (Budi, WA saja)", 80, 740);

  // Persyaratan
  ctx.font = "24px Arial";
  ctx.fillStyle = "#333333";
  const baris = [
    "Persyaratan 1: pendidikan minimal D3/S1",
    "Persyaratan 2: mahir Microsoft Excel",
    "Persyaratan 3: bersedia kerja shift",
    "Persyaratan 4: usia maksimal 35 tahun",
    "Persyaratan 5: sehat jasmani dan rohani",
    "Persyaratan 6: tidak butuh pengalaman",
  ];
  for (let i = 0; i < baris.length; i++) {
    ctx.fillText(baris[i], 80, 830 + i * 44);
  }

  // Kaki poster
  ctx.fillStyle = "#0b3d91";
  ctx.fillRect(80, 1140, 920, 120);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 30px Arial";
  ctx.fillText("Registrasi gratis - tidak dipungut biaya apa pun", 100, 1212);

  return canvas.toDataURL("image/png");
});

fs.writeFileSync(TUJUAN, Buffer.from(dataUrl.split(",")[1], "base64"));
await browser.close();
console.log(`Contoh poster ditulis ke ${TUJUAN}`);
