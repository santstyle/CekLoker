/**
 * Benchmark kualitas OCR untuk CekLoker.
 *
 * Menjalankan poster uji melalui pipeline OCR yang SAMA dengan aplikasi
 * (dua pass PSM AUTO + SPARSE_TEXT, pemilihan pass berbasis skor, penyaringan
 * baris `urutkanDanSaringBaris`, dan fallback teks mentah). Helper aplikasi
 * diimpor langsung dari `lib/`, bukan disalin, supaya benchmark tidak
 * menyimpang dari perilaku nyata.
 *
 * Pemakaian:
 *   pnpm ocr:bench
 *   pnpm ocr:bench -- --only=poster-administrasi
 *   pnpm ocr:bench -- --kategori=perusahaan
 *   pnpm ocr:bench -- --compare=scripts/ocr-debug/results/baseline.json
 *   pnpm ocr:bench -- --save-baseline
 *
 * Konvensi poster: lihat scripts/ocr-debug/posters/README.md.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { registerHooks } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const postersDir = path.join(__dirname, "posters");
const resultsDir = path.join(__dirname, "results");

// ---------------------------------------------------------------------------
// Loader: Node menjalankan TypeScript lewat type stripping, tetapi impor
// relatif tanpa ekstensi (mis. `./kualitas`) tidak otomatis ditambah `.ts`.
// Hook ini menambal hal itu agar helper aplikasi bisa diimpor apa adanya.
// ---------------------------------------------------------------------------
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      const relatif = specifier.startsWith("./") || specifier.startsWith("../");
      const tanpaEkstensi = path.extname(specifier) === "";
      if (relatif && tanpaEkstensi) {
        return nextResolve(`${specifier}.ts`, context);
      }
      if (specifier.startsWith("@/")) {
        const target = path.join(repoRoot, specifier.slice(2));
        for (const kandidat of [
          target,
          `${target}.ts`,
          path.join(target, "index.ts"),
        ]) {
          if (fs.existsSync(kandidat)) {
            return {
              url: pathToFileURL(kandidat).href,
              shortCircuit: true,
            };
          }
        }
      }
      throw err;
    }
  },
});

const { urutkanDanSaringBaris, rataKeyakinan } = await import(
  pathToFileURL(path.join(repoRoot, "lib/ocr/baris-ocr.ts")).href
);
const { ekstrakNamaUsaha } = await import(
  pathToFileURL(path.join(repoRoot, "lib/cek/ekstrak-nama-usaha.ts")).href
);
const { createWorker, PSM } = await import("tesseract.js");

// ---------------------------------------------------------------------------
// Argumen CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const ambilArg = (nama) => {
  const prefiks = `--${nama}=`;
  const found = args.find((a) => a.startsWith(prefiks));
  return found ? found.slice(prefiks.length) : null;
};
const hanya = ambilArg("only");
const filterKategori = ambilArg("kategori");
const comparePath = ambilArg("compare");
const simpanBaseline = args.includes("--save-baseline");

// ---------------------------------------------------------------------------
// Metrik teks
// ---------------------------------------------------------------------------
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[b.length];
}

function normalisasi(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function kataSet(s) {
  return new Set(
    normalisasi(s)
      .split(/[^a-z0-9]+/u)
      .filter((w) => w.length >= 3),
  );
}

/** Kemiripan karakter 0-100 (Levenshtein atas teks ternormalisasi). */
function kemiripan(gt, hasil) {
  const a = normalisasi(gt);
  const b = normalisasi(hasil);
  const panjang = Math.max(a.length, b.length);
  if (panjang === 0) return 100;
  return (1 - levenshtein(a, b) / panjang) * 100;
}

/** Recall/precision kata berbasis himpunan kata (>=3 karakter). */
function metrikKata(gt, hasil) {
  const gtKata = kataSet(gt);
  const hasilKata = kataSet(hasil);
  const recall =
    gtKata.size === 0
      ? 100
      : ([...gtKata].filter((w) => hasilKata.has(w)).length / gtKata.size) *
        100;
  const presisi =
    hasilKata.size === 0
      ? gtKata.size === 0
        ? 100
        : 0
      : ([...hasilKata].filter((w) => gtKata.has(w)).length / hasilKata.size) *
        100;
  return { recall, presisi };
}

// ---------------------------------------------------------------------------
// Pencocokan kolom penting
//   PERSIS    : seluruh nilai muncul utuh (abaikan spasi, tanda hubung, besar-kecil)
//   TERPOTONG : nilai terbelah (mis. email terpecah baris) tetapi semua bagian ada
//   MIRIP     : >= 70% token bermakna nilai ditemukan
//   HILANG    : selain itu
// ---------------------------------------------------------------------------
function rapat(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[\s\-_.]/g, "");
}

