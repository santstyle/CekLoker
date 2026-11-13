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

const RENTANG = [
  {
    nomor: "01",
    label: "Rendah",
    skor: "Skor < 15",
    status: "Tidak ada indikator bermasalah",
    saran: "Tetap verifikasi kanal resmi perusahaan sebelum mengirim berkas.",
    kartu: "from-blue-50 to-white ring-blue-200/80",
    chip: "bg-blue-600 text-white",
  },
  {
    nomor: "02",
    label: "Perlu dicek",
    skor: "Skor 15 – 44",
    status: "Indikator ambigu, perlu konfirmasi",
    saran:
      "Konfirmasi upah, jam kerja, dan identitas perusahaan lewat sumber resmi.",
    kartu: "from-amber-50 to-white ring-amber-200/80",
    chip: "bg-amber-500 text-white",
  },
  {
    nomor: "03",
    label: "Tinggi",
    skor: "Skor ≥ 45",
    status: "Kombinasi indikator berisiko",
    saran:
      "Jangan kirim berkas apa pun sampai identitas dan legalitasnya terverifikasi.",
    kartu: "from-rose-50 to-white ring-rose-200/80",
    chip: "bg-rose-600 text-white",
  },
] as const;

const PASAL = [
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
] as const;

export default function Beranda() {
  return (
    <div className="relative bg-cream text-ink">
      {/* ============ HERO: kanvas terang dengan kubah gradasi ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e7ebf5] via-[#edf0f8] to-cream">
        <Container
          ukuran="penuh"
          className="relative pt-14 text-center sm:pt-20"
        >
          <p className="mx-auto inline-flex items-center gap-2.5 rounded-full bg-white/70 py-1.5 pr-4 pl-2 font-mono text-[0.6rem] font-medium tracking-[0.2em] text-ink uppercase ring-1 ring-ink/10 backdrop-blur-sm">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500"
            />
            Alat pra-lamaran · Ketenagakerjaan Indonesia
          </p>
          <h1 className="mx-auto mt-6 max-w-5xl font-display text-[clamp(2.75rem,7.4vw,5.5rem)] leading-[1.0] font-semibold tracking-tight text-balance text-ink">
            Kerja yang layak dimulai dari iklan yang{" "}
            <span className="teks-gradasi">jujur.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-xl">
            Tempel iklan lowongan Anda. CekLoker memindainya dengan{" "}
            {JUMLAH_ATURAN} aturan baku ketenagakerjaan Indonesia, lalu menjawab
            dengan bukti dan rujukan pasal.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cek"
              className="inline-flex min-h-14 items-center rounded-full bg-ink px-9 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1e293b]"
            >
              Cek lowongan sekarang
            </Link>
            <Link
              href="/metodologi"
              className="inline-flex min-h-14 items-center rounded-full bg-white/60 px-8 text-base font-semibold text-slate-700 ring-1 ring-ink/15 backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-ink"
            >
              Lihat metodologi
            </Link>
          </div>
          <p className="mt-6 font-mono text-[0.62rem] tracking-[0.2em] text-slate-500 uppercase">
            {JUMLAH_ATURAN} aturan baku&ensp;·&ensp;0 akun&ensp;·&ensp;0 teks
            disimpan
          </p>
        </Container>

        {/* Kubah aurora di atas horizon */}
        <svg
          viewBox="0 0 1440 460"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
          className="mt-2 block h-56 w-full sm:h-72 lg:h-80"
        >
          <defs>
            <linearGradient id="kubah" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#60a5fa" />
              <stop offset="32%" stop-color="#818cf8" />
              <stop offset="62%" stop-color="#c084fc" />
              <stop offset="84%" stop-color="#f472b6" />
              <stop offset="100%" stop-color="#fda4af" />
            </linearGradient>
            <radialGradient id="cahayaHorizon" cx="50%" cy="100%" r="75%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
              <stop offset="55%" stop-color="#ffffff" stop-opacity="0" />
            </radialGradient>
            <pattern
              id="titikKubah"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="1.6"
                cy="1.6"
                r="1.6"
                fill="#ffffff"
                fillOpacity="0.4"
              />
            </pattern>
          </defs>
          <ellipse cx="720" cy="480" rx="780" ry="440" fill="url(#kubah)" />
          <ellipse
            cx="720"
            cy="480"
            rx="780"
            ry="440"
            fill="url(#titikKubah)"
          />
          <ellipse
            cx="720"
            cy="480"
            rx="780"
            ry="440"
            fill="url(#cahayaHorizon)"
          />
          <ellipse
            cx="720"
            cy="480"
            rx="560"
            ry="300"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.5"
            strokeWidth="1.4"
          />
          <ellipse
            cx="720"
            cy="480"
            rx="340"
            ry="170"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
        </svg>

        {/* Kartu laporan ilustrasi, mengambang di atas horizon */}
        <div className="relative z-10 -mt-24 flex justify-center px-4 pb-16 sm:-mt-40 sm:pb-20">
          <figure className="kartu-bingkai-gradasi w-[min(92vw,400px)] rotate-[-1.2deg] rounded-2xl p-5 shadow-[0_30px_60px_-20px_rgb(76_29_149/0.45)]">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 font-mono text-[0.58rem] font-semibold tracking-[0.2em] text-ink uppercase">
              <span>CekLoker · Laporan risiko</span>
              <span className="text-muted normal-case">
                No. 000 · Ilustrasi
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.72rem]">
              <div>
                <dt className="font-mono text-[0.52rem] tracking-[0.18em] text-muted uppercase">
                  Posisi
                </dt>
                <dd className="font-medium text-ink">Admin toko</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.52rem] tracking-[0.18em] text-muted uppercase">
                  Lokasi
                </dt>
                <dd className="font-medium text-ink">Jakarta Barat</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.52rem] tracking-[0.18em] text-muted uppercase">
                  Sumber
                </dt>
                <dd className="font-medium text-ink">Pesan pribadi</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.52rem] tracking-[0.18em] text-muted uppercase">
                  Upah
                </dt>
                <dd className="font-medium text-ink">Tidak dicantumkan</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-end justify-between gap-4 border-y border-slate-100 py-3">
              <div>
                <p className="font-mono text-[0.52rem] tracking-[0.18em] text-muted uppercase">
                  Skor risiko
                </p>
                <p className="mt-1 font-display text-5xl leading-none font-semibold text-ink tabular-nums">
                  65<span className="text-lg font-medium text-muted">/100</span>
                </p>
              </div>
              <span className="stempel mb-1 rotate-[-6deg] text-amber-700">
                Perlu dicek
              </span>
            </div>
            <ol className="mt-3 space-y-1.5 text-[0.7rem] leading-snug text-slate-600">
              <li>
                <span className="font-semibold text-amber-800">TEMUAN #01</span>{" "}
                Pungutan biaya di muka (Rp 150.000)
              </li>
              <li>
                <span className="font-semibold text-amber-800">TEMUAN #02</span>{" "}
                Kontak hanya nomor pribadi perorangan
              </li>
              <li>
                <span className="font-semibold text-blue-800">TEMUAN #03</span>{" "}
                Nominal upah tidak dicantumkan
              </li>
            </ol>
            <figcaption className="mt-3 border-t border-slate-100 pt-2 text-[0.62rem] leading-snug text-muted">
              Ilustrasi dengan iklan contoh, bukan data pengguna. CekLoker tidak
              pernah memberi vonis.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ============ Strip marquee pola ============ */}
      <div
        aria-label="Contoh pola yang dikenali mesin CekLoker"
        className="overflow-hidden bg-gradient-to-r from-blue-600 via-violet-600 to-rose-500 py-2.5"
      >
        <div className="animate-marquee flex w-max items-center whitespace-nowrap">
          {[...POLA, ...POLA].map((pola, i) => (
            <span
              key={i}
              aria-hidden={i >= POLA.length}
              className="flex items-center font-mono text-[0.68rem] font-medium tracking-[0.18em] text-white uppercase"
            >
              <span className="px-5">{pola}</span>
              <span aria-hidden="true" className="text-white/60">
                ●
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ============ Rentang risiko: kartu gradasi lembut ============ */}
      <section className="py-16 sm:py-24">
        <Container ukuran="penuh">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[0.65rem] font-semibold tracking-[0.22em] text-aksen uppercase">
                  Bukan vonis
                </p>
                <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] font-semibold tracking-tight text-ink">
                  Bukan angka hitam putih.{" "}
                  <span className="teks-gradasi">Rentang risiko</span>, dengan
                  buktinya di meja Anda.
                </h2>
              </div>
              <p className="max-w-[16rem] font-mono text-[0.6rem] leading-relaxed tracking-[0.16em] text-muted uppercase">
                Spektrum skor 0 – 100 · tiga rentang
              </p>
            </div>
          </Reveal>

          <div
            aria-hidden="true"
            className="mt-10 h-2.5 w-full rounded-full bg-[linear-gradient(90deg,#2563eb_0%,#2563eb_15%,#f59e0b_15%,#f59e0b_45%,#e11d48_45%,#e11d48_100%)]"
          />
          <div
            aria-hidden="true"
            className="mt-2 flex justify-between font-mono text-[0.6rem] tracking-[0.16em] text-muted uppercase"
          >
            <span className="w-[15%] text-center">0–14</span>
            <span className="w-[30%] text-center">15–44</span>
            <span className="w-[55%] text-center">45–100</span>
          </div>

          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {RENTANG.map((band) => (
              <li
                key={band.label}
                className={`group flex flex-col rounded-3xl bg-gradient-to-b p-6 ring-1 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-20px_rgb(15_23_42/0.25)] sm:p-7 ${band.kartu}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`inline-flex rounded-full px-4 py-1.5 font-mono text-[0.65rem] font-semibold tracking-[0.18em] uppercase ${band.chip}`}
                  >
                    {band.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-display text-5xl leading-none font-semibold text-ink/10 transition-colors duration-300 group-hover:text-ink/20"
                  >
                    {band.nomor}
                  </span>
                </div>
                <p className="mt-5 font-mono text-[0.6rem] tracking-[0.18em] text-muted uppercase">
                  {band.skor}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink sm:text-2xl">
                  {band.status}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {band.saran}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ============ Cara kerja: tiga kartu gradasi ============ */}
      <section className="border-y border-line bg-paper py-16 sm:py-24">
        <Container ukuran="penuh">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[0.65rem] font-semibold tracking-[0.22em] text-aksen uppercase">
                Cara kerja
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] font-semibold tracking-tight text-ink">
                Tempel iklannya.{" "}
                <span className="teks-gradasi">Buktinya kembali.</span>
              </h2>
            </div>
            <Link
              href="/cek"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1e293b]"
            >
              Coba sekarang
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                nomor: "01",
                tag: "Masukan",
                judul: "Tempel teksnya",
                teks: "Salin iklan lowongan dari mana pun Anda menemukannya, lalu tempel ke kotak di halaman Cek.",
              },
              {
                nomor: "02",
                tag: "Proses",
                judul: "Mesin membaca",
                teks: `${JUMLAH_ATURAN} aturan baku ketenagakerjaan memindai pola: pungutan biaya, kontak pribadi, jam kerja melebihi batas, dan lainnya.`,
              },
              {
                nomor: "03",
                tag: "Keluaran",
                judul: "Anda terima jawabannya",
                teks: "Kutipan asli dari iklan, pasal yang dilanggar, dan rentang risiko. Keputusan akhir tetap di tangan Anda.",
              },
            ].map((langkah) => (
              <li
                key={langkah.nomor}
                className="group flex flex-col rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_16px_40px_-20px_rgb(15_23_42/0.18)] ring-1 ring-line transition-all duration-300 hover:-translate-y-1.5"
              >
                <span
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-rose-500 font-mono text-sm font-semibold text-white shadow-lg"
                >
                  {langkah.nomor}
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                  {langkah.judul}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {langkah.teks}
                </p>
                <p className="teks-gradasi mt-auto pt-6 font-mono text-[0.62rem] font-semibold tracking-[0.24em] uppercase">
                  {langkah.tag}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-center font-mono text-[0.62rem] tracking-[0.2em] text-muted uppercase">
            Tanpa akun&ensp;·&ensp;Tanpa unggah berkas&ensp;·&ensp;Tanpa
            penyimpanan teks
          </p>
        </Container>
      </section>

      {/* ============ Dasar hukum: register pasal ============ */}
      <section className="py-16 sm:py-24">
        <Container ukuran="penuh">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="font-mono text-[0.65rem] font-semibold tracking-[0.22em] text-aksen uppercase">
                Dasar hukum
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.02] font-semibold tracking-tight text-ink">
                Setiap temuan,{" "}
                <span className="teks-gradasi">pasalnya ikut.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                Tidak ada aturan karangan. Setiap indikator terhubung ke
                peraturan ketenagakerjaan Indonesia yang berlaku, dan Anda bisa
                membacanya sendiri.
              </p>
              <Link
                href="/metodologi"
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-ink ring-1 ring-ink/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                Katalog {JUMLAH_ATURAN} aturan
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <ol className="divide-y divide-slate-100 overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04),0_16px_40px_-20px_rgb(15_23_42/0.18)] ring-1 ring-line lg:col-span-8">
              {PASAL.map((item) => (
                <li
                  key={item.pasal}
                  className="grid gap-2 p-6 transition-colors hover:bg-slate-50 sm:grid-cols-12 sm:gap-6"
                >
                  <span className="font-mono text-[0.72rem] leading-snug font-semibold text-aksen sm:col-span-4">
                    {item.pasal}
                  </span>
                  <span className="text-sm leading-relaxed text-slate-600 sm:col-span-8">
                    {item.teks}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ============ FAQ ============ */}
      <section className="border-t border-line bg-paper py-16 sm:py-24">
        <Container ukuran="penuh">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="font-mono text-[0.65rem] font-semibold tracking-[0.22em] text-aksen uppercase">
                FAQ
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.25rem,4.2vw,3.5rem)] leading-[1.02] font-semibold tracking-tight text-ink">
                Pertanyaan yang <span className="teks-gradasi">sering</span>{" "}
                diajukan.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <Faq butir={FAQ} />
            </div>
          </div>
        </Container>
      </section>

      {/* ============ CTA penutup: panel gradasi senja ============ */}
      <section className="gradien-senja relative overflow-hidden py-20 text-white sm:py-28">
        <Container
          ukuran="penuh"
          className="relative flex flex-col items-center text-center"
        >
          <p className="font-mono text-[0.62rem] font-semibold tracking-[0.26em] text-blue-200/90 uppercase">
            Cek dulu, baru lamar
          </p>
          <h2 className="mt-5 font-display text-[clamp(3rem,8.5vw,6rem)] leading-[1.0] font-semibold tracking-tight text-balance">
            Baca iklannya.
            <br />
            <span className="teks-gradasi-terang">Baru lamar.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-blue-100/90">
            Gratis, tanpa daftar akun. Teks iklan Anda tidak pernah disimpan di
            server kami.
          </p>
          <Link
            href="/cek"
            className="mt-10 inline-flex min-h-14 items-center rounded-full bg-white px-10 text-lg font-semibold text-ink shadow-[0_10px_40px_-10px_rgb(255_255_255/0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
          >
            Cek lowongan sekarang
          </Link>
        </Container>
      </section>
    </div>
  );
}
