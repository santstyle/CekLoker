import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Kepala } from "@/components/situs/kepala";
import { Reveal } from "@/components/situs/reveal";
import { URL_RUJUKAN, LABEL_RUJUKAN } from "@/lib/evaluation/rujukan";
import { DATA_UPAH_TERSEDIA, CATATAN_DATA_UPAH } from "@/lib/evaluation/wages";
import { metadataHalaman } from "@/lib/situs";

export const metadata: Metadata = metadataHalaman({
  judul: "Sumber Hukum & Data",
  deskripsi:
    "Daftar lengkap sumber hukum resmi (UU, Permenaker, KEP) dan status ketersediaan data upah minimum regional yang digunakan CekLoker untuk evaluasi lowongan kerja.",
  jalur: "/sumber",
});

const SUMBER_HUKUM = [
  {
    id: "uu-13-2003",
    judul: "UU No. 13 Tahun 2003 tentang Ketenagakerjaan",
    deskripsi:
      "Dasar hukum utama ketenagakerjaan Indonesia mengatur hubungan industrial, upah, jam kerja, hak cuti, PHK, dan penyelesaian perselisihan. CekLoker merujuk pasal 5, 6, 38, 77, 78, dan 89.",
    url: "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
    pasal: ["5", "6", "38", "77", "78", "89"],
  },
  {
    id: "uu-27-2022",
    judul: "UU No. 27 Tahun 2022 tentang Pelindungan Pekerja Migran",
    deskripsi:
      "Mengatur perlindungan pekerja migran Indonesia, prosedur penempatan, dan tanggung jawab penyelenggara. Relevan untuk lowongan kerja di luar negeri.",
    url: "https://peraturan.go.id/uu/nomor-27-tahun-2022.html",
    pasal: [],
  },
  {
    id: "uu-18-2017",
    judul: "UU No. 18 Tahun 2017 tentang Pelindungan Pekerja Migran Indonesia",
    deskripsi:
      "Mengubah UU No. 39/2004. Memperkuat perlindungan mulai pra-penempatan hingga pasca-pulang, serta sanksi bagi penyelenggara yang melanggar.",
    url: "https://peraturan.go.id/uu/nomor-18-tahun-2017.html",
    pasal: [],
  },
  {
    id: "permenaker-39-2016",
    judul: "Permenaker No. 39 Tahun 2016 tentang Persyaratan dan Tatacara Perjanjian Kerja Waktu Tertentu",
    deskripsi:
      "Mengatur syarat PKWT, jangka waktu maksimal, perpanjangan, dan upah saat berakhirnya PKWT. Dasar aturan CekLoker untuk indikator kontraktor palsu dan PKWT berantai.",
    url: "https://jdih.kemnaker.go.id/peraturan/permenaker-no-39-tahun-2016",
    pasal: [],
  },
  {
    id: "permenaker-7-2013",
    judul: "Permenaker No. 7 Tahun 2013 tentang Upah Minimum",
    deskripsi:
      "Mengatur penetapan, komponen, dan mekanisme upah minimum provinsi/kabupaten/kota. Landasan data upah minimum regional CekLoker.",
    url: "https://jdih.kemnaker.go.id/peraturan/permenaker-no-7-tahun-2013",
    pasal: [],
  },
  {
    id: "pp-36-2021",
    judul: "PP No. 36 Tahun 2021 tentang Upah",
    deskripsi:
      "Mengatur komponen upah, struktur dan skala upah, upah minimum, pembayaran upah, dan penundaan pembayaran upah. Pengaturan turunan UU 13/2003 pasal 88-89.",
    url: "https://peraturan.go.id/pp/nomor-36-tahun-2021.html",
    pasal: [],
  },
  {
    id: "kep-226-2019",
    judul: "KEP Menaker No. 226 Tahun 2019 tentang Pedoman Penetapan Upah Minimum Provinsi",
    deskripsi:
      "Pedoman teknis penetapan UMP: formula, variabel, dan prosedur. Referensi metodologi data upah CekLoker.",
    url: "https://jdih.kemnaker.go.id/peraturan/kepmen-no-226-tahun-2019",
    pasal: [],
  },
  {
    id: "se-1-2020",
    judul: "SE Menaker No. 1 Tahun 2020 tentang Pelaksanaan Upah Minimum",
    deskripsi:
      "Surat edaran pelaksanaan UMP bagi gubernur dan pengusaha. Detail mekanisme pengecualian dan penundaan UMP.",
    url: "https://jdih.kemnaker.go.id/peraturan/se-menaker-no-1-tahun-2020",
    pasal: [],
  },
] as const;

