"use client";

import html2canvas from "html2canvas";

/**
 * Merender sebuah elemen kartu hasil menjadi blob PNG di sisi klien.
 *
 * Elemen yang diberikan harus berisi persis render kartu yang akan dibagikan
 * (ringkasan + skor + rentang + disclaimer), bersifat statis (tanpa tombol
 * atau tautan), punya posisi relatif, latar belakang, dan kontras.
 *
 * Tidak ada teks lowongan pengguna yang dikirim ke mana pun — seluruh proses
 * berjalan di peramban pengguna.
 */
export async function renderHasilKePNG(elemen: HTMLElement): Promise<Blob> {
  const lebar = Math.max(elemen.scrollWidth, 1200);
  const tinggi = Math.max(elemen.scrollHeight, 630);

  const kanvas = await html2canvas(elemen, {
    scale: 2,
    width: lebar,
    height: tinggi,
    backgroundColor: "#ffffff",
    logging: false,
    allowTaint: false,
    useCORS: true,
  });

  return new Promise<Blob>((selesaikan, tolak) => {
    kanvas.toBlob(
      (blob) => {
        if (blob) selesaikan(blob);
        else tolak(new Error("Kanvas tidak dapat dikonversi ke PNG."));
      },
      "image/png",
      0.95,
    );
  });
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
 * Nama berkas PNG yang deterministik dan aman (tanpa karakter berbahaya).
 * Contoh: cekloker-hasil-perlu-dicek-20261115-0930-a1b2c3d4.png
 */
export function namaFileHasil(hasil: { band: string; id: string }): string {
  const idAman = hasil.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "sesi";
  return `cekloker-hasil-${hasil.band}-${stempelWaktuLokal()}-${idAman}.png`;
}

/** Mengunduh blob sebagai berkas. */
export function unduhBlob(blob: Blob, namaFile: string): void {
  const url = URL.createObjectURL(blob);
  const tautan = document.createElement("a");
  tautan.href = url;
  tautan.download = namaFile;
  document.body.appendChild(tautan);
  tautan.click();
  document.body.removeChild(tautan);
  URL.revokeObjectURL(url);
}
