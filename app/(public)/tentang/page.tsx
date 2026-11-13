import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Kepala } from "@/components/situs/kepala";
import { EVALUATOR_VERSION } from "@/lib/evaluation/evaluate";
import { metadataHalaman } from "@/lib/situs";

export const metadata: Metadata = metadataHalaman({
  judul: "Tentang Inisiatif",
  deskripsi:
    "Alasan CekLoker dibangun, prinsip integritas produk, arsitektur teknologi, dan batas layanan yang perlu dipahami pengguna.",
  jalur: "/tentang",
});

const PRINSIP = [
  {
    nomor: "01",
    judul: "Tanpa Vonis Sepihak",
    uraian:
      "CekLoker tidak pernah menghakimi secara mutlak sebuah lowongan 'penipuan' atau 'asli'. Kami menyajikan rentang risiko terukur beserta kutipan bukti dan rujukan hukum resmi agar pencari kerja dapat mengambil keputusan secara mandiri dan bijak.",
  },
  {
    nomor: "02",
    judul: "Deterministik Murni",
    uraian:
      "Hasil evaluasi dihitung oleh sekumpulan aturan baku ketenagakerjaan, bukan opini acak model generatif. Teks iklan yang sama akan selalu menghasilkan skor dan rentang risiko yang konsisten.",
  },
  {
    nomor: "03",
    judul: "Privasi Tanpa Kompromi",
    uraian:
      "Teks iklan lowongan yang Anda tempel dianalisis saat itu juga dan tidak pernah disimpan di basis data server kami. Kami menghormati kerahasiaan data pencari kerja sepenuhnya.",
  },
];

export default function HalamanTentang() {
  return (
    <div className="bg-cream">
      <Kepala
        kicker="Tentang Inisiatif · SDG 8"
        judul={
          <>
            Inisiatif terbuka untuk{" "}
            <span className="teks-gradasi-terang">pekerjaan layak.</span>
          </>
        }
        deskripsi="CekLoker dibangun untuk mendukung SDG 8 (Decent Work & Economic Growth), mendampingi pencari kerja di Indonesia dari indikator risiko dan pelanggaran hak kerja."
      />

      <Container className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-16 sm:gap-20">
          {/* 3 Prinsip Utama */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Prinsip Integritas Produk
              </h2>
              <p className="text-sm text-slate-500">
                Landasan etika dalam setiap baris kode CekLoker.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {PRINSIP.map((prinsip) => (
                <div
                  key={prinsip.judul}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-rose-500 font-mono text-[0.65rem] font-semibold text-white shadow-md"
                    >
                      {prinsip.nomor}
                    </span>
                    <h3 className="text-lg font-bold text-slate-950">
                      {prinsip.judul}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {prinsip.uraian}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Arsitektur Teknologi */}
          <section className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs sm:p-10">
            <h2 className="text-2xl font-black text-slate-950">
              Spesifikasi Teknologi Terverifikasi
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fondasi arsitektur perangkat lunak yang andal, aman, dan dapat
              diuji.
            </p>

            <ul className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-slate-700 sm:text-base">
              <li className="flex items-start gap-3">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-slate-950" />
                <span>
                  <strong className="text-slate-950">
                    Next.js App Router &amp; TypeScript Strict:
                  </strong>{" "}
                  Arsitektur aplikasi modern dengan performa kompilasi instan
                  dan keamanan tipe penuh.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-slate-950" />
                <span>
                  <strong className="text-slate-950">
                    Mesin Evaluasi Versi {EVALUATOR_VERSION}:
                  </strong>{" "}
                  Seluruh aturan diuji secara deterministik melalui pengujian
                  otomatis Vitest.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-slate-950" />
                <span>
                  <strong className="text-slate-950">
                    Drizzle ORM &amp; Neon Postgres:
                  </strong>{" "}
                  Persistensi metadata agregat dengan validasi skema Zod tanpa
                  menyimpan isi lowongan teks mentah pengguna.
                </span>
              </li>
            </ul>
          </section>

          {/* Keterbatasan Layanan */}
          <div className="rounded-3xl border border-slate-200/80 bg-slate-100/70 p-7 text-xs leading-relaxed text-slate-600 sm:p-9 sm:text-sm">
            <span className="font-bold text-slate-900">Batasan Layanan: </span>
            CekLoker adalah instrumen skrining awal dan bukan pengganti
            konsultasi hukum resmi atau penyelidikan aparat penegak hukum.
            Analisis dibatasi oleh isi informasi tertulis pada teks yang
            dimasukkan pengguna.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cek"
              className="rounded-full bg-slate-950 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800"
            >
              Mulai Evaluasi Lowongan
            </Link>
            <Link
              href="/metodologi"
              className="rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
            >
              Pelajari Metodologi Penilaian
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
