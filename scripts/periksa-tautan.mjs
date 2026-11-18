#!/usr/bin/env node
/**
 * Pemeriksa tautan rujukan hukum.
 *
 * Membaca seluruh URL `https://…` dari:
 *   - lib/evaluation/rujukan.ts   (URL_RUJUKAN — dipakai mesin & halaman)
 *   - app/(public)/sumber/page.tsx (SUMBER_HUKUM — daftar resmi di /sumber)
 *
 * URL milik repositori proyek sendiri (github.com/santstyle/CekLoker)
 * dilewati: itu bukan rujukan hukum, dan berkas dokumen proyek bisa saja
 * belum ada di main. Sisanya diperiksa dengan HEAD (fallback GET bila HEAD
 * ditolak). Skrip ini TIDAK menandai apa pun terverifikasi — ia hanya
 * memeriksa bahwa tautan masih bisa dibuka.
 * Keputusan "terverifikasi" (membuka teks pasal dan memeriksanya) tetap
 * manual; lihat docs/verifikasi-hukum.md.
 *
 * Pakai: pnpm periksa:tautan
 * Keluar 0 bila semua tautan menjawab 2xx/3xx; 1 bila ada yang gagal.
 * Catatan: butuh akses jaringan; tanpa jaringan semua tautan dilaporkan
 * gagal, jadi jalankan di lingkungan yang bisa menghubungi peraturan.go.id
 * dan jdih.kemnaker.go.id.
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SUMBER_FILE = [
  "lib/evaluation/rujukan.ts",
  "app/(public)/sumber/page.tsx",
];

const REGEX_URL = /https:\/\/[^\s"'`)\\,]+/g;
const TIMEOUT_MS = 15_000;

async function kumpulkanUrl() {
  const url = new Set();
  for (const berkas of SUMBER_FILE) {
    const isi = await readFile(join(root, berkas), "utf8");
    for (const cocok of isi.matchAll(REGEX_URL)) {
      // Buang tanda baca yang nempel di akhir.
      const bersih = cocok[0].replace(/[.,;:)]+$/, "");
      // Lewati tautan milik repositori proyek sendiri.
      if (bersih.startsWith("https://github.com/santstyle/CekLoker")) continue;
      url.add(bersih);
    }
  }
  return [...url].sort();
}

async function periksa(url) {
  for (const metode of ["HEAD", "GET"]) {
    try {
      const respons = await fetch(url, {
        method: metode,
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { "user-agent": "cekloker-link-checker/1.0" },
      });
      if (metode === "HEAD" && [405, 501].includes(respons.status)) continue;
      return { url, ok: respons.status < 400, status: respons.status };
    } catch (galat) {
      if (metode === "HEAD") continue; // coba GET dulu sebelum menyerah.
      return {
        url,
        ok: false,
        status: 0,
        galat: galat?.message ?? String(galat),
      };
    }
  }
  return { url, ok: false, status: 0, galat: "HEAD dan GET sama-sama gagal" };
}

const urls = await kumpulkanUrl();
console.log(`Memeriksa ${urls.length} tautan unik…\n`);

const hasil = [];
for (const url of urls) {
  const r = await periksa(url);
  hasil.push(r);
  console.log(
    `${r.ok ? "✓" : "✗"} ${String(r.status).padEnd(3)} ${r.url}${r.galat ? ` (${r.galat})` : ""}`,
  );
}

const gagal = hasil.filter((r) => !r.ok);
console.log(
  `\n${hasil.length - gagal.length}/${hasil.length} tautan OK; ${gagal.length} gagal.`,
);
process.exit(gagal.length === 0 ? 0 : 1);
