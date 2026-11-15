import type { Band } from "./types";

/**
 * Kasus acuan kanonik untuk evaluasi lowongan.
 *
 * Setiap kasus mengunci keluaran evaluator versi 1.0.0 pada tiga sumbu:
 * `expectedBand`, `expectedSkor`, dan `expectedRuleIds`. Nilai-nilai itu adalah
 * kontrak: bila mesin evaluasi berubah, uji acuan akan gagal lebih dulu sebelum
 * perubahan perilaku sampai ke pengguna.
 *
 * Aturan perawatan:
 * - Jangan ubah `teks` atau `lokasi` tanpa menghitung ulang ketiga nilai acuan;
 *   perubahan sekecil apa pun dapat menggeser band maupun skor.
 * - `expectedRuleIds` selalu diurutkan alfabetis karena urutan temuan bukan
 *   bagian dari kontrak evaluator.
 * - `catatan` menjelaskan apa yang diuji kasus ini, bukan salinan hasil.
 *
 * Tidak ada teks lowongan pengguna di berkas ini: seluruh teks adalah contoh
 * sintetis yang ditulis untuk pengujian.
 */
export type KasusAcuan = {
  id: string;
  teks: string;
  lokasi?: string;
  expectedBand: Band;
  expectedRuleIds: readonly string[];
  expectedSkor: number;
  /** Alasan singkat keberadaan kasus ini dalam himpunan acuan. */
  catatan: string;
};