function tokenBermakna(s) {
  return String(s ?? "")
    .toLowerCase()
    .split(/[^a-z0-9]+/u)
    .filter((t) => t.length >= 3);
}

function nilaiKolom(harapan, hasilRapat, hasilNormal) {
  const target = rapat(harapan);
  if (target && hasilRapat.includes(target)) return "PERSIS";

  // Email/nilai dengan pemisah yang mungkin terbelah baris.
  if (String(harapan).includes("@")) {
    const [lokal, domain] = String(harapan).split("@");
    const lokalRapat = rapat(lokal);
    const domainRapat = rapat(domain);
    if (
      lokalRapat &&
      domainRapat &&
      hasilRapat.includes(lokalRapat) &&
      hasilRapat.includes(domainRapat)
    ) {
      return "TERPOTONG";
    }
  }

  const token = tokenBermakna(harapan);
  if (token.length > 0) {
    const ketemu = token.filter((t) => hasilNormal.includes(t)).length;
    if (ketemu / token.length >= 0.7) return "MIRIP";
  }
  return "HILANG";
}

function cekKolomPenting(kolomPenting, teksHasil) {
  const hasilRapat = rapat(teksHasil);
  const hasilNormal = normalisasi(teksHasil);
  const rincian = {};
  let total = 0;
  let cocok = 0;
  for (const [kunci, nilai] of Object.entries(kolomPenting ?? {})) {
    if (Array.isArray(nilai)) {
      rincian[kunci] = nilai.map((v) => {
        total += 1;
        const status = nilaiKolom(v, hasilRapat, hasilNormal);
        if (status === "PERSIS" || status === "TERPOTONG" || status === "MIRIP")
          cocok += 1;
        return status;
      });
    } else if (typeof nilai === "string") {
      // `namaUsaha` dicatat terpisah sebagai hasil ekstraksi, bukan kolom wajib.
      if (kunci === "namaUsaha") {
        rincian[kunci] = nilai;
        continue;
      }
      total += 1;
      const status = nilaiKolom(nilai, hasilRapat, hasilNormal);
      if (status === "PERSIS" || status === "TERPOTONG" || status === "MIRIP")
        cocok += 1;
      rincian[kunci] = status;
    }
  }
  return { rincian, total, cocok };
}

// ---------------------------------------------------------------------------
// Pipeline OCR yang mencerminkan components/check/unggah-poster.tsx
// ---------------------------------------------------------------------------
const langPath = path.join(repoRoot, "public/tesseract");

async function buatWorker() {
  return createWorker(["ind", "eng"], 1, { langPath });
}

/** Satu pass PSM. Baris dibangun dari data.text persis seperti aplikasi. */
async function jalankanPass(imgPath, mode) {
  const worker = await buatWorker();
  try {
    await worker.setParameters({ tessedit_pageseg_mode: mode });
    const { data } = await worker.recognize(imgPath);
    const baris = String(data.text ?? "")
      .split("\n")
      .map((t, i) => ({
        teks: t.trim(),
        keyakinan: Number(data.confidence ?? 80),
        bbox: { x0: 0, y0: i, x1: 0, y1: i },
      }));
    return { baris, berhasil: true };
  } finally {
    await worker.terminate();
  }
}

function skorPass(baris) {
  const alnum = baris.reduce(
    (s, b) => s + (b.teks.match(/[A-Za-z0-9]/g)?.length ?? 0),
    0,
  );
  return alnum * rataKeyakinan(baris);
}

/**
 * Jalankan dua pass lalu pilih yang skornya lebih tinggi, saring barisnya,
 * dan jatuh ke teks mentah bila hasil saringan < 30 karakter alfanumerik —
 * sama seperti aplikasi.
 */
async function jalankanPipelineOcr(imgPath) {
  const hasil = [];
  let passesBerhasil = 0;
  for (const mode of [PSM.AUTO, PSM.SPARSE_TEXT]) {
    try {
      const pass = await jalankanPass(imgPath, mode);
      hasil.push(pass);
      passesBerhasil += 1;
    } catch {
      // Satu pass gagal tidak boleh menggagalkan seluruh poster.
    }
  }
  if (hasil.length === 0) {
    return { teks: "", passes: 0, galatPass: "semua pass OCR gagal" };
  }

  const terpilih = hasil.reduce(
    (terbaik, sekarang) =>
      skorPass(sekarang.baris) > skorPass(terbaik.baris) ? sekarang : terbaik,
    hasil[0],
  );

  const teksSaring = urutkanDanSaringBaris(terpilih.baris, 35);
  const pakaiFallback = teksSaring.replace(/[^A-Za-z0-9]/g, "").length < 30;
  const teks = pakaiFallback
    ? terpilih.baris.map((b) => b.teks).join("\n")
    : teksSaring;

  return { teks, passes: passesBerhasil, fallback: pakaiFallback };
}

