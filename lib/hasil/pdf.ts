"use client";

import { GState, jsPDF } from "jspdf";

import { BATAS_BAND } from "@/lib/evaluation/score";
import type { HasilEvaluasi } from "@/lib/evaluation/types";
import {
  bagiHalaman,
  bangunLaporan,
  bersihkanTeks,
  bungkusTeks,
  formatTanggalLaporan,
  namaBerkasLaporan,
  type GayaTeks,
  type LaporanLengkap,
  type MetaLaporan,
  type OpsiTataLetak,
  type StatusTemuan,
  type Level,
} from "@/lib/hasil/laporan";

/* ============================ Ukuran halaman ============================ */

const HALAMAN = { lebar: 595.28, tinggi: 841.89 } as const;
const MARGIN = 44;
const LEBAR_KONTEN = HALAMAN.lebar - MARGIN * 2;
const KONTEN_ATAS_1 = 108;
const KONTEN_ATAS_N = 78;
const KONTEN_BAWAH = 750;
const GARIS_FOOTER = 780;
const JARAK_BLOK = 12;
const JARAK_KARTU = 9;
const SITUS = "ceklokerkita.vercel.app";

/* ================================ Warna ================================= */

type RGB = readonly [number, number, number];

/** Token laporan (sesuai spesifikasi template). */
const WARNA = {
  brand: [37, 99, 235] as RGB,
  navy: [15, 27, 61] as RGB,
  muted: [91, 100, 120] as RGB,
  line: [221, 227, 238] as RGB,
  bad: [184, 51, 43] as RGB,
  warn: [168, 98, 10] as RGB,
  ok: [31, 138, 91] as RGB,
  kekuatan: [138, 147, 166] as RGB,
} as const;

const WARNA_STATUS: Record<StatusTemuan, RGB> = {
  Menyimpang: WARNA.bad,
  "Perlu dicek": WARNA.warn,
  Sesuai: WARNA.ok,
};

/**
 * Varian warna yang dipakai khusus untuk TEKS status/level. Isian (bar,
 * chip, lingkaran) tetap memakai token WARNA, tetapi tulisan memakai
 * varian gelap ini agar kontras tetap aman — termasuk pada teks kecil
 * di atas chip/lingkaran berwarna status berkekuatan rendah (alfa 12%).
 */
const WARNA_TULIS = {
  bad: [122, 30, 26] as RGB,
  warn: [122, 74, 8] as RGB,
  ok: [20, 96, 63] as RGB,
} as const;

const WARNA_STATUS_TULIS: Record<StatusTemuan, RGB> = {
  Menyimpang: WARNA_TULIS.bad,
  "Perlu dicek": WARNA_TULIS.warn,
  Sesuai: WARNA_TULIS.ok,
};

const WARNA_LEVEL_TULIS: Record<Level, RGB> = {
  Tinggi: WARNA_TULIS.bad,
  "Perlu dicek": WARNA_TULIS.warn,
  Rendah: WARNA_TULIS.ok,
};

/* ================================= Font ================================= */

/**
 * Poppins di-embed dari /fonts pada saat unduhan (bukan dari bundel JS) agar
 * ukuran bundel tetap kecil. Bila pengambilan font gagal, laporan tetap
 * dibuat memakai font bawaan jsPDF supaya unduhan tidak pernah batal.
 */
const FONT_TERSEMAT = [
  { berkas: "Poppins-Regular.ttf", keluarga: "Poppins", gaya: "normal" },
  { berkas: "Poppins-Bold.ttf", keluarga: "Poppins", gaya: "bold" },
  { berkas: "Poppins-Italic.ttf", keluarga: "Poppins", gaya: "italic" },
  { berkas: "Poppins-Medium.ttf", keluarga: "PoppinsMedium", gaya: "normal" },
] as const;

interface Konteks {
  pdf: jsPDF;
  keluarga: Record<GayaTeks, string>;
  gaya: Record<GayaTeks, string>;
}

const KELUARGA_BAWAAN: Record<GayaTeks, string> = {
  regular: "helvetica",
  medium: "helvetica",
  bold: "helvetica",
  italic: "helvetica",
};

const KELUARGA_POPPINS: Record<GayaTeks, string> = {
  regular: "Poppins",
  medium: "PoppinsMedium",
  bold: "Poppins",
  italic: "Poppins",
};

const GAYA_UMUM: Record<GayaTeks, string> = {
  regular: "normal",
  medium: "normal",
  bold: "bold",
  italic: "italic",
};

/* ============================== Watermark =============================== */

/**
 * Berkas watermark sudah diputar 28 derajat berlawanan arah jarum jam dan
 * diberi alpha 7% (dibuat dari public/logo-header.png). Lebar sebelum
 * rotasi 430 pt sehingga lebar kotak pembatasnya 430 x (1778/1672) pt.
 */
const WATERMARK = { lebar: 457.26, tinggi: 347.7 } as const;
const WATERMARK_URL = "/watermark-cekloker.png";
const LOGO_URL = "/logo-header.png";

/* ================================ Utilitas ============================== */

