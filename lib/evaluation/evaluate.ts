/**
 * Titik masuk mesin evaluasi lowongan.
 *
 * Alur: validasi input -> normalisasi -> deteksi aturan -> skor -> rentang.
 * Seluruh proses deterministik dan tidak menyimpan teks lowongan.
 */

import { z } from "zod";

import { extractSalaries, normalizeText } from "./normalize";
import { matchProvinsi } from "./provinces";
import { DETEKTOR, RULES } from "./rules";
import { bandDariSkor, bandTerburuk, hitungSkor } from "./score";
import {
  KEKUATAN_NILAI,
  type Band,
  type HasilEvaluasi,
  type KonteksDeteksi,
  type RegionalWage,
  type Rule,
  type Temuan,
} from "./types";
import { getUpahMinimum } from "./wages";

export const EVALUATOR_VERSION = "1.0.0";

export const skemaInputEvaluasi = z.object(
  {
    teksLowongan: z
      .string("Teks lowongan wajib diisi.")
      .trim()
      .min(30, "Teks lowongan minimal 30 karakter."),
    lokasi: z
      .string("Lokasi harus berupa teks.")
      .trim()
      .max(200, "Lokasi maksimal 200 karakter.")
      .optional(),
    perusahaan: z
      .string("Nama perusahaan harus berupa teks.")
      .trim()
      .max(200, "Nama perusahaan maksimal 200 karakter.")
      .optional(),
  },
  { error: "Body permintaan harus berupa objek JSON." },
);

export type InputEvaluasi = z.infer<typeof skemaInputEvaluasi>;

export interface OpsiEvaluasi {
  /** Sumber data upah minimum; dapat diganti pada pengujian. */
  dataUpah?: readonly RegionalWage[];
}

export const LABEL_BAND: Record<Band, string> = {
  rendah: "Rendah",
  perlu_dicek: "Perlu dicek",
  tinggi: "Tinggi",
};

/** Saran tindakan per aturan; satu saran per aturan yang menyala. */
export const SARAN_PER_RULE: Record<string, string> = {
  upah_dibawah_umr:
    "Konfirmasi nominal upah secara tertulis dan bandingkan dengan upah minimum provinsi di sumber resmi.",
  waktu_kerja_berlebih:
    "Tanyakan pola jam kerja dan hak istirahat mingguan sebelum menyetujui jadwal.",
  pungutan_biaya:
    "Jangan membayar biaya apa pun; rekrutmen resmi tidak memungut biaya dari pelamar.",
  penempatan_luar_negeri_nonresmi:
    "Pastikan penempatan melalui P3MI berizin dan periksa kontrak kerja di kanal resmi.",
  gaji_tidak_wajar_tinggi:
    "Minta rincian komponen gaji dan target yang menyertainya secara tertulis.",
  kontak_whatsapp_saja:
    "Cari kanal resmi perusahaan dan hubungi nomor yang tertera di situs atau media resminya.",
  email_gratis:
    "Verifikasi domain email perusahaan melalui situs resmi atau akun media sosial terverifikasi.",
  tanpa_nama_perusahaan:
    "Minta nama badan usaha lengkap dan alamat kantor sebelum melanjutkan.",
  minta_dokumen_sensitif_dini:
    "Jangan mengirim data rekening atau dokumen pribadi sebelum ada kontrak dan proses seleksi yang jelas.",
  diterima_tanpa_seleksi:
    "Tanyakan tahapan seleksi resmi dan jangan menyerahkan berkas sebelum prosesnya jelas.",
  tekanan_mendesak:
    "Abaikan tekanan waktu dan ambil keputusan setelah memverifikasi perusahaan.",
  diskriminasi_gender_usia:
    "Tanyakan dasar syarat tersebut dan laporkan bila tidak berkaitan dengan kompetensi.",
  skema_komisi_berantai:
    "Minta penjelasan tertulis sumber penghasilan utama dan hindari skema yang bergantung pada anggota baru.",
  upah_tidak_diungkap:
    "Minta kisaran upah dan komponen tunjangan secara tertulis sebelum melamar.",
  lokasi_tidak_jelas:
    "Pastikan lokasi kerja atau cakupan kerja jarak jauh secara tertulis.",
  lembur_tanpa_batas:
    "Tanyakan ketentuan lembur dan upah lembur sesuai aturan yang berlaku.",
  rekrut_via_dm_samar:
    "Pindahkan komunikasi ke kanal resmi perusahaan dan hindari transaksi lewat pesan pribadi.",
};

