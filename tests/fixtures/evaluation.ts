import type { Band } from "@/lib/evaluation/types";

export type FixtureEvaluasi = {
  id: string;
  teks: string;
  lokasi?: string;
  expectedBand: Band;
  expectedRuleIds: string[];
  expectedSkor: number;
};

/**
 * Kumpulan kasus acuan untuk menguji evaluasi lowongan secara deterministik.
 *
 * Nilai `expectedBand`, `expectedRuleIds`, dan `expectedSkor` dikunci dari
 * keluaran evaluator versi 1.0.0. Jangan ubah teks, `lokasi`, atau `perusahaan`
 * tanpa menghitung ulang ketiga nilai tersebut — perubahan sekecil apa pun
 * dapat menggeser band maupun skor.
 *
 * `expectedRuleIds` selalu diurutkan secara alfabetis karena urutan temuan
 * tidak menjadi bagian dari kontrak evaluator.
 */
export const FIXTURES_EVALUASI: readonly FixtureEvaluasi[] = [
  // --- bersih: diharapkan tanpa temuan ---
  {
    id: "c1_software_engineer",
    teks: "PT Sinar Teknologi membuka lowongan Software Engineer. Gaji Rp 8.000.000 per bulan. Kirim CV ke hr@sinarteknologi.co.id.",
    lokasi: "Jakarta",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
  },
  {
    id: "c2_admin_keuangan",
    teks: "PT Rasa Nusantara mencari Admin Keuangan. Gaji Rp 5.000.000 per bulan. Lamar melalui rekrutmen@rasanusantara.co.id.",
    lokasi: "Bandung, Jawa Barat",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
  },
  {
    id: "c3_staff_marketing",
    teks: "PT Karya Logistik membuka posisi Staff Marketing. Gaji Rp 6.500.000 per bulan. Kirim CV ke karir@karyalogistik.co.id.",
    lokasi: "Surabaya, Jawa Timur",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
  },
  {
    id: "c4_data_analyst_remote",
    teks: "PT Data Cerdas mencari Data Analyst, remote WFH. Gaji Rp 9.500.000 per bulan. Lamar via talent@datacerdas.co.id.",
    lokasi: "Jakarta",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
  },
  {
    id: "c5_staff_gudang",
    teks: "PT Gudang Sejahtera membuka lowongan Staff Gudang. Gaji Rp 4.200.000 per bulan. Kirim CV ke hrd@gudangsejahtera.co.id.",
    lokasi: "Semarang, Jawa Tengah",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
  },
  {
    id: "c6_customer_service",
    teks: "PT Layanan Prima mencari Customer Service. Gaji Rp 4.500.000 per bulan. Lamar melalui rekrutmen@layananprima.co.id.",
    lokasi: "Medan, Sumatera Utara",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
  },
  {
    id: "c7_desainer_grafis",
    teks: "PT Kreasi Visual membuka posisi Desainer Grafis. Gaji Rp 5.500.000 per bulan. Kirim portofolio ke karir@kreasivisual.co.id.",
    lokasi: "Yogyakarta, DI Yogyakarta",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
  },
  {
    id: "c8_barista",
    teks: "PT Kopi Bali Jaya mencari Barista. Gaji Rp 3.800.000 per bulan. Lamar melalui rekrutmen@kopibalijaya.co.id.",
    lokasi: "Denpasar, Bali",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
  },

  // --- perlu dicek: indikator yang perlu dikonfirmasi ---
  {
    id: "d1_admin_online_shop",
    teks: "Lowongan admin online shop. Gaji menarik, kuota terbatas. Hubungi WhatsApp 0812-3456-7890 sekarang.",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "kontak_whatsapp_saja",
      "tanpa_nama_perusahaan",
      "tekanan_mendesak",
      "upah_tidak_diungkap",
    ],
    expectedSkor: 12,
  },
  {
    id: "d2_operator_produksi",
    teks: "PT Baja Perkasa membuka lowongan Operator Produksi. Jam kerja 12 jam per hari, lembur wajib. Kuota terbatas.",
    lokasi: "Jakarta",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "lembur_tanpa_batas",
      "tekanan_mendesak",
      "upah_tidak_diungkap",
      "waktu_kerja_berlebih",
    ],
    expectedSkor: 16,
  },
  {
    id: "d3_spg_dm_instagram",
    teks: "Dicari SPG wanita berpenampilan menarik, maksimal usia 25 tahun, belum menikah. Kuota terbatas. Chat DM Instagram @spgcekloker.",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "diskriminasi_gender_usia",
      "lokasi_tidak_jelas",
      "rekrut_via_dm_samar",
      "tanpa_nama_perusahaan",
      "tekanan_mendesak",
      "upah_tidak_diungkap",
    ],
    expectedSkor: 19,
  },
  {
    id: "d4_helper_pabrik",
    teks: "Dicari helper pabrik. Lembur wajib, shift malam. Hubungi WhatsApp 0857-1122-3344 untuk informasi.",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "kontak_whatsapp_saja",
      "lembur_tanpa_batas",
      "lokasi_tidak_jelas",
      "tanpa_nama_perusahaan",
      "upah_tidak_diungkap",
    ],
    expectedSkor: 19,
  },
  {
    id: "d5_kurir",
    teks: "PT Cahaya Abadi membuka lowongan Kurir. Jam kerja 12 jam tanpa hari libur. Lamar via WhatsApp 0813-9988-7766.",
    lokasi: "Jakarta",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "kontak_whatsapp_saja",
      "upah_tidak_diungkap",
      "waktu_kerja_berlebih",
    ],
    expectedSkor: 16,
  },
  {
    id: "d6_sales_gratis_email",
    teks: "PT Mitra Niaga mencari Sales, khusus pria. Jam kerja 12 jam per hari. Lamar ke mitra.niaga@gmail.com, kuota terbatas.",
    lokasi: "Jawa Barat",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "diskriminasi_gender_usia",
      "email_gratis",
      "tekanan_mendesak",
      "upah_tidak_diungkap",
      "waktu_kerja_berlebih",
    ],
    expectedSkor: 18,
  },
  {
    id: "d7_staff_produksi",
    teks: "PT Sumber Makmur mencari Staff Produksi, khusus pria. Jam kerja 12 jam tanpa hari libur, lembur wajib.",
    lokasi: "Surabaya, Jawa Timur",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "diskriminasi_gender_usia",
      "lembur_tanpa_batas",
      "upah_tidak_diungkap",
      "waktu_kerja_berlebih",
    ],
    expectedSkor: 19,
  },
  {
    id: "d8_kasir_minimarket",
    teks: "Dicari kasir minimarket. Gaji belum ditentukan, kuota terbatas. Hubungi WhatsApp 0899-8877-6655.",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "kontak_whatsapp_saja",
      "lokasi_tidak_jelas",
      "tanpa_nama_perusahaan",
      "tekanan_mendesak",
      "upah_tidak_diungkap",
    ],
    expectedSkor: 16,
  },

  // --- tinggi: kombinasi indikator risiko ---
  {
    id: "t1_biaya_administrasi",
    teks: "PT Berkah Jaya membuka lowongan Staff Administrasi. Wajib bayar biaya administrasi Rp150.000 sebelum tes.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["pungutan_biaya", "upah_tidak_diungkap"],
    expectedSkor: 17,
  },
  {
    id: "t2_penempatan_korea",
    teks: "PT Global Mandiri membuka penempatan kerja Korea. Wajib paspor dan visa. Informasi lebih lanjut hubungi kantor kami.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["penempatan_luar_negeri_nonresmi", "upah_tidak_diungkap"],
    expectedSkor: 15,
  },
  {
    id: "t3_dokumen_dini",
    teks: "PT Sinar Rekrut mencari Staff Admin. Kirim scan KTP, kartu keluarga, dan buku tabungan sebelum interview.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["minta_dokumen_sensitif_dini", "upah_tidak_diungkap"],
    expectedSkor: 14,
  },
  {
    id: "t4_langsung_diterima",
    teks: "PT Andalan Cepat membuka kerja sampingan. Langsung diterima tanpa seleksi. Lamar ke andalancepat@gmail.com.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: [
      "diterima_tanpa_seleksi",
      "email_gratis",
      "upah_tidak_diungkap",
    ],
    expectedSkor: 12,
  },
  {
    id: "t5_komisi_berantai",
    teks: "PT Cuci Untung membuka lowongan. Skema komisi berantai dengan downline dan member get member, tanpa gaji tetap.",
    lokasi: "Jawa Barat",
    expectedBand: "tinggi",
    expectedRuleIds: ["skema_komisi_berantai", "upah_tidak_diungkap"],
    expectedSkor: 14,
  },
  {
    id: "t6_gaji_tidak_wajar",
    teks: "PT Prospek Emas mencari Sales Executive. Gaji Rp 50.000.000 per bulan untuk lulusan SMA tanpa pengalaman.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["gaji_tidak_wajar_tinggi"],
    expectedSkor: 11,
  },
  {
    id: "t7_transfer_biaya",
    teks: "PT Anugerah Kerja membuka lowongan Staff Gudang. Wajib transfer biaya pelatihan Rp300.000 dan biaya seragam Rp150.000.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["pungutan_biaya"],
    expectedSkor: 15,
  },
];
