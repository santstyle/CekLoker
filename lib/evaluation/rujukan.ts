/**
 * Label manusiawi untuk id rujukan hukum yang dipakai aturan evaluasi.
 *
 * Halaman publik tidak boleh menampilkan id mentah. Setiap id yang dipakai
 * RULES wajib terdaftar di sini; id tak dikenal dikembalikan apa adanya
 * sebagai jaring pengaman agar tampilan tidak pernah kosong.
 */

export const LABEL_RUJUKAN: Readonly<Record<string, string>> = {
  "uu-13-2003-pasal-5": "UU No. 13/2003 Pasal 5",
  "uu-13-2003-pasal-6": "UU No. 13/2003 Pasal 6",
  "uu-13-2003-pasal-38": "UU No. 13/2003 Pasal 38",
  "uu-13-2003-pasal-77": "UU No. 13/2003 Pasal 77",
  "uu-13-2003-pasal-78": "UU No. 13/2003 Pasal 78",
  "uu-13-2003-pasal-89": "UU No. 13/2003 Pasal 89",
  "permenaker-39-2016": "Permenaker No. 39/2016",
  "uu-27-2022": "UU No. 27/2022",
  "uu-18-2017": "UU No. 18/2017",
};

/** Status verifikasi sebuah rujukan hukum di dalam aplikasi. */
export interface VerifikasiRujukan {
  /** Tanggal pemeriksaan terakhir terhadap teks resmi, format ISO YYYY-MM-DD; null bila belum pernah. */
  tanggalVerifikasi: string | null;
  /** true selama teks pasal/regulasi belum diperiksa terhadap sumber resmi. */
  perluVerifikasi: boolean;
  /** Apa yang harus diperiksa sebelum menandai terverifikasi. */
  catatan: string;
}

/**
 * Status verifikasi tiap rujukan hukum yang dipakai RULES.
 *
 * PENTING — belum satu pun sumber di bawah ini diverifikasi ulang oleh
 * pemilik CekLoker terhadap teks resmi terbaru. Itu termasuk Permenaker
 * 39/2016 (yang relevansinya untuk aturan pungutan_biaya sangat diragukan),
 * UU 13/2003 Pasal 77 (waktu kerja) dan Pasal 89 (upah minimum), serta
 * sisanya. Semua pasal UU 13/2003 juga telah berubah oleh UU Cipta Kerja
 * (UU 11/2020, kemudian UU 6/2023) sehingga bunyinya bisa berbeda dari saat
 * rujukan ini pertama kali ditulis.
 *
 * Antarmuka wajib menampilkan "Belum diverifikasi" selama perluVerifikasi
 * masih true. Menandai terverifikasi: isi `tanggalVerifikasi` DAN set
 * `perluVerifikasi: false` pada entri yang sama, dalam satu suntingan, hanya
 * setelah bunyi pasal dibuka dan diperiksa dari sumber resmi. Lihat
 * docs/verifikasi-hukum.md.
 */
const CATATAN_PERUBAHAN_CiptaKerja =
  "Periksa bunyi terkini setelah perubahan oleh UU 11/2020 jo. UU 6/2023.";