export const KASUS_ACUAN: readonly KasusAcuan[] = [
  // --- rendah: diharapkan tanpa temuan ---
  {
    id: "c1_software_engineer",
    teks: "PT Sinar Teknologi membuka lowongan Software Engineer. Gaji Rp 8.000.000 per bulan. Kirim CV ke hr@sinarteknologi.co.id.",
    lokasi: "Jakarta",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan:
      "Iklan lengkap: nama perusahaan, upah nominal, email domain resmi, dan lokasi jelas.",
  },
  {
    id: "c2_admin_keuangan",
    teks: "PT Rasa Nusantara mencari Admin Keuangan. Gaji Rp 5.000.000 per bulan. Lamar melalui rekrutmen@rasanusantara.co.id.",
    lokasi: "Bandung, Jawa Barat",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: "Variasi peran kantor dengan saluran email resmi dan lokasi kota.",
  },
  {
    id: "c3_staff_marketing",
    teks: "PT Karya Logistik membuka posisi Staff Marketing. Gaji Rp 6.500.000 per bulan. Kirim CV ke karir@karyalogistik.co.id.",
    lokasi: "Surabaya, Jawa Timur",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: "Iklan bersih dengan kata kunci pekerjaan umum.",
  },
  {
    id: "c4_data_analyst_remote",
    teks: "PT Data Cerdas mencari Data Analyst, remote WFH. Gaji Rp 9.500.000 per bulan. Lamar via talent@datacerdas.co.id.",
    lokasi: "Jakarta",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: "Kerja jarak jauh tidak boleh dianggap lokasi tidak jelas.",
  },
  {
    id: "c5_staff_gudang",
    teks: "PT Gudang Sejahtera membuka lowongan Staff Gudang. Gaji Rp 4.200.000 per bulan. Kirim CV ke hrd@gudangsejahtera.co.id.",
    lokasi: "Semarang, Jawa Tengah",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: "Upah di atas acuan tidak memicu aturan upah apa pun.",
  },
  {
    id: "c6_customer_service",
    teks: "PT Layanan Prima mencari Customer Service. Gaji Rp 4.500.000 per bulan. Lamar melalui rekrutmen@layananprima.co.id.",
    lokasi: "Medan, Sumatera Utara",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: "Peran layanan pelanggan dengan kontak email resmi.",
  },
  {
    id: "c7_desainer_grafis",
    teks: "PT Kreasi Visual membuka posisi Desainer Grafis. Gaji Rp 5.500.000 per bulan. Kirim portofolio ke karir@kreasivisual.co.id.",
    lokasi: "Yogyakarta, DI Yogyakarta",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: "Iklan bidang kreatif dengan alamat email domain perusahaan.",
  },
  {
    id: "c8_barista",
    teks: "PT Kopi Bali Jaya mencari Barista. Gaji Rp 3.800.000 per bulan. Lamar melalui rekrutmen@kopibalijaya.co.id.",
    lokasi: "Denpasar, Bali",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: "Iklan ritel makanan dengan unsur lengkap.",
  },
  {
    id: "c9_perawat",
    teks: "PT Medika Sehat membuka lowongan Perawat Klinik. Gaji Rp 5.200.000 per bulan. Kirim lamaran ke rekrutmen@medikasehat.co.id.",
    lokasi: "Bekasi, Jawa Barat",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: "Sektor kesehatan; memastikan istilah medis tidak salah terbaca.",
  },
  {
    id: "c10_guru",
    teks: "PT Cerdas Edukasi mencari Guru Matematika SMA. Gaji Rp 6.000.000 per bulan. Lamar melalui karir@cerdasedukasi.co.id.",
    lokasi: "Malang, Jawa Timur",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: 'Sektor pendidikan; kata "SMA" tidak boleh dianggap penanda usia.',
  },
  {
    id: "c11_supervisor",
    teks: "PT Ritel Modern membuka posisi Supervisor Toko. Gaji Rp 7.500.000 per bulan. Kirim CV ke hrd@ritelmodern.co.id.",
    lokasi: "Tangerang, Banten",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: "Peran tingkat pengawas dengan iklan lengkap.",
  },
  {
    id: "c12_teknisi",
    teks: "PT Agro Lestari mencari Teknisi Mesin. Gaji Rp 6.800.000 per bulan. Lamar via rekrutmen@agrolestari.co.id.",
    lokasi: "Palembang, Sumatera Selatan",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: "Sektor agraris; memastikan kata teknis tidak memicu pola keliru.",
  },
  {
    id: "c13_tour_guide",
    teks: "PT Wisata Bahari membuka lowongan Tour Guide. Gaji Rp 4.800.000 per bulan. Kirim CV ke karir@wisatabahari.co.id.",
    lokasi: "Denpasar, Bali",
    expectedBand: "rendah",
    expectedRuleIds: [],
    expectedSkor: 0,
    catatan: "Sektor pariwisata dengan kontak dan lokasi jelas.",
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
    catatan:
      "Kontak hanya nomor telepon, tanpa identitas perusahaan, upah tersirat, dan tekanan kuota.",
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
    catatan:
      "Jam kerja 12 jam plus lembur wajib: dua aturan ketenagakerjaan terpicu bersamaan.",
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
    catatan:
      "Kombinasi syarat diskriminatif, rekrutmen via DM, dan tanpa identitas perusahaan.",
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
    catatan: "Iklan singkat tanpa identitas, lokasi, dan upah yang jelas.",
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
    catatan:
      "Perusahaan dan lokasi ada, tetapi jam kerja berlebih dan upah tidak dicantumkan.",
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
    catatan:
      "Kontak email layanan gratis plus syarat gender dan jam kerja berlebih.",
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
    catatan: "Syarat gender tanpa kaitan kompetensi pada iklan produksi.",
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
    catatan:
      'Frasa "gaji belum ditentukan" harus terbaca sebagai upah tidak diungkap.',
  },
  {
    id: "d9_karyawan_toko",
    teks: "Dicari karyawan toko. Usia maksimal 30 tahun, diutamakan pria. Gaji Rp 3.000.000 per bulan.",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "diskriminasi_gender_usia",
      "lokasi_tidak_jelas",
      "tanpa_nama_perusahaan",
    ],
    expectedSkor: 12,
    catatan:
      "Upah dicantumkan, tetapi syarat usia/gender dan identitas perusahaan tetap menjadi indikator.",
  },
  {
    id: "d10_loker_online",
    teks: "Loker online! Kerja dari rumah, gaji besar tanpa batas. Info lebih lanjut hubungi WA 0812-1111-2222.",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "kontak_whatsapp_saja",
      "tanpa_nama_perusahaan",
      "upah_tidak_diungkap",
    ],
    expectedSkor: 11,
    catatan:
      'Bahasa promosi "gaji besar" tetap dihitung sebagai upah tidak diungkap.',
  },
  {
    id: "d11_satpam",
    teks: "PT Sinar Abadi membuka lowongan Satpam. Shift malam, jam kerja 12 jam per hari. Gaji Rp 3.500.000 per bulan.",
    lokasi: "Jakarta",
    expectedBand: "perlu_dicek",
    expectedRuleIds: ["lembur_tanpa_batas", "waktu_kerja_berlebih"],
    expectedSkor: 13,
    catatan:
      "Tanpa temuan kontak/identitas; hanya beban jam kerja yang perlu dicek.",
  },
  {
    id: "d12_spg_wanita",
    teks: "Lowongan SPG diutamakan wanita, menarik. Kirim lamaran ke spg.loker@gmail.com.",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "email_gratis",
      "lokasi_tidak_jelas",
      "tanpa_nama_perusahaan",
      "upah_tidak_diungkap",
    ],
    expectedSkor: 11,
    catatan:
      'Kata "menarik" sebagai syarat penampilan terdeteksi lewat pola diskriminasi.',
  },
  {
    id: "d13_content_writer",
    teks: "Dicari Content Writer, diutamakan wanita. Gaji Rp 5.000.000 per bulan. Kirim portofolio ke kreasidigital.hr@gmail.com.",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "email_gratis",
      "lokasi_tidak_jelas",
      "tanpa_nama_perusahaan",
    ],
    expectedSkor: 10,
    catatan:
      "Kasus batas: skor 10 tetap berada di bawah ambang perlu dicek, tetapi aturan penentu langsung menaikkan band.",
  },
  {
    id: "d14_mandor",
    teks: "PT Bangun Jaya mencari Mandor Proyek. Lembur wajib tanpa batas. Hubungi WhatsApp 0856-2233-4455.",
    lokasi: "Balikpapan, Kalimantan Timur",
    expectedBand: "perlu_dicek",
    expectedRuleIds: [
      "kontak_whatsapp_saja",
      "lembur_tanpa_batas",
      "upah_tidak_diungkap",
    ],
    expectedSkor: 11,
    catatan:
      "Peran lapangan dengan kontak WhatsApp dan lembur tanpa keterangan batas.",
  },

  // --- tinggi: kombinasi indikator risiko ---
  {
    id: "t1_biaya_administrasi",
    teks: "PT Berkah Jaya membuka lowongan Staff Administrasi. Wajib bayar biaya administrasi Rp150.000 sebelum tes.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["pungutan_biaya", "upah_tidak_diungkap"],
    expectedSkor: 17,
    catatan: "Pungutan biaya sebelum seleksi menetapkan band tinggi langsung.",
  },
  {
    id: "t2_penempatan_korea",
    teks: "PT Global Mandiri membuka penempatan kerja Korea. Wajib paspor dan visa. Informasi lebih lanjut hubungi kantor kami.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["penempatan_luar_negeri_nonresmi", "upah_tidak_diungkap"],
    expectedSkor: 15,
    catatan: "Penempatan luar negeri tanpa kanal resmi yang bisa diverifikasi.",
  },
  {
    id: "t3_dokumen_dini",
    teks: "PT Sinar Rekrut mencari Staff Admin. Kirim scan KTP, kartu keluarga, dan buku tabungan sebelum interview.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["minta_dokumen_sensitif_dini", "upah_tidak_diungkap"],
    expectedSkor: 14,
    catatan: "Permintaan dokumen pribadi dan perbankan sebelum wawancara.",
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
    catatan: "Janji diterima langsung tanpa proses seleksi.",
  },
  {
    id: "t5_komisi_berantai",
    teks: "PT Cuci Untung membuka lowongan. Skema komisi berantai dengan downline dan member get member, tanpa gaji tetap.",
    lokasi: "Jawa Barat",
    expectedBand: "tinggi",
    expectedRuleIds: ["skema_komisi_berantai", "upah_tidak_diungkap"],
    expectedSkor: 14,
    catatan: "Penanda skema berjenjang yang mengandalkan anggota baru.",
  },
  {
    id: "t6_gaji_tidak_wajar",
    teks: "PT Prospek Emas mencari Sales Executive. Gaji Rp 50.000.000 per bulan untuk lulusan SMA tanpa pengalaman.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["gaji_tidak_wajar_tinggi"],
    expectedSkor: 11,
    catatan: "Nominal upah jauh di atas kewajaran untuk syarat pengalaman.",
  },
  {
    id: "t7_transfer_biaya",
    teks: "PT Anugerah Kerja membuka lowongan Staff Gudang. Wajib transfer biaya pelatihan Rp300.000 dan biaya seragam Rp150.000.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["pungutan_biaya"],
    expectedSkor: 15,
    catatan: "Dua pungutan biaya sekaligus, keduanya terlarang bagi pelamar.",
  },
  {
    id: "t8_biaya_pelatihan",
    teks: "PT Pelatihan Cepat membuka lowongan. Wajib membayar biaya pelatihan Rp500.000 sebelum kerja.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["pungutan_biaya"],
    expectedSkor: 15,
    catatan: "Biaya pelatihan dibebankan ke pelamar sebelum mulai bekerja.",
  },
  {
    id: "t9_taiwan",
    teks: "PT Jasa Luar Negeri membuka penempatan kerja ke Taiwan. Wajib membayar biaya administrasi Rp2.000.000.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["pungutan_biaya", "upah_tidak_diungkap"],
    expectedSkor: 17,
    catatan: "Penempatan luar negeri yang dibarengi pungutan biaya.",
  },
  {
    id: "t10_ktp_rekening",
    teks: "PT Rekrut Cepat mencari Staff. Kirim foto KTP dan buku rekening, lalu transfer biaya seragam Rp200.000.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["pungutan_biaya", "upah_tidak_diungkap"],
    expectedSkor: 17,
    catatan:
      "Permintaan dokumen sensitif dan transfer biaya dalam satu iklan pendek.",
  },
  {
    id: "t11_tanpa_interview",
    teks: "PT Andalan Sukses membuka lowongan. Langsung diterima tanpa interview, hubungi andalansukses@gmail.com.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: [
      "diterima_tanpa_seleksi",
      "email_gratis",
      "upah_tidak_diungkap",
    ],
    expectedSkor: 12,
    catatan:
      'Variasi kata "tanpa interview" untuk aturan diterima tanpa seleksi.',
  },
  {
    id: "t12_downline",
    teks: "PT Untung Terus membuka lowongan. Sistem komisi berantai, cari downline. Chat DM Instagram @untungterus.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: [
      "rekrut_via_dm_samar",
      "skema_komisi_berantai",
      "upah_tidak_diungkap",
    ],
    expectedSkor: 18,
    catatan: "Skema komisi berantai yang disalurkan lewat pesan pribadi.",
  },
  {
    id: "t13_cepat_kaya",
    teks: "PT Cepat Kaya mencari Sales. Gaji Rp 40.000.000 per bulan tanpa pengalaman. Kuota terbatas.",
    lokasi: "Jakarta",
    expectedBand: "tinggi",
    expectedRuleIds: ["gaji_tidak_wajar_tinggi", "tekanan_mendesak"],
    expectedSkor: 12,
    catatan:
      "Kasus batas ambang upah: tepat Rp 40.000.000 sudah memicu aturan upah tidak wajar.",
  },
];