function alpha(pdf: jsPDF, isi: number, garis = 1): void {
  pdf.setGState(new GState({ opacity: isi, "stroke-opacity": garis }));
}

function ukur(
  k: Konteks,
  teks: string,
  ukuran: number,
  gaya: GayaTeks,
): number {
  k.pdf.setFont(k.keluarga[gaya], k.gaya[gaya]);
  k.pdf.setFontSize(ukuran);
  return k.pdf.getTextWidth(teks);
}

function tataLetak(k: Konteks): OpsiTataLetak {
  return {
    lebarKonten: LEBAR_KONTEN,
    ukurTeks: (teks, ukuran, gaya) => ukur(k, teks, ukuran, gaya),
  };
}

function bungkus(
  k: Konteks,
  teks: string,
  ukuran: number,
  lebar: number,
  gaya: GayaTeks = "regular",
): string[] {
  return bungkusTeks(teks, ukuran, lebar, tataLetak(k), gaya);
}

interface GayaTulis {
  ukuran: number;
  gaya: GayaTeks;
  warna: RGB;
  /** kiri (default) | kanan | tengah */
  rata?: "kiri" | "kanan" | "tengah";
}

function tulis(
  k: Konteks,
  teks: string,
  x: number,
  y: number,
  opsi: GayaTulis,
): void {
  const { pdf } = k;
  pdf.setFont(k.keluarga[opsi.gaya], k.gaya[opsi.gaya]);
  pdf.setFontSize(opsi.ukuran);
  pdf.setTextColor(opsi.warna[0], opsi.warna[1], opsi.warna[2]);

  if (opsi.rata === "kanan" || opsi.rata === "tengah") {
    const lebar = pdf.getTextWidth(teks);
    x = opsi.rata === "kanan" ? x - lebar : x - lebar / 2;
  }
  pdf.text(teks, x, y);
}

/** Perkiraan garis dasar teks yang digambar dari sisi atas kotak. */
function garisDasar(atas: number, ukuran: number): number {
  return atas + ukuran * 0.8;
}

interface SegmenTeks {
  teks: string;
  gaya: GayaTeks;
  ukuran: number;
  warna: RGB;
}

/**
 * Menata beberapa potongan teks bergaya berbeda pada satu alur paragraf.
 * Mengembalikan tinggi yang dipakai; menggambar hanya bila `gambar` benar.
 */
function alirSegmen(
  k: Konteks,
  segmen: readonly SegmenTeks[],
  x: number,
  y: number,
  lebarMaks: number,
  tinggiBaris: number,
  gambar: boolean,
): number {
  interface Kata {
    teks: string;
    gaya: GayaTeks;
    ukuran: number;
    warna: RGB;
    lebar: number;
    spasi: boolean;
  }

  const kata: Kata[] = [];
  for (const bagian of segmen) {
    const potongan = bersihkanTeks(bagian.teks).split(" ").filter(Boolean);
    potongan.forEach((isi, indeks) => {
      kata.push({
        teks: isi,
        gaya: bagian.gaya,
        ukuran: bagian.ukuran,
        warna: bagian.warna,
        lebar: ukur(k, isi, bagian.ukuran, bagian.gaya),
        spasi: indeks > 0,
      });
    });
  }

  let lebarBaris = 0;
  let baris = 0;
  let jumlahBaris = 0;
  let bagian: Kata[] = [];

  const gambarBaris = () => {
    if (bagian.length === 0) return;
    jumlahBaris += 1;
    if (!gambar) return;
    let kiri = x;
    for (const potongan of bagian) {
      tulis(k, potongan.teks, kiri, y + baris * tinggiBaris, {
        ukuran: potongan.ukuran,
        gaya: potongan.gaya,
        warna: potongan.warna,
      });
      kiri += potongan.lebar + ukur(k, " ", potongan.ukuran, potongan.gaya);
    }
  };

  for (const potongan of kata) {
    const lebarSpasi = potongan.spasi
      ? ukur(k, " ", potongan.ukuran, potongan.gaya)
      : 0;
    const perlu = (bagian.length > 0 ? lebarSpasi : 0) + potongan.lebar;

    if (bagian.length > 0 && lebarBaris + perlu > lebarMaks) {
      gambarBaris();
      baris += 1;
      bagian = [];
      lebarBaris = 0;
    }

    bagian.push(potongan);
    lebarBaris += (bagian.length > 1 ? lebarSpasi : 0) + potongan.lebar;
  }
  gambarBaris();

  return Math.max(jumlahBaris, 1) * tinggiBaris;
}

/* ============================== Aset gambar ============================= */

interface Aset {
  dataUrl: string;
  lebar: number;
  tinggi: number;
}

async function muatAset(url: string): Promise<Aset | null> {
  try {
    const respons = await fetch(url);
    if (!respons.ok) return null;
    const buffer = await respons.arrayBuffer();
    const dataUrl = `data:image/png;base64,${keBase64(buffer)}`;

    const dimensi = await new Promise<{ lebar: number; tinggi: number } | null>(
      (selesai) => {
        const gambar = new Image();
        gambar.onload = () =>
          selesai({
            lebar: gambar.naturalWidth,
            tinggi: gambar.naturalHeight,
          });
        gambar.onerror = () => selesai(null);
        gambar.src = dataUrl;
      },
    );

    if (!dimensi) return null;
    return { dataUrl, ...dimensi };
  } catch {
    return null;
  }
}

