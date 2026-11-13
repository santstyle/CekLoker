import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Faq } from "@/components/situs/faq";
import { Reveal } from "@/components/situs/reveal";
import { RULES } from "@/lib/evaluation/rules";
import { DATA_UPAH_TERSEDIA } from "@/lib/evaluation/wages";
import { DESKRIPSI_SITUS, metadataHalaman } from "@/lib/situs";

export const metadata: Metadata = metadataHalaman({
  judul: "Cek Risiko Lowongan Kerja Indonesia",
  deskripsi: DESKRIPSI_SITUS,
  jalur: "/",
});

const JUMLAH_ATURAN = RULES.length;

const FAQ = [
  {
    pertanyaan: "Apakah CekLoker bisa memastikan sebuah lowongan itu penipuan?",
    jawaban:
      "Tidak, dan kami tidak pernah mengklaimnya. CekLoker menyajikan rentang risiko berbasis aturan beserta kutipan bukti dan rujukan pasal, agar keputusan akhir tetap di tangan Anda. Vonis hanya bisa keluar dari proses hukum, bukan dari pindaian teks.",
  },
  {
    pertanyaan: "Apakah teks lowongan yang saya tempel disimpan?",
    jawaban:
      "Tidak. Teks iklan diproses saat itu juga dan tidak pernah ditulis ke basis data server kami. Hasil evaluasi disimpan sementara di sessionStorage peramban Anda dan hilang saat tab ditutup.",
  },
  {
    pertanyaan: "Berapa biayanya?",
    jawaban:
      "CekLoker gratis dan kode sumbernya dirilis di bawah lisensi MIT. SDG 8 (pekerjaan layak) adalah alasan inisiatif ini ada, bukan model bisnisnya.",
  },
  {
    pertanyaan: "Dari mana dasar rujukan hukumnya?",
    jawaban:
      "Dari peraturan ketenagakerjaan Indonesia yang berlaku: UU No. 13/2003, Permenaker No. 39/2016, UU No. 27/2022 tentang pelindungan data pribadi, dan UU No. 18/2017 tentang pelindungan pekerja migran. Rinciannya ada di halaman Metodologi.",
  },
] as const;

