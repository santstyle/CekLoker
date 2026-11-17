/**
 * Contoh laporan risiko untuk hero beranda.
 *
 * Isi kartu tidak ditulis tangan: seluruh nilai evaluasi (band, skor, temuan,
 * ringkasan) diturunkan langsung dari `evaluasiLowongan` atas kasus acuan
 * sintetis. Dengan begitu kartu di beranda tidak mungkin melenceng dari hasil
 * yang benar-benar dihasilkan mesin.
 *
 * Hanya metadata tampilan (posisi, sumber, upah) yang ditulis terpisah, karena
 * informasi itu memang tidak dibaca mesin dari teks iklan.
 */

import { evaluasiLowongan } from "./evaluation/evaluate";
import { KASUS_ACUAN } from "./evaluation/kasus-acuan";
import type { HasilEvaluasi } from "./evaluation/types";

/** Jumlah judul temuan yang ditampilkan langsung di kartu. */
export const BATAS_TEMUAN_TAMPIL = 3;

export type ContohLaporan = {
  id: string;
  /** Nomor urut tampilan, mis. "001". */
  nomor: string;
  posisi: string;
  lokasi: string;
  sumber: string;
  upah: string;
  hasil: HasilEvaluasi;
  /** Judul temuan teratas, maksimal `BATAS_TEMUAN_TAMPIL`. */
  temuanTampil: string[];
  /** Jumlah temuan yang tidak ditampilkan karena melebihi batas. */
  sisaTemuan: number;
};

type MetadataContoh = {
  id: string;
  posisi: string;
  sumber: string;
  upah: string;
};

const METADATA_CONTOH: readonly MetadataContoh[] = [
  {
    id: "c1_software_engineer",
    posisi: "Software Engineer",
    sumber: "Email perusahaan",
    upah: "Rp 8.000.000 / bulan",
  },
  {
    id: "d3_spg_dm_instagram",
    posisi: "SPG (Sales Promotion Girl)",
    sumber: "DM Instagram",
    upah: "Tidak dicantumkan",
  },
  {
    id: "t1_biaya_administrasi",
    posisi: "Staff Administrasi",
    sumber: "Iklan teks",
    upah: "Tidak dicantumkan",
  },
];

function ambilKasus(id: string) {
  const kasus = KASUS_ACUAN.find((butir) => butir.id === id);
  if (!kasus) {
    throw new Error(
      `Kasus acuan "${id}" tidak ditemukan. Periksa kembali METADATA_CONTOH.`,
    );
  }
  return kasus;
}

/**
 * Tiga contoh laporan: satu band rendah, satu perlu dicek, satu tinggi.
 * Urutannya sengaja tidak menaik agar kartu pertama tidak selalu yang paling
 * menakutkan.
 */
export const CONTOH_LAPORAN: readonly ContohLaporan[] = METADATA_CONTOH.map(
  (meta, indeks) => {
    const kasus = ambilKasus(meta.id);
    const hasil = evaluasiLowongan({
      teksLowongan: kasus.teks,
      ...(kasus.lokasi ? { lokasi: kasus.lokasi } : {}),
    });
    const temuanTampil = hasil.temuan
      .slice(0, BATAS_TEMUAN_TAMPIL)
      .map((temuan) => temuan.judul);

    return {
      id: meta.id,
      nomor: String(indeks + 1).padStart(3, "0"),
      posisi: meta.posisi,
      lokasi: kasus.lokasi ?? "Tidak dicantumkan",
      sumber: meta.sumber,
      upah: meta.upah,
      hasil,
      temuanTampil,
      sisaTemuan: Math.max(hasil.temuan.length - temuanTampil.length, 0),
    };
  },
);