function keBase64(buffer: ArrayBuffer): string {
  const byte = new Uint8Array(buffer);
  let biner = "";
  const potongan = 8192;
  for (let i = 0; i < byte.length; i += potongan) {
    biner += String.fromCharCode(...byte.subarray(i, i + potongan));
  }
  return btoa(biner);
}

async function sematkanFont(pdf: jsPDF): Promise<boolean> {
  try {
    for (const font of FONT_TERSEMAT) {
      const respons = await fetch(`/fonts/${font.berkas}`);
      if (!respons.ok) return false;
      const buffer = await respons.arrayBuffer();
      pdf.addFileToVFS(font.berkas, keBase64(buffer));
      pdf.addFont(font.berkas, font.keluarga, font.gaya);
    }
    return true;
  } catch {
    return false;
  }
}

/* =========================== Header dan footer ========================== */

function gambarHeader(
  k: Konteks,
  laporan: LaporanLengkap,
  logo: Aset | null,
  halaman: number,
  tanggal: string,
): void {
  const { pdf } = k;
  const kanan = MARGIN + LEBAR_KONTEN;

  if (halaman === 1) {
    if (logo) {
      pdf.addImage(
        logo.dataUrl,
        "PNG",
        MARGIN,
        36,
        128,
        (128 * logo.tinggi) / logo.lebar,
      );
    }
    tulis(k, "Laporan Pemeriksaan Lowongan", kanan, 52, {
      ukuran: 14,
      gaya: "bold",
      warna: WARNA.navy,
      rata: "kanan",
    });
    tulis(k, `No. ${laporan.nomor}`, kanan, 66, {
      ukuran: 7.6,
      gaya: "regular",
      warna: WARNA.muted,
      rata: "kanan",
    });
    tulis(k, tanggal, kanan, 77, {
      ukuran: 7.6,
      gaya: "regular",
      warna: WARNA.muted,
      rata: "kanan",
    });
    garisHeader(pdf, 92, 64, 2.6);
    return;
  }

  if (logo) {
    pdf.addImage(
      logo.dataUrl,
      "PNG",
      MARGIN,
      30,
      78,
      (78 * logo.tinggi) / logo.lebar,
    );
  }
  tulis(k, `Laporan ${laporan.nomor}`, kanan, 44, {
    ukuran: 7.6,
    gaya: "regular",
    warna: WARNA.muted,
    rata: "kanan",
  });
  garisHeader(pdf, 62, 40, 2.2);
}

function garisHeader(
  pdf: jsPDF,
  y: number,
  panjangAksen: number,
  tebalAksen: number,
): void {
  pdf.setLineWidth(0.8);
  pdf.setDrawColor(WARNA.line[0], WARNA.line[1], WARNA.line[2]);
  pdf.line(MARGIN, y, MARGIN + LEBAR_KONTEN, y);

  pdf.setLineWidth(tebalAksen);
  pdf.setDrawColor(WARNA.brand[0], WARNA.brand[1], WARNA.brand[2]);
  pdf.line(MARGIN, y, MARGIN + panjangAksen, y);
}

function gambarFooter(k: Konteks, halaman: number, total: number): void {
  const { pdf } = k;
  const kanan = MARGIN + LEBAR_KONTEN;

  pdf.setLineWidth(0.8);
  pdf.setDrawColor(WARNA.line[0], WARNA.line[1], WARNA.line[2]);
  pdf.line(MARGIN, GARIS_FOOTER, kanan, GARIS_FOOTER);

  tulis(k, "CekLoker", MARGIN, 793, {
    ukuran: 8,
    gaya: "bold",
    warna: WARNA.navy,
  });
  tulis(k, SITUS, 90, 793, {
    ukuran: 7.2,
    gaya: "regular",
    warna: WARNA.muted,
  });
  tulis(k, `Halaman ${halaman} dari ${total}`, kanan, 793, {
    ukuran: 7.2,
    gaya: "regular",
    warna: WARNA.muted,
    rata: "kanan",
  });
  tulis(
    k,
    "Alat bantu informasi berbasis aturan, bukan nasihat hukum atau vonis. Verifikasi selalu ke sumber resmi.",
    MARGIN,
    803,
    { ukuran: 6.8, gaya: "regular", warna: WARNA.muted },
  );
  tulis(
    k,
    "Dibuat di perangkat Anda. Teks iklan tidak disimpan di server CekLoker.",
    MARGIN,
    813,
    { ukuran: 6.8, gaya: "regular", warna: WARNA.muted },
  );
}

function gambarWatermark(pdf: jsPDF, watermark: Aset | null): void {
  if (!watermark) return;
  pdf.addImage(
    watermark.dataUrl,
    "PNG",
    (HALAMAN.lebar - WATERMARK.lebar) / 2,
    HALAMAN.tinggi / 2 + 10 - WATERMARK.tinggi / 2,
    WATERMARK.lebar,
    WATERMARK.tinggi,
  );
}

