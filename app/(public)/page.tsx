import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function Beranda() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background Ambient Glow (Dribbble/Linear style) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
      >
        <div className="aspect-[1155/678] w-[72.1875rem] flex-none bg-gradient-to-tr from-emerald-400/25 via-teal-300/20 to-emerald-600/10 opacity-70" />
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <Container>
          <div className="flex flex-col items-center text-center">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-50/70 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs backdrop-blur-xs transition-all hover:bg-emerald-50">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SEVENT X SDG 8 Decent Work &amp; Economic Growth</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl text-balance">
              Deteksi risiko lowongan kerja{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                secara instan &amp; objektif
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-xl">
              CekLoker menguji isi iklan lowongan terhadap standar regulasi
              ketenagakerjaan Indonesia. Temukan indikator mencurigakan, bukti kutipan,
              dan rujukan hukum resmi sebelum melamar.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/cek"
                className="group inline-flex items-center gap-2.5 rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-950/15 transition-all duration-200 hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Periksa Lowongan Sekarang</span>
                <svg
                  className="size-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/metodologi"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300"
              >
                Lihat 18+ Aturan
              </Link>
            </div>

            {/* Value Props Strip */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs font-medium text-slate-500 sm:text-sm">
              <div className="flex items-center gap-2">
                <svg className="size-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                <span>100% Deterministik Tanpa Halusinasi</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="size-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                <span>Zero-Storage Teks Privasi</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="size-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                <span>Rujukan UU &amp; Permenaker Resmi</span>
              </div>
            </div>
          </div>

          {/* Dribbble Top-Tier Hero Mockup Showcase */}
          <div className="relative mt-16 sm:mt-24">
            <div className="relative mx-auto max-w-5xl rounded-3xl border border-slate-200/80 bg-slate-900/5 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl">
                {/* Mockup Window Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-rose-400" />
                    <span className="size-3 rounded-full bg-amber-400" />
                    <span className="size-3 rounded-full bg-emerald-400" />
                    <span className="ml-3 font-mono text-xs text-slate-400">cekloker.id/evaluasi</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-800">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Rentang: Perlu Dikonfirmasi
                  </div>
                </div>

                {/* Mockup Dashboard Content */}
                <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-12 lg:gap-8">
                  {/* Left Column: Teks Analysis with Highlights */}
                  <div className="flex flex-col gap-4 lg:col-span-7">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Pratinjau Pemindaian Teks Iklan
                      </span>
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        3 Indikator Terdeteksi
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5 font-mono text-xs leading-relaxed text-slate-700">
                      <p>Lowongan Kerja Staff Admin &amp; Data Entry (Urgent!)</p>
                      <p className="mt-2 text-slate-500">PT Maju Sejahtera Sentosa — Jakarta Selatan</p>
                      <p className="mt-3">
                        Kualifikasi: Pria/Wanita, usia 18-30 thn, lulusan SMA/SMK sederajat.
                      </p>
                      <p className="mt-2 rounded-md bg-amber-100/80 p-1.5 text-amber-900 border border-amber-300">
                        &bull; Penghasilan: Rp 8.000.000 - Rp 15.000.000 per bulan (Komisi tanpa batas)
                      </p>
                      <p className="mt-2 rounded-md bg-rose-100/90 p-1.5 text-rose-900 border border-rose-300 font-bold">
                        &bull; Biaya seragam, ID card, dan administrasi berkas: Rp 150.000 (Wajib lunas saat tes)
                      </p>
                      <p className="mt-2 rounded-md bg-amber-100/80 p-1.5 text-amber-900 border border-amber-300">
                        &bull; Langsung kirim CV ke nomor WhatsApp 0812-xxxx (Tanpa seleksi berkas)
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Scorecard & Legal References */}
                  <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50/50 to-white p-6 lg:col-span-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Skor Risiko Terhitung
                      </span>
                      <div className="mt-3 flex items-baseline gap-3">
                        <span className="text-5xl font-black tracking-tight text-slate-900">
                          65
                        </span>
                        <span className="text-sm font-semibold text-slate-400">/ 100</span>
                        <span className="ml-auto rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700">
                          Perlu Dicek
                        </span>
                      </div>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" style={{ width: "65%" }} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Rujukan Hukum Pelanggaran
                      </span>
                      <div className="flex flex-col gap-2">
                        <div className="rounded-lg border border-slate-200/80 bg-white p-2.5 text-xs">
                          <p className="font-bold text-slate-800">Pasal 35 UU No. 13/2003</p>
                          <p className="text-slate-500">Pemberi kerja dilarang memungut biaya penempatan dari pencari kerja.</p>
                        </div>
                        <div className="rounded-lg border border-slate-200/80 bg-white p-2.5 text-xs">
                          <p className="font-bold text-slate-800">Permenaker No. 39/2016</p>
                          <p className="text-slate-500">Standar rekrutmen wajib transparan tanpa pembebanan pungutan sepihak.</p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/cek"
                      className="mt-2 text-center rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition-all hover:bg-slate-800"
                    >
                      Coba Evaluasi Lowongan Anda &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bento Grid Feature Section (Modern Dribbble Layout) */}
      <section className="border-y border-slate-200/80 bg-slate-50/60 py-24 sm:py-32">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-800 shadow-2xs">
              <span>Fitur Utama</span>
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Dirancang untuk melindungi pencari kerja
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Arsitektur evaluasi berbasis aturan deterministik yang mengutamakan transparansi dan privasi penuh.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Bento 1: Large Multi-Rule Detection */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs transition-all duration-300 hover:shadow-lg sm:col-span-2">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-950 sm:text-2xl">
                    18+ Aturan Ketenagakerjaan Terprogram
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
                    Memindai anomali upah di bawah batas minimum (UMP), pungutan biaya terselubung, manipulasi jam kerja lembur, hingga pola rekrutmen berantai yang merugikan.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Pungutan Biaya Seleksi</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Ambang Upah Minimum (UMP)</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Kanal Kontak Pribadi</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Dokumen Sensitif Dini</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Penempatan Luar Negeri Ilegal</span>
                </div>
              </div>
            </div>

            {/* Bento 2: Deterministic Score */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs transition-all duration-300 hover:shadow-lg">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Deterministik Tanpa Halusinasi
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Masukan yang sama selalu menghasilkan skor risiko dan temuan yang identik. Tidak ada model bahasa yang mereka-reka vonis.
              </p>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <span className="font-mono text-xs font-semibold text-emerald-600">
                  Versioned Engine v1.0.0 &bull; Vitest Tested
                </span>
              </div>
            </div>

            {/* Bento 3: Zero Data Storage Privacy */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs transition-all duration-300 hover:shadow-lg">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Privasi 100% Terjaga
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Teks lowongan yang Anda masukkan langsung diproses dan tidak pernah disimpan di database server kami.
              </p>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-500">
                  Hasil disimpan sementara di peramban sesi Anda
                </span>
              </div>
            </div>

            {/* Bento 4: Legal Framework */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs transition-all duration-300 hover:shadow-lg sm:col-span-2">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-slate-950 sm:text-2xl">
                    Transparansi Regulasi Ketenagakerjaan
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
                    Setiap indikator disertai nomor pasal regulasi resmi (UU No. 13/2003 Ketenagakerjaan, UU No. 6/2023 Cipta Kerja, Permenaker, dan Surat Edaran Menaker) agar Anda memiliki dasar hukum yang kuat saat berhadapan dengan perekrut.
                  </p>
                </div>

                <div className="mt-8">
                  <Link
                    href="/metodologi"
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    <span>Pelajari metodologi dan dasar hukum selengkapnya</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tiga Rentang Section */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Tiga Rentang Risiko Objektif
            </h2>
            <p className="mt-4 text-base text-slate-600">
              CekLoker tidak memberikan vonis hitam-putih. Kami menyajikan rentang risiko agar keputusan akhir tetap di tangan Anda.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/50 to-white p-8 shadow-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                Rendah
              </span>
              <h3 className="mt-5 text-xl font-bold text-slate-950">Indikator Aman</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Tidak ditemukan indikator bermasalah pada teks lowongan. Tetap lakukan verifikasi ke kanal resmi perusahaan sebelum mengirim berkas.
              </p>
            </div>

            <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-b from-amber-50/50 to-white p-8 shadow-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                <span className="size-1.5 rounded-full bg-amber-600" />
                Perlu Dicek
              </span>
              <h3 className="mt-5 text-xl font-bold text-slate-950">Perlu Konfirmasi</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Ada indikator yang perlu dikonfirmasi langsung, seperti ketidaksesuaian kisaran upah, jam kerja, atau penggunaan kontak pribadi perorangan.
              </p>
            </div>

            <div className="rounded-3xl border border-rose-200/80 bg-gradient-to-b from-rose-50/50 to-white p-8 shadow-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
                <span className="size-1.5 rounded-full bg-rose-600" />
                Tinggi
              </span>
              <h3 className="mt-5 text-xl font-bold text-slate-950">Kewaspadaan Penuh</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Ditemukan kombinasi indikator berisiko tinggi seperti permintaan transfer biaya, penahanan ijazah tanpa kontrak, atau janji kerja instan tanpa tes.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Dribbble Style Floating CTA Banner */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-8 py-16 sm:px-16 sm:py-24 shadow-2xl">
            <div className="absolute -right-20 -top-20 size-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
            <div className="relative mx-auto max-w-2xl text-center">
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                Inisiatif Terbuka &amp; Gratis
              </span>
              <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-5xl text-balance">
                Periksa lowongan Anda sekarang sebelum terlambat
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
                Hanya butuh 5 detik untuk memastikan masa depan dan hak kerja Anda terlindungi dari praktik rekrutmen yang merugikan.
              </p>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/cek"
                  className="rounded-full bg-emerald-500 px-9 py-4 text-base font-bold text-slate-950 shadow-xl transition-all duration-200 hover:bg-emerald-400 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  Mulai Evaluasi Lowongan Sekarang
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
