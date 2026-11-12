/**
 * Definisi 17 aturan pemeriksaan beserta detektornya.
 *
 * Semua fungsi deteksi murni: membaca KonteksDeteksi, mengembalikan daftar
 * bukti pendek. Daftar kosong berarti aturan tidak menyala.
 */

import { containsAny, extractSalaries, formatRupiah } from "./normalize";
import type { Detektor, Rule } from "./types";

const POLA_WAKTU_BERLEBIH = [
  "12 jam",
  "lebih dari 8 jam",
  "tanpa hari libur",
  "tanpa libur",
  "7 hari kerja",
] as const;

const POLA_PUNGUTAN = [
  "biaya administrasi",
  "biaya pendaftaran",
  "biaya pelatihan",
  "biaya seleksi",
  "biaya seragam",
  "uang jaminan",
  "deposit",
  "wajib bayar",
  "harus bayar",
  "transfer biaya",
  "potong gaji untuk",
] as const;

const PENOLAK_BIAYA = [
  "tanpa biaya",
  "gratis",
  "ditanggung perusahaan",
  "tidak ada biaya",
  "bebas biaya",
] as const;

const PENEGAS_BIAYA = [
  "wajib bayar",
  "harus bayar",
  "transfer",
  "setor",
  "dipotong",
  "potong gaji",
] as const;

const NEGARA_TUJUAN = [
  "luar negeri",
  "mancanegara",
  "korea",
  "jepang",
  "taiwan",
  "hongkong",
  "singapura",
  "malaysia",
  "arab saudi",
  "timur tengah",
  "qatar",
  "uni emirat arab",
] as const;

const PENANDA_PENEMPATAN = [
  "paspor",
  "passport",
  "visa",
  "pjtki",
  "pmi",
  "penyalur",
  "agen",
  "magang",
  "kontrak",
] as const;

const POLA_GAJI_TINGGI_TANPA_SYARAT = [
  "tanpa pengalaman",
  "tidak perlu pengalaman",
  "no experience",
] as const;

const DOMAIN_EMAIL_GRATIS = [
  "gmail.com",
  "yahoo.com",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "rocketmail.com",
  "mail.com",
] as const;

const POLA_DOKUMEN_BANK = [
  "rekening",
  "atm",
  "pin",
  "buku tabungan",
  "nomor rekening",
] as const;

const POLA_DOKUMEN_PRIBADI = [
  "ktp",
  "npwp",
  "ijazah",
  "transkrip",
  "foto ktp",
  "scan ktp",
  "kk",
  "kartu keluarga",
] as const;

const PENANDA_SEBELUM_SELEKSI = [
  "sebelum wawancara",
  "sebelum interview",
  "sebelum seleksi",
  "di awal",
  "saat mendaftar",
  "ketika mendaftar",
  "tanpa wawancara",
] as const;

const POLA_DITERIMA_LANGSUNG = [
  "langsung diterima",
  "diterima tanpa seleksi",
  "tanpa seleksi",
  "tanpa wawancara",
  "tanpa interview",
  "langsung kerja",
  "langsung bergabung tanpa syarat",
  "siapa saja bisa",
] as const;

const POLA_TEKANAN = [
  "hari ini juga",
  "kuota terbatas",
  "sisa slot",
  "sisa kuota",
  "jangan lewatkan",
  "buruan",
  "segera isi form",
  "segera transfer",
  "ditunggu segera",
] as const;

const POLA_DISKRIMINASI = [
  "hanya pria",
  "hanya wanita",
  "khusus pria",
  "khusus wanita",
  "pria saja",
  "wanita saja",
  "berpenampilan menarik",
  "cantik",
  "ganteng",
  "tinggi badan",
  "maksimal usia",
  "maksimal umur",
  "maksimal 25 tahun",
  "usia maksimal",
  "tidak boleh hamil",
  "belum menikah",
] as const;

const POLA_MLM_KUAT = [
  "mlm",
  "downline",
  "member get member",
  "passive income",
  "penghasilan pasif",
  "money game",
  "skema piramida",
] as const;

