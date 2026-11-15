/**
 * Kuis edukasi hak kerja & pola lowongan berisiko.
 *
 * Modul ini murni: tidak menyentuh DOM, penyimpanan, maupun jaringan.
 * Hasil kuis tidak pernah meninggalkan peramban dan tidak diberi label
 * "penipuan" atau "asli" — kuis hanya mengukur pemahaman pelamar, dan
 * nilai yang kembali adalah untuk refleksi diri.
 *
 * Seluruh rujukan hukum yang dipakai di sini juga tercantum di halaman
 * /edukasi; jangan menambahkan pasal atau nomor undang-undang baru yang
 * tidak dapat diverifikasi dari sumber resmi.
 */

export type KategoriKuis = "sangat_baik" | "cukup_baik" | "perlu_dipelajari";

export interface PertanyaanKuis {
  id: string;
  pertanyaan: string;
  pilihan: readonly string[];
  /** Indeks `jawaban` pada array `pilihan`. */
  jawaban: number;
  penjelasan: string;
  /** Rujukan hukum bila ada; dikutip apa adanya dari halaman /edukasi. */
  rujukan?: string;
}

export const KUIS_PERTANYAAN: readonly PertanyaanKuis[] = [
  {
    id: "biaya-rekrutmen",
    pertanyaan:
      "Sebuah iklan meminta Anda membayar biaya administrasi seragam sebelum diterima bekerja. Apa yang paling tepat?",
    pilihan: [
      "Membayar karena proses seperti itu umum terjadi",
      "Menolak — pungutan biaya penempatan kepada tenaga kerja dilarang",
      "Membayar asalkan ada kuitansi resmi",
      "Menunda pembayaran hingga hari pertama kerja",
    ],
    jawaban: 1,
    penjelasan:
      "Rekrutmen resmi tidak pernah memungut biaya dari pelamar. Pungutan biaya penempatan kepada tenaga kerja dilarang oleh Pasal 38 ayat (1) UU No. 13/2003.",
    rujukan: "Pasal 38 ayat (1) UU No. 13/2003",
  },
  {
    id: "jam-kerja",
    pertanyaan:
      "Berapa batas jam kerja normal per minggu menurut PP No. 35/2021?",
    pilihan: [
      "36 jam per minggu",
      "40 jam per minggu",
      "48 jam per minggu",
      "60 jam per minggu",
    ],
    jawaban: 1,
    penjelasan:
      "Batas standar adalah 40 jam per minggu (7 jam/hari untuk 6 hari kerja, atau 8 jam/hari untuk 5 hari kerja). Kerja lembur wajib dibayar.",
    rujukan: "PP No. 35/2021",
  },
  {
    id: "penempatan-luar-negeri",
    pertanyaan:
      "Penempatan tenaga kerja ke luar negeri yang sah wajib dilakukan melalui…",
    pilihan: [
      "Agen perantara mana pun yang menjanjikan proses cepat",
      "Rekomendasi pribadi dari sesama pelamar",
      "Perusahaan Penempatan Pekerja Migran Indonesia (P3MI) berizin resmi",
      "Pembayaran deposit di muka kepada penampung berkas",
    ],
    jawaban: 2,
    penjelasan:
      "Penempatan ke luar negeri wajib melalui P3MI berizin resmi sesuai UU No. 18/2017 tentang PPMI.",
    rujukan: "UU No. 18/2017 PPMI",
  },
  {
    id: "gaji-tidak-masuk-akal",
    pertanyaan:
      "Iklan menawarkan gaji fantastis untuk kualifikasi ringan tanpa wawancara formal. Langkah paling tepat adalah…",
    pilihan: [
      "Segera mendaftar agar keburu diambil pelamar lain",
      "Meminta surat penawaran kerja (Offering Letter) resmi dan klarifikasi proses seleksi",
      "Mentransfer biaya administrasi agar penawaran dipercepat",
      "Mengirim seluruh berkas sensitif segera",
    ],
    jawaban: 1,
    penjelasan:
      "Iming-iming gaji fantastis untuk kualifikasi ringan tanpa seleksi patut diwaspadai. Minta Offering Letter resmi yang merinci gaji pokok dan struktur tunjangan.",
  },
  {
    id: "berkas-sensitif",
    pertanyaan:
      "Kapan waktu yang wajar mengirim berkas sensitif seperti fotokopi KTP atau buku tabungan?",
    pilihan: [
      "Saat pendaftaran awal agar dianggap serius",
      "Setelah ada surat penawaran kerja (Offering Letter) resmi",
      "Bila diminta lewat pesan instan pribadi",
      "Sebelum proses seleksi agar lebih cepat diproses",
    ],
    jawaban: 1,
    penjelasan:
      "Tunda pengiriman data sensitif hingga ada Offering Letter resmi; permintaan berkas sensitif terlalu dini adalah pola risiko.",
  },
  {
    id: "kontak-pribadi-deposit",
    pertanyaan:
      "HRD hanya menghubungi Anda lewat nomor telepon pribadi dan meminta transfer deposit. Sikap terbaik adalah…",
    pilihan: [
      "Mentransfer deposit agar posisi tetap terjaga",
      "Memverifikasi legalitas badan usaha lewat AHU Kemenkumham dan menolak transfer",
      "Mengganti nomor telepon agar lebih sulit dihubungi",
      "Langsung menerima tawaran karena prosesnya cepat",
    ],
    jawaban: 1,
    penjelasan:
      "Rekrutmen resmi memakai kontak terverifikasi dan tidak meminta transfer apa pun. Verifikasi legalitas badan usaha lewat AHU Kemenkumham dan jangan pernah mentransfer uang.",
  },
  {
    id: "upah-minimum",
    pertanyaan:
      "Apakah pemberi kerja boleh membayar upah di bawah Upah Minimum Provinsi/Kota?",
    pilihan: [
      "Boleh, bila pelamar menyetujui",
      "Boleh, bila perusahaan sedang sulit",
      "Tidak, upah tidak boleh lebih rendah dari upah minimum",
      "Hanya boleh bagi pekerja harian",
    ],
    jawaban: 2,
    penjelasan:
      "Pemberi kerja dilarang membayar upah lebih rendah dari ketetapan upah minimum provinsi/kota tempat pekerja ditempatkan.",
    rujukan: "UU No. 6/2023 Cipta Kerja",
  },
];