// ---------------------------------------------------------------------------
// Muat daftar poster
// ---------------------------------------------------------------------------
const ekstensiGambar = /\.(jpg|jpeg|png|webp)$/i;

const daftarPoster = fs
  .readdirSync(postersDir)
  .filter((f) => ekstensiGambar.test(f))
  .map((f) => f)
  .filter((f) => !hanya || path.basename(f, path.extname(f)) === hanya)
  .sort();

if (daftarPoster.length === 0) {
  console.error("Tidak ada poster yang cocok. Periksa --only/--kategori.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Jalankan benchmark
// ---------------------------------------------------------------------------
const hasilBenchmark = [];

for (const berkas of daftarPoster) {
  const nama = path.basename(berkas, path.extname(berkas));
  const imgPath = path.join(postersDir, berkas);
  const metaPath = path.join(postersDir, `${nama}.meta.json`);
  const gtPath = path.join(postersDir, `${nama}.txt`);

  let meta = {};
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    } catch (e) {
      console.warn(`[${nama}] meta.json tidak valid: ${e.message}`);
    }
  }

  if (filterKategori && meta.kategori !== filterKategori) continue;

  const groundTruth = fs.existsSync(gtPath)
    ? fs.readFileSync(gtPath, "utf8")
    : "";

  const mulai = Date.now();
  let teksHasil = "";
  let passes = 0;
  let error = null;
  try {
    const pipeline = await jalankanPipelineOcr(imgPath);
    teksHasil = pipeline.teks;
    passes = pipeline.passes;
    if (pipeline.galatPass) error = pipeline.galatPass;
  } catch (e) {
    error = e?.message ? String(e.message) : String(e);
  }
  const waktu = Date.now() - mulai;

  const sim = Math.round(kemiripan(groundTruth, teksHasil) * 10) / 10;
  const { recall, presisi } = metrikKata(groundTruth, teksHasil);
  const kolom = cekKolomPenting(meta.kolomPenting, teksHasil);

  const namaUsahaHasil = ekstrakNamaUsaha(teksHasil);
  const namaUsahaMeta = !Array.isArray(meta.kolomPenting?.namaUsaha)
    ? (meta.kolomPenting?.namaUsaha ?? null)
    : null;

  let namaUsahaStatus = "-";
  if (namaUsahaMeta) {
    if (!namaUsahaHasil) namaUsahaStatus = "tidak terdeteksi";
    else if (rapat(namaUsahaHasil) === rapat(namaUsahaMeta))
      namaUsahaStatus = "cocok";
    else namaUsahaStatus = "beda";
  }

  hasilBenchmark.push({
    nama,
    kategori: meta.kategori ?? "-",
    jenisPoster: meta.jenisPoster ?? "-",
    sim,
    recall: Math.round(recall * 10) / 10,
    presisi: Math.round(presisi * 10) / 10,
    kolom: kolom.rincian,
    kolomCocok: kolom.cocok,
    kolomTotal: kolom.total,
    namaUsahaMeta,
    namaUsahaHasil,
    namaUsahaStatus,
    waktu,
    passes,
    error,
    teksHasil,
  });

  const status = error ? `GAGAL: ${error}` : `${sim}%`;
  console.log(`[${nama}] ${status} (${passes} pass, ${waktu} ms)`);
}

// ---------------------------------------------------------------------------
// Ringkasan per kategori & jenisPoster
// ---------------------------------------------------------------------------
function rata(arr, kunci) {
  if (arr.length === 0) return 0;
  return (
    Math.round((arr.reduce((s, h) => s + h[kunci], 0) / arr.length) * 10) / 10
  );
}

function ringkas(arr, kunci) {
  const grup = new Map();
  for (const h of arr) {
    const k = h[kunci] ?? "-";
    if (!grup.has(k)) grup.set(k, []);
    grup.get(k).push(h);
  }
  return [...grup.entries()]
    .map(([nilai, items]) => ({
      nilai,
      jumlah: items.length,
      sim: rata(items, "sim"),
      recall: rata(items, "recall"),
      presisi: rata(items, "presisi"),
      waktu: rata(items, "waktu"),
    }))
    .sort((a, b) => a.nilai.localeCompare(b.nilai));
}

