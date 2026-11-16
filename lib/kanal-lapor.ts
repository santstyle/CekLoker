/**
 * Daftar kanal lapor resmi untuk fitur /bantuan.
 * Hanya digunakan oleh komponen /bantuan, tidak diimpor oleh halaman
 * hasil, kartu hasil, atau PDF.
 *
 * Aturan penggunaan:
 * - Field url bernilai "TODO" tidak akan dirender sebagai tautan;
 *   hanya akan ditampilkan teks "Tautan resmi belum tersedia"
 *   bersama telepon/WhatsApp yang ada.
 * - Setiap item wajib punya field: id, nama, url, jenis_kasus[],
   perlu_verifikasi.
 * - Field url "TODO": tampilkan "Tautan resmi belum tersedia".
 */

export type JenisKasus = readonly string[];

export interface DataKanalLapor {
  id: string;
  nama: string;
  url: string;
  cara: string;
  jenis_kasus: JenisKasus;
  catatan: string;
  perlu_verifikasi: boolean;
  tanggal_verifikasi: string; // "Belum diverifikasi" atau tanggal terformat
  sumber_info: string;
  /** Telepon opsional (mis. hotline). */
  telepon?: string;
  /** WhatsApp opsional (nomor tanpa spasi). */
  whatsapp?: string;
  /** Syarat bukti yang perlu disiapkan (opsional). */
  syarat_bukti?: readonly string[];
}

/**
 * Daftar lengkap kanal lapor. Urutan diasumsikan relevansi standar,
 * tapi tampilan akan difilter berdasarkan jenis kasus yang dipilih pengguna.
 */
export const KANAL_LAPOR: DataKanalLapor[] = [
  {
    id: "lapor-menaker",
    nama: "Lapor Menaker (Kemnaker)",
    url: "https://lapormenaker.kemnaker.go.id",
    cara: "web, login SIAPkerja",
    jenis_kasus: ["biaya_dimuka", "diskriminasi"],
    catatan:
      "Cakupan: norma ketenagakerjaan. Belum pasti menerima laporan lowongan palsu.",
    perlu_verifikasi: true,
    tanggal_verifikasi: "",
    sumber_info: "Infopublik, DDTCNews (Nov 2025)",
  },
  {
    id: "kemnaker-hotline",
    nama: "Hotline Kemnaker",
    telepon: "1500 630",
    url: "",
    cara: "telepon",
    jenis_kasus: ["lowongan_palsu", "biaya_dimuka"],
    catatan: "",
    perlu_verifikasi: true,
    tanggal_verifikasi: "",
    sumber_info: "Bisnis.com, Kontan (2024)",
  },
  {
    id: "karirhub",
    nama: "KarirHub Kemnaker (pembanding lowongan resmi)",
    url: "https://karirhub.kemnaker.go.id",
    cara: "web",
    jenis_kasus: [],
    catatan: "Bukan kanal lapor.",
    perlu_verifikasi: true,
    tanggal_verifikasi: "",
    sumber_info: "Kompas.tv, Bisnis.com",
  },
  {
    id: "cekrekening",
    nama: "CekRekening.id (Komdigi)",
    url: "https://cekrekening.id",
    cara: "web, login",
    jenis_kasus: ["rekening_penipu"],
    syarat_bukti: ["kronologi", "tangkapan layar", "bukti transfer"],
    catatan:
      "Tidak mengembalikan uang atau membek freeze rekening; hubungi bank.",
    perlu_verifikasi: true,
    tanggal_verifikasi: "",
    sumber_info: "Detik, Kontan, Hukumonline",
  },
  {
    id: "aduannomor",
    nama: "AduanNomor.id (Komdigi)",
    url: "https://aduannomor.id",
    cara: "web, login",
    jenis_kasus: ["nomor_penipu"],
    catatan: "",
    perlu_verifikasi: true,
    tanggal_verifikasi: "",
    sumber_info: "Hukumonline, Wartaekonomi",
  },
  {
    id: "aduankonten",
    nama: "AduanKonten.id (Komdigi)",
    url: "https://aduankonten.id",
    cara: "web, login",
    jenis_kasus: ["lowongan_palsu"],
    catatan: "Perlu daftar akun.",
    perlu_verifikasi: true,
    tanggal_verifikasi: "",
    sumber_info: "Detik, Infopublik",
  },
  {
    id: "polisi-siber",
    nama: "Polri / Dittipidsiber Bareskrim",
    url: "https://patrolisiber.id",
    cara: "web",
    jenis_kasus: ["lowongan_palsu", "biaya_dimuka", "data_pribadi_bocor"],
    catatan:
      "URL dari sumber sekunder; cek juga SPKT terdekat.",
    perlu_verifikasi: true,
    tanggal_verifikasi: "",
    sumber_info: "Commoner Law, Katadata",
  },
  {
    id: "kp2mi",
    nama: "Kementerian P2MI (lowongan luar negeri)",
    telepon: "0800-1000 / 021-2924-4810",
    whatsapp: "0811-8080-141 (menu Layanan Kejahatan Siber)",
    url: "TODO",
    cara: "telepon, WhatsApp",
    jenis_kasus: ["lowongan_luar_negeri"],
    catatan: "Tautan resmi belum tersedia.",
    perlu_verifikasi: true,
    tanggal_verifikasi: "",
    sumber_info: "Okezone/RCTI+, Infopublik, Metrotvnews (2026)",
  },
  {
    id: "bank",
    nama: "Bank atau penyedia e-wallet Anda",
    url: "",
    cara: "",
    jenis_kasus: ["rekening_penipu", "biaya_dimuka"],
    catatan: "Minta penelusuran dan pemblokiran transaksi.",
    perlu_verifikasi: false,
    tanggal_verifikasi: "",
    sumber_info: "",
  },
];

// Mapping cepat: id -> data kanal (untuk pencarian cepat di klien)
export const CANAL_BY_ID = new Map(
  KANAL_LAPOR.map((k) => [k.id, k])
);