import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function daftarBerkas(dir: string): string[] {
  const hasil: string[] = [];
  function susuri(folder: string) {
    for (const entri of readdirSync(folder)) {
      const jalur = join(folder, entri);
      const statistik = statSync(jalur);
      if (statistik.isDirectory()) {
        if (entri !== "node_modules" && entri !== ".git") susuri(jalur);
      } else if (/\.(ts|tsx|js|jsx)$/.test(entri)) {
        hasil.push(jalur);
      }
    }
  }
  try {
    susuri(dir);
  } catch {
    // Direktori mungkin tidak ada; lewati saja.
  }
  return hasil;
}

const FILE_HASIL: string[] = [
  ...daftarBerkas(join(ROOT, "app", "(public)", "hasil", "[id]")),
  ...daftarBerkas(join(ROOT, "components", "hasil")),
  ...daftarBerkas(join(ROOT, "lib", "hasil")),
  join(ROOT, "lib", "api", "evaluasi.ts"),
];

describe("pemisahan lingkup /bantuan", () => {
  it("file halaman hasil TIDAK mengimpor lib/kanal-lapor", () => {
    const pelanggaran: string[] = [];
    for (const file of FILE_HASIL) {
      try {
        const isi = readFileSync(file, "utf8");
        if (/kanal-lapor/.test(isi)) {
          pelanggaran.push(file);
        }
      } catch {
        // File mungkin tidak ada; lewati.
      }
    }
    expect(pelanggaran).toEqual([]);
  });

  it("file halaman hasil TIDAK mengandung 'laporkan ke' atau 'hotline'", () => {
    const pelanggaran: string[] = [];
    for (const file of FILE_HASIL) {
      try {
        const isi = readFileSync(file, "utf8");
        if (/laporkan\s+ke/i.test(isi) || /hotline/i.test(isi)) {
          pelanggaran.push(file);
        }
      } catch {
        // File mungkin tidak ada; lewati.
      }
    }
    expect(pelanggaran).toEqual([]);
  });

  it("file halaman hasil TIDAK mengandung nomor telepon hotline Kemnaker", () => {
    const pelanggaran: string[] = [];
    for (const file of FILE_HASIL) {
      try {
        const isi = readFileSync(file, "utf8");
        if (isi.includes("1500 630")) {
          pelanggaran.push(file);
        }
      } catch {
        // File mungkin tidak ada; lewati.
      }
    }
    expect(pelanggaran).toEqual([]);
  });

  it("file halaman hasil TIDAK mengandung URL kanal lapor resmi", () => {
    const urlKanal = [
      "lapormenaker.kemnaker.go.id",
      "cekrekening.id",
      "aduannomor.id",
      "aduankonten.id",
      "patrolisiber.id",
      "karirhub.kemnaker.go.id",
    ];
    const pelanggaran: string[] = [];
    for (const file of FILE_HASIL) {
      try {
        const isi = readFileSync(file, "utf8");
        for (const url of urlKanal) {
          if (isi.includes(url)) {
            pelanggaran.push(`${file} mengandung ${url}`);
            break;
          }
        }
      } catch {
        // File mungkin tidak ada; lewati.
      }
    }
    expect(pelanggaran).toEqual([]);
  });
});
