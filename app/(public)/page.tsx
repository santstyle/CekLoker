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

const POLA = RULES.map((aturan) => aturan.judul);

export default function Beranda() {
  return (
    <div className="relative overflow-hidden bg-cream text-ink">
      {/* Hero */}
      <section className="relative">
        <Container className="pt-14 pb-10 sm:pt-20 sm:pb-14">
          <h1 className="mx-auto max-w-6xl text-center font-display text-[clamp(3rem,8.5vw,6.75rem)] leading-[1.02] font-semibold tracking-tight text-balance text-ink">
            Kerja yang layak dimulai dari iklan yang{" "}
            <span className="teks-aksen">jujur.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-muted sm:text-xl">
            Tempel iklan lowongan Anda. CekLoker membacanya dengan{" "}
            {JUMLAH_ATURAN} aturan baku ketenagakerjaan Indonesia dan menjawab
            dengan bukti, rujukan pasal, dan rentang risiko.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cek"
              className="inline-flex min-h-13 items-center rounded-full bg-ink px-8 text-base font-semibold text-white transition-colors duration-200 hover:bg-ink-deep"
            >
              Cek lowongan sekarang
            </Link>
            <Link
              href="/metodologi"
              className="inline-flex min-h-13 items-center rounded-full border border-line bg-paper px-7 text-base font-semibold text-ink transition-colors duration-200 hover:border-ink"
            >
              Cara kerjanya
            </Link>
          </div>

          {/* Panggung kartu: tiga kartu produk melayang ala referensi */}
          <div className="mx-auto mt-14 grid w-full max-w-6xl gap-5 sm:mt-16 md:grid-cols-[1fr_1.15fr_1fr] md:items-center md:gap-0">
            {/* Kartu temuan, kiri */}
            <div className="rounded-kartu border border-line bg-paper p-5 shadow-kartu md:-mr-4 md:translate-y-6 md:-rotate-[5deg] md:p-6">
              <p className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.16em] text-amber-800 uppercase">
                <span
                  aria-hidden="true"
                  className="flex size-2 rounded-full bg-amber-500"
                />
                Temuan berisiko
              </p>
              <blockquote className="mt-4 font-display text-lg leading-snug text-ink italic">
                &ldquo;Biaya seragam dan administrasi berkas: Rp 150.000, wajib
                lunas saat tes.&rdquo;
              </blockquote>
              <p className="mt-4 border-t border-line pt-3 text-[0.72rem] leading-relaxed text-muted">
                Pungutan biaya sebelum penempatan, bertentangan dengan Pasal 38
                ayat (1) UU No. 13/2003.
              </p>
            </div>

            {/* Kartu hasil, tengah */}
            <div className="z-10 rounded-kartu bg-ink-deep p-6 text-white shadow-2xl md:-translate-y-2 md:p-8">
              <p className="flex items-center justify-between gap-3 text-[0.68rem] font-semibold tracking-[0.16em] text-slate-400 uppercase">
                Contoh hasil CekLoker
                <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-amber-300 normal-case">
                  Perlu dicek
                </span>
              </p>
              <div className="mt-5 flex items-end gap-4">
                <span className="font-display text-7xl leading-none font-semibold text-white tabular-nums md:text-8xl">
                  65
                </span>
                <span className="mb-1.5 text-xs leading-tight text-slate-400">
                  dari 100
                  <br />
                  skor risiko
                </span>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: "65%" }}
                />
              </div>
              <ul className="mt-5 space-y-2 text-[0.78rem] leading-snug text-slate-300">
                <li>1 dari 3 temuan: pungutan biaya di muka</li>
                <li>Kutipan asli teks iklan selalu disertakan</li>
                <li>Keputusan tetap di tangan Anda</li>
              </ul>
              <p className="mt-5 border-t border-white/10 pt-3 text-[0.65rem] text-slate-500">
                Ilustrasi memakai iklan contoh, bukan data pengguna.
              </p>
            </div>

            {/* Kartu pasal, kanan */}
            <div className="rounded-kartu border border-line bg-paper p-5 shadow-kartu md:-ml-4 md:translate-y-8 md:rotate-[5deg] md:p-6">
              <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">
                Rujukan pasal
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                &ldquo;Pelaksana penempatan tenaga kerja dilarang memungut biaya
                penempatan, baik langsung maupun tidak langsung, sebagian atau
                keseluruhan kepada tenaga kerja.&rdquo;
              </p>
              <p className="mt-4 border-t border-line pt-3 text-[0.72rem] text-muted">
                UU No. 13/2003 tentang Ketenagakerjaan
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Strip pola yang dikenali */}
      <div
        aria-label="Contoh pola yang dikenali mesin CekLoker"
        className="overflow-hidden border-y border-line bg-paper py-3.5"
      >
        <div className="animate-marquee flex w-max items-center gap-0 whitespace-nowrap">
          {[...POLA, ...POLA].map((pola, i) => (
            <span
              key={i}
              aria-hidden={i >= POLA.length}
              className="flex items-center text-[0.7rem] font-semibold tracking-[0.18em] text-ink uppercase"
            >
              <span className="px-5">{pola}</span>
              <span aria-hidden="true" className="text-aksen">
                &#9679;
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Rentang risiko */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-aksen uppercase">
              Bukan vonis
            </p>
            <h2 className="mt-4 max-w-5xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.04] font-semibold tracking-tight text-ink">
              Bukan angka hitam putih.{" "}
              <span className="teks-aksen">Rentang risiko</span>, dengan
              buktinya di meja Anda.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Rendah",
                judul: "Indikator aman",
                teks: "Tidak ditemukan indikator bermasalah. Tetap verifikasi kanal resmi perusahaan sebelum mengirim berkas.",
                garis: "bg-blue-600",
                chip: "border-blue-600/30 bg-blue-50 text-blue-800",
              },
              {
                label: "Perlu dicek",
                judul: "Perlu konfirmasi",
                teks: "Ada indikator yang perlu dikonfirmasi langsung: kisaran upah, jam kerja, atau kontak pribadi perorangan.",
                garis: "bg-amber-500",
                chip: "border-amber-500/40 bg-amber-50 text-amber-800",
              },
              {
                label: "Tinggi",
                judul: "Kewaspadaan penuh",
                teks: "Kombinasi indikator berisiko: permintaan transfer, ijazah ditahan, janji kerja instan tanpa seleksi.",
                garis: "bg-rose-600",
                chip: "border-rose-600/30 bg-rose-50 text-rose-800",
              },
            ].map((band) => (
              <div
                key={band.label}
                className="flex flex-col gap-4 rounded-kartu border border-line bg-paper p-6 sm:p-8"
              >
                <span
                  aria-hidden="true"
                  className={`h-1 w-12 rounded-full ${band.garis}`}
                />
                <span
                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${band.chip}`}
                >
                  {band.label}
                </span>
                <h3 className="font-display text-2xl font-semibold text-ink">
                  {band.judul}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {band.teks}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Cara kerja: sticky split */}
      <section className="border-y border-line bg-paper py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-aksen uppercase">
                  Cara kerja
                </p>
                <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] font-semibold tracking-tight text-ink">
                  Tempel iklannya.{" "}
                  <span className="teks-aksen">Buktinya kembali.</span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                  Tidak perlu daftar akun, tidak perlu unggah berkas. Teksnya
                  diolah saat itu juga dan tidak pernah disimpan di server kami.
                </p>
                <Link
                  href="/cek"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-aksen underline-offset-4 hover:underline"
                >
                  Coba sekarang, gratis
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            <ol className="lg:col-span-7">
              {[
                {
                  nomor: "01",
                  judul: "Tempel teksnya",
                  teks: "Salin iklan lowongan dari mana pun Anda menemukannya, lalu tempel ke kotak di halaman Cek.",
                },
                {
                  nomor: "02",
                  judul: "Mesin membaca",
                  teks: `${JUMLAH_ATURAN} aturan baku ketenagakerjaan memindai pola: pungutan biaya, kontak pribadi, jam kerja melebihi batas, dan lainnya.`,
                },
                {
                  nomor: "03",
                  judul: "Anda terima jawabannya",
                  teks: "Kutipan asli dari iklan, pasal yang dilanggar, dan rentang risiko. Keputusan akhir tetap di tangan Anda.",
                },
              ].map((langkah) => (
                <li
                  key={langkah.nomor}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-b border-line py-7 last:border-b-0 sm:gap-10"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-5xl leading-none font-semibold text-ink/12 sm:text-6xl"
                  >
                    {langkah.nomor}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-semibold text-ink sm:text-2xl">
                      {langkah.judul}
                    </span>
                    <span className="mt-2 block max-w-lg text-sm leading-relaxed text-muted sm:text-[0.95rem]">
                      {langkah.teks}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Dasar hukum */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-aksen uppercase">
                Dasar hukum
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] font-semibold tracking-tight text-ink">
                Setiap temuan,{" "}
                <span className="teks-aksen">pasalnya ikut.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                Tidak ada aturan karangan. Setiap indikator terhubung ke
                peraturan ketenagakerjaan Indonesia yang berlaku, dan Anda bisa
                membacanya sendiri.
              </p>
              <Link
                href="/metodologi"
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-aksen underline-offset-4 hover:underline"
              >
                Metodologi dan katalog {JUMLAH_ATURAN} aturan
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <ul className="divide-y divide-line border-y border-line lg:col-span-7">
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
                        teks: "Perbandingan kisaran upah terhadap upah minimum. Belum aktif, menunggu data resmi.",
                      },
                    ]),
              ].map((item) => (
                <li
                  key={item.pasal}
                  className="grid gap-1.5 py-5 sm:grid-cols-[1fr_1.5fr] sm:gap-6"
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
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-paper py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-aksen uppercase">
                FAQ
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,3.75rem)] leading-[1.05] font-semibold tracking-tight text-ink">
                Pertanyaan yang <span className="teks-aksen">sering</span>{" "}
                diajukan.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <Faq butir={FAQ} />
            </div>
          </div>
        </Container>
      </section>

      {/* CTA penutup */}
      <section className="bg-cream py-20 sm:py-28">
        <Container>
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <h2 className="font-display text-[clamp(3rem,9vw,6.5rem)] leading-[1.02] font-semibold tracking-tight text-balance text-ink">
              Baca iklannya. <span className="teks-aksen">Baru lamar.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              Gratis, tanpa daftar akun. Teks iklan Anda tidak pernah disimpan
              di server kami.
            </p>
            <Link
              href="/cek"
              className="mt-10 inline-flex min-h-14 items-center rounded-full bg-ink px-10 text-lg font-semibold text-white transition-colors duration-200 hover:bg-ink-deep"
            >
              Cek lowongan sekarang
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
