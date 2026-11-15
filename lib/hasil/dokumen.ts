"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Merender sebuah elemen kartu hasil menjadi berkas PDF di sisi klien.
 *
 * Elemen yang diberikan harus berisi persis render kartu yang akan dibagikan
 * (ringkasan + skor + rentang + disclaimer), bersifat statis (tanpa tombol
 * atau tautan), memakai inline style hex, dan kuat kontras.
 *
 * Tidak ada teks lowongan pengguna yang dikirim ke mana pun — seluruh proses
 * berjalan di peramban pengguna.
 */
export async function renderHasilKePDF(
  elemen: HTMLElement,
  namaFile: string,
): Promise<void> {
  const kanvas = await html2canvas(elemen, {
    scale: 2,
    backgroundColor: "#ffffff",
    logging: false,
    allowTaint: false,
    useCORS: true,
  });

  const dataUrl = kanvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const lebarHalaman = pdf.internal.pageSize.getWidth();
  const tinggiHalaman = pdf.internal.pageSize.getHeight();
  const properti = pdf.getImageProperties(dataUrl);

  const margin = 12;
  const lebarTersedia = lebarHalaman - margin * 2;
  const tinggiTersedia = tinggiHalaman - margin * 2;

  let lebar = lebarTersedia;
  let tinggi = (properti.height / properti.width) * lebar;
  if (tinggi > tinggiTersedia) {
    tinggi = tinggiTersedia;
    lebar = (properti.width / properti.height) * tinggi;
  }

  const x = (lebarHalaman - lebar) / 2;
  const y = (tinggiHalaman - tinggi) / 2;

  pdf.addImage(dataUrl, "PNG", x, y, lebar, tinggi);
  pdf.save(namaFile);
}

/** Tanggal lokal format YYYYMMDD-hhmm (zona waktu pengguna, bukan UTC). */
function stempelWaktuLokal(sekarang = new Date()): string {
  const pad = (nilai: number) => String(nilai).padStart(2, "0");
  return (
    `${sekarang.getFullYear()}${pad(sekarang.getMonth() + 1)}${pad(sekarang.getDate())}` +
    `-${pad(sekarang.getHours())}${pad(sekarang.getMinutes())}`
  );
}

/**
 * Nama berkas PDF yang deterministik dan aman (tanpa karakter berbahaya).
 * Contoh: cekloker-hasil-perlu_dicek-20261115-0944-a1b2c3d4.pdf
 */
export function namaFileHasil(hasil: { band: string; id: string }): string {
  const idAman = hasil.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "sesi";
  return `cekloker-hasil-${hasil.band}-${stempelWaktuLokal()}-${idAman}.pdf`;
}
