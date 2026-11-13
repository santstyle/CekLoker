import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LABEL_BAND } from "@/lib/evaluation/evaluate";
import { RULES } from "@/lib/evaluation/rules";
import { labelRujukan } from "@/lib/evaluation/rujukan";
import { BATAS_BAND } from "@/lib/evaluation/score";
import { KEKUATAN_NILAI, type KategoriRule } from "@/lib/evaluation/types";
import { CATATAN_DATA_UPAH } from "@/lib/evaluation/wages";
import { metadataHalaman } from "@/lib/situs";

const LABEL_KATEGORI: Record<KategoriRule, string> = {
  upah: "Kompensasi Upah",
  kontak: "Saluran Kontak",
  identitas: "Identitas Perusahaan",
  dokumen: "Data Pribadi",
  seleksi: "Prosedur Rekrutmen",
  tekanan: "Tekanan Waktu",
  diskriminasi: "Klausul Diskriminasi",
  penempatan: "Penempatan Kerja",
  lainnya: "Indikator Lain",
};

const LABEL_KEKUATAN = {
  lemah: "Lemah (×0,5)",
  sedang: "Sedang (×1)",
  kuat: "Kuat (×1,5)",
} as const;

export const metadata: Metadata = metadataHalaman({
  judul: "Metodologi",
  deskripsi:
    "Cara CekLoker menghitung rentang risiko: daftar aturan, bobot kategori, ambang skor, dan rujukan hukum yang dipakai secara deterministik.",
  jalur: "/metodologi",
});

