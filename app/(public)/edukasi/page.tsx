export const metadata = {
  title: "Edukasi — CekLoker",
};

const POLA_WASPADA = [
  {
    judul: "Diminta membayar biaya",
    uraian:
      "Rekrutmen resmi tidak memungut biaya dari pelamar, apa pun namanya: biaya administrasi, seragam, pelatihan, atau jaminan.",
    saran:
      "Jangan membayar apa pun. Bila diminta, hentikan proses dan pertimbangkan melaporkannya.",
  },
  {
    judul: "Gaji jauh di atas kisaran wajar",
    uraian:
      "Nominal gaji yang jauh melampaui standar posisi serupa dengan syarat ringan patut dipertanyakan.",
    saran:
      "Minta rincian komponen gaji dan target yang menyertainya secara tertulis.",
  },
  {
    judul: "Komunikasi hanya lewat kanal pribadi",
    uraian:
      "Proses yang hanya berjalan lewat pesan pribadi tanpa identitas perusahaan yang jelas menyulitkan verifikasi.",
    saran:
      "Cari kanal resmi perusahaan dan pindahkan komunikasi ke sana sebelum memberikan data apa pun.",
  },
  {
    judul: "Dokumen sensitif diminta terlalu dini",
    uraian:
      "Nomor rekening, fotokopi identitas, atau data keluarga belum seharusnya diminta sebelum ada kontrak dan proses seleksi yang jelas.",
    saran:
      "Tunda pengiriman dokumen hingga tahapan seleksi dan kontrak resmi tersedia.",
  },
  {
    judul: "Diterima tanpa seleksi",
    uraian:
      "Proses seleksi resmi memiliki tahapan. Penerimaan instan tanpa wawancara layak dicurigai.",
    saran:
      "Tanyakan tahapan seleksi resmi dan jangan menyerahkan berkas sebelum prosesnya jelas.",
  },
  {
    judul: "Tekanan untuk memutuskan segera",
    uraian:
      "Batasan waktu yang mendesak seperti 'hari ini juga' bertujuan membuat Anda tidak sempat memverifikasi.",
    saran:
      "Abaikan tekanan waktu dan ambil keputusan setelah memverifikasi perusahaan.",
  },
  {
    judul: "Penghasilan bergantung pada anggota baru",
    uraian:
      "Skema yang menjanjikan komisi dari merekrut orang lain lagi berpotensi menjadi penipuan rekrutmen berantai.",
    saran:
      "Minta penjelasan tertulis sumber penghasilan utama dan hindari skema yang bergantung pada anggota baru.",
  },
];

const HAK_DASAR = [
  {
    judul: "Upah minimum",
    uraian:
      "Upah minimum provinsi ditetapkan pemerintah setiap tahun. Nominal upah dalam iklan tidak boleh di bawah angka provinsi yang berlaku.",
  },
  {
    judul: "Batas jam kerja",
    uraian:
      "Peraturan perundang-undangan menetapkan batas jam kerja wajar per hari dan per minggu, termasuk ketentuan upah lembur dan hak istirahat mingguan.",
  },
  {
    judul: "Penempatan luar negeri",
    uraian:
      "Penempatan pekerja ke luar negeri harus melalui perusahaan penempatan berizin resmi (P3MI), bukan perantara perorangan.",
  },
];

const CARA_VERIFIKASI = [
  "Cari nama badan usaha lengkap dan alamat kantor, lalu cocokkan dengan situs resmi perusahaan.",
  "Hubungi perusahaan lewat kanal resmi yang tertera di situsnya, bukan nomor yang muncul dari iklan.",
  "Bandingkan nominal upah dengan upah minimum provinsi pada sumber resmi pemerintah.",
  "Baca kontrak dengan saksama sebelum menandatangani atau menyerahkan dokumen apa pun.",
  "Bila menemukan pelanggaran ketenagakerjaan, laporkan ke instansi ketenagakerjaan setempat.",
];

export default function HalamanEdukasi() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Edukasi
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Sebelum melamar, pahami hak dasar Anda sebagai pencari kerja dan
          pola yang sering muncul pada praktik rekrutmen yang merugikan.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Hak dasar pekerja
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {HAK_DASAR.map((hak) => (
            <div
              key={hak.judul}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {hak.judul}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {hak.uraian}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Pola yang perlu diwaspadai
        </h2>
        <ul className="flex flex-col gap-4">
          {POLA_WASPADA.map((pola) => (
            <li
              key={pola.judul}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {pola.judul}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {pola.uraian}
              </p>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">Yang bisa Anda lakukan: </span>
                {pola.saran}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Daftar periksa verifikasi
        </h2>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {CARA_VERIFIKASI.map((butir) => (
            <li key={butir}>{butir}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