const PETA_RULE: ReadonlyMap<string, Rule> = new Map(
  RULES.map((rule) => [rule.id, rule]),
);

function bandAkhir(skor: number, temuan: readonly Temuan[]): Band {
  let band = bandDariSkor(skor);

  for (const butir of temuan) {
    const rule = PETA_RULE.get(butir.ruleId);
    if (rule?.hasilJikaCocok) {
      band = bandTerburuk(band, rule.hasilJikaCocok);
    }
  }

  return band;
}

function susunSaran(temuan: readonly Temuan[]): string[] {
  const saran: string[] = [];

  for (const butir of temuan) {
    const teks = SARAN_PER_RULE[butir.ruleId];
    if (teks && !saran.includes(teks)) saran.push(teks);
  }

  if (saran.length === 0) {
    saran.push(
      "Tetap verifikasi lowongan melalui kanal resmi perusahaan sebelum melamar.",
    );
  }

  return saran;
}

function susunRingkasan(jumlahTemuan: number, band: Band): string {
  if (jumlahTemuan === 0) {
    return "Tidak ditemukan indikator bermasalah pada teks lowongan. Tetap verifikasi ke sumber resmi.";
  }

  return `${jumlahTemuan} indikator ditemukan. Rentang risiko: ${LABEL_BAND[band]}.`;
}

/**
 * Menilai satu teks lowongan.
 *
 * Mengembalikan rentang risiko, skor, temuan, saran, dan ringkasan.
 * Tidak pernah memuat vonis atau menyimpan teks masukan.
 */
export function evaluasiLowongan(
  input: InputEvaluasi,
  opsi: OpsiEvaluasi = {},
): HasilEvaluasi {
  const teksMentah = input.teksLowongan;
  const teks = normalizeText(teksMentah);
  const lokasi =
    input.lokasi && input.lokasi.length > 0 ? input.lokasi : undefined;
  const perusahaan =
    input.perusahaan && input.perusahaan.length > 0
      ? input.perusahaan
      : undefined;

  const provinsiFromLokasi = matchProvinsi(lokasi);
  const provinsi = provinsiFromLokasi ?? matchProvinsi(teksMentah);
  const upahMinimum = getUpahMinimum(provinsi, opsi.dataUpah);

  const gaji = extractSalaries(teks)[0] ?? null;
  const konteks: KonteksDeteksi = {
    teks,
    teksMentah,
    provinsi,
    gajiBulanan: gaji,
    upahMinimum,
    ...(lokasi ? { lokasi } : {}),
    ...(perusahaan ? { perusahaan } : {}),
  };

  const temuan: Temuan[] = [];

  for (const detektor of DETEKTOR) {
    const rule = PETA_RULE.get(detektor.ruleId);
    if (!rule) continue;

    const bukti = detektor.deteksi(konteks);
    if (bukti.length === 0) continue;

    const faktor = KEKUATAN_NILAI[rule.kekuatan];
    temuan.push({
      ruleId: rule.id,
      judul: rule.judul,
      kategori: rule.kategori,
      kekuatan: rule.kekuatan,
      faktor,
      kontribusi: Math.round(rule.bobot * faktor * 100) / 100,
      bukti: [...new Set(bukti)],
      penjelasan: rule.deskripsi,
    });
  }

  temuan.sort((kiri, kanan) => {
    if (kiri.kontribusi !== kanan.kontribusi) {
      return kanan.kontribusi - kiri.kontribusi;
    }
    return kiri.ruleId < kanan.ruleId ? -1 : kiri.ruleId > kanan.ruleId ? 1 : 0;
  });

  const skor = hitungSkor(temuan);
  const band = bandAkhir(skor, temuan);

  return {
    band,
    skor,
    temuan,
    saran: susunSaran(temuan),
    ringkasan: susunRingkasan(temuan.length, band),
    versi: EVALUATOR_VERSION,
  };
}
