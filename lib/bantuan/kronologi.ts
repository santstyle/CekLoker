/**
 * Penyusun kronologi untuk halaman /bantuan (korban penipuan lowongan).
 *
 * Modul ini murni (pure): tidak menyentuh DOM, sessionStorage, maupun
 * jaringan, agar logika pembuatan teks kronologi dapat diuji unit.
 *
 * Semua data hanya ada di peramban pengguna; tidak ada request keluar.
 */

export interface LangkahKronologi {
  /** Tanggal ISO (YYYY-MM-DD), boleh kosong. */
  tanggal: string;
  /** Deskripsi langkah kejadian. */
  deskripsi: string;
}

export interface DataKronologi {
  /** Tanggal kejadian pertama. */
  tanggalKejadian: string;
  /** Platform/sumber iklan (mis. "Instagram", "Jobstreet"). */
  platform: string;
  /** Pihak yang mengaku sebagai perusahaan. */
  pihak: string;
  /** Kontak pelaku (telepon/email/akun), boleh kosong. */
  kontak: string;
  /** Nomor rekening tujuan, opsional. */
  rekening: string;
  /** Nominal kerugian (teks bebas, mis. "Rp2.000.000"), opsional. */
  nominal: string;
  /** Urutan langkah beranggal. */
  langkah: readonly LangkahKronologi[];
  /** Bukti yang dimiliki pengguna. */
  bukti: readonly string[];
  /** Ringkasan hasil pemeriksaan sebelumnya, bila dilampirkan. */
  ringkasanHasil?: HasilRingkas | null;
}

export interface HasilRingkas {
  skor: number;
  band: string;
  labelBand: string;
  temuan: readonly string[];
}

/**
 * Membuat kronologi teks rapi. Baris yang kosong/ruang kosong dihilangkan;
 * langkah tanpa deskripsi diabaikan. Tidak pernah memuat markup.
 */
export function bangunKronologi(data: DataKronologi): string {
  const baris: string[] = [];
  const kosong = (teks: string) => teks.trim().length === 0;

  baris.push("KRONOLOGI KEJADIAN");
  baris.push("");

  if (!kosong(data.tanggalKejadian)) {
    baris.push(`Tanggal kejadian : ${data.tanggalKejadian.trim()}`);
  }
  if (!kosong(data.platform)) {
    baris.push(`Platform / sumber iklan : ${data.platform.trim()}`);
  }
  if (!kosong(data.pihak)) {
    baris.push(`Pihak yang mengaku perusahaan : ${data.pihak.trim()}`);
  }
  if (!kosong(data.kontak)) {
    baris.push(`Kontak pelaku : ${data.kontak.trim()}`);
  }
  if (!kosong(data.rekening)) {
    baris.push(`Nomor rekening tujuan : ${data.rekening.trim()}`);
  }
  if (!kosong(data.nominal)) {
    baris.push(`Nominal kerugian : ${data.nominal.trim()}`);
  }

  const langkahIsi = data.langkah.filter(
    (langkah) => !kosong(langkah.deskripsi),
  );
  if (langkahIsi.length > 0) {
    baris.push("");
    baris.push("URUTAN KEJADIAN");
    for (const langkah of langkahIsi) {
      const tanggal = kosong(langkah.tanggal)
        ? ""
        : `[${langkah.tanggal.trim()}] `;
      baris.push(`- ${tanggal}${langkah.deskripsi.trim()}`);
    }
  }

  if (data.bukti.length > 0) {
    baris.push("");
    baris.push("BUKTI YANG DIMILIKI");
    for (const b of data.bukti) {
      if (!kosong(b)) baris.push(`- ${b.trim()}`);
    }
  }

  if (data.ringkasanHasil && !kosong(data.ringkasanHasil.temuan.join(","))) {
    baris.push("");
    baris.push("LAMPIRAN: RINGKASAN HASIL PEMERIKSAAN SEBELUMNYA");
    baris.push(`Skor : ${data.ringkasanHasil.skor}`);
    baris.push(`Rentang risiko : ${data.ringkasanHasil.labelBand}`);
    for (const t of data.ringkasanHasil.temuan) {
      if (!kosong(t)) baris.push(`- ${t.trim()}`);
    }
  }

  return baris.join("\n");
}

/** Nama berkas untuk unduhan kronologi (.txt). */
export function namaBerkasKronologi(sekarang: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const tgl = `${sekarang.getFullYear()}${pad(sekarang.getMonth() + 1)}${pad(
    sekarang.getDate(),
  )}`;
  const jam = `${pad(sekarang.getHours())}${pad(sekarang.getMinutes())}`;
  return `kronologi-cekloker-${tgl}-${jam}.txt`;
}

/** Bukti yang biasa dimiliki korban, dipakai untuk opsi centang. */
export const PILIHAN_BUKTI: readonly string[] = [
  "Tangkapan layar iklan",
  "Tangkapan layar percakapan",
  "Bukti transfer",
  "Bukti rekening pelaku",
  "Kontak pelaku (telepon/email/akun)",
  "Data diri yang sudah terkirim",
];
