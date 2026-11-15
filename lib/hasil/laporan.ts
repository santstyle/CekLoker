/**
 * Pembuat data laporan PDF.
 *
 * Modul ini murni: tidak menyentuh DOM, jsPDF, maupun jaringan, sehingga
 * seluruh aturan isi laporan dapat diuji tanpa merender apa pun. Nilai yang
 * tampil di laporan (level, skor, jumlah temuan) diambil apa adanya dari
 * objek hasil evaluasi — tidak pernah dihitung ulang di sini.
 *
 * Acuan tata letak: dokumen spesifikasi template laporan CekLoker.
 */

import { labelRujukan } from "@/lib/evaluation/rujukan";
import { RULES } from "@/lib/evaluation/rules";
import type { Band, HasilEvaluasi } from "@/lib/evaluation/types";

export type Level = "Rendah" | "Perlu dicek" | "Tinggi";

export type StatusTemuan = "Menyimpang" | "Perlu dicek" | "Sesuai";

/** Gaya teks yang dikenali pengukur lebar (lihat OpsiTataLetak). */
export type GayaTeks = "regular" | "medium" | "bold" | "italic";

/** Satu kartu temuan di laporan (bentuk akhir, siap digambar). */
export interface TemuanLaporan {
  judul: string;
  status: StatusTemuan;
  /** Hanya terisi bila opsi "Sertakan kutipan dari iklan" menyala. */
  kutipan?: string;
  dasar: string;
  tingkatKekuatan: string;
}

/** Skema data masukan pembuat laporan (sesuai spesifikasi template). */
export interface LaporanPdfInput {
  nomor: string;
  tanggalIso: string;
  posisi?: string;
  lokasi?: string;
  sumber?: string;
  upah?: string;
  skor: number;
  level: Level;
  temuan: TemuanLaporan[];
  sertakanKutipan: boolean;
}

/** Laporan lengkap: skema di atas + konteks yang dibutuhkan penggambar PDF. */
export interface LaporanLengkap extends LaporanPdfInput {
  band: Band;
  /** Ringkasan dari mesin evaluasi (tanpa teks iklan). */
  ringkasan: string;
  /** Kalimat ringkasan kartu sesuai level (spesifikasi bagian 8). */
  ringkasanLevel: string;
  langkah: readonly string[];
  contohPesan: string;
  jumlah: {
    total: number;
    menyimpang: number;
    perluDicek: number;
    sesuai: number;
  };
  versiMesin: string;
}

const PETA_RULE = new Map(RULES.map((rule) => [rule.id, rule]));

/**
 * Label level laporan. Ditulis sebagai literal agar bisa dipakai sebagai kunci
 * peta konten, dan dijaga tetap sama dengan LABEL_BAND oleh pengujian.
 */
const LEVEL_DARI_BAND = {
  rendah: "Rendah",
  perlu_dicek: "Perlu dicek",
  tinggi: "Tinggi",
} as const satisfies Record<Band, Level>;

/** Level laporan dari band mesin evaluasi (tanpa menghitung ulang apa pun). */
export function levelDariBand(band: Band): Level {
  return LEVEL_DARI_BAND[band];
}

/** Status kartu temuan diturunkan dari aturan, bukan dihitung ulang. */
export function statusDariRuleId(ruleId: string): StatusTemuan {
  const rule = PETA_RULE.get(ruleId);
  if (!rule) return "Perlu dicek";
  if (rule.hasilJikaCocok === "tinggi") return "Menyimpang";
  if (rule.hasilJikaCocok === "rendah") return "Sesuai";
  return "Perlu dicek";
}

/**
 * Tingkat kekuatan dasar rujukan, mis. "undang-undang dan surat edaran".
 * Aturan tanpa rujukan hukum resmi memakai "indikator umum".
 */
export function tingkatKekuatanDariRujukan(
  rujukanHukumIds: readonly string[],
): string {
  if (rujukanHukumIds.length === 0) return "indikator umum";

  const tingkat: string[] = [];
  for (const id of rujukanHukumIds) {
    const label = id.startsWith("uu-")
      ? "undang-undang"
      : id.startsWith("permenaker-")
        ? "peraturan menteri"
        : id.startsWith("se-") || id.startsWith("kep-")
          ? "surat edaran"
          : "indikator umum";
    if (!tingkat.includes(label)) tingkat.push(label);
  }
  return tingkat.join(" dan ");
}