/* ============================ Blok dan penggambar ======================= */

interface Blok {
  /** Tinggi isi blok, tanpa jarak atas. */
  tinggi: number;
  /** Jarak dari blok sebelumnya (dihitung terpisah agar tidak dobel). */
  jarakAtas: number;
  gambar: (pdf: jsPDF, y: number) => void;
}

/** Tinggi total yang dipakai saat paginasi. */
function tinggiBlok(blok: Blok): number {
  return blok.jarakAtas + blok.tinggi;
}

function gambarKotak(
  pdf: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  opsi: {
    radius: number;
    isiWarna: RGB;
    isiAlpha: number;
    garisWarna?: RGB;
    garisAlpha?: number;
    garisTebal?: number;
  },
): void {
  alpha(pdf, opsi.isiAlpha, opsi.garisAlpha ?? 1);
  pdf.setFillColor(opsi.isiWarna[0], opsi.isiWarna[1], opsi.isiWarna[2]);
  if (opsi.garisWarna && opsi.garisTebal) {
    pdf.setDrawColor(
      opsi.garisWarna[0],
      opsi.garisWarna[1],
      opsi.garisWarna[2],
    );
    pdf.setLineWidth(opsi.garisTebal);
    pdf.roundedRect(x, y, w, h, opsi.radius, opsi.radius, "FD");
  } else {
    pdf.roundedRect(x, y, w, h, opsi.radius, opsi.radius, "F");
  }
  alpha(pdf, 1, 1);
}

/** Kartu ringkasan: skor besar, meter tiga rentang, hitungan temuan. */
function blokRingkasan(k: Konteks, laporan: LaporanLengkap): Blok {
  const tinggi = 122;
  const x = MARGIN;
  const w = LEBAR_KONTEN;
  const warnaLevel = WARNA_LEVEL_TULIS[laporan.level];

  return {
    tinggi,
    jarakAtas: 0,
    gambar: (pdf, y) => {
      gambarKotak(pdf, x, y, w, tinggi, {
        radius: 12,
        isiWarna: WARNA.brand,
        isiAlpha: 0.03,
        garisWarna: WARNA.line,
        garisTebal: 0.8,
      });

      // Bar kiri warna level. Sengaja TIDAK memakai clip(): jsPDF
      // mengeluarkan operator clip tanpa "n", sehingga path berikutnya
      // (rect kecil) ikut mengisi seluruh path akumulasi dan seluruh
      // kartu tertutup cat warna status. Bar digambar sebagai kotak
      // membulat kecil, sama seperti bar kartu temuan.
      pdf.setFillColor(warnaLevel[0], warnaLevel[1], warnaLevel[2]);
      pdf.roundedRect(x, y, 6, tinggi, 3, 3, "F");

      tulis(k, "Skor risiko", x + 24, y + 24, {
        ukuran: 7.5,
        gaya: "medium",
        warna: WARNA.muted,
      });

      const angka = String(laporan.skor);
      tulis(k, angka, x + 24, y + 70, {
        ukuran: 42,
        gaya: "bold",
        warna: warnaLevel,
      });
      tulis(k, "/100", x + 24 + ukur(k, angka, 42, "bold") + 4, y + 70, {
        ukuran: 11,
        gaya: "regular",
        warna: WARNA.muted,
      });
      tulis(k, `Risiko ${laporan.level.toLowerCase()}`, x + 24, y + 92, {
        ukuran: 12,
        gaya: "bold",
        warna: warnaLevel,
      });
      tulis(k, laporan.ringkasanLevel, x + 24, y + 106, {
        ukuran: 8,
        gaya: "regular",
        warna: WARNA.muted,
      });

      gambarMeter(pdf, k, x + 215, y + 26, w - 215 - 24, y, laporan);
    },
  };
}