export default function Beranda() {
  return (
    <div className="relative overflow-hidden bg-cream text-ink">
      {/* Hero */}
      <section className="relative border-b border-line">
        <Container className="pt-16 pb-16 sm:pt-24 sm:pb-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <Reveal>
              <h1 className="font-display text-[2.75rem] leading-[1.08] font-medium tracking-tight text-balance text-ink sm:text-6xl lg:text-[4.5rem]">
                Periksa dulu iklannya,{" "}
                <em className="text-aksen italic">sebelum</em> melamar.
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-xl">
                CekLoker memindai iklan lowongan terhadap aturan baku
                ketenagakerjaan Indonesia. Anda dapat kutipan bukti, rujukan
                pasal, dan rentang risiko. Bukan vonis, dan tidak ada model yang
                mereka-reka jawaban.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/cek"
                  className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 text-base font-semibold text-white transition-colors duration-200 hover:bg-ink-deep"
                >
                  Cek lowongan sekarang
                </Link>
                <Link
                  href="/metodologi"
                  className="inline-flex min-h-12 items-center rounded-full border border-line bg-paper px-6 text-base font-semibold text-ink transition-colors duration-200 hover:border-ink hover:text-ink"
                >
                  Cara kerja
                </Link>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-medium text-muted sm:text-[0.8rem]">
                <span>Deterministik, bukan tebakan</span>
                <span aria-hidden="true" className="text-line">
                  |
                </span>
                <span>Teks Anda tidak disimpan</span>
                <span aria-hidden="true" className="text-line">
                  |
                </span>
                <span>Rujukan UU &amp; Permenaker</span>
              </p>
            </Reveal>
          </div>

          {/* Kartu contoh hasil; ilustrasi, bukan data pengguna */}
          <Reveal delay={350} className="relative mt-14 sm:mt-20">
            <figure
              className="relative mx-auto max-w-3xl -rotate-1 rounded-kartu border border-line bg-paper p-5 shadow-kartu sm:p-7"
              aria-label="Ilustrasi contoh hasil evaluasi CekLoker"
            >
              <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                <span className="text-[0.7rem] font-semibold tracking-[0.14em] text-muted uppercase">
                  Contoh hasil evaluasi
                </span>
                <span className="rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-[0.7rem] font-semibold text-amber-800">
                  Perlu dicek
                </span>
              </figcaption>

              <blockquote className="mt-5 border-l-2 border-amber-400 pl-4 font-display text-lg leading-snug text-ink italic sm:text-2xl">
                “Biaya seragam, ID card, dan administrasi berkas: Rp 150.000,
                wajib lunas saat tes.”
              </blockquote>

              <div className="mt-5 flex flex-col gap-2 text-xs text-muted sm:text-[0.8rem]">
                <p>
                  <span className="font-semibold text-ink">
                    Temuan 1 dari 3.
                  </span>{" "}
                  Pungutan biaya sebelum penempatan, bertentangan dengan Pasal
                  38 ayat (1) UU No. 13/2003.
                </p>
                <p>
                  Ilustrasi di atas memakai iklan contoh, bukan data Anda. Hasil
                  nyata muncul setelah Anda menempel teks lowongan di halaman
                  Cek.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <span className="font-display text-4xl font-medium text-ink tabular-nums sm:text-5xl">
                  65
                </span>
                <div className="flex-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: "65%" }}
                    />
                  </div>
                  <p className="mt-1.5 text-[0.7rem] text-muted">
                    Skor risiko dari 100. Ambang band lihat Metodologi.
                  </p>
                </div>
              </div>
            </figure>
          </Reveal>
        </Container>
      </section>

      {/* Cara kerja */}
      <section className="bg-cream py-16 sm:py-24">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-5xl">
              Cara kerjanya <em className="text-aksen italic">langsung</em>.
            </h2>
          </Reveal>

          <ol className="mt-12 grid gap-10 border-t border-line pt-10 sm:grid-cols-3 sm:gap-8">
            {[
              {
                nomor: "01",
                judul: "Tempel iklannya",
                teks: "Salin teks iklan lowongan dari mana pun Anda menemukannya. Tidak perlu daftar akun, tidak perlu unggah berkas.",
              },
              {
                nomor: "02",
                judul: "Aturan baku memindai",
                teks: `${JUMLAH_ATURAN} aturan ketenagakerjaan memeriksa pola berisiko: pungutan biaya, kontak pribadi, jam kerja tidak wajar, dan lainnya.`,
              },
              {
                nomor: "03",
                judul: "Anda terima buktinya",
                teks: "Bukan skor mentah saja: kutipan asli dari iklan, pasal yang relevan, dan rentang risiko. Keputusan tetap di tangan Anda.",
              },
            ].map((langkah, i) => (
              <li
                key={langkah.nomor}
                className="border-t border-line pt-6 sm:border-t-0 sm:pt-0"
              >
                <Reveal delay={i * 120} className="flex h-full flex-col gap-3">
                  <span
                    aria-hidden="true"
                    className="font-display text-5xl leading-none font-medium text-ink/10"
                  >
                    {langkah.nomor}
                  </span>
                  <h3 className="text-lg font-bold text-ink">
                    {langkah.judul}
                  </h3>
                  <p className="max-w-sm text-sm leading-relaxed text-muted">
                    {langkah.teks}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Apa yang kami cari */}
      <section className="border-y border-line bg-paper py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <h2 className="font-display text-3xl leading-tight font-medium tracking-tight text-ink sm:text-4xl">
                  Hal yang <em className="text-aksen italic">jarang</em> ditulis
                  di iklan, tapi menentukan.
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                  Perekrut yang wajar tidak memungut biaya sebelum Anda
                  diterima, dan tidak meminta ijazah asli Anda. CekLoker mencari
                  pola-pola seperti ini secara harfiah, bukan lewat dugaan.
                </p>
                <Link
                  href="/metodologi"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-aksen underline-offset-4 hover:underline"
                >
                  {JUMLAH_ATURAN} aturan dan dasar hukumnya
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <ul className="divide-y divide-line border-y border-line">
                {[
                  {
                    pasal: "Pasal 38 ayat (1) UU No. 13/2003",
                    teks: "Pungutan biaya penempatan kepada tenaga kerja dilarang dalam bentuk apa pun.",
                  },
                  {
                    pasal: "Permenaker No. 39/2016",
                    teks: "Penyelenggara pameran kesempatan kerja dilarang memungut biaya dari pencari kerja.",
                  },
                  {
                    pasal: "Pasal 77 ayat (2) UU No. 13/2003",
                    teks: "Batas waktu kerja 40 jam seminggu tanpa upah lembur yang sah menjadi indikator pelanggaran.",
                  },
                  {
                    pasal: "UU No. 27/2022 (PDP)",
                    teks: "Permintaan dokumen sensitif di awal proses, di luar kebutuhan seleksi yang wajar.",
                  },
                  ...(DATA_UPAH_TERSEDIA
                    ? []
                    : [
                        {
                          pasal: "Upah Minimum (UMP/UMK)",
                          teks: "Perbandingan kisaran upah terhadap upah minimum provinsi. Belum aktif, menunggu data resmi.",
                        },
                      ]),
                ].map((item) => (
                  <li
                    key={item.pasal}
                    className="grid gap-1 py-5 sm:grid-cols-[1fr_1.4fr] sm:gap-6"
                  >
                    <span className="text-xs leading-snug font-semibold text-ink">
                      {item.pasal}
                    </span>
                    <span className="text-sm leading-relaxed text-muted">
                      {item.teks}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Tiga rentang risiko */}
      <section className="bg-cream py-16 sm:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-xl font-display text-3xl leading-tight font-medium tracking-tight text-ink sm:text-5xl">
              Bukan vonis. <em className="text-aksen italic">Rentang.</em>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Tiga pita yang jelas, dengan label teks dan ikon pembeda, bukan
              warna sendirian.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-kartu border border-line bg-line sm:grid-cols-3">
            {[
              {
                label: "Rendah",
                judul: "Indikator aman",
                teks: "Tidak ditemukan indikator bermasalah pada teks. Tetap verifikasi kanal resmi perusahaan sebelum mengirim berkas.",
                garis: "bg-blue-600",
                chip: "bg-blue-50 text-blue-800 border-blue-200",
              },
              {
                label: "Perlu dicek",
                judul: "Perlu konfirmasi",
                teks: "Ada indikator yang perlu dikonfirmasi langsung: kisaran upah, jam kerja, atau kontak pribadi perorangan.",
                garis: "bg-amber-500",
                chip: "bg-amber-50 text-amber-800 border-amber-200",
              },
              {
                label: "Tinggi",
                judul: "Kewaspadaan penuh",
                teks: "Kombinasi indikator berisiko: permintaan transfer, ijazah ditahan, janji kerja instan tanpa seleksi.",
                garis: "bg-rose-600",
                chip: "bg-rose-50 text-rose-800 border-rose-200",
              },
            ].map((band) => (
              <div
                key={band.label}
                className="flex flex-col gap-4 bg-paper p-6 sm:p-8"
              >
                <span
                  aria-hidden="true"
                  className={`h-1 w-14 rounded-full ${band.garis}`}
                />
                <span
                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${band.chip}`}
                >
                  {band.label}
                </span>
                <h3 className="text-xl font-bold text-ink">{band.judul}</h3>
                <p className="text-sm leading-relaxed text-muted">
                  {band.teks}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-paper py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="font-display text-3xl leading-tight font-medium tracking-tight text-ink sm:text-4xl">
                Pertanyaan yang <em className="text-aksen italic">sering</em>{" "}
                diajukan.
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                Jawaban singkat dan apa adanya. Selebihnya ada di{" "}
                <Link
                  href="/metodologi"
                  className="font-semibold text-ink underline underline-offset-4 hover:text-aksen"
                >
                  Metodologi
                </Link>
                .
              </p>
            </div>
            <div className="lg:col-span-8">
              <Faq butir={FAQ} />
            </div>
          </div>
        </Container>
      </section>

      {/* CTA penutup */}
      <section className="bg-ink-deep">
        <Container className="py-16 sm:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="font-display text-3xl leading-tight font-medium text-balance text-white sm:text-5xl">
              Lowongan berikutnya layak{" "}
              <em className="text-blue-400 italic">diperiksa</em>.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-400">
              Lima detik sekarang lebih murah daripada satu bulan di tempat yang
              salah.
            </p>
            <Link
              href="/cek"
              className="mt-9 inline-flex min-h-13 items-center rounded-full bg-aksen px-8 text-base font-semibold text-white transition-colors duration-200 hover:bg-aksen-pekat"
            >
              Cek lowongan sekarang
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