/** Dasar rujukan yang tampil di kartu temuan. */
export function dasarDariRujukan(rujukanHukumIds: readonly string[]): string {
  if (rujukanHukumIds.length === 0) {
    return "Indikator umum risiko rekrutmen";
  }
  return rujukanHukumIds.map((id) => labelRujukan(id)).join("; ");
}

export const RINGKASAN_LEVEL: Readonly<Record<Level, string>> = {
  Tinggi: "Kombinasi indikator berisiko ditemukan.",
  "Perlu dicek": "Ada indikator yang perlu dikonfirmasi.",
  Rendah: "Tidak ditemukan indikator bermasalah.",
};

/**
 * Langkah selanjutnya per level (spesifikasi template, bagian 8).
 * Sengaja disimpan terpisah dari kartu "Langkah selanjutnya" di web karena
 * laporan memuat kalimat lengkap yang lebih panjang.
 */
export const LANGKAH_PER_LEVEL: Readonly<Record<Level, readonly string[]>> = {
  Tinggi: [
    "Jangan transfer uang dan jangan kirim KTP, ijazah, atau data rekening sebelum identitas perusahaan terverifikasi.",
    "Konfirmasi lewat kanal resmi perusahaan (situs atau nomor kantor yang Anda temukan sendiri, bukan dari iklan).",
    "Simpan tangkapan layar iklan dan percakapan sebagai bukti.",
    "Jika sudah terlanjur membayar atau mengirim data, laporkan ke kanal resmi dan hubungi bank Anda.",
  ],
  "Perlu dicek": [
    "Konfirmasi upah, jam kerja, dan identitas perusahaan lewat sumber resmi.",
    "Pastikan tidak ada biaya yang diminta dari pelamar.",
    "Tahan pengiriman dokumen sensitif sampai konfirmasi jelas.",
  ],
  Rendah: [
    "Tetap verifikasi kanal resmi perusahaan sebelum mengirim berkas.",
    "Jangan kirim dokumen sensitif di awal proses jika tidak diperlukan.",
  ],
};

export function contohPesanKonfirmasi(posisi?: string): string {
  const namaPosisi = posisi && posisi.trim().length > 0 ? posisi.trim() : "ini";
  return (
    `Halo, saya melihat lowongan posisi ${namaPosisi}. Boleh dikonfirmasi nama ` +
    "perusahaan lengkap, alamat kantor, besaran gaji, dan apakah ada biaya apa " +
    "pun dari pelamar? Terima kasih."
  );
}

const NAMA_BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

function pad(nilai: number): string {
  return String(nilai).padStart(2, "0");
}

/**
 * Zona waktu Indonesia mengikuti offset mesin pengguna; di luar WIB/WITA/WIT
 * label ditulis sebagai UTC±N agar tidak mengklaim zona yang keliru.
 */
function labelZona(sekarang: Date): string {
  const menit = -sekarang.getTimezoneOffset();
  if (menit === 420) return "WIB";
  if (menit === 480) return "WITA";
  if (menit === 540) return "WIT";
  const tanda = menit < 0 ? "-" : "+";
  const jam = Math.floor(Math.abs(menit) / 60);
  return `UTC${tanda}${jam}`;
}

/** Tanggal laporan, mis. "15 November 2026, 14.32 WIB" (waktu perangkat). */
export function formatTanggalLaporan(sekarang = new Date()): string {
  const tanggal = `${sekarang.getDate()} ${NAMA_BULAN[sekarang.getMonth()]} ${sekarang.getFullYear()}`;
  const jam = `${pad(sekarang.getHours())}.${pad(sekarang.getMinutes())}`;
  return `${tanggal}, ${jam} ${labelZona(sekarang)}`;
}

/** Stempel nama berkas, format YYYYMMDD-HHmm (waktu lokal perangkat). */
export function stempelWaktuLokal(sekarang = new Date()): string {
  return (
    `${sekarang.getFullYear()}${pad(sekarang.getMonth() + 1)}${pad(sekarang.getDate())}` +
    `-${pad(sekarang.getHours())}${pad(sekarang.getMinutes())}`
  );
}