export const VERIFIKASI_RUJUKAN: Readonly<Record<string, VerifikasiRujukan>> = {
  "uu-13-2003-pasal-5": {
    tanggalVerifikasi: null,
    perluVerifikasi: true,
    catatan: `Dipakai aturan diskriminasi_gender_usia. ${CATATAN_PERUBAHAN_CiptaKerja}`,
  },
  "uu-13-2003-pasal-6": {
    tanggalVerifikasi: null,
    perluVerifikasi: true,
    catatan: `Dipakai aturan diskriminasi_gender_usia. ${CATATAN_PERUBAHAN_CiptaKerja}`,
  },
  "uu-13-2003-pasal-38": {
    tanggalVerifikasi: null,
    perluVerifikasi: true,
    catatan: `Dipakai aturan pungutan_biaya. ${CATATAN_PERUBAHAN_CiptaKerja}`,
  },
  "uu-13-2003-pasal-77": {
    tanggalVerifikasi: null,
    perluVerifikasi: true,
    catatan: `Dipakai aturan waktu_kerja_berlebih. ${CATATAN_PERUBAHAN_CiptaKerja}`,
  },
  "uu-13-2003-pasal-78": {
    tanggalVerifikasi: null,
    perluVerifikasi: true,
    catatan: `Dipakai aturan lembur_tanpa_batas. ${CATATAN_PERUBAHAN_CiptaKerja}`,
  },
  "uu-13-2003-pasal-89": {
    tanggalVerifikasi: null,
    perluVerifikasi: true,
    catatan: `Dipakai aturan upah_dibawah_umr. ${CATATAN_PERUBAHAN_CiptaKerja}`,
  },
  "permenaker-39-2016": {
    tanggalVerifikasi: null,
    perluVerifikasi: true,
    catatan:
      "Dipakai aturan pungutan_biaya. Relevansi Permenaker 39/2016 (Persyaratan dan Tatacara PKWT) terhadap larangan pungutan biaya sama sekali belum diperiksa — kandidat utama untuk diganti atau dihapus.",
  },
  "uu-27-2022": {
    tanggalVerifikasi: null,
    perluVerifikasi: true,
    catatan:
      "Dipakai aturan minta_dokumen_sensitif_dini. UU 27/2022 = Pelindungan Data Pribadi; relevansinya terhadap indikator permintaan dokumen lebih awal di proses seleksi perlu diperiksa (PDP mengatur pemrosesan data pribadi, bukan 'larangan memungut dokumen').",
  },
  "uu-18-2017": {
    tanggalVerifikasi: null,
    perluVerifikasi: true,
    catatan:
      "Dipakai aturan penempatan_luar_negeri_nonresmi. UU 18/2017 = Pelindungan Pekerja Migran Indonesia; periksa bunyi terkini dan kaitan pasal-pasalnya dengan indikator perekrutan luar negeri nonresmi.",
  },
};

/**
 * Status verifikasi sebuah id rujukan.
 *
 * Id yang tidak dikenal diperlakukan sebagai belum terverifikasi —
 * tak pernah sebagai terverifikasi.
 */
export function verifikasiRujukan(id: string): VerifikasiRujukan {
  return (
    VERIFIKASI_RUJUKAN[id] ?? {
      tanggalVerifikasi: null,
      perluVerifikasi: true,
      catatan:
        "Id rujukan tidak terdaftar; status tidak boleh dianggap terverifikasi.",
    }
  );
}

/** Label status verifikasi untuk antarmuka. */
export function labelVerifikasiRujukan(id: string): string {
  const verifikasi = verifikasiRujukan(id);
  if (verifikasi.perluVerifikasi) return "Belum diverifikasi";
  return verifikasi.tanggalVerifikasi
    ? `Terakhir diverifikasi: ${verifikasi.tanggalVerifikasi}`
    : "Belum diverifikasi";
}

/**
 * Peta URL resmi untuk setiap rujukan hukum.
 * Sumber: peraturan.go.id, JDIH Kemenaker, dan situs resmi terkait.
 * Dipisah dari LABEL_RUJUKAN agar komponen yang hanya butuh label (seperti
 * gambar-og.tsx) tidak terdampak perubahan URL.
 */
export const URL_RUJUKAN: Readonly<Record<string, string>> = {
  "uu-13-2003-pasal-5": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "uu-13-2003-pasal-6": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "uu-13-2003-pasal-38": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "uu-13-2003-pasal-77": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "uu-13-2003-pasal-78": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "uu-13-2003-pasal-89": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "permenaker-39-2016":
    "https://jdih.kemnaker.go.id/peraturan/permenaker-no-39-tahun-2016",
  "uu-27-2022": "https://peraturan.go.id/uu/nomor-27-tahun-2022.html",
  "uu-18-2017": "https://peraturan.go.id/uu/nomor-18-tahun-2017.html",
};

/**
 * Mengambil URL resmi untuk id rujukan.
 * Mengembalikan undefined jika id tidak dikenal agar pemanggil bisa
 * memutuskan fallback (mis. link ke peraturan.go.id pencarian).
 */
export function urlRujukan(id: string): string | undefined {
  return URL_RUJUKAN[id];
}

export function labelRujukan(id: string): string {
  return LABEL_RUJUKAN[id] ?? id;
}
