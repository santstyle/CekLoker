import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Kepala } from "@/components/situs/kepala";
import { LABEL_BAND } from "@/lib/evaluation/evaluate";
import { hitungJenis, jenisAturan } from "@/lib/evaluation/jenis";
import { RULES } from "@/lib/evaluation/rules";
import { labelRujukan, urlRujukan } from "@/lib/evaluation/rujukan";
import { BATAS_BAND } from "@/lib/evaluation/score";
import {
  KEKUATAN_NILAI,
  type KategoriRule,
  type Rule,
} from "@/lib/evaluation/types";
import {
  DIPERBARUI_ATURAN,
  formatTanggalAturan,
  VERSI_ATURAN,
} from "@/lib/evaluation/versi";
import {
  CATATAN_DATA_UPAH,
  DATA_UPAH_TERSEDIA,
  LABEL_DATA_UPAH_BELUM_TERSEDIA,
} from "@/lib/evaluation/wages";
import { metadataHalaman } from "@/lib/situs";
import { Reveal } from "@/components/situs/reveal";

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

/** Tabel katalog aturan (dipakai untuk kelompok hukum dan pola). */
function TabelAturan({
  aturan,
  aturanUpahAktif,
}: {
  aturan: readonly Rule[];
  aturanUpahAktif: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="p-4 font-bold text-slate-900">Nama Aturan</th>
              <th className="p-4 font-bold text-slate-900">Kategori</th>
              <th className="p-4 font-bold text-slate-900">Kekuatan</th>
              <th className="p-4 font-bold text-slate-900">Rujukan Hukum</th>
              <th className="p-4 font-bold text-slate-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {aturan.map((butir) => (
              <tr
                key={butir.id}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="p-4 align-top font-semibold text-slate-900">
                  {butir.judul}
                </td>
                <td className="p-4 align-top text-slate-600">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                    {LABEL_KATEGORI[butir.kategori]}
                  </span>
                </td>
                <td className="p-4 align-top text-slate-600">
                  {LABEL_KEKUATAN[butir.kekuatan]}
                </td>
                <td className="p-4 align-top text-xs text-slate-600">
                  {butir.rujukanHukumIds.length > 0 ? (
                    <span className="flex flex-wrap gap-1">
                      {butir.rujukanHukumIds.map((id, idx) => {
                        const url = urlRujukan(id);
                        const label = labelRujukan(id);
                        return (
                          <span
                            key={`${id}-${idx}`}
                            className="flex items-center gap-0.5"
                          >
                            {url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-700 underline transition-colors hover:text-slate-900"
                              >
                                {label}
                              </a>
                            ) : (
                              <span className="text-slate-700">{label}</span>
                            )}
                            {idx < butir.rujukanHukumIds.length - 1 && (
                              <span
                                aria-hidden="true"
                                className="text-slate-400"
                              >
                                ,
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-4 align-top">
                  {butir.id === "upah_dibawah_umr" && !aturanUpahAktif ? (
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-amber-700">
                      {LABEL_DATA_UPAH_BELUM_TERSEDIA}
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      Aktif
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const metadata: Metadata = metadataHalaman({
  judul: "Metodologi",
  deskripsi:
    "Cara CekLoker menghitung rentang risiko: daftar aturan (dengan dan tanpa rujukan hukum), bobot kategori, dan ambang skor — dihitung secara deterministik.",
  jalur: "/metodologi",
});

export default function HalamanMetodologi() {
  // Hanya aturan upah_dibawah_umr yang bergantung pada data upah; hitungan
  // aturan aktif dihitung dari data, bukan di-hardcode.
  const aturanUpahAktif = DATA_UPAH_TERSEDIA;
  const jumlahAturanAktif = aturanUpahAktif ? RULES.length : RULES.length - 1;
  const { hukum: JUMLAH_HUKUM, pola: JUMLAH_POLA } = hitungJenis(RULES);
  const ATURAN_HUKUM = RULES.filter((butir) => jenisAturan(butir) === "hukum");
  const ATURAN_POLA = RULES.filter((butir) => jenisAturan(butir) === "pola");

  return (
    <div className="bg-cream">
      <Kepala
        kicker="Metodologi · Transparan"
        judul={
          <>
            Metodologi, <span className="teks-gradasi-terang">apa adanya.</span>
          </>
        }
        deskripsi="CekLoker beroperasi secara deterministik: masukan teks yang sama akan selalu menghasilkan skor, temuan, dan rentang risiko yang identik tanpa bias model generatif."
      />

      <Container className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-16 sm:gap-20">
          {/* Badge Status Data Upah */}
          <Reveal>
            <div className="flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-xs">
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="size-5 text-blue-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Data Upah Minimum Regional:{" "}
                  <span
                    className={
                      DATA_UPAH_TERSEDIA ? "text-green-700" : "text-amber-700"
                    }
                  >
                    {DATA_UPAH_TERSEDIA
                      ? "Tersedia & Aktif"
                      : "Belum Tersedia (Belum Aktif)"}
                  </span>
                </p>
                <p className="text-sm text-slate-600">{CATATAN_DATA_UPAH}</p>
              </div>
            </div>
          </Reveal>

          {/* Alur Pemeriksaan */}
          <Reveal delay={60}>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Alur Pemeriksaan Sistem
                </h2>
                <p className="text-sm text-muted">
                  5 tahapan evaluasi data yang dijalankan oleh mesin CekLoker.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs sm:p-10">
                <ol className="flex list-decimal flex-col gap-5 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
                  <li>
                    <strong className="text-slate-950">
                      Normalisasi Teks:{" "}
                    </strong>
                    Karakter dan spasi distandarisasi untuk mencegah teknik
                    manipulasi teks (misal: penggantian huruf dengan simbol)
                    tanpa mengubah makna isi iklan.
                  </li>
                  <li>
                    <strong className="text-slate-950">
                      Pemeriksaan Aturan (Pattern Matching &amp;
                      Threshold):{" "}
                    </strong>
                    Setiap aturan memindai pola linguistik dan ambang
                    kuantitatif pada teks lowongan.
                  </li>
                  <li>
                    <strong className="text-slate-950">
                      Pencocokan Bukti Otentik:{" "}
                    </strong>
                    Setiap indikator yang terpicu wajib mengutip kalimat asli
                    dari teks lowongan sebagai bukti transparan bagi pengguna.
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
                    objektif (Rendah, Perlu dicek, Tinggi).
                  </li>
                  <li>
                    <strong className="text-slate-950">
                      Aturan Penentu Langsung:{" "}
                    </strong>
                    Beberapa indikator terkuat dapat menetapkan rentang minimal
                    berapa pun skornya — misalnya pungutan biaya penempatan atau
                    permintaan dokumen sensitif di awal proses menandai rentang
                    Tinggi. Aturan semacam ini hanya menaikkan rentang, tidak
                    pernah menurunkannya.
                  </li>
                </ol>
              </div>
            </section>
          </Reveal>

          {/* Formula Skor Card */}
          <Reveal>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Formula Perhitungan Skor
                </h2>
                <p className="text-sm text-muted">
                  Rumus matematis baku tanpa campur tangan kecerdasan buatan
                  opini.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs sm:p-9">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 font-mono text-sm font-bold text-slate-900">
                  Kontribusi Indikator = Bobot Dasar Aturan (1–10) &times;
                  Faktor Kekuatan
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Faktor pengali kekuatan:{" "}
                  <strong>Lemah ({KEKUATAN_NILAI.lemah})</strong>,{" "}
                  <strong>Sedang ({KEKUATAN_NILAI.sedang})</strong>, dan{" "}
                  <strong>Kuat ({KEKUATAN_NILAI.kuat})</strong>. Total skor
                  dibulatkan ke bilangan bulat terdekat dan dibatasi pada
                  rentang 0 hingga 100.
                </p>
              </div>
            </section>
          </Reveal>

          {/* Tiga Rentang Klasifikasi */}
          <Reveal>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Batas Ambang Rentang Risiko
                </h2>
                <p className="text-sm text-muted">
                  Kriteria penetapan status evaluasi berdasarkan akumulasi skor.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 text-blue-950 shadow-2xs">
                  <span className="text-xs font-bold tracking-wider uppercase">
                    Rentang 1
                  </span>
                  <p className="mt-2 text-2xl font-black">
                    {LABEL_BAND.rendah}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-blue-700">
                    Skor &lt; {BATAS_BAND.perluDicek}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    Tidak ditemukan indikator pelanggaran standar kerja yang
                    signifikan.
                  </p>
                </div>

                <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 text-amber-950 shadow-2xs">
                  <span className="text-xs font-bold tracking-wider uppercase">
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
                  <span className="text-xs font-bold tracking-wider uppercase">
                    Rentang 3
                  </span>
                  <p className="mt-2 text-2xl font-black">
                    {LABEL_BAND.tinggi}
                  </p>
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
          </Reveal>

          {/* Tabel Aturan Aktif */}
          <Reveal>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Katalog {RULES.length} Aturan Evaluasi
                </h2>
                <p className="text-sm text-muted">
                  Sebagian aturan dirumuskan dari perundang-undangan resmi
                  Republik Indonesia; sebagian lainnya berdasarkan pola
                  indikator umum risiko rekrutmen, bukan pasal tertentu.{" "}
                  {aturanUpahAktif
                    ? `Seluruh ${RULES.length} aturan aktif.`
                    : `${jumlahAturanAktif} aturan aktif; aturan perbandingan upah menunggu data resmi.`}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-400">
                  Katalog aturan v{VERSI_ATURAN} &bull; diperbarui{" "}
                  {formatTanggalAturan(DIPERBARUI_ATURAN)}
                </p>
              </div>

              <div className="flex flex-col gap-8">
                <section
                  aria-labelledby="katalog-hukum"
                  className="flex flex-col gap-3"
                >
                  <div>
                    <h3
                      id="katalog-hukum"
                      className="text-lg font-extrabold tracking-tight text-slate-950"
                    >
                      Aturan dengan Rujukan Hukum ({JUMLAH_HUKUM})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Aturan yang menyebut basis pasal resmi; klik rujukannya
                      untuk membuka sumber.
                    </p>
                  </div>
                  <TabelAturan
                    aturan={ATURAN_HUKUM}
                    aturanUpahAktif={aturanUpahAktif}
                  />
                </section>

                <section
                  aria-labelledby="katalog-pola"
                  className="flex flex-col gap-3"
                >
                  <div>
                    <h3
                      id="katalog-pola"
                      className="text-lg font-extrabold tracking-tight text-slate-950"
                    >
                      Aturan Pola Indikator ({JUMLAH_POLA})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pola risiko rekrutmen yang umum dikenali mesin; tidak
                      merujuk pasal tertentu dan bukan penilaian hukum.
                    </p>
                  </div>
                  <TabelAturan
                    aturan={ATURAN_POLA}
                    aturanUpahAktif={aturanUpahAktif}
                  />
                </section>
              </div>
            </section>
          </Reveal>

          <Reveal delay={120}>
            <div className="pt-2">
              <Link
                href="/cek"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800"
              >
                <span>Uji Metodologi dengan Lowongan Anda</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
