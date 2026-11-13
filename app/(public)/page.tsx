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
    chip: "border-blue-600/40 bg-blue-50 text-blue-800",
  },
  {
    nomor: "02",
    label: "Perlu dicek",
    skor: "Skor 15 – 44",
    status: "Indikator ambigu, perlu konfirmasi",
    saran:
      "Konfirmasi upah, jam kerja, dan identitas perusahaan lewat sumber resmi.",
    chip: "border-amber-500/40 bg-amber-50 text-amber-800",
  },
  {
    nomor: "03",
    label: "Tinggi",
    skor: "Skor ≥ 45",
    status: "Kombinasi indikator berisiko",
    saran:
      "Jangan kirim berkas apa pun sampai identitas dan legalitasnya terverifikasi.",
    chip: "border-rose-600/40 bg-rose-50 text-rose-800",
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
      {/* ============ HERO: kanvas berkas navy ============ */}
      <section className="relative overflow-hidden bg-ink-deep text-white">
        <div aria-hidden="true" className="pola-kisi-gelap absolute inset-0" />
        <Container className="relative py-14 sm:py-16 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Kolom teks */}
            <div className="lg:col-span-6">
              <p className="flex items-center gap-2.5 font-mono text-[0.62rem] font-medium tracking-[0.22em] text-slate-400 uppercase">
                <span
                  aria-hidden="true"
                  className="inline-block size-1.5 rounded-[2px] bg-blue-400"
                />
                Alat pra-lamaran · Ketenagakerjaan Indonesia
              </p>
              <h1 className="mt-6 font-display text-[clamp(2.75rem,6.4vw,4.75rem)] leading-[1.02] font-semibold tracking-tight text-balance text-white">
                Kerja yang layak dimulai dari iklan yang{" "}
                <span className="teks-aksen-terang">jujur.</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
                Tempel iklan lowongan Anda. CekLoker memindainya dengan{" "}
                {JUMLAH_ATURAN} aturan baku ketenagakerjaan Indonesia, lalu
                menjawab dengan bukti, rujukan pasal, dan rentang risiko.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/cek"
                  className="inline-flex min-h-13 items-center rounded-full bg-[#3b82f6] px-8 text-base font-semibold text-ink-deep transition-colors duration-200 hover:bg-[#60a5fa]"
                >
                  Cek lowongan sekarang
                </Link>
                <Link
                  href="/metodologi"
                  className="inline-flex min-h-13 items-center rounded-full border border-white/20 px-7 text-base font-semibold text-slate-200 transition-colors duration-200 hover:border-white/50 hover:text-white"
                >
                  Lihat metodologi
                </Link>
              </div>
              <p className="mt-8 font-mono text-[0.62rem] leading-relaxed tracking-[0.18em] text-slate-500 uppercase">
                {JUMLAH_ATURAN} aturan baku&ensp;·&ensp;0 akun
                diperlukan&ensp;·&ensp;0 teks disimpan
              </p>
            </div>

            {/* Kolom berkas evaluasi */}
            <figure className="relative lg:col-span-6">
              <div
                aria-hidden="true"
                className="absolute inset-4 rotate-[2.5deg] rounded-md border border-white/10 bg-white/[0.06]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-2 rotate-[-3deg] rounded-md border border-white/10 bg-white/[0.09]"
              />
              <div className="relative rotate-[-1deg] rounded-md border border-line bg-paper p-6 text-ink shadow-2xl sm:p-7">
                <div className="flex items-center justify-between gap-4 border-b-2 border-ink pb-3 font-mono text-[0.6rem] font-semibold tracking-[0.18em] text-ink uppercase">
                  <span>CekLoker · Laporan risiko</span>
                  <span className="text-muted">No. 000 · Ilustrasi</span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[0.66rem] leading-relaxed text-ink">
                  <div>
                    <dt className="text-[0.55rem] text-muted uppercase">
                      Posisi
                    </dt>
                    <dd>Admin toko</dd>
                  </div>
                  <div>
                    <dt className="text-[0.55rem] text-muted uppercase">
                      Lokasi
                    </dt>
                    <dd>Jakarta Barat</dd>
                  </div>
                  <div>
                    <dt className="text-[0.55rem] text-muted uppercase">
                      Sumber
                    </dt>
                    <dd>Pesan pribadi</dd>
                  </div>
                  <div>
                    <dt className="text-[0.55rem] text-muted uppercase">
                      Upah
                    </dt>
                    <dd>Tidak dicantumkan</dd>
                  </div>
                </dl>
                <div className="mt-5 flex items-end justify-between gap-4 border-y border-line py-4">
                  <div>
                    <p className="font-mono text-[0.55rem] tracking-[0.18em] text-muted uppercase">
                      Skor risiko
                    </p>
                    <p className="mt-1 font-display text-6xl leading-none font-semibold tabular-nums sm:text-7xl">
                      65
                      <span className="text-2xl font-medium text-muted">
                        /100
                      </span>
                    </p>
                  </div>
                  <span className="stempel mb-1 rotate-[-6deg] text-amber-700">
                    Perlu dicek
                  </span>
                </div>
                <ol className="mt-4 space-y-2 font-mono text-[0.66rem] leading-relaxed text-ink">
                  <li>
                    <span className="font-semibold text-amber-800">
                      TEMUAN #01
                    </span>{" "}
                    Pungutan biaya di muka (Rp 150.000)
                  </li>
                  <li>
                    <span className="font-semibold text-amber-800">
                      TEMUAN #02
                    </span>{" "}
                    Kontak hanya nomor pribadi perorangan
                  </li>
                  <li>
                    <span className="font-semibold text-blue-800">
                      TEMUAN #03
                    </span>{" "}
                    Nominal upah tidak dicantumkan
                  </li>
                </ol>
                <figcaption className="mt-5 border-t border-line pt-3 text-[0.65rem] leading-snug text-muted">
                  Ilustrasi dengan iklan contoh, bukan data pengguna. CekLoker
                  tidak pernah memberi vonis.
                </figcaption>
              </div>
            </figure>
          </div>
        </Container>
      </section>

      {/* ============ Strip pola yang dikenali ============ */}
      <div
        aria-label="Contoh pola yang dikenali mesin CekLoker"
        className="overflow-hidden border-b border-ink-deep bg-aksen py-3"
      >
        <div className="animate-marquee flex w-max items-center whitespace-nowrap">
          {[...POLA, ...POLA].map((pola, i) => (
            <span
              key={i}
              aria-hidden={i >= POLA.length}
              className="flex items-center font-mono text-[0.68rem] font-medium tracking-[0.18em] text-white uppercase"
            >
              <span className="px-5">{pola}</span>
              <span aria-hidden="true" className="text-blue-200">
                &#9679;
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ============ Rentang risiko: spektrum + tabel ============ */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-8">
              <div>
                <p className="font-mono text-[0.65rem] font-semibold tracking-[0.22em] text-aksen uppercase">
                  Bukan vonis
                </p>
                <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.25rem,5.2vw,3.75rem)] leading-[1.05] font-semibold tracking-tight text-ink">
                  Bukan angka hitam putih.{" "}
                  <span className="teks-aksen">Rentang risiko</span>, dengan
                  buktinya di meja Anda.
                </h2>
              </div>
              <p className="max-w-[16rem] font-mono text-[0.62rem] leading-relaxed tracking-[0.16em] text-muted uppercase">
                Spektrum skor 0 – 100, tiga rentang
              </p>
            </div>
          </Reveal>

          <div
            aria-hidden="true"
            className="mt-10 h-3 w-full rounded-full bg-[linear-gradient(90deg,#2563eb_0%,#2563eb_15%,#f59e0b_15%,#f59e0b_45%,#e11d48_45%,#e11d48_100%)]"
          />
          <div
            aria-hidden="true"
            className="mt-2 flex justify-between font-mono text-[0.6rem] tracking-[0.16em] text-muted uppercase"
          >
            <span className="w-[15%] text-center">0–14</span>
            <span className="w-[30%] text-center">15–44</span>
            <span className="w-[55%] text-center">45–100</span>
          </div>

          <ul className="mt-8 border-2 border-ink bg-paper">
            <li
              aria-hidden="true"
              className="hidden bg-ink px-5 py-2 font-mono text-[0.6rem] font-semibold tracking-[0.22em] text-white uppercase sm:grid sm:grid-cols-12 sm:gap-4"
            >
              <span className="col-span-1">No.</span>
              <span className="col-span-2">Rentang</span>
              <span className="col-span-4">Artinya</span>
              <span className="col-span-5">Yang sebaiknya Anda lakukan</span>
            </li>
            {RENTANG.map((band) => (
              <li
                key={band.label}
                className="grid gap-2 border-t border-ink px-5 py-5 sm:grid-cols-12 sm:items-center sm:gap-4"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-xs font-semibold text-muted"
                >
                  {band.nomor}
                </span>
                <span className="col-span-2">
                  <span
                    className={`inline-flex rounded-sm border px-2.5 py-1 font-mono text-[0.68rem] font-semibold tracking-[0.08em] uppercase ${band.chip}`}
                  >
                    {band.label}
                  </span>
                  <span className="mt-1 block font-mono text-[0.55rem] tracking-[0.14em] text-muted uppercase">
                    {band.skor}
                  </span>
                </span>
                <span className="text-sm leading-snug font-semibold text-ink sm:col-span-4">
                  {band.status}
                </span>
                <span className="text-sm leading-relaxed text-muted sm:col-span-5">
                  {band.saran}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ============ Cara kerja: tiga panel berkas ============ */}
      <section className="border-y border-line bg-paper py-16 sm:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[0.65rem] font-semibold tracking-[0.22em] text-aksen uppercase">
                Cara kerja
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-semibold tracking-tight text-ink">
                Tempel iklannya.{" "}
                <span className="teks-aksen">Buktinya kembali.</span>
              </h2>
            </div>
            <Link
              href="/cek"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.72rem] font-semibold tracking-[0.18em] text-aksen uppercase underline-offset-4 hover:underline"
            >
              Coba sekarang, gratis
              <span aria-hidden="true">&rarr;</span>
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
                className="flex flex-col border-2 border-ink bg-cream p-6"
              >
                <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-4">
                  <span className="font-mono text-[0.6rem] font-semibold tracking-[0.22em] text-muted uppercase">
                    Langkah {langkah.nomor}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-4xl leading-none font-semibold text-ink/15"
                  >
                    {langkah.nomor}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                  {langkah.judul}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                  {langkah.teks}
                </p>
                <p className="mt-auto pt-6 font-mono text-[0.58rem] font-medium tracking-[0.22em] text-aksen uppercase">
                  {langkah.tag}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-center font-mono text-[0.62rem] tracking-[0.2em] text-muted uppercase">
            Tanpa akun&ensp;·&ensp;Tanpa unggah berkas&ensp;·&ensp;Tanpa
            penyimpanan teks
          </p>
        </Container>
      </section>

      {/* ============ Dasar hukum: register pasal ============ */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="font-mono text-[0.65rem] font-semibold tracking-[0.22em] text-aksen uppercase">
                Dasar hukum
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.05] font-semibold tracking-tight text-ink">
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
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-[0.72rem] font-semibold tracking-[0.18em] text-aksen uppercase underline-offset-4 hover:underline"
              >
                Katalog {JUMLAH_ATURAN} aturan
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <ol className="divide-y divide-ink border-2 border-ink bg-paper lg:col-span-8">
              {PASAL.map((item) => (
                <li
                  key={item.pasal}
                  className="grid gap-2 p-5 sm:grid-cols-12 sm:gap-6"
                >
                  <span className="font-mono text-[0.72rem] leading-snug font-semibold text-ink sm:col-span-4">
                    {item.pasal}
                  </span>
                  <span className="text-sm leading-relaxed text-muted sm:col-span-8">
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
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="font-mono text-[0.65rem] font-semibold tracking-[0.22em] text-aksen uppercase">
                FAQ
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.25rem,4.2vw,3.25rem)] leading-[1.05] font-semibold tracking-tight text-ink">
                Pertanyaan yang <span className="teks-aksen">sering</span>{" "}
                diajukan.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <Faq butir={FAQ} />
            </div>
          </div>
        </Container>
      </section>

      {/* ============ CTA penutup: kanvas navy ============ */}
      <section className="relative overflow-hidden bg-ink-deep py-20 text-white sm:py-24">
        <div aria-hidden="true" className="pola-kisi-gelap absolute inset-0" />
        <Container className="relative flex flex-col items-center text-center">
          <p className="font-mono text-[0.62rem] font-semibold tracking-[0.24em] text-slate-500 uppercase">
            Cek dulu, baru lamar
          </p>
          <h2 className="mt-5 font-display text-[clamp(3rem,8.5vw,6rem)] leading-[1.02] font-semibold tracking-tight text-balance text-white">
            Baca iklannya.
            <br />
            <span className="teks-aksen-terang">Baru lamar.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400">
            Gratis, tanpa daftar akun. Teks iklan Anda tidak pernah disimpan di
            server kami.
          </p>
          <Link
            href="/cek"
            className="mt-10 inline-flex min-h-14 items-center rounded-full bg-[#3b82f6] px-10 text-lg font-semibold text-ink-deep transition-colors duration-200 hover:bg-[#60a5fa]"
          >
            Cek lowongan sekarang
          </Link>
        </Container>
      </section>
    </div>
  );
}
