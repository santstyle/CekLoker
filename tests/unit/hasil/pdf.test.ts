import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HasilEvaluasi } from "@/lib/evaluation/types";
import { buatDokumenLaporan } from "@/lib/hasil/pdf";

const PUBLIK = path.join(process.cwd(), "public");
const SEKARANG = new Date(2026, 10, 15, 14, 32, 0);

const HASIL_TINGGI: HasilEvaluasi = {
  band: "tinggi",
  skor: 72,
  temuan: [
    {
      ruleId: "pungutan_biaya",
      judul: "Pungutan biaya kepada pelamar",
      kategori: "seleksi",
      kekuatan: "kuat",
      faktor: 1.5,
      kontribusi: 30,
      bukti: ["transfer biaya administrasi Rp350.000 sebelum wawancara"],
      penjelasan: "Permintaan pembayaran dari pelamar untuk proses rekrutmen.",
    },
    {
      ruleId: "penempatan_luar_negeri_nonresmi",
      judul: "Penempatan luar negeri tanpa jalur resmi",
      kategori: "penempatan",
      kekuatan: "kuat",
      faktor: 1.5,
      kontribusi: 27,
      bukti: ["penempatan Korea Selatan"],
      penjelasan: "Tidak ada penanda jalur penempatan resmi.",
    },
  ],
  saran: ["Jangan transfer uang apa pun sebelum identitas terverifikasi."],
  ringkasan: "Kombinasi indikator berisiko ditemukan. 2 temuan.",
  versi: "ui-mock",
};

/** Serve berkas statis public/ di lingkungan Node (tanpa browser). */
function fetchPublik(input: string | URL): Promise<Response> {
  const url = typeof input === "string" ? input : input.toString();
  const berkas = path.join(PUBLIK, decodeURIComponent(url.replace(/^\/+/, "")));
  if (!existsSync(berkas)) {
    return Promise.resolve(new Response("tidak ada", { status: 404 }));
  }
  return Promise.resolve(
    new Response(new Uint8Array(readFileSync(berkas)), { status: 200 }),
  );
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(fetchPublik) as unknown as typeof fetch,
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Menangkap alur konten halaman 1: stream Flate pertama berisi BT + Tf. */
function alirKontenHalaman1(pdfBytes: ArrayBuffer): string {
  const mentah = Buffer.from(new Uint8Array(pdfBytes)).toString("latin1");
  const penanda = /stream\r?\n/g;
  let m: RegExpExecArray | null;
  while ((m = penanda.exec(mentah))) {
    const mulai = m.index + m[0].length;
    const akhir = mentah.indexOf("endstream", mulai);
    if (akhir < 0) continue;
    let isi: string | null = null;
    try {
      isi = zlib
        .inflateSync(Buffer.from(mentah.slice(mulai, akhir), "latin1"))
        .toString("latin1");
    } catch {
      // Stream biner (font/gambar) — lewati.
    }
    // BT di awal baris + Tf = konten halaman, bukan data font/cmap biner.
    if (isi && isi.includes("\nBT") && isi.includes(" Tf")) return isi;
  }
  throw new Error("Alur konten halaman 1 tidak ditemukan.");
}

describe("Buat dokumen laporan (lib/hasil/pdf)", () => {
  it("halaman 1 tidak memakai operator clip tanpa penutup n", async () => {
    // Regresi: bar kiri kartu ringkasan dulu digambar dengan clip() yang
    // hanya mengeluarkan "W" tanpa "n"; operator re berikutnya menyambung
    // path kartu sehingga SELURUH kartu terisi cat status gelap dan teks
    // di atasnya tidak terbaca.
    const dokumen = await buatDokumenLaporan(HASIL_TINGGI, {
      id: "uji-pdf-001",
      sekarang: SEKARANG,
      acak: () => 0.42,
    });
    const alur = alirKontenHalaman1(dokumen.output("arraybuffer"));
    expect(alur).not.toMatch(/\nW\n/);
  });

  it("isi kartu ringkasan memakai tint biru brand, bukan warna status", async () => {
    const dokumen = await buatDokumenLaporan(HASIL_TINGGI, {
      id: "uji-pdf-002",
      sekarang: SEKARANG,
      acak: () => 0.42,
    });
    const alur = alirKontenHalaman1(dokumen.output("arraybuffer"));
    expect(alur).toMatch(/\/GS1 gs\n0\.15 0\.39 0\.92 rg/);
  });

  it("angka skor dan label level memakai varian teks gelap (kontras aman)", async () => {
    const dokumen = await buatDokumenLaporan(HASIL_TINGGI, {
      id: "uji-pdf-003",
      sekarang: SEKARANG,
      acak: () => 0.42,
    });
    const alur = alirKontenHalaman1(dokumen.output("arraybuffer"));
    // WARNA_TULIS.bad [122,30,26]/255 — teks gelap di atas tint, bukan merah solid.
    expect(alur).toContain("0.478 0.118 0.102 rg");
  });
});
