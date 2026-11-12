import Link from "next/link";

import { EVALUATOR_VERSION } from "@/lib/evaluation/evaluate";

export const metadata = {
  title: "Tentang — CekLoker",
};

const PRINSIP = [
  {
    judul: "Tanpa vonis",
    uraian:
      "CekLoker tidak pernah menyatakan sebuah lowongan 'penipuan' atau 'asli'. Yang diberikan hanyalah rentang risiko beserta alasan dan buktinya, agar Anda bisa memutuskan sendiri.",
  },
  {
    judul: "Deterministik",
    uraian:
      "Hasil dihitung oleh aturan tetap, bukan opini model AI. Teks yang sama selalu menghasilkan rentang dan skor yang sama, sehingga mudah diuji dan direproduksi.",
  },
  {
    judul: "Privasi",
    uraian:
      "Teks lowongan yang Anda tempel tidak disimpan di server. Yang tercatat hanyalah ringkasan agregat tanpa isi teks, dan hasil pemeriksaan tersimpan sementara di peramban Anda sendiri.",
  },
];

export default function HalamanTentang() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tentang CekLoker
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          CekLoker membantu pencari kerja di Indonesia menilai iklan lowongan
          sebelum melamar. Tempel teks lowongan, dan mesin pemeriksaan
          membandingkannya dengan standar ketenagakerjaan serta indikator yang
          sering muncul pada penipuan rekrutmen.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Prinsip
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRINSIP.map((prinsip) => (
            <div
              key={prinsip.judul}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {prinsip.judul}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {prinsip.uraian}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Teknologi
        </h2>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            Next.js dengan App Router dan TypeScript strict sebagai aplikasi
            utama.
          </li>
          <li>
            Mesin evaluasi berbasis aturan dengan {EVALUATOR_VERSION} sebagai
            versi saat ini; seluruh perilakunya diuji dengan pengujian unit.
          </li>
          <li>
            Zod untuk validasi masukan, Drizzle ORM dengan Postgres (Neon)
            untuk pencatatan agregat, dan Vitest untuk pengujian.
          </li>
          <li>
            Basis pengetahuan aturan dan rujukan hukum dikelola lewat panel
            administrasi internal, bukan lewat aplikasi publik.
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <p className="font-semibold text-zinc-900 dark:text-zinc-50">
          Keterbatasan
        </p>
        <p className="mt-1">
          CekLoker bukan layanan hukum dan tidak menggantikan konsultasi dengan
          ahli hukum atau instansi ketenagakerjaan. Rentang risiko hanya
          mencerminkan isi teks yang Anda tempel; informasi yang tidak tertulis
          di sana tidak bisa dinilai.
        </p>
      </section>

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
          Baca Metodologi
        </Link>
      </div>
    </div>
  );
}