/** Meter tiga rentang; ambang diambil dari konstanta mesin skor. */
function gambarMeter(
  pdf: jsPDF,
  k: Konteks,
  x: number,
  y: number,
  w: number,
  kartuY: number,
  laporan: LaporanLengkap,
): void {
  const jarak = 3;
  const tinggiBar = 9;
  const lebarBar = w - jarak * 2;
  const segmen = [
    {
      nama: "Rendah",
      dari: 0,
      sampai: BATAS_BAND.perluDicek - 1,
      satuan: BATAS_BAND.perluDicek,
      warna: WARNA.ok,
      warnaTulis: WARNA_TULIS.ok,
    },
    {
      nama: "Perlu dicek",
      dari: BATAS_BAND.perluDicek,
      sampai: BATAS_BAND.tinggi - 1,
      satuan: BATAS_BAND.tinggi - BATAS_BAND.perluDicek,
      warna: WARNA.warn,
      warnaTulis: WARNA_TULIS.warn,
    },
    {
      nama: "Tinggi",
      dari: BATAS_BAND.tinggi,
      sampai: 100,
      satuan: 100 - BATAS_BAND.tinggi,
      warna: WARNA.bad,
      warnaTulis: WARNA_TULIS.bad,
    },
  ];

  let kiri = x;
  for (const bagian of segmen) {
    const lebar = (bagian.satuan / 100) * lebarBar;
    alpha(pdf, 0.85, 0.85);
    pdf.setFillColor(bagian.warna[0], bagian.warna[1], bagian.warna[2]);
    pdf.roundedRect(kiri, y, lebar, tinggiBar, 4.5, 4.5, "F");
    alpha(pdf, 1, 1);

    tulis(k, bagian.nama, kiri, y + tinggiBar + 11, {
      ukuran: 7.2,
      gaya: "medium",
      warna: bagian.warnaTulis,
    });
    tulis(k, `${bagian.dari}-${bagian.sampai}`, kiri, y + tinggiBar + 21, {
      ukuran: 6.8,
      gaya: "regular",
      warna: WARNA.muted,
    });
    kiri += lebar + jarak;
  }

  // Penanda posisi skor.
  const skor = Math.max(0, Math.min(100, laporan.skor));
  const posisi = x + (skor / 100) * lebarBar;
  pdf.setFillColor(WARNA.navy[0], WARNA.navy[1], WARNA.navy[2]);
  pdf.triangle(posisi - 4, y - 8, posisi + 4, y - 8, posisi, y - 1, "F");
  tulis(k, String(skor), posisi, y - 11, {
    ukuran: 7.5,
    gaya: "bold",
    warna: WARNA.navy,
    rata: "tengah",
  });

  const hitung = laporan.jumlah;
  const ringkas =
    `${hitung.total} temuan:  ${hitung.menyimpang} menyimpang,  ` +
    `${hitung.perluDicek} perlu dicek` +
    (hitung.sesuai > 0 ? `,  ${hitung.sesuai} sesuai` : "");
  tulis(k, ringkas, x, kartuY + 122 - 22, {
    ukuran: 8.2,
    gaya: "medium",
    warna: WARNA.navy,
  });
}

/** Baris meta iklan: posisi, lokasi, sumber, upah. */
function blokMeta(k: Konteks, laporan: LaporanLengkap): Blok {
  const kolom = [
    { label: "Posisi", nilai: laporan.posisi },
    { label: "Lokasi penempatan", nilai: laporan.lokasi },
    { label: "Sumber iklan", nilai: laporan.sumber },
    { label: "Upah tertulis", nilai: laporan.upah },
  ];
  const lebarKolom = LEBAR_KONTEN / 4;
  const lebarNilai = lebarKolom - 10;

  const barisNilai = kolom.map((butir) =>
    bungkus(
      k,
      butir.nilai && butir.nilai.length > 0 ? butir.nilai : "Tidak dicantumkan",
      9.5,
      lebarNilai,
      "medium",
    ),
  );
  const maksBaris = Math.max(...barisNilai.map((baris) => baris.length), 1);
  const tinggi = 27 + (maksBaris - 1) * 13;

  return {
    tinggi,
    jarakAtas: JARAK_BLOK,
    gambar: (pdf, y) => {
      kolom.forEach((butir, indeks) => {
        const x = MARGIN + indeks * lebarKolom;
        tulis(k, butir.label, x, y + 8, {
          ukuran: 7.2,
          gaya: "regular",
          warna: WARNA.muted,
        });
        barisNilai[indeks].forEach((baris, nomor) => {
          tulis(k, baris, x, y + 19 + nomor * 13, {
            ukuran: 9.5,
            gaya: "medium",
            warna: WARNA.navy,
          });
        });
      });

      pdf.setLineWidth(0.6);
      pdf.setDrawColor(WARNA.line[0], WARNA.line[1], WARNA.line[2]);
      pdf.line(MARGIN, y + tinggi, MARGIN + LEBAR_KONTEN, y + tinggi);
    },
  };
}

/** Judul bagian (H2) beserta jarak atas dan bawahnya. */
function blokJudul(k: Konteks, judul: string): Blok {
  return {
    tinggi: 17 + 7,
    jarakAtas: 14,
    gambar: (pdf, y) => {
      tulis(k, judul, MARGIN, y + garisDasar(0, 13), {
        ukuran: 13,
        gaya: "bold",
        warna: WARNA.navy,
      });
    },
  };
}

const LEBAR_JUDUL_TEMUAN = LEBAR_KONTEN - 58 - 96;
const LEBAR_KUTIPAN = LEBAR_KONTEN - 52 - 16;