const POLA_MLM_SINYAL = [
  "tanpa modal",
  "rekrut teman",
  "ajak teman",
  "cari anggota",
  "bawa member",
  "jaringan member",
  "bonus rekrut",
  "bonus jaringan",
] as const;

const PENANDA_UPAH_TERSIRAT = [
  "sesuai umr",
  "sesuai ump",
  "sesuai upah minimum",
] as const;

const PENANDA_KERJA_JARAK_JAUH = [
  "remote",
  "wfh",
  "work from home",
  "hybrid",
  "online",
] as const;

const POLA_LEMBUR = [
  "lembur tanpa upah",
  "lembur tidak dibayar",
  "lembur wajib",
  "siap lembur kapan saja",
  "shift malam",
  "24 jam",
  "on call",
  "standby",
  "lembur setiap hari",
] as const;

const POLA_DM = [
  "dm instagram",
  "dm ig",
  "inbox instagram",
  "inbox dm",
  "chat pribadi",
  "hubungi dm",
  "kirim dm",
  "dm saja",
  "via dm",
] as const;

const PENANDA_PERUSAHAAN = [
  "pt",
  "cv",
  "ud",
  "tbk",
  "persero",
  "koperasi",
  "yayasan",
  "firma",
] as const;

const POLA_TELEPON = /(?:\+62|62|0)8[1-9][0-9]{7,11}/g;
const POLA_EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/;
const POLA_SITUS = /https?:\/\/|www\./;

