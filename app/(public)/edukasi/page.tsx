import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Kepala } from "@/components/situs/kepala";
import { metadataHalaman } from "@/lib/situs";

export const metadata: Metadata = metadataHalaman({
  judul: "Edukasi Hak Kerja",
  deskripsi:
    "Panduan mengenali pola lowongan kerja berisiko dan memahami hak dasar pekerja Indonesia, lengkap dengan rujukan regulasi resmi.",
  jalur: "/edukasi",
});

const POLA_WASPADA = [
  {
    judul: "Pungutan Biaya Rekrutmen",
    uraian:
      "Rekrutmen resmi tidak memungut biaya dari pelamar: biaya formulir, administrasi berkas, seragam, pelatihan, atau jaminan kerja.",
    saran:
      "Tolak pembayaran apa pun. Pungutan biaya penempatan kepada tenaga kerja dilarang oleh Pasal 38 ayat (1) UU No. 13/2003.",
    kategori: "Kritis",
  },
  {
    judul: "Nominal Upah Tidak Realistis",
    uraian:
      "Iming-iming gaji fantastis puluhan juta untuk kualifikasi ringan tanpa wawancara formal patut dicurigai.",
    saran:
      "Minta surat penawaran kerja (Offering Letter) resmi yang merinci gaji pokok dan struktur tunjangan.",
    kategori: "Waspada",
  },
  {
    judul: "Komunikasi Jalur Pribadi",
    uraian:
      "Proses perekrutan hanya berjalan lewat pesan instan nomor telepon pribadi tanpa surat berkop atau email domain kantor.",
    saran:
      "Pastikan nomor telepon kantor atau email memiliki domain korporat resmi dan alamat fisik kantor terdaftar.",
    kategori: "Waspada",
  },
  {
    judul: "Permintaan Berkas Sensitif Terlalu Dini",
    uraian:
      "Permintaan buku tabungan, nomor PIN, data keluarga lengkap, atau fotokopi KTP sebelum tahapan penawaran kerja resmi.",
    saran:
      "Tunda pengiriman data sensitif hingga ada surat penawaran kerja (Offering Letter) resmi.",
    kategori: "Privasi",
  },
  {
    judul: "Diterima Instan Tanpa Seleksi",
    uraian:
      "Pemberitahuan lolos kerja secara instan tanpa proses wawancara, tes kompetensi, atau klarifikasi kualifikasi.",
    saran:
      "Tanyakan prosedur seleksi baku dan profil posisi sebelum menyetujui komitmen apa pun.",
    kategori: "Waspada",
  },
  {
    judul: "Tekanan Waktu Berlebihan",
    uraian:
      "Desakan untuk menandatangani atau mengirim uang 'hari ini juga' agar pelamar tidak sempat berpikir jernih.",
    saran:
      "Abaikan tekanan waktu dan lakukan riset legalitas badan usaha melalui AHU Kemenkumham.",
    kategori: "Manipulasi",
  },
];

const HAK_DASAR = [
  {
    judul: "Upah Minimum (UMP/UMK)",
    uraian:
      "Pemberi kerja dilarang membayar upah lebih rendah dari ketetapan upah minimum provinsi/kota tempat pekerja ditempatkan.",
    rujukan: "UU No. 6/2023 Cipta Kerja",
  },
  {
    judul: "Batas Jam Kerja & Hak Lembur",
    uraian:
      "Batas standar 40 jam per minggu (7 jam/hari untuk 6 hari kerja, atau 8 jam/hari untuk 5 hari kerja). Kerja lembur wajib dibayar.",
    rujukan: "PP No. 35/2021",
  },
  {
    judul: "Penempatan Luar Negeri Resmi",
    uraian:
      "Penempatan tenaga kerja ke luar negeri wajib melalui Perusahaan Penempatan Pekerja Migran Indonesia (P3MI) berizin resmi.",
    rujukan: "UU No. 18/2017 PPMI",
  },
];

export default function HalamanEdukasi() {
  return (
    <div className="bg-cream">
      <Kepala
        kicker="Pusat Literasi Pencari Kerja"
        judul={
          <>
            Kenali hak kerja,{" "}
            <span className="teks-gradasi-terang">waspadai risikonya.</span>
          </>
        }
        deskripsi="Panduan praktis berbasis peraturan perundang-undangan ketenagakerjaan Indonesia untuk membekali pencari kerja sebelum melamar."
      />

      <Container className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-16 sm:gap-20">
          {/* Section 1: Hak Dasar Pekerja */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Hak Dasar yang Wajib Anda Peroleh
              </h2>
              <p className="text-sm text-slate-500">
                Standar minimum yang dijamin oleh regulasi pemerintah Republik
                Indonesia.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {HAK_DASAR.map((hak) => (
                <div
                  key={hak.judul}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-3">
                    <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {hak.rujukan}
                    </span>
                    <h3 className="text-lg font-bold text-slate-950">
                      {hak.judul}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {hak.uraian}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Pola Waspada Bento */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Pola Risiko yang Sering Terjadi
              </h2>
              <p className="text-sm text-slate-500">
                Pola-pola rekrutmen yang berpotensi merugikan atau melanggar hak
                pelamar.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {POLA_WASPADA.map((pola) => (
                <div
                  key={pola.judul}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-700">
                        {pola.kategori}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-950 sm:text-lg">
                      {pola.judul}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {pola.uraian}
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-blue-200/80 bg-blue-50/60 p-4 text-xs text-blue-950 sm:text-sm">
                    <span className="font-bold">Langkah Preventif: </span>
                    <span>{pola.saran}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Checklist Verifikasi */}
          <section className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs sm:p-10">
            <h2 className="text-2xl font-black text-slate-950">
              5 Langkah Mandiri Sebelum Mengirim Lamaran
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Gunakan daftar periksa ini untuk memastikan legalitas perekrut.
            </p>

            <ol className="mt-6 flex list-decimal flex-col gap-4 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
              <li>
                <strong>Cek Alamat Fisik di Google Maps:</strong> Pastikan
                kantor memiliki plang nama fisik dan bukan sekadar rumah kosong
                atau ruko terbengkalai.
              </li>
              <li>
                <strong>Verifikasi Legalitas Badan Usaha:</strong> Periksa nama
                PT/CV di situs resmi Ditjen AHU Online Kemenkumham.
              </li>
              <li>
                <strong>Bandingkan Gaji dengan UMP:</strong> Bila gaji yang
                dijanjikan jauh di bawah atau tidak masuk akal di atas UMP
                daerah bersangkutan, lakukan konfirmasi ulang.
              </li>
              <li>
                <strong>Hindari Jalur Kontak WA Pribadi:</strong> Utamakan
                pendaftaran melalui portal karir resmi perusahaan atau job
                portal terverifikasi.
              </li>
              <li>
                <strong>Jangan Pernah Mentransfer Uang:</strong> Proses
                rekrutmen tidak pernah meminta biaya apa pun dari pelamar kerja.
              </li>
            </ol>
          </section>

          {/* CTA Banner */}
          <div className="gradien-senja flex flex-col items-center justify-between gap-6 rounded-3xl p-8 text-center shadow-xl sm:flex-row sm:p-12 sm:text-left">
            <div>
              <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                Punya iklan lowongan yang mencurigakan?
              </h3>
              <p className="mt-1 text-sm text-blue-100/90">
                Uji langsung menggunakan mesin evaluasi CekLoker secara instan.
              </p>
            </div>
            <Link
              href="/cek"
              className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Periksa Sekarang
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