/** Satu kartu temuan; tidak pernah dipotong antar halaman. */
function blokTemuan(
  k: Konteks,
  temuan: LaporanLengkap["temuan"][number],
  nomor: number,
): Blok {
  const warna = WARNA_STATUS[temuan.status];
  const warnaTulis = WARNA_STATUS_TULIS[temuan.status];
  const judulBaris = bungkus(k, temuan.judul, 10.5, LEBAR_JUDUL_TEMUAN, "bold");
  const kutipanBaris = temuan.kutipan
    ? bungkus(k, temuan.kutipan, 8.8, LEBAR_KUTIPAN - 24, "italic")
    : [];
  const tinggiKutipan =
    kutipanBaris.length > 0 ? 6 + kutipanBaris.length * 13 + 6 : 0;

  const segmenDasar: SegmenTeks[] = [
    { teks: "Dasar:", gaya: "medium", ukuran: 8, warna: WARNA.navy },
    { teks: temuan.dasar, gaya: "regular", ukuran: 8, warna: WARNA.muted },
    {
      teks: `(${temuan.tingkatKekuatan})`,
      gaya: "regular",
      ukuran: 8,
      warna: WARNA.kekuatan,
    },
  ];

  let tinggi = 12 + judulBaris.length * 14;
  if (tinggiKutipan > 0) tinggi += 8 + tinggiKutipan;
  tinggi += 14;
  tinggi += alirSegmen(k, segmenDasar, 0, 0, LEBAR_KUTIPAN, 11.5, false);
  tinggi += 12;

  const labelChip = temuan.status;
  const lebarChip = 8 + 4.4 + 4 + ukur(k, labelChip, 7.4, "medium") + 8;

  return {
    tinggi,
    jarakAtas: JARAK_KARTU,
    gambar: (pdf, y) => {
      pdf.setLineWidth(0.8);
      pdf.setDrawColor(WARNA.line[0], WARNA.line[1], WARNA.line[2]);
      pdf.roundedRect(MARGIN, y, LEBAR_KONTEN, tinggi, 10, 10, "S");

      // Bar kiri warna status.
      pdf.setFillColor(warna[0], warna[1], warna[2]);
      pdf.roundedRect(MARGIN, y + 10, 4, tinggi - 20, 2, 2, "F");

      // Lingkaran nomor.
      const pusatX = MARGIN + 28;
      const pusatY = y + 25;
      alpha(pdf, 0.12, 1);
      pdf.setFillColor(warna[0], warna[1], warna[2]);
      pdf.circle(pusatX, pusatY, 11, "F");
      alpha(pdf, 1, 1);
      tulis(k, String(nomor), pusatX, pusatY + 3.6, {
        ukuran: 10,
        gaya: "bold",
        warna: warnaTulis,
        rata: "tengah",
      });

      judulBaris.forEach((baris, indeks) => {
        tulis(
          k,
          baris,
          MARGIN + 52,
          y + 12 + garisDasar(0, 10.5) + indeks * 14,
          {
            ukuran: 10.5,
            gaya: "bold",
            warna: WARNA.navy,
          },
        );
      });

      // Chip status.
      const chipX = MARGIN + LEBAR_KONTEN - 14 - lebarChip;
      const chipY = y + 12;
      gambarKotak(pdf, chipX, chipY, lebarChip, 15, {
        radius: 7.5,
        isiWarna: warna,
        isiAlpha: 0.12,
      });
      pdf.setFillColor(warna[0], warna[1], warna[2]);
      pdf.circle(chipX + 8 + 2.2, chipY + 7.5, 2.2, "F");
      tulis(k, labelChip, chipX + 8 + 4.4 + 4, chipY + 7.5 + 2.6, {
        ukuran: 7.4,
        gaya: "medium",
        warna: warnaTulis,
      });

      let bawah = y + 12 + judulBaris.length * 14;

      if (kutipanBaris.length > 0) {
        bawah += 8;
        gambarKotak(pdf, MARGIN + 52, bawah, LEBAR_KUTIPAN, tinggiKutipan, {
          radius: 6,
          isiWarna: WARNA.brand,
          isiAlpha: 0.06,
        });
        pdf.setFillColor(WARNA.brand[0], WARNA.brand[1], WARNA.brand[2]);
        pdf.rect(MARGIN + 52, bawah, 3, tinggiKutipan, "F");
        kutipanBaris.forEach((baris, indeks) => {
          tulis(
            k,
            baris,
            MARGIN + 52 + 12,
            bawah + 6 + garisDasar(0, 8.8) + indeks * 13,
            { ukuran: 8.8, gaya: "italic", warna: WARNA.muted },
          );
        });
        bawah += tinggiKutipan;
      }

      bawah += 14;
      alirSegmen(
        k,
        segmenDasar,
        MARGIN + 52,
        bawah + garisDasar(0, 8),
        LEBAR_KUTIPAN,
        11.5,
        true,
      );
    },
  };
}

/** Pemberitahuan saat tidak ada temuan. */
function blokTanpaTemuan(k: Konteks): Blok {
  const teks =
    "Tidak ditemukan indikator bermasalah pada teks iklan. Tetap verifikasi kanal resmi dan izin usaha perusahaan sebelum melamar.";
  const baris = bungkus(k, teks, 9, LEBAR_KONTEN - 24);
  const tinggi = 12 + baris.length * 13.5 + 12;

  return {
    tinggi,
    jarakAtas: JARAK_KARTU,
    gambar: (pdf, y) => {
      gambarKotak(pdf, MARGIN, y, LEBAR_KONTEN, tinggi, {
        radius: 10,
        isiWarna: WARNA.brand,
        isiAlpha: 0.04,
        garisWarna: WARNA.line,
        garisTebal: 0.8,
      });
      baris.forEach((isi, indeks) => {
        tulis(k, isi, MARGIN + 12, y + 12 + garisDasar(0, 9) + indeks * 13.5, {
          ukuran: 9,
          gaya: "regular",
          warna: WARNA.navy,
        });
      });
    },
  };
}