/** Metadata aturan; dipakai untuk menyusun temuan dan rujukan hukum. */
export const RULES: readonly Rule[] = [
  {
    id: "upah_dibawah_umr",
    judul: "Upah di bawah ketentuan minimum",
    deskripsi:
      "Nominal upah yang disebutkan lebih rendah daripada upah minimum provinsi yang berlaku.",
    kategori: "upah",
    tipe: "ambang",
    bobot: 8,
    kekuatan: "kuat",
    hasilJikaCocok: "perlu_dicek",
    rujukanHukumIds: ["permenaker-18-2024"],
    pola: [],
    ambangBatas: 1,
  },
  {
    id: "waktu_kerja_berlebih",
    judul: "Waktu kerja melampaui batas wajar",
    deskripsi:
      "Beban kerja yang disebutkan berpotensi melewati batas jam kerja dan hari istirahat.",
    kategori: "lainnya",
    tipe: "pola",
    bobot: 6,
    kekuatan: "kuat",
    hasilJikaCocok: "perlu_dicek",
    rujukanHukumIds: ["uu-13-2003-pasal-6"],
    pola: POLA_WAKTU_BERLEBIH,
    ambangBatas: null,
  },
  {
    id: "pungutan_biaya",
    judul: "Pungutan biaya kepada pelamar",
    deskripsi:
      "Ada permintaan pembayaran dari pihak pelamar untuk proses rekrutmen atau penempatan.",
    kategori: "seleksi",
    tipe: "pola",
    bobot: 10,
    kekuatan: "kuat",
    hasilJikaCocok: "tinggi",
    rujukanHukumIds: ["se-menaker-m6-hk04-v-2025"],
    pola: POLA_PUNGUTAN,
    ambangBatas: null,
  },
  {
    id: "penempatan_luar_negeri_nonresmi",
    judul: "Penempatan luar negeri tanpa jalur resmi",
    deskripsi:
      "Lowongan menyebut penempatan ke luar negeri tanpa penanda jalur penempatan resmi.",
    kategori: "penempatan",
    tipe: "pola",
    bobot: 9,
    kekuatan: "kuat",
    hasilJikaCocok: "tinggi",
    rujukanHukumIds: ["uu-18-2017"],
    pola: NEGARA_TUJUAN,
    ambangBatas: null,
  },
  {
    id: "gaji_tidak_wajar_tinggi",
    judul: "Nominal gaji tidak wajar untuk posisi umum",
    deskripsi:
      "Nominal gaji yang ditawarkan jauh di atas kewajaran tanpa syarat pengalaman yang sepadan.",
    kategori: "upah",
    tipe: "ambang",
    bobot: 7,
    kekuatan: "kuat",
    hasilJikaCocok: "tinggi",
    rujukanHukumIds: [],
    pola: [],
    ambangBatas: 40_000_000,
  },
  {
    id: "kontak_whatsapp_saja",
    judul: "Kontak hanya lewat nomor telepon",
    deskripsi:
      "Lowongan hanya mencantumkan nomor telepon tanpa email resmi atau situs perusahaan.",
    kategori: "kontak",
    tipe: "pola",
    bobot: 5,
    kekuatan: "sedang",
    hasilJikaCocok: "perlu_dicek",
    rujukanHukumIds: [],
    pola: [],
    ambangBatas: null,
  },
  {
    id: "email_gratis",
    judul: "Kontak memakai email layanan gratis",
    deskripsi:
      "Alamat email perusahaan memakai domain layanan gratis, bukan domain resmi perusahaan.",
    kategori: "kontak",
    tipe: "pola",
    bobot: 3,
    kekuatan: "lemah",
    hasilJikaCocok: null,
    rujukanHukumIds: [],
    pola: DOMAIN_EMAIL_GRATIS,
    ambangBatas: null,
  },
  {
    id: "tanpa_nama_perusahaan",
    judul: "Nama perusahaan tidak disebutkan",
    deskripsi:
      "Teks lowongan tidak memuat nama atau bentuk badan usaha yang bisa ditelusuri.",
    kategori: "identitas",
    tipe: "pola",
    bobot: 4,
    kekuatan: "sedang",
    hasilJikaCocok: "perlu_dicek",
    rujukanHukumIds: [],
    pola: PENANDA_PERUSAHAAN,
    ambangBatas: null,
  },
  {
    id: "minta_dokumen_sensitif_dini",
    judul: "Permintaan dokumen sensitif di awal proses",
    deskripsi:
      "Dokumen pribadi atau data perbankan diminta sebelum tahap seleksi berjalan.",
    kategori: "dokumen",
    tipe: "pola",
    bobot: 8,
    kekuatan: "kuat",
    hasilJikaCocok: "tinggi",
    rujukanHukumIds: ["uu-27-2022"],
    pola: [...POLA_DOKUMEN_BANK, ...POLA_DOKUMEN_PRIBADI, ...PENANDA_SEBELUM_SELEKSI],
    ambangBatas: null,
  },
  {
    id: "diterima_tanpa_seleksi",
    judul: "Diterima tanpa proses seleksi",
    deskripsi:
      "Lowongan menjanjikan penerimaan langsung tanpa wawancara atau seleksi yang jelas.",
    kategori: "seleksi",
    tipe: "pola",
    bobot: 6,
    kekuatan: "kuat",
    hasilJikaCocok: "tinggi",
    rujukanHukumIds: [],
    pola: POLA_DITERIMA_LANGSUNG,
    ambangBatas: null,
  },
  {
    id: "tekanan_mendesak",
    judul: "Tekanan waktu yang mendesak",
    deskripsi:
      "Lowongan mendorong keputusan cepat dengan batas waktu atau kuota yang menekan.",
    kategori: "tekanan",
    tipe: "pola",
    bobot: 3,
    kekuatan: "lemah",
    hasilJikaCocok: null,
    rujukanHukumIds: [],
    pola: POLA_TEKANAN,
    ambangBatas: null,
  },
  {
    id: "diskriminasi_gender_usia",
    judul: "Syarat yang membatasi kelompok tertentu",
    deskripsi:
      "Lowongan memuat syarat berbasis gender, penampilan, atau usia yang tidak berkaitan dengan kompetensi.",
    kategori: "diskriminasi",
    tipe: "pola",
    bobot: 4,
    kekuatan: "sedang",
    hasilJikaCocok: "perlu_dicek",
    rujukanHukumIds: ["uu-13-2003-pasal-5"],
    pola: POLA_DISKRIMINASI,
    ambangBatas: null,
  },
  {
    id: "skema_komisi_berantai",
    judul: "Skema komisi berantai",
    deskripsi:
      "Lowongan memuat penanda skema rekrutmen berjenjang yang mengandalkan anggota baru.",
    kategori: "lainnya",
    tipe: "pola",
    bobot: 8,
    kekuatan: "kuat",
    hasilJikaCocok: "tinggi",
    rujukanHukumIds: [],
    pola: [...POLA_MLM_KUAT, ...POLA_MLM_SINYAL],
    ambangBatas: null,
  },
  {
    id: "upah_tidak_diungkap",
    judul: "Nominal upah tidak dicantumkan",
    deskripsi:
      "Teks lowongan tidak memuat nominal upah maupun acuan upah minimum yang jelas.",
    kategori: "upah",
    tipe: "pola",
    bobot: 3,
    kekuatan: "lemah",
    hasilJikaCocok: null,
    rujukanHukumIds: [],
    pola: PENANDA_UPAH_TERSIRAT,
    ambangBatas: null,
  },
  {
    id: "lokasi_tidak_jelas",
    judul: "Lokasi kerja tidak jelas",
    deskripsi:
      "Teks lowongan tidak menyebut lokasi kerja yang bisa dikenali maupun penanda kerja jarak jauh.",
    kategori: "identitas",
    tipe: "pola",
    bobot: 4,
    kekuatan: "sedang",
    hasilJikaCocok: null,
    rujukanHukumIds: [],
    pola: PENANDA_KERJA_JARAK_JAUH,
    ambangBatas: null,
  },
  {
    id: "lembur_tanpa_batas",
    judul: "Lembur tanpa batas yang jelas",
    deskripsi:
      "Lowongan menyiratkan lembur berkelanjutan tanpa keterangan upah lembur atau batas waktu.",
    kategori: "tekanan",
    tipe: "pola",
    bobot: 4,
    kekuatan: "sedang",
    hasilJikaCocok: "perlu_dicek",
    rujukanHukumIds: ["kep-230-men-2003"],
    pola: POLA_LEMBUR,
    ambangBatas: null,
  },
  {
    id: "rekrut_via_dm_samar",
    judul: "Rekrutmen lewat pesan pribadi",
    deskripsi:
      "Proses rekrutmen diarahkan ke pesan pribadi di media sosial tanpa kanal resmi.",
    kategori: "kontak",
    tipe: "pola",
    bobot: 4,
    kekuatan: "sedang",
    hasilJikaCocok: "perlu_dicek",
    rujukanHukumIds: [],
    pola: POLA_DM,
    ambangBatas: null,
  },
];