export interface HasilKuis {
  benar: number;
  salah: number;
  /** Belum dijawab atau indeks pilihan di luar jangkauan. */
  kosong: number;
  skorPersen: number;
  kategori: KategoriKuis;
}

export const KATEGORI_KUIS: Record<KategoriKuis, string> = {
  sangat_baik: "Sangat Baik",
  cukup_baik: "Cukup Baik",
  perlu_dipelajari: "Perlu Dipelajari Lagi",
};

/**
 * Menilai jawaban kuis. `jawaban[i]` adalah indeks pilihan untuk soal ke-i;
 * nilai `undefined`, non-integer, atau di luar jangkauan dihitung sebagai
 * kosong — bukan salah — supaya hasil refleksi diri tetap jujur.
 */
export function nilaiKuis(jawaban: readonly (number | undefined)[]): HasilKuis {
  let benar = 0;
  let salah = 0;
  let kosong = 0;

  KUIS_PERTANYAAN.forEach((soal, indeks) => {
    const dipilih = jawaban[indeks];
    const valid =
      typeof dipilih === "number" &&
      Number.isInteger(dipilih) &&
      dipilih >= 0 &&
      dipilih < soal.pilihan.length;

    if (!valid) {
      kosong += 1;
      return;
    }
    if (dipilih === soal.jawaban) {
      benar += 1;
    } else {
      salah += 1;
    }
  });

  const skorPersen = Math.round((benar / KUIS_PERTANYAAN.length) * 100);
  const kategori: KategoriKuis =
    skorPersen === 100
      ? "sangat_baik"
      : skorPersen >= 50
        ? "cukup_baik"
        : "perlu_dipelajari";

  return { benar, salah, kosong, skorPersen, kategori };
}
