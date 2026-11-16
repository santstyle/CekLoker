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
  {
    id: "biaya-pelatihan",
    pertanyaan:
      "Iklan menyebut pelatihan wajib yang biayanya harus Anda bayar sebelum mulai bekerja. Sikap paling tepat adalah…",
    pilihan: [
      "Membayar karena pelatihan menambah keterampilan",
      "Membayar setengah dulu, sisanya dipotong dari gaji",
      "Menolak — biaya pelatihan tidak boleh dibebankan kepada pelamar",
      "Membayar asalkan pelatihan diadakan di kantor perusahaan",
    ],
    jawaban: 2,
    penjelasan:
      "Pungutan biaya penempatan kepada tenaga kerja dilarang, termasuk yang dikemas sebagai biaya pelatihan wajib sebelum kerja. Pelatihan kerja adalah kewajiban pemberi kerja, bukan beban pelamar.",
    rujukan: "Pasal 38 ayat (1) UU No. 13/2003",
  },
  {
    id: "identitas-perusahaan",
    pertanyaan:
      "Iklan lowongan tidak mencantumkan nama badan usaha maupun alamat kantor. Langkah verifikasi paling masuk akal adalah…",
    pilihan: [
      "Mencari nama badan usaha di AHU Kemenkumham sebelum melamar",
      "Percaya karena iklan sudah tayang di media sosial",
      "Mengirim fotokopi KTP agar perusahaan membuka identitasnya",
      "Menanyakan nama perusahaan hanya lewat kolom komentar publik",
    ],
    jawaban: 0,
    penjelasan:
      "Identitas badan usaha yang jelas adalah syarat dasar sebelum Anda mengirim data pribadi. Jika nama perusahaan tidak dapat diverifikasi, tunda lamaran dan cari lowongan lain.",
  },
  {
    id: "wawancara-chat",
    pertanyaan:
      "Anda dinyatakan “diterima” hanya lewat chat tanpa wawancara, lalu diminta segera mengisi data rekening. Yang paling tepat adalah…",
    pilihan: [
      "Mengisi data rekening agar gaji bisa segera dikirim",
      "Meminta wawancara resmi dan menunda data rekening hingga ada kontrak",
      "Mengisi data rekening lalu memblokir nomor tersebut",
      "Membagikan data rekening ke grup pelamar lain",
    ],
    jawaban: 1,
    penjelasan:
      "Penerimaan tanpa wawancara dan permintaan data rekening secara mendadak adalah pola yang perlu diperiksa. Minta proses seleksi resmi dan perjanjian kerja sebelum menyerahkan data keuangan.",
  },
  {
    id: "gaji-tanpa-angka",
    pertanyaan:
      "Iklan menulis “gaji menarik, bisa nego” tanpa angka sama sekali. Apa yang sebaiknya Anda lakukan?",
    pilihan: [
      "Menganggap gajinya besar karena disebut menarik",
      "Melamar dulu, urusan gaji dibicarakan setelah masuk kerja",
      "Menanyakan rentang gaji yang jelas sebelum melanjutkan proses",
      "Menyetujui berapa pun nominalnya agar cepat diterima",
    ],
    jawaban: 2,
    penjelasan:
      "Upah yang tidak dinyatakan membuat Anda tidak bisa menilai kewajaran tawaran. Menanyakan rentang upah di awal adalah hal wajar dan melindungi Anda dari kesepakatan yang sepihak.",
  },
  {
    id: "rekening-orang-lain",
    pertanyaan:
      "Perusahaan meminta upah Anda dikirim ke rekening milik orang lain yang bukan nama Anda. Bagaimana menyikapinya?",
    pilihan: [
      "Menolak dan meminta upah dibayarkan ke rekening atas nama sendiri",
      "Menuruti karena mungkin hanya prosedur internal",
      "Menuruti bila orang itu mengaku sebagai staf HRD",
      "Mengirim buku tabungan sendiri agar bisa dicek",
    ],
    jawaban: 0,
    penjelasan:
      "Upah adalah hak pekerja dan sebaiknya masuk ke rekening atas nama Anda sendiri. Permintaan mengalihkan upah ke rekening pihak lain menyulitkan pembuktian jika terjadi sengketa.",
  },
  {
    id: "kontrak-tertulis",
    pertanyaan:
      "Anda diminta mulai bekerja tanpa perjanjian kerja tertulis. Langkah paling tepat adalah…",
    pilihan: [
      "Mulai bekerja karena sudah ada janji lisan",
      "Mulai bekerja karena upah sudah dijanjikan lewat pesan singkat",
      "Menolak semua pekerjaan yang tidak punya kontrak",
      "Meminta perjanjian kerja tertulis yang memuat upah, jabatan, dan syarat kerja",
    ],
    jawaban: 3,
    penjelasan:
      "Perjanjian kerja yang memuat nama, jabatan, besaran upah, dan syarat kerja melindungi kedua pihak. Tanpa dokumen itu, Anda sulit membuktikan isi kesepakatan saat terjadi perselisihan.",
  },
  {
    id: "lembur-tidak-dibayar",
    pertanyaan:
      "Atasan meminta Anda lembur setiap hari tanpa membayar upah lembur. Menurut aturan, yang benar adalah…",
    pilihan: [
      "Lembur tidak perlu dibayar bila dilakukan atas kemauan sendiri",
      "Kerja lembur wajib dibayar sesuai ketentuan; tolak lembur yang tidak dibayar",
      "Lembur hanya dibayar bila ada surat perintah tertulis",
      "Lembur cukup diganti dengan pujian dari atasan",
    ],
    jawaban: 1,
    penjelasan:
      "Waktu kerja lembur dan upah lembur diatur tersendiri. Pekerjaan di luar jam kerja normal yang diperintahkan atasan tetap harus dibayar sesuai ketentuan.",
    rujukan: "PP No. 35/2021",
  },
  {
    id: "pin-buku-tabungan",
    pertanyaan:
      "Perekrut meminta PIN dan buku tabungan Anda untuk “verifikasi gaji”. Sikap tepat adalah…",
    pilihan: [
      "Memberikan keduanya karena itu bagian dari verifikasi",
      "Memberikan PIN saja tanpa buku tabungan",
      "Memberikan keduanya lalu mengganti PIN setelahnya",
      "Menolak — data perbankan pribadi tidak boleh diserahkan ke perekrut",
    ],
    jawaban: 3,
    penjelasan:
      "PIN dan buku tabungan adalah kunci akses dana Anda. Tidak ada proses rekrutmen resmi yang membutuhkannya; permintaan seperti ini justru berpotensi merugikan Anda.",
  },
  {
    id: "domain-surel",
    pertanyaan:
      "Perekrut mengirim tawaran kerja dari alamat surel gratis, bukan domain perusahaan. Apa artinya bagi Anda?",
    pilihan: [
      "Tidak ada masalah, semua perusahaan boleh memakai surel gratis",
      "Perlu verifikasi tambahan karena identitas perusahaan belum jelas",
      "Tawaran itu sudah pasti tidak benar",
      "Berarti perusahaan tersebut baru dan pasti resmi",
    ],
    jawaban: 1,
    penjelasan:
      "Alamat surel bukan bukti sah atau tidaknya sebuah tawaran. Namun ketidaksesuaian domain adalah alasan wajar untuk memverifikasi identitas perusahaan melalui kanal resmi sebelum melanjutkan.",
  },
  {
    id: "biaya-mcu",
    pertanyaan:
      "Perusahaan meminta Anda membayar biaya medical check-up (MCU) sebelum kontrak ditandatangani. Sebaiknya…",
    pilihan: [
      "Membayar karena MCU memang mahal",
      "Membayar lalu meminta penggantian setelah masuk kerja",
      "Menolak membayar dan meminta kejelasan siapa yang menanggung biaya pemeriksaan",
      "Membayar ke rekening pribadi perekrut",
    ],
    jawaban: 2,
    penjelasan:
      "MCU adalah bagian dari proses penerimaan kerja yang disiapkan pemberi kerja. Pembayaran ke rekening pribadi perekrut, tanpa dokumen resmi, adalah pola yang perlu dihindari.",
    rujukan: "Pasal 38 ayat (1) UU No. 13/2003",
  },
  {
    id: "tautan-pendek",
    pertanyaan:
      "Undangan wawancara hanya berisi tautan pendek tanpa nama perusahaan, dikirim lewat pesan acak. Langkah aman adalah…",
    pilihan: [
      "Mengklik tautan dan mengisi seluruh data pribadi",
      "Langsung hadir tanpa memeriksa apa pun",
      "Meneruskan tautan ke teman untuk dicoba lebih dulu",
      "Memeriksa tujuan tautan dan memastikan alamat kantor resmi sebelum hadir",
    ],
    jawaban: 3,
    penjelasan:
      "Tautan pendek menyembunyikan alamat sebenarnya. Pastikan tujuan tautan dan alamat kantor dapat diverifikasi, dan jangan mengisi data pribadi di halaman yang tidak jelas pemiliknya.",
  },
  {
    id: "uang-jaminan",
    pertanyaan:
      "Anda diminta menyetor “uang jaminan” agar berkas lamaran diproses. Apa yang tepat?",
    pilihan: [
      "Menyetor karena jumlahnya kecil",
      "Menolak — jaminan uang untuk diterima kerja bukan praktik resmi",
      "Menyetor asalkan mendapat kuitansi",
      "Menyetor setengahnya lebih dulu",
    ],
    jawaban: 1,
    penjelasan:
      "Tidak ada ketentuan yang membenarkan pemberi kerja memungut uang jaminan dari pelamar. Kuitansi tidak membuat pungutan itu menjadi sah.",
    rujukan: "Pasal 38 ayat (1) UU No. 13/2003",
  },
  {
    id: "tekanan-waktu",
    pertanyaan:
      "Perekrut menekan Anda: “Transfer sekarang atau posisi diberikan ke orang lain dalam sepuluh menit.” Sikap terbaik adalah…",
    pilihan: [
      "Mengikuti tenggat agar tidak kehilangan kesempatan",
      "Meminta waktu untuk mengecek, lalu memverifikasi perusahaan tanpa terburu-buru",
      "Mentransfer sebagian supaya posisi ditahan",
      "Mengirim seluruh dokumen pribadi sekaligus",
    ],
    jawaban: 1,
    penjelasan:
      "Tekanan waktu yang ekstrem bertujuan menghalangi Anda berpikir dan memverifikasi. Rekrutmen yang wajar memberi ruang bagi pelamar untuk membaca dan mempertimbangkan tawaran.",
  },
  {
    id: "ijazah-ditahan",
    pertanyaan:
      "Perusahaan menahan ijazah asli Anda sebagai syarat masuk kerja. Bagaimana menanggapinya?",
    pilihan: [
      "Menyerahkan ijazah asli karena itu hal biasa",
      "Menyerahkan asli tetapi meminta fotokopi sebagai gantinya",
      "Menolak menyerahkan dokumen asli dan menawarkan salinan yang dilegalisasi",
      "Menyerahkan asli hanya untuk satu bulan pertama",
    ],
    jawaban: 2,
    penjelasan:
      "Ijazah asli adalah dokumen pribadi yang sulit diganti. Menyerahkan salinan resmi sudah cukup untuk keperluan administrasi, dan menahan dokumen asli menyulitkan Anda melamar di tempat lain.",
  },
  {
    id: "deposit-kursi",
    pertanyaan:
      "“Deposit kursi” diminta agar Anda “mengunci” tempat pelatihan. Tanggapan paling tepat adalah…",
    pilihan: [
      "Membayar agar kursi tidak diambil orang lain",
      "Membayar bila deposit dijanjikan dikembalikan setelah bekerja",
      "Meminta nomor rekening perusahaan untuk mentransfer",
      "Menolak dan mencari lowongan yang tidak memungut biaya dari pelamar",
    ],
    jawaban: 3,
    penjelasan:
      "Biaya apa pun yang diminta dari pelamar sebelum bekerja, dengan nama apa pun, adalah tanda peringatan. Janji pengembalian deposit sulit ditagih bila tidak ada perjanjian resmi.",
    rujukan: "Pasal 38 ayat (1) UU No. 13/2003",
  },
  {
    id: "data-sebelum-seleksi",
    pertanyaan:
      "Sebelum seleksi, Anda diminta mengirim swafoto memegang KTP beserta nomor kartu keluarga. Sebaiknya…",
    pilihan: [
      "Menolak dulu dan menanyakan dasar serta tujuan permintaan tersebut",
      "Mengirim karena diminta untuk kelengkapan berkas",
      "Mengirim lewat pesan pribadi agar prosesnya cepat",
      "Mengirim swafoto KTP saja tanpa kartu keluarga",
    ],
    jawaban: 0,
    penjelasan:
      "Data kependudukan dapat disalahgunakan untuk pendaftaran pinjaman atau pembukaan rekening. Kirim hanya setelah proses seleksi jelas dan tujuan permintaan dapat dipertanggungjawabkan.",
  },
  {
    id: "tawaran-terlalu-bagus",
    pertanyaan:
      "Tawaran kerja jauh di atas harga pasar, tanpa seleksi, dan tanpa kejelasan atasan. Langkah bijak adalah…",
    pilihan: [
      "Langsung menerima karena kesempatan seperti itu langka",
      "Meminta rincian tertulis tentang jabatan, atasan, dan lingkup kerja sebelum memutuskan",
      "Membayar biaya orientasi agar segera masuk",
      "Mengajak teman ikut agar tidak sendirian",
    ],
    jawaban: 1,
    penjelasan:
      "Tawaran yang terlalu mudah biasanya tidak sepadan dengan risikonya. Rincian tertulis tentang jabatan, atasan, dan lingkup kerja membantu Anda menilai kewajaran tawaran.",
  },
  {
    id: "pinjaman-biaya",
    pertanyaan:
      "Perusahaan menawarkan pinjaman untuk biaya keberangkatan yang akan dipotong dari gaji. Apa yang perlu Anda periksa?",
    pilihan: [
      "Tidak perlu diperiksa karena sudah dipotong dari gaji",
      "Cukup memastikan pinjamannya cepat cair",
      "Pastikan pinjaman, potongan, dan sisa upah tertulis jelas serta tidak membuat upah di bawah minimum",
      "Serahkan seluruh dokumen agar segera diproses",
    ],
    jawaban: 2,
    penjelasan:
      "Potongan atas pinjaman tidak boleh membuat upah yang Anda terima turun di bawah ketentuan upah minimum. Semua angka pinjaman dan potongan sebaiknya tertulis dalam perjanjian.",
    rujukan: "UU No. 6/2023 Cipta Kerja",
  },
  {
    id: "lokasi-wawancara",
    pertanyaan:
      "Wawancara dijanjikan di sebuah rumah kos tanpa identitas kantor, dan Anda diminta datang sendirian pada malam hari. Tindakan aman adalah…",
    pilihan: [
      "Datang sendirian agar terlihat serius",
      "Datang dengan membawa semua dokumen asli",
      "Meminta wawancara di kantor resmi pada jam kerja atau menundanya bila tidak jelas",
      "Mentransfer biaya administrasi lebih dulu",
    ],
    jawaban: 2,
    penjelasan:
      "Keselamatan pribadi lebih penting daripada peluang kerja. Wawancara resmi berlangsung di tempat yang dapat diverifikasi, pada jam kerja, dan tidak meminta Anda datang sendirian dalam kondisi berisiko.",
  },
  {
    id: "rincian-potongan",
    pertanyaan:
      "Iklan menyebut “gaji 5 juta, tetapi setelah potongan internal diterima 2 juta” tanpa rincian. Apa yang perlu Anda minta?",
    pilihan: [
      "Rincian tertulis komponen upah dan potongan sebelum menyetujui",
      "Janji lisan bahwa potongan akan dikembalikan nanti",
      "Tidak perlu dipertanyakan karena potongan itu wajar",
      "Meminta potongan ditambah agar lebih transparan",
    ],
    jawaban: 0,
    penjelasan:
      "Upah yang Anda terima harus dapat dihitung dari komponen yang jelas. Tanpa rincian tertulis, besar potongan bisa berubah sepihak setelah Anda mulai bekerja.",
    rujukan: "PP No. 35/2021",
  },
  {
    id: "aplikasi-tidak-resmi",
    pertanyaan:
      "Perekrut meminta Anda memasang aplikasi dari tautan luar (bukan toko aplikasi resmi) sebagai syarat seleksi. Sebaiknya…",
    pilihan: [
      "Memasang karena diwajibkan oleh perekrut",
      "Memasang asalkan tautannya dikirim langsung oleh perekrut",
      "Menolak memasang aplikasi di luar toko resmi dan meminta proses seleksi yang wajar",
      "Memasang lalu mengirim tangkapan layar isi ponsel",
    ],
    jawaban: 2,
    penjelasan:
      "Aplikasi dari sumber tidak resmi berisiko mencuri data atau mengendalikan perangkat Anda. Seleksi kerja yang wajar tidak memerlukan pemasangan aplikasi di luar kanal resmi.",
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

/** Jumlah soal yang ditampilkan pada satu sesi kuis. */
export const SOAL_PER_KUIS = 7;

/**
 * PRNG mulberry32 — kecil, deterministik, dan cukup untuk mengacak urutan
 * soal. Seed yang sama selalu menghasilkan urutan yang sama sehingga kuis
 * dapat diulang atau dibagikan lewat `?set=` tanpa menulis apa pun ke server.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Memilih `jumlah` soal unik dari bank soal secara deterministik berdasarkan
 * `seed`. Urutan soal tidak pernah berubah untuk seed yang sama.
 *
 * `jumlah` dipangkas ke panjang bank agar tidak pernah mengembalikan soal
 * duplikat atau `undefined`.
 */
export function pilihSoalKuis(
  seed: number,
  jumlah: number = SOAL_PER_KUIS,
  bank: readonly PertanyaanKuis[] = KUIS_PERTANYAAN,
): readonly PertanyaanKuis[] {
  const total = Math.max(0, Math.min(Math.floor(jumlah), bank.length));
  const acak = [...bank];
  const rand = mulberry32(Number.isFinite(seed) ? seed : 0);

  // Fisher–Yates dari belakang; hanya `total` elemen terakhir yang pasti
  // teracak, jadi cukup berhenti di `acak.length - total`.
  for (let i = acak.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const sementara = acak[i]!;
    acak[i] = acak[j]!;
    acak[j] = sementara;
  }

  return acak.slice(acak.length - total).reverse();
}

/**
 * Menilai jawaban kuis. `jawaban[i]` adalah indeks pilihan untuk soal ke-i;
 * nilai `undefined`, non-integer, atau di luar jangkauan dihitung sebagai
 * kosong — bukan salah — supaya hasil refleksi diri tetap jujur.
 *
 * `soal` dapat diisi set soal yang benar-benar ditampilkan (hasil
 * `pilihSoalKuis`); secara bawaan memakai seluruh bank soal.
 */
export function nilaiKuis(
  jawaban: readonly (number | undefined)[],
  soal: readonly PertanyaanKuis[] = KUIS_PERTANYAAN,
): HasilKuis {
  let benar = 0;
  let salah = 0;
  let kosong = 0;

  soal.forEach((butir, indeks) => {
    const dipilih = jawaban[indeks];
    const valid =
      typeof dipilih === "number" &&
      Number.isInteger(dipilih) &&
      dipilih >= 0 &&
      dipilih < butir.pilihan.length;

    if (!valid) {
      kosong += 1;
      return;
    }
    if (dipilih === butir.jawaban) {
      benar += 1;
    } else {
      salah += 1;
    }
  });

  const skorPersen =
    soal.length === 0 ? 0 : Math.round((benar / soal.length) * 100);
  const kategori: KategoriKuis =
    skorPersen === 100
      ? "sangat_baik"
      : skorPersen >= 50
        ? "cukup_baik"
        : "perlu_dipelajari";

  return { benar, salah, kosong, skorPersen, kategori };
}