/** Nama berkas unduhan: cekloker-laporan-YYYYMMDD-HHmm.pdf */
export function namaBerkasLaporan(sekarang = new Date()): string {
  return `cekloker-laporan-${stempelWaktuLokal(sekarang)}.pdf`;
}

/**
 * Nomor laporan dibuat di perangkat (tidak berasal dari server):
 * CL-YYYY-NNNN dengan NNNN acak per unduhan.
 */
export function nomorLaporan(
  sekarang = new Date(),
  acak: () => number = Math.random,
): string {
  const nomor = Math.floor(acak() * 10_000);
  return `CL-${sekarang.getFullYear()}-${String(nomor).padStart(4, "0")}`;
}

const POLA_KONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const POLA_TIDAK_TERDUKUNG =
  /[\u200b-\u200f\u2028\u2029\u202a-\u202e\ufe0e\ufe0f\ufffd]|[\u{1f000}-\u{1faff}]|[\u{2600}-\u{27bf}]/gu;

/**
 * Membersihkan teks sebelum digambar: buang karakter kontrol, arah teks
 * tersembunyi, dan emoji yang tidak ada di font Poppins. Spasi berlebih
 * dirapatkan agar pembungkusan baris tetap rapi.
 */
export function bersihkanTeks(teks: string): string {
  return teks
    .replace(POLA_KONTROL, "")
    .replace(POLA_TIDAK_TERDUKUNG, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Mengubah tanda kutip lurus menjadi tanda kutip tipografis. */
export function tipografikan(teks: string): string {
  let hasil = "";
  let buka = true;
  for (const huruf of teks) {
    if (huruf === '"') {
      hasil += buka ? "\u201c" : "\u201d";
      buka = !buka;
    } else if (huruf === "'") {
      hasil += "\u2019";
    } else {
      hasil += huruf;
    }
  }
  return hasil;
}

/** Teks siap gambar: bersih, tipografis, dan sudah dirapikan spasinya. */
function teksSiap(nilai: string | undefined): string | undefined {
  if (nilai === undefined) return undefined;
  const bersih = bersihkanTeks(nilai);
  return bersih.length > 0 ? tipografikan(bersih) : undefined;
}

export interface MetaLaporan {
  posisi?: string;
  lokasi?: string;
  sumber?: string;
  upah?: string;
}

export interface OpsiLaporan {
  /** Id sesi; dipakai sebagai cadangan bila nomor laporan kosong. */
  id: string;
  /** Opsi kutipan iklan; default mati. */
  sertakanKutipan?: boolean;
  meta?: MetaLaporan;
  sekarang?: Date;
  acak?: () => number;
}

/**
 * Menyusun data laporan dari hasil evaluasi.
 *
 * Level, skor, dan jumlah temuan dijamin sama dengan yang tampil di layar
 * karena semuanya disalin dari `hasil`. Kutipan hanya ikut bila opsi menyala.
 */
export function bangunLaporan(
  hasil: HasilEvaluasi,
  opsi: OpsiLaporan,
): LaporanLengkap {
  const sekarang = opsi.sekarang ?? new Date();
  const sertakanKutipan = opsi.sertakanKutipan === true;

  const temuan: TemuanLaporan[] = hasil.temuan.map((butir) => {
    const rule = PETA_RULE.get(butir.ruleId);
    const rujukan = rule?.rujukanHukumIds ?? [];
    const kutipan = sertakanKutipan
      ? teksSiap(butir.bukti.join(" \u00b7 "))
      : undefined;

    return {
      judul: teksSiap(butir.judul) ?? butir.judul,
      status: statusDariRuleId(butir.ruleId),
      ...(kutipan ? { kutipan: `\u201c${kutipan}\u201d` } : {}),
      dasar: teksSiap(dasarDariRujukan(rujukan)) ?? dasarDariRujukan(rujukan),
      tingkatKekuatan: tingkatKekuatanDariRujukan(rujukan),
    };
  });

  const level = levelDariBand(hasil.band);
  const posisi = teksSiap(opsi.meta?.posisi);

  return {
    nomor: nomorLaporan(sekarang, opsi.acak),
    tanggalIso: sekarang.toISOString(),
    ...(posisi ? { posisi } : {}),
    ...(teksSiap(opsi.meta?.lokasi)
      ? { lokasi: teksSiap(opsi.meta?.lokasi) }
      : {}),
    ...(teksSiap(opsi.meta?.sumber)
      ? { sumber: teksSiap(opsi.meta?.sumber) }
      : {}),
    ...(teksSiap(opsi.meta?.upah) ? { upah: teksSiap(opsi.meta?.upah) } : {}),
    skor: hasil.skor,
    level,
    temuan,
    sertakanKutipan,
    band: hasil.band,
    ringkasan: teksSiap(hasil.ringkasan) ?? hasil.ringkasan,
    ringkasanLevel: RINGKASAN_LEVEL[level],
    langkah: LANGKAH_PER_LEVEL[level],
    contohPesan: contohPesanKonfirmasi(posisi),
    jumlah: {
      total: hasil.temuan.length,
      menyimpang: temuan.filter((butir) => butir.status === "Menyimpang")
        .length,
      perluDicek: temuan.filter((butir) => butir.status === "Perlu dicek")
        .length,
      sesuai: temuan.filter((butir) => butir.status === "Sesuai").length,
    },
    versiMesin: hasil.versi,
  };
}

export interface OpsiTataLetak {
  /** Lebar area konten dalam pt. */
  lebarKonten: number;
  /** Pengukur lebar teks; jsPDF memakai getTextWidth, tes memakai fungsi tetap. */
  ukurTeks: (teks: string, ukuran: number, gaya: GayaTeks) => number;
}

/**
 * Membungkus teks menjadi baris-baris yang muat dalam lebar maksimum.
 * Kata yang lebih panjang dari satu baris dipotong paksa agar tidak keluar
 * dari kartu.
 */
export function bungkusTeks(
  teks: string,
  ukuran: number,
  lebarMaks: number,
  opsi: OpsiTataLetak,
  gaya: GayaTeks = "regular",
): string[] {
  const kata = bersihkanTeks(teks)
    .split(" ")
    .filter((k) => k.length > 0);
  if (kata.length === 0) return [];

  const baris: string[] = [];
  let sekarang = "";

  for (const bagian of kata) {
    const calon = sekarang.length === 0 ? bagian : `${sekarang} ${bagian}`;
    if (opsi.ukurTeks(calon, ukuran, gaya) <= lebarMaks) {
      sekarang = calon;
      continue;
    }

    if (sekarang.length > 0) baris.push(sekarang);
    sekarang = "";

    // Kata tunggal yang lebih lebar dari area: potong per karakter.
    if (opsi.ukurTeks(bagian, ukuran, gaya) > lebarMaks) {
      let potongan = "";
      for (const huruf of bagian) {
        if (
          opsi.ukurTeks(potongan + huruf, ukuran, gaya) > lebarMaks &&
          potongan.length > 0
        ) {
          baris.push(potongan);
          potongan = huruf;
        } else {
          potongan += huruf;
        }
      }
      sekarang = potongan;
    } else {
      sekarang = bagian;
    }
  }

  if (sekarang.length > 0) baris.push(sekarang);
  return baris;
}

/**
 * Membagi tinggi elemen menjadi halaman tanpa pernah memotong satu elemen.
 *
 * Tinggi tiap elemen sudah termasuk jarak antar elemen (dihitung pemanggil).
 * Elemen yang lebih tinggi dari satu halaman tetap diletakkan sendiri pada
 * halamannya, tidak dipotong.
 */
export function bagiHalaman(
  tinggiElemen: readonly number[],
  tinggiTersedia: number,
): number[][] {
  const halaman: number[][] = [];
  let sekarang: number[] = [];
  let terpakai = 0;

  for (let indeks = 0; indeks < tinggiElemen.length; indeks += 1) {
    const tinggi = tinggiElemen[indeks];

    if (sekarang.length > 0 && terpakai + tinggi > tinggiTersedia) {
      halaman.push(sekarang);
      sekarang = [];
      terpakai = 0;
    }

    sekarang.push(indeks);
    terpakai += tinggi;
  }

  if (sekarang.length > 0) halaman.push(sekarang);
  return halaman;
}