export default function HalamanMetodologi() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50/60 py-16 sm:py-24">
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
      >
        <div className="aspect-[1155/678] w-[65rem] flex-none bg-gradient-to-tr from-blue-400/20 to-indigo-400/15 opacity-60" />
      </div>

      <Container>
        <div className="mx-auto flex max-w-4xl flex-col gap-16 sm:gap-20">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-800 shadow-2xs">
              <span className="size-1.5 animate-pulse rounded-full bg-blue-600" />
              <span>Transparansi Algoritma</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-balance text-slate-950 sm:text-5xl">
              Metodologi Evaluasi Deterministik
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              CekLoker beroperasi secara deterministik: masukan teks yang sama
              akan selalu menghasilkan skor, temuan, dan rentang risiko yang
              identik tanpa bias model generatif.
            </p>
          </div>

          {/* Alur Pemeriksaan */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Alur Pemeriksaan Sistem
              </h2>
              <p className="text-sm text-slate-500">
                5 tahapan evaluasi data yang dijalankan oleh mesin CekLoker.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs sm:p-10">
              <ol className="flex list-decimal flex-col gap-5 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
                <li>
                  <strong className="text-slate-950">Normalisasi Teks: </strong>
                  Karakter dan spasi distandarisasi untuk mencegah teknik
                  manipulasi teks (misal: penggantian huruf dengan simbol) tanpa
                  mengubah makna isi iklan.
                </li>
                <li>
                  <strong className="text-slate-950">
                    Pemeriksaan Aturan (Pattern Matching &amp; Threshold):{" "}
                  </strong>
                  Setiap aturan memindai pola linguistik dan ambang kuantitatif
                  pada teks lowongan.
                </li>
                <li>
                  <strong className="text-slate-950">
                    Pencocokan Bukti Otentik:{" "}
                  </strong>
                  Setiap indikator yang terpicu wajib mengutip kalimat asli dari
                  teks lowongan sebagai bukti transparan bagi pengguna.
                </li>
                <li>
                  <strong className="text-slate-950">
                    Kalkulasi Skor Terbobot:{" "}
                  </strong>
                  Akumulasi skor dihitung dari bobot dasar aturan dikalikan
                  faktor kekuatan indikator (maksimum 100).
                </li>
                <li>
                  <strong className="text-slate-950">
                    Penetapan Rentang Risiko:{" "}
                  </strong>
                  Hasil akhir diklasifikasikan ke dalam 3 rentang risiko
                  objektif (Rendah, Perlu Dicek, Tinggi).
                </li>
              </ol>
              <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs leading-relaxed text-amber-900">
                {CATATAN_DATA_UPAH}
              </p>
            </div>
          </section>

          {/* Formula Skor Card */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Formula Perhitungan Skor
              </h2>
              <p className="text-sm text-slate-500">
                Rumus matematis baku tanpa campur tangan kecerdasan buatan
                opini.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs sm:p-9">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 font-mono text-sm font-bold text-slate-900">
                Kontribusi Indikator = Bobot Dasar Aturan (1–10) &times; Faktor
                Kekuatan
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Faktor pengali kekuatan:{" "}
                <strong>Lemah ({KEKUATAN_NILAI.lemah})</strong>,{" "}
                <strong>Sedang ({KEKUATAN_NILAI.sedang})</strong>, dan{" "}
                <strong>Kuat ({KEKUATAN_NILAI.kuat})</strong>. Total skor
                dibulatkan ke bilangan bulat terdekat dan dibatasi pada rentang
                0 hingga 100.
              </p>
            </div>
          </section>

          {/* Tiga Rentang Klasifikasi */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Batas Ambang Rentang Risiko
              </h2>
              <p className="text-sm text-slate-500">
                Kriteria penetapan status evaluasi berdasarkan akumulasi skor.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 text-blue-950 shadow-2xs">
                <span className="text-xs font-bold tracking-wider uppercase opacity-75">
                  Rentang 1
                </span>
                <p className="mt-2 text-2xl font-black">{LABEL_BAND.rendah}</p>
                <p className="mt-1 text-xs font-semibold text-blue-700">
                  Skor &lt; {BATAS_BAND.perluDicek}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  Tidak ditemukan indikator pelanggaran standar kerja yang
                  signifikan.
                </p>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 text-amber-950 shadow-2xs">
                <span className="text-xs font-bold tracking-wider uppercase opacity-75">
                  Rentang 2
                </span>
                <p className="mt-2 text-2xl font-black">
                  {LABEL_BAND.perlu_dicek}
                </p>
                <p className="mt-1 text-xs font-semibold text-amber-700">
                  Skor {BATAS_BAND.perluDicek} &ndash; {BATAS_BAND.tinggi - 1}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  Ditemukan indikator yang perlu dikonfirmasi keabsahannya.
                </p>
              </div>

              <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-6 text-rose-950 shadow-2xs">
                <span className="text-xs font-bold tracking-wider uppercase opacity-75">
                  Rentang 3
                </span>
                <p className="mt-2 text-2xl font-black">{LABEL_BAND.tinggi}</p>
                <p className="mt-1 text-xs font-semibold text-rose-700">
                  Skor &ge; {BATAS_BAND.tinggi}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  Ditemukan indikator berisiko tinggi atau pungutan biaya
                  terlarang.
                </p>
              </div>
            </div>
          </section>

          {/* Tabel Aturan Aktif */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Katalog {RULES.length} Aturan Evaluasi Aktif
              </h2>
              <p className="text-sm text-slate-500">
                Setiap aturan dirumuskan dari perundang-undangan resmi Republik
                Indonesia.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="p-4 font-bold text-slate-900">
                        Nama Aturan
                      </th>
                      <th className="p-4 font-bold text-slate-900">Kategori</th>
                      <th className="p-4 font-bold text-slate-900">Kekuatan</th>
                      <th className="p-4 font-bold text-slate-900">
                        Rujukan Hukum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {RULES.map((aturan) => (
                      <tr
                        key={aturan.id}
                        className="transition-colors hover:bg-slate-50/50"
                      >
                        <td className="p-4 align-top font-semibold text-slate-900">
                          {aturan.judul}
                        </td>
                        <td className="p-4 align-top text-slate-600">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                            {LABEL_KATEGORI[aturan.kategori]}
                          </span>
                        </td>
                        <td className="p-4 align-top text-slate-600">
                          {LABEL_KEKUATAN[aturan.kekuatan]}
                        </td>
                        <td className="p-4 align-top text-xs text-slate-600">
                          {aturan.rujukanHukumIds.length > 0
                            ? aturan.rujukanHukumIds
                                .map(labelRujukan)
                                .join(", ")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <div className="pt-2">
            <Link
              href="/cek"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800"
            >
              <span>Uji Metodologi dengan Lowongan Anda</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
