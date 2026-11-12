import Link from "next/link";

const RENTANG = [
  {
    band: "Rendah",
    warna: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
    uraian:
      "Tidak ditemukan indikator bermasalah pada teks lowongan. Tetap verifikasi ke sumber resmi sebelum melamar.",
  },
  {
    band: "Perlu dicek",
    warna: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
    uraian:
      "Ada indikator yang perlu dikonfirmasi langsung ke perusahaan atau melalui sumber resmi.",
  },
  {
    band: "Tinggi",
    warna: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
    uraian:
      "Ditemukan kombinasi indikator yang sering muncul pada penipuan rekrutmen. Berhati-hati sebelum melanjutkan.",
  },
];

const LANGKAH = [
  {
    judul: "Tempel teks lowongan",
    uraian:
      "Salin isi iklan lowongan apa adanya. Tambahkan lokasi bila ada agar perbandingan upah minimum lebih akurat.",
  },
  {
    judul: "Mesin memeriksa aturan",
    uraian:
      "Sistem membandingkan teks dengan serangkaian aturan ketenagakerjaan dan indikator risiko secara deterministik.",
  },
  {
    judul: "Baca hasilnya",
    uraian:
      "Anda mendapat rentang risiko, alasan, bukti kutipan, rujukan regulasi, dan saran langkah berikutnya.",
  },
];

export default function Beranda() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-5">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Periksa lowongan kerja sebelum melamar
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          CekLoker menilai iklan lowongan terhadap standar ketenagakerjaan
          Indonesia dan indikator yang sering muncul pada penipuan rekrutmen.
          Hasilnya berupa rentang risiko beserta alasan, bukti, rujukan hukum,
          dan saran — bukan vonis.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/cek"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Periksa Lowongan
          </Link>
          <Link
            href="/metodologi"
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Cara Kerjanya
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tiga rentang risiko
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {RENTANG.map((butir) => (
            <div
              key={butir.band}
              className={`rounded-xl border p-4 ${butir.warna}`}
            >
              <p className="text-base font-semibold">{butir.band}</p>
              <p className="mt-2 text-sm leading-relaxed">{butir.uraian}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Cara kerjanya
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {LANGKAH.map((langkah, indeks) => (
            <li
              key={langkah.judul}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                Langkah {indeks + 1}
              </p>
              <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">
                {langkah.judul}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {langkah.uraian}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <p className="font-semibold text-zinc-900 dark:text-zinc-50">
          Privasi Anda
        </p>
        <p className="mt-1">
          Teks lowongan yang Anda tempel tidak disimpan di server. Pemeriksaan
          berjalan atas permintaan, dan hasil tersimpan sementara di peramban
          Anda sendiri.
        </p>
      </section>
    </div>
  );
}