const ringkasanKategori = ringkas(hasilBenchmark, "kategori");
const ringkasanJenis = ringkas(hasilBenchmark, "jenisPoster");
const terburuk = [...hasilBenchmark].sort((a, b) => a.sim - b.sim).slice(0, 5);

// ---------------------------------------------------------------------------
// Bandingkan dengan baseline
// ---------------------------------------------------------------------------
function muatBaseline(lokasi) {
  const isi = JSON.parse(fs.readFileSync(lokasi, "utf8"));
  const arr = Array.isArray(isi) ? isi : (isi.posters ?? []);
  return new Map(arr.map((b) => [b.nama, b]));
}

let baseline = null;
if (comparePath) {
  try {
    baseline = muatBaseline(comparePath);
  } catch (e) {
    console.warn(`Gagal memuat baseline (${comparePath}): ${e.message}`);
  }
}

const perbandingan = [];
if (baseline) {
  for (const h of hasilBenchmark) {
    const prev = baseline.get(h.nama);
    if (!prev) {
      perbandingan.push({ nama: h.nama, baru: true });
      continue;
    }
    const dSim = Math.round((h.sim - prev.sim) * 10) / 10;
    const dRecall = Math.round((h.recall - prev.recall) * 10) / 10;
    const dPresisi = Math.round((h.presisi - prev.presisi) * 10) / 10;
    const regresi = dSim <= -3 || dRecall <= -5 || dPresisi <= -10;
    perbandingan.push({
      nama: h.nama,
      dSim,
      dRecall,
      dPresisi,
      regresi,
    });
  }
}

const adaRegresi = perbandingan.some((p) => p.regresi);

// ---------------------------------------------------------------------------
// Markdown
// ---------------------------------------------------------------------------
function barisTabelKolom(h) {
  return `${h.kolomCocok}/${h.kolomTotal || 0}`;
}

function buatMarkdown(stamp) {
  const out = [];
  out.push(`# Benchmark OCR CekLoker — ${stamp}`);
  out.push("");
  out.push(
    "Pipeline yang diuji sama dengan aplikasi: dua pass (PSM AUTO + SPARSE_TEXT), " +
      "pemilihan pass berbasis skor, penyaringan baris, dan fallback teks mentah.",
  );
  out.push("");
  out.push("## Ringkasan per poster");
  out.push("");
  out.push(
    "| Poster | Kategori | Jenis | Sim% | Recall% | Presisi% | Kolom | Nama usaha | Waktu (ms) | Pass |",
  );
  out.push("|---|---|---|---|---|---|---|---|---|---|");
  for (const h of hasilBenchmark) {
    out.push(
      `| ${h.nama} | ${h.kategori} | ${h.jenisPoster} | ${h.sim} | ${h.recall} | ${h.presisi} | ` +
        `${barisTabelKolom(h)} | ${h.namaUsahaStatus} | ${h.waktu} | ${h.passes} |`,
    );
  }
  out.push("");

  out.push("## Ringkasan per kategori");
  out.push("");
  out.push("| Kategori | Poster | Sim% | Recall% | Presisi% | Waktu (ms) |");
  out.push("|---|---|---|---|---|---|");
  for (const r of ringkasanKategori) {
    out.push(
      `| ${r.nilai} | ${r.jumlah} | ${r.sim} | ${r.recall} | ${r.presisi} | ${r.waktu} |`,
    );
  }
  out.push("");

  out.push("## Ringkasan per jenis poster");
  out.push("");
  out.push("| Jenis | Poster | Sim% | Recall% | Presisi% | Waktu (ms) |");
  out.push("|---|---|---|---|---|---|");
  for (const r of ringkasanJenis) {
    out.push(
      `| ${r.nilai} | ${r.jumlah} | ${r.sim} | ${r.recall} | ${r.presisi} | ${r.waktu} |`,
    );
  }
  out.push("");

  out.push("## 5 poster terburuk (kemiripan terendah)");
  out.push("");
  out.push("| Poster | Sim% | Recall% | Presisi% | Kolom |");
  out.push("|---|---|---|---|---|");
  for (const h of terburuk) {
    out.push(
      `| ${h.nama} | ${h.sim} | ${h.recall} | ${h.presisi} | ${barisTabelKolom(h)} |`,
    );
  }
  out.push("");

  if (baseline) {
    out.push("## Perbandingan dengan baseline");
    out.push("");
    out.push("| Poster | ΔSim | ΔRecall | ΔPresisi | Status |");
    out.push("|---|---|---|---|---|");
    for (const p of perbandingan) {
      if (p.baru) {
        out.push(`| ${p.nama} | - | - | - | BARU |`);
      } else {
        out.push(
          `| ${p.nama} | ${p.dSim > 0 ? "+" : ""}${p.dSim} | ${p.dRecall > 0 ? "+" : ""}${p.dRecall} | ` +
            `${p.dPresisi > 0 ? "+" : ""}${p.dPresisi} | ${p.regresi ? "REGRESI" : "OK"} |`,
        );
      }
    }
    out.push("");
  }

  out.push("## Rincian kolom penting");
  out.push("");
  for (const h of hasilBenchmark) {
    out.push(`### ${h.nama}`);
    out.push("");
    if (Object.keys(h.kolom).length === 0) {
      out.push("- (tidak ada kolom penting di meta)");
    } else {
      for (const [k, v] of Object.entries(h.kolom)) {
        if (k === "namaUsaha") {
          out.push(
            `- namaUsaha: harapan "${v}" — ekstraksi "${h.namaUsahaHasil ?? "-"}" (${h.namaUsahaStatus})`,
          );
        } else if (Array.isArray(v)) {
          out.push(`- ${k}: ${v.join(", ")}`);
        } else {
          out.push(`- ${k}: ${v}`);
        }
      }
    }
    out.push("");
    out.push("<details><summary>Teks OCR</summary>");
    out.push("");
    out.push("```");
    out.push(h.teksHasil.trim());
    out.push("```");
    out.push("");
    out.push("</details>");
    out.push("");
  }

  return out.join("\n");
}