/** Satu langkah bernomor; judul bagian menempel pada langkah pertama. */
function blokLangkah(
  k: Konteks,
  langkah: string,
  nomor: number,
  pertama: boolean,
  terakhir: boolean,
): Blok {
  const lebarTeks = LEBAR_KONTEN - 18;
  const baris = bungkus(k, langkah, 9, lebarTeks);
  const tinggi =
    (pertama ? 17 + 7 : 0) + baris.length * 13.5 + (terakhir ? 0 : 5);

  return {
    tinggi,
    jarakAtas: pertama ? 14 : 5,
    gambar: (pdf, y) => {
      let atas = y;
      if (pertama) {
        tulis(k, "Langkah selanjutnya", MARGIN, y + garisDasar(0, 13), {
          ukuran: 13,
          gaya: "bold",
          warna: WARNA.navy,
        });
        atas = y + 17 + 7;
      }

      tulis(k, `${nomor}.`, MARGIN, atas + garisDasar(0, 9), {
        ukuran: 9,
        gaya: "bold",
        warna: WARNA.brand,
      });
      baris.forEach((isi, indeks) => {
        tulis(k, isi, MARGIN + 18, atas + garisDasar(0, 9) + indeks * 13.5, {
          ukuran: 9,
          gaya: "regular",
          warna: WARNA.navy,
        });
      });
    },
  };
}

/** Kotak berjudul: contoh pesan konfirmasi dan tentang laporan. */
function blokKotak(
  k: Konteks,
  opsi: {
    judul: string;
    isi: string;
    isiGaya: GayaTeks;
    isiUkuran: number;
    isiBaris: number;
    judulUkuran: number;
    judulWarna: RGB;
    isiWarna: RGB;
    isiKotak: RGB;
    isiAlpha: number;
    jarakAtas: number;
    garisWarna?: RGB;
    garisAlpha?: number;
  },
): Blok {
  const baris = bungkus(
    k,
    opsi.isi,
    opsi.isiUkuran,
    LEBAR_KONTEN - 24,
    opsi.isiGaya,
  );
  const tinggi = 12 + opsi.judulUkuran + 4 + baris.length * opsi.isiBaris + 12;

  return {
    tinggi,
    jarakAtas: opsi.jarakAtas,
    gambar: (pdf, y) => {
      gambarKotak(pdf, MARGIN, y, LEBAR_KONTEN, tinggi, {
        radius: 9,
        isiWarna: opsi.isiKotak,
        isiAlpha: opsi.isiAlpha,
        ...(opsi.garisWarna
          ? {
              garisWarna: opsi.garisWarna,
              garisTebal: 0.7,
              garisAlpha: opsi.garisAlpha ?? 1,
            }
          : {}),
      });
      tulis(
        k,
        opsi.judul,
        MARGIN + 12,
        y + 12 + garisDasar(0, opsi.judulUkuran),
        {
          ukuran: opsi.judulUkuran,
          gaya: "medium",
          warna: opsi.judulWarna,
        },
      );
      baris.forEach((isi, indeks) => {
        tulis(
          k,
          isi,
          MARGIN + 12,
          y +
            12 +
            opsi.judulUkuran +
            4 +
            garisDasar(0, opsi.isiUkuran) +
            indeks * opsi.isiBaris,
          { ukuran: opsi.isiUkuran, gaya: opsi.isiGaya, warna: opsi.isiWarna },
        );
      });
    },
  };
}

/* ============================ Penyusun laporan ========================== */

function susunBlok(k: Konteks, laporan: LaporanLengkap): Blok[] {
  const blok: Blok[] = [
    blokRingkasan(k, laporan),
    blokMeta(k, laporan),
    blokJudul(k, `Temuan (${laporan.jumlah.total})`),
  ];

  if (laporan.temuan.length === 0) {
    blok.push(blokTanpaTemuan(k));
  } else {
    laporan.temuan.forEach((temuan, indeks) => {
      blok.push(blokTemuan(k, temuan, indeks + 1));
    });
  }

  laporan.langkah.forEach((langkah, indeks) => {
    blok.push(
      blokLangkah(
        k,
        langkah,
        indeks + 1,
        indeks === 0,
        indeks === laporan.langkah.length - 1,
      ),
    );
  });

  blok.push(
    blokKotak(k, {
      judul: "Contoh pesan konfirmasi",
      isi: laporan.contohPesan,
      isiGaya: "italic",
      isiUkuran: 9,
      isiBaris: 13.5,
      judulUkuran: 9,
      judulWarna: WARNA.navy,
      isiWarna: WARNA.muted,
      isiKotak: WARNA.brand,
      isiAlpha: 0.07,
      jarakAtas: JARAK_BLOK,
      garisWarna: WARNA.brand,
      garisAlpha: 0.35,
    }),
  );

  blok.push(
    blokKotak(k, {
      judul: "Tentang laporan ini",
      isi:
        "Pemeriksaan dilakukan oleh aturan baku yang hasilnya selalu sama untuk teks yang sama. " +
        "Setiap temuan menyebut kutipan dan dasar rujukannya. Tingkat kekuatan dasar (undang-undang, " +
        "peraturan menteri, surat edaran, atau indikator umum) dicantumkan agar Anda bisa menimbang sendiri. " +
        laporan.penjelasanPenentu +
        " Hasil ini adalah indikasi risiko, bukan penilaian bahwa suatu pihak melakukan pelanggaran atau penipuan.",
      isiGaya: "regular",
      isiUkuran: 8,
      isiBaris: 11.5,
      judulUkuran: 9,
      judulWarna: WARNA.navy,
      isiWarna: WARNA.muted,
      isiKotak: WARNA.navy,
      isiAlpha: 0.07,
      jarakAtas: JARAK_BLOK,
    }),
  );

  return blok;
}