function deteksiPungutanBiaya(teks: string): string[] {
  const cocok = containsAny(teks, POLA_PUNGUTAN);
  if (cocok.length === 0) return [];

  const penolak = containsAny(teks, PENOLAK_BIAYA);
  const penegas = containsAny(teks, PENEGAS_BIAYA);
  if (penolak.length > 0 && penegas.length === 0) return [];

  return cocok;
}

function deteksiTeleponSaja(teks: string): string[] {
  const rapat = teks.replace(/[\s().-]/g, "");
  const nomor = [...rapat.matchAll(POLA_TELEPON)].map((cocok) => cocok[0]);
  if (nomor.length === 0) return [];
  if (POLA_EMAIL.test(teks) || POLA_SITUS.test(teks)) return [];
  return nomor.slice(0, 3);
}

/** Satu detektor per aturan, dengan urutan yang sama seperti RULES. */
export const DETEKTOR: readonly Detektor[] = [
  {
    ruleId: "upah_dibawah_umr",
    deteksi: (konteks) => {
      if (konteks.gajiBulanan === null || konteks.upahMinimum === null) return [];
      if (konteks.gajiBulanan >= konteks.upahMinimum.upahBulanan) return [];
      return [
        `upah ${formatRupiah(konteks.gajiBulanan)}`,
        `minimum ${formatRupiah(konteks.upahMinimum.upahBulanan)}`,
      ];
    },
  },
  {
    ruleId: "waktu_kerja_berlebih",
    deteksi: (konteks) => containsAny(konteks.teks, POLA_WAKTU_BERLEBIH),
  },
  {
    ruleId: "pungutan_biaya",
    deteksi: (konteks) => deteksiPungutanBiaya(konteks.teks),
  },
  {
    ruleId: "penempatan_luar_negeri_nonresmi",
    deteksi: (konteks) => {
      const tujuan = containsAny(konteks.teks, NEGARA_TUJUAN);
      if (tujuan.length === 0) return [];
      const penanda = containsAny(konteks.teks, PENANDA_PENEMPATAN);
      if (penanda.length === 0) return [];
      return [...tujuan, ...penanda];
    },
  },
  {
    ruleId: "gaji_tidak_wajar_tinggi",
    deteksi: (konteks) => {
      const tertinggi = extractSalaries(konteks.teks).at(-1) ?? null;
      if (tertinggi === null) return [];

      if (tertinggi >= 40_000_000) return [`gaji ${formatRupiah(tertinggi)}`];
      if (tertinggi >= 25_000_000) {
        const penanda = containsAny(konteks.teks, POLA_GAJI_TINGGI_TANPA_SYARAT);
        if (penanda.length > 0) return [`gaji ${formatRupiah(tertinggi)}`, ...penanda];
      }
      return [];
    },
  },
  {
    ruleId: "kontak_whatsapp_saja",
    deteksi: (konteks) => deteksiTeleponSaja(konteks.teks),
  },
  {
    ruleId: "email_gratis",
    deteksi: (konteks) => containsAny(konteks.teks, DOMAIN_EMAIL_GRATIS),
  },
  {
    ruleId: "tanpa_nama_perusahaan",
    deteksi: (konteks) => {
      if (konteks.perusahaan && konteks.perusahaan.trim().length > 0) return [];
      if (containsAny(konteks.teks, PENANDA_PERUSAHAAN).length > 0) return [];
      return ["nama perusahaan tidak disebutkan"];
    },
  },
  {
    ruleId: "minta_dokumen_sensitif_dini",
    deteksi: (konteks) => {
      const bank = containsAny(konteks.teks, POLA_DOKUMEN_BANK);
      const pribadi = containsAny(konteks.teks, POLA_DOKUMEN_PRIBADI);
      if (bank.length === 0 && pribadi.length === 0) return [];

      const dini = containsAny(konteks.teks, PENANDA_SEBELUM_SELEKSI);
      if (dini.length === 0) return [];
      return [...bank, ...pribadi, ...dini];
    },
  },
  {
    ruleId: "diterima_tanpa_seleksi",
    deteksi: (konteks) => containsAny(konteks.teks, POLA_DITERIMA_LANGSUNG),
  },
  {
    ruleId: "tekanan_mendesak",
    deteksi: (konteks) => containsAny(konteks.teks, POLA_TEKANAN),
  },
  {
    ruleId: "diskriminasi_gender_usia",
    deteksi: (konteks) => containsAny(konteks.teks, POLA_DISKRIMINASI),
  },
  {
    ruleId: "skema_komisi_berantai",
    deteksi: (konteks) => {
      const kuat = containsAny(konteks.teks, POLA_MLM_KUAT);
      const sinyal = containsAny(konteks.teks, POLA_MLM_SINYAL);
      if (kuat.length > 0) return [...kuat, ...sinyal];
      if (sinyal.length >= 2) return sinyal;
      return [];
    },
  },
  {
    ruleId: "upah_tidak_diungkap",
    deteksi: (konteks) => {
      if (extractSalaries(konteks.teks).length > 0) return [];
      if (containsAny(konteks.teks, PENANDA_UPAH_TERSIRAT).length > 0) return [];
      return ["nominal upah tidak disebutkan"];
    },
  },
  {
    ruleId: "lokasi_tidak_jelas",
    deteksi: (konteks) => {
      if (konteks.provinsi !== null) return [];
      if (containsAny(konteks.teks, PENANDA_KERJA_JARAK_JAUH).length > 0) return [];
      return ["lokasi kerja tidak disebutkan"];
    },
  },
  {
    ruleId: "lembur_tanpa_batas",
    deteksi: (konteks) => containsAny(konteks.teks, POLA_LEMBUR),
  },
  {
    ruleId: "rekrut_via_dm_samar",
    deteksi: (konteks) => containsAny(konteks.teks, POLA_DM),
  },
];