// ---------------------------------------------------------------------------
// Tampilkan & simpan
// ---------------------------------------------------------------------------
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.mkdirSync(resultsDir, { recursive: true });

console.log("");
console.log(
  "| Poster | Kategori | Jenis | Sim% | Recall% | Presisi% | Kolom | Nama usaha | Waktu (ms) | Pass |",
);
console.log("|---|---|---|---|---|---|---|---|---|---|");
for (const h of hasilBenchmark) {
  console.log(
    `| ${h.nama} | ${h.kategori} | ${h.jenisPoster} | ${h.sim} | ${h.recall} | ${h.presisi} | ` +
      `${barisTabelKolom(h)} | ${h.namaUsahaStatus} | ${h.waktu} | ${h.passes} |`,
  );
}

console.log("");
console.log("Ringkasan per kategori:");
for (const r of ringkasanKategori) {
  console.log(
    `  ${r.nilai}: ${r.jumlah} poster, sim ${r.sim}%, recall ${r.recall}%, presisi ${r.presisi}%`,
  );
}
console.log("Ringkasan per jenis poster:");
for (const r of ringkasanJenis) {
  console.log(
    `  ${r.nilai}: ${r.jumlah} poster, sim ${r.sim}%, recall ${r.recall}%, presisi ${r.presisi}%`,
  );
}
console.log("5 poster terburuk:");
for (const h of terburuk) {
  console.log(
    `  ${h.nama}: sim ${h.sim}%, recall ${h.recall}%, presisi ${h.presisi}%`,
  );
}

if (baseline) {
  console.log("");
  console.log("Perbandingan baseline:");
  for (const p of perbandingan) {
    if (p.baru) {
      console.log(`  ${p.nama}: BARU (tidak ada di baseline)`);
    } else {
      const tanda = (n) => (n > 0 ? `+${n}` : `${n}`);
      console.log(
        `  ${p.nama}: Δsim ${tanda(p.dSim)}, Δrecall ${tanda(p.dRecall)}, Δpresisi ${tanda(p.dPresisi)}` +
          `${p.regresi ? "  <-- REGRESI" : ""}`,
      );
    }
  }
}

const outJson = path.join(resultsDir, `${stamp}.json`);
const outMd = path.join(resultsDir, `${stamp}.md`);
fs.writeFileSync(
  outJson,
  JSON.stringify(
    { dibuat: new Date().toISOString(), posters: hasilBenchmark },
    null,
    2,
  ),
);
fs.writeFileSync(outMd, buatMarkdown(stamp));

console.log("");
console.log(`Hasil disimpan: ${outJson}`);
console.log(`Laporan: ${outMd}`);

if (simpanBaseline) {
  fs.writeFileSync(
    path.join(resultsDir, "baseline.json"),
    JSON.stringify(hasilBenchmark, null, 2),
  );
  console.log("Baseline diperbarui: results/baseline.json");
}

if (adaRegresi) {
  console.error("PERINGATAN: ada regresi terhadap baseline.");
  process.exitCode = 2;
}