function susunHalaman(blok: readonly Blok[]): number[][] {
  const kapasitas1 = KONTEN_BAWAH - KONTEN_ATAS_1;
  const kapasitasN = KONTEN_BAWAH - KONTEN_ATAS_N;

  const halaman1: number[] = [];
  let terpakai = 0;
  let indeks = 0;
  for (; indeks < blok.length; indeks += 1) {
    if (
      halaman1.length > 0 &&
      terpakai + tinggiBlok(blok[indeks]) > kapasitas1
    ) {
      break;
    }
    halaman1.push(indeks);
    terpakai += tinggiBlok(blok[indeks]);
  }

  const sisa = blok.slice(indeks);
  const halamanLain = bagiHalaman(
    sisa.map((butir) => tinggiBlok(butir)),
    kapasitasN,
  ).map((halaman) => halaman.map((nomor) => nomor + indeks));

  return [halaman1, ...halamanLain].filter((halaman) => halaman.length > 0);
}

/* ============================ Titik masuk umum ========================== */

export interface OpsiLaporanPdf {
  /** Id sesi hasil; dipakai bila nomor laporan tidak tersedia. */
  id: string;
  sertakanKutipan?: boolean;
  meta?: MetaLaporan;
  sekarang?: Date;
  acak?: () => number;
}

/**
 * Membuat dokumen PDF laporan dari hasil evaluasi.
 *
 * Seluruh proses berjalan di perangkat pengguna: font, logo, dan watermark
 * diambil dari berkas statis situs ini sendiri, dan tidak ada teks iklan
 * yang dikirim ke mana pun.
 */
export async function buatDokumenLaporan(
  hasil: HasilEvaluasi,
  opsi: OpsiLaporanPdf,
): Promise<jsPDF> {
  const sekarang = opsi.sekarang ?? new Date();
  const laporan = bangunLaporan(hasil, {
    id: opsi.id,
    ...(opsi.sertakanKutipan !== undefined
      ? { sertakanKutipan: opsi.sertakanKutipan }
      : {}),
    ...(opsi.meta ? { meta: opsi.meta } : {}),
    sekarang,
    ...(opsi.acak ? { acak: opsi.acak } : {}),
  });

  const pdf = new jsPDF({
    unit: "pt",
    format: "a4",
    orientation: "portrait",
    compress: true,
  });
  pdf.setProperties({
    title: "Laporan Pemeriksaan Lowongan - CekLoker",
    author: "CekLoker",
    subject: "Indikasi risiko iklan lowongan berbasis aturan",
    creator: "CekLoker",
  });
  try {
    // jsPDF hanya mengenal kode bahasa "id" (bukan "id-ID").
    pdf.setLanguage("id");
  } catch {
    // Bahasa dokumen hanya metadata; abaikan bila tidak didukung.
  }

  const [fontSiap, logo, watermark] = await Promise.all([
    sematkanFont(pdf),
    muatAset(LOGO_URL),
    muatAset(WATERMARK_URL),
  ]);

  const k: Konteks = {
    pdf,
    keluarga: fontSiap ? KELUARGA_POPPINS : KELUARGA_BAWAAN,
    gaya: GAYA_UMUM,
  };

  const blok = susunBlok(k, laporan);
  const halaman = susunHalaman(blok);
  const tanggal = formatTanggalLaporan(sekarang);

  halaman.forEach((isiHalaman, nomorHalaman) => {
    if (nomorHalaman > 0) pdf.addPage();
    gambarWatermark(pdf, watermark);
    gambarHeader(k, laporan, logo, nomorHalaman + 1, tanggal);

    let y = nomorHalaman === 0 ? KONTEN_ATAS_1 : KONTEN_ATAS_N;
    for (const nomorBlok of isiHalaman) {
      y += blok[nomorBlok].jarakAtas;
      blok[nomorBlok].gambar(pdf, y);
      y += blok[nomorBlok].tinggi;
    }
  });

  for (let nomor = 1; nomor <= halaman.length; nomor += 1) {
    pdf.setPage(nomor);
    gambarFooter(k, nomor, halaman.length);
  }

  return pdf;
}

/** Membuat laporan lalu mengunduhnya sebagai PDF. */
export async function unduhLaporanPdf(
  hasil: HasilEvaluasi,
  opsi: OpsiLaporanPdf,
): Promise<void> {
  const pdf = await buatDokumenLaporan(hasil, opsi);
  pdf.save(namaBerkasLaporan(opsi.sekarang ?? new Date()));
}