export default function HalamanSumber() {
  return (
    <div className="bg-cream">
      <Kepala
        kicker="Sumber Hukum & Data"
        judul="Sumber Hukum & Data Upah Minimum"
        deskripsi={
          <>
            CekLoker menggunakan sumber hukum resmi Indonesia dan data upah minimum regional
            untuk menilai lowongan kerja. Semua rujukan dapat diklik menuju dokumen asli di
            peraturan.go.id atau JDIH Kemenaker.
          </>
        }
      />

      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[0.6rem] font-medium tracking-[0.2em] text-muted uppercase">
            Terakhir diperbarui: 2025-11-15
          </p>

          <div className="mt-10 flex flex-col gap-10">
            {/* Status Data Upah */}
            <Reveal delay={0}>
              <section className="flex flex-col gap-3 border-l-2 border-transparent pl-0 transition-colors hover:border-sky-300 sm:pl-5">
                <h2 className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
                  Status Data Upah Minimum Regional
                </h2>
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  <div className="flex items-start gap-3 p-4 rounded-xl border bg-white shadow-xs">
                    <div className="flex-shrink-0 size-10 flex items-center justify-center rounded-lg bg-blue-100">
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
                        Data Upah Minimum:{" "}
                        <span className={DATA_UPAH_TERSEDIA ? "text-green-700" : "text-amber-700"}>
                          {DATA_UPAH_TERSEDIA ? "Tersedia & Aktif" : "Belum Tersedia (Belum Aktif)"}
                        </span>
                      </p>
                      <p className="mt-1 text-slate-600">{CATATAN_DATA_UPAH}</p>
                    </div>
                  </div>
                  <p className="text-slate-500 pl-10">
                    Data upah minimum provinsi/kabupaten/kota diambil dari penetapan resmi
                    gubernur/keputusan menteri. CekLoker akan mengaktifkan fitur bandingkan upah
                    lowongan dengan UMP/UMK/UMAK begitu data lengkap tersedia dan diverifikasi.
                  </p>
                </div>
              </section>
            </Reveal>

            {/* Daftar Sumber Hukum */}
            <Reveal delay={60}>
              <section className="flex flex-col gap-3 border-l-2 border-transparent pl-0 transition-colors hover:border-sky-300 sm:pl-5">
                <h2 className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
                  Daftar Sumber Hukum Resmi
                </h2>
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {SUMBER_HUKUM.map((sumber, idx) => (
                    <div
                      key={sumber.id}
                      className="flex flex-col gap-2 p-4 rounded-xl border bg-white shadow-xs transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 font-mono text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900">
                            <a
                              href={sumber.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-sky-700 underline-offset-2 transition-colors"
                            >
                              {sumber.judul}
                            </a>
                          </h3>
                          {sumber.pasal.length > 0 && (
                            <p className="mt-1 text-xs text-sky-700 font-medium">
                              Pasal terkait CekLoker: {sumber.pasal.join(", ")}
                            </p>
                          )}
                          <p className="mt-2 text-slate-600">{sumber.deskripsi}</p>
                        </div>
                      </div>
                      <a
                        href={sumber.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-800 transition-colors"
                      >
                        Buka dokumen resmi
                        <svg
                          className="size-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 3H21M21 13.5V21M21 3l-18 18"
                          />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Rujukan per Aturan (Tabel) */}
            <Reveal delay={120}>
              <section className="flex flex-col gap-3 border-l-2 border-transparent pl-0 transition-colors hover:border-sky-300 sm:pl-5">
                <h2 className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
                  Rujukan per Aturan Evaluasi CekLoker
                </h2>
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  <div className="overflow-x-auto rounded-xl border bg-white">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b bg-slate-50">
                          <th className="p-3 font-semibold text-slate-900">
                            ID Aturan
                          </th>
                          <th className="p-3 font-semibold text-slate-900">
                            Judul Aturan
                          </th>
                          <th className="p-3 font-semibold text-slate-900">
                            Rujukan Hukum
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {Object.entries(URL_RUJUKAN).map(([id, url]) => (
                          <tr key={id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-xs text-slate-700">
                              {id}
                            </td>
                            <td className="p-3 text-slate-600">
                              {LABEL_RUJUKAN[id] ?? id}
                            </td>
                            <td className="p-3">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-600 hover:text-sky-800 underline-offset-2 transition-colors inline-flex items-center gap-1"
                              >
                                Buka
                                <svg
                                  className="size-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2.5"
                                  stroke="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 3H21M21 13.5V21M21 3l-18 18"
                                  />
                                </svg>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-slate-500 pl-2">
                    Tabel di atas memetakan setiap id rujukan yang dipakai aturan evaluasi ke
                    URL dokumen resmi di peraturan.go.id atau JDIH Kemenaker.
                  </p>
                </div>
              </section>
            </Reveal>

            {/* Catatan Metodologi */}
            <Reveal delay={180}>
              <section className="flex flex-col gap-3 border-l-2 border-transparent pl-0 transition-colors hover:border-sky-300 sm:pl-5">
                <h2 className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
                  Catatan Metodologi
                </h2>
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  <ul className="list-disc list-inside space-y-2 pl-2">
                    <li>
                      Semua rujukan hukum diambil dari situs resmi <strong>peraturan.go.id</strong>
                      (Direktori Peraturan Perundang-undangan BPHN) dan
                      <strong>JDIH Kemenaker</strong> (Jaringan Dokumentasi dan Informasi Hukum
                      Kementerian Ketenagakerjaan).
                    </li>
                    <li>
                      URL ditujukan ke halaman indeks peraturan; nomor pasal spesifik dapat
                      dicari di dalam dokumen PDF/HTML yang tersedia di situs tersebut.
                    </li>
                    <li>
                      CekLoker tidak mengarsipkan salinan dokumen hukum; tautan selalu mengarah
                      ke sumber asli agar pengguna mendapatkan versi terbaru dan sah.
                    </li>
                    <li>
                      Data upah minimum regional akan diupdate mengikuti penetapan resmi
                      gubernur (UMP) dan keputusan menteri (UMK/UMAK) setiap tahunnya.
                    </li>
                    <li>
                      Jika menemukan tautan rusak atau peraturan yang telah dicabut/diganti,
                      silakan laporkan melalui halaman <a href="/tentang" className="underline text-sky-600">Tentang</a>.
                    </li>
                  </ul>
                </div>
              </section>
            </Reveal>
          </div>
        </div>
      </Container>
    </div>
  );
}