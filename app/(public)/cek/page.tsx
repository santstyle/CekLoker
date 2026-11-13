"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { UnggahPoster } from "@/components/check/unggah-poster";
import { Container } from "@/components/ui/container";
import { kunciSimpananHasil, type ResponsEvaluasi } from "@/lib/api/evaluasi";

const MINIMAL_KARAKTER = 30;

const CONTOH_LOWONGAN_MENCURIGAKAN = `LOWONGAN KERJA URGENT STAFF ADMIN & DATA ENTRY
PT Sentosa Maju Bersama — Jakarta Pusat

Kualifikasi:
- Pria/Wanita usia 18 - 35 tahun
- Pendidikan minimal SMP/SMA/SMK Sederajat
- Pengalaman tidak diutamakan (Langsung diterima)
- Siap kerja minggu ini juga

Fasilitas & Gaji:
- Gaji pokok Rp 8.500.000 - Rp 15.000.000 / bulan
- Uang harian & transport Rp 100.000 / hari
- Bonus komisi rekrutmen member baru tanpa batas

Catatan Penting:
- Wajib membayar biaya administrasi berkas & seragam kerja sebesar Rp 150.000 yang ditransfer sebelum jadwal wawancara kerja.
- Kirim data diri langsung melalui pesan WhatsApp pribadi HRD: 0812-9876-5432 (Tidak menerima telepon).`;

const CONTOH_LOWONGAN_WAJAR = `LOWONGAN PEKERJAAN: JUNIOR ACCOUNTANT
PT Nusantara Berkat Abadi (Kawasan Industri Pulogadung, Jakarta Timur)

Tanggung Jawab:
- Melakukan pencatatan jurnal transaksi harian dan rekonsiliasi kas/bank.
- Membantu penyusunan laporan keuangan bulanan sesuai PSAK.
- Menyiapkan berkas perpajakan (PPh 21, PPh 23, dan PPN).

Kualifikasi:
- Lulusan D3/S1 Akuntansi dari perguruan tinggi terakreditasi.
- Memahami software akuntansi Accurate atau SAP menjadi nilai tambah.
- Memiliki ketelitian tinggi dan integritas kerja.

Kompensasi & Hak Kerja:
- Gaji pokok sesuai ketentuan UMP DKI Jakarta (Rp 5.067.000) ditambah tunjangan kesehatan BPJS Ketenagakerjaan & BPJS Kesehatan.
- Jam kerja: Senin - Jumat, 08.30 - 17.30 WIB (40 jam per minggu).

Pendaftaran:
Kirimkan CV dan portofolio Anda melalui email resmi rekrutmen: karir@nusantaraberkat.co.id dengan subjek "Posisi Akuntan - [Nama Anda]". Proses seleksi bebas biaya apa pun.`;

type TabMode = "teks" | "poster";

export default function HalamanCek() {
  const router = useRouter();
  const [tabAktif, setTabAktif] = useState<TabMode>("teks");
  const [teks, setTeks] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [mengirim, setMengirim] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);
  const [sumberOcr, setSumberOcr] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const panjangTeks = teks.trim().length;
  const bolehKirim = panjangTeks >= MINIMAL_KARAKTER && !mengirim;

  async function kirim(peristiwa: React.FormEvent<HTMLFormElement>) {
    peristiwa.preventDefault();
    setMengirim(true);
    setPesan(null);

    try {
      const respons = await fetch("/api/evaluasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teksLowongan: teks,
          ...(lokasi.trim() ? { lokasi: lokasi.trim() } : {}),
        }),
      });
      const data: unknown = await respons.json();

      if (!respons.ok) {
        const pesanGagal =
          (data as { error?: string }).error ??
          "Terjadi kendala saat memeriksa lowongan. Coba lagi.";
        setPesan(pesanGagal);
        setMengirim(false);
        return;
      }

      const { id, hasil } = data as ResponsEvaluasi;
      window.sessionStorage.setItem(
        kunciSimpananHasil(id),
        JSON.stringify({ id, hasil }),
      );
      router.push(`/hasil/${id}`);
    } catch {
      setPesan(
        "Tidak dapat menghubungi layanan. Periksa koneksi internet lalu coba lagi.",
      );
      setMengirim(false);
    }
  }

  function handleTeksOcr(teksHasil: string) {
    setTeks(teksHasil);
    setSumberOcr(true);
    setPesan(null);
    // Pindahkan fokus ke textarea agar pengguna memeriksa hasil bacaan
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-slate-50/60 py-12 sm:py-16 lg:py-20">
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
      >
        <div className="aspect-[1155/678] w-[60rem] flex-none bg-gradient-to-tr from-blue-400/20 to-indigo-400/15 opacity-50" />
      </div>

      <Container>
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-800 shadow-2xs">
              <span className="size-1.5 animate-pulse rounded-full bg-blue-600" />
              <span>Pemeriksaan Deterministik</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Periksa Iklan Lowongan Kerja
            </h1>

            <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
              Tempel teks iklan atau unggah poster lowongan. Sistem memindai
              indikator risiko dan mengonfirmasikannya dengan standar
              ketenagakerjaan.
            </p>

            {/* Quick Demo Buttons */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
              <span className="text-xs font-semibold text-slate-400">
                Coba contoh cepat:
              </span>
              <button
                type="button"
                onClick={() => {
                  setTabAktif("teks");
                  setTeks(CONTOH_LOWONGAN_MENCURIGAKAN);
                  setLokasi("Jakarta Pusat");
                  setSumberOcr(false);
                  setPesan(null);
                }}
                className="rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800 transition-all hover:bg-amber-100 active:scale-95"
              >
                &bull; Contoh Iklan Mencurigakan
              </button>
              <button
                type="button"
                onClick={() => {
                  setTabAktif("teks");
                  setTeks(CONTOH_LOWONGAN_WAJAR);
                  setLokasi("Jakarta Timur");
                  setSumberOcr(false);
                  setPesan(null);
                }}
                className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-800 transition-all hover:bg-blue-100 active:scale-95"
              >
                &bull; Contoh Iklan Standar Wajar
              </button>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl sm:p-10">
            {/* Tab Selection */}
            <div className="mb-8 flex rounded-2xl border border-slate-200 bg-slate-100/70 p-1">
              <button
                type="button"
                onClick={() => setTabAktif("teks")}
                className={`flex-1 cursor-pointer rounded-xl py-2.5 text-xs font-bold transition-all sm:text-sm ${
                  tabAktif === "teks"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Tempel Teks Iklan
              </button>
              <button
                type="button"
                onClick={() => setTabAktif("poster")}
                className={`flex-1 cursor-pointer rounded-xl py-2.5 text-xs font-bold transition-all sm:text-sm ${
                  tabAktif === "poster"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Pindai Gambar Poster (OCR)
              </button>
            </div>

            {/* Poster Upload Section */}
            {tabAktif === "poster" && (
              <div className="mb-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <UnggahPoster
                  onTeksTerbaca={handleTeksOcr}
                  onMulaiMemproses={() => setPesan(null)}
                  disabled={mengirim}
                />
              </div>
            )}

            <form onSubmit={kirim} className="flex flex-col gap-8">
              {/* OCR Notice */}
              {sumberOcr && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs text-blue-950 sm:text-sm"
                >
                  <svg
                    className="mt-0.5 size-5 shrink-0 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <div>
                    <span className="font-bold">
                      Teks hasil bacaan mesin (OCR):{" "}
                    </span>
                    Periksa dan perbaiki bila ada ejaan kata, nominal gaji, atau
                    nomor telepon yang kurang tepat sebelum Anda mengirim
                    evaluasi.
                  </div>
                </div>
              )}

              {/* Text Input Group */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="teks-lowongan"
                    className="text-sm font-bold text-slate-900"
                  >
                    Teks Iklan Lowongan Kerja{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-xs font-semibold transition-colors ${
                      panjangTeks >= MINIMAL_KARAKTER
                        ? "text-slate-400"
                        : "text-amber-600"
                    }`}
                  >
                    {panjangTeks} karakter (minimal {MINIMAL_KARAKTER})
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    id="teks-lowongan"
                    value={teks}
                    onChange={(perubahan) => setTeks(perubahan.target.value)}
                    rows={11}
                    required
                    placeholder="Tempel seluruh isi teks lowongan kerja di sini... Sertakan rincian posisi, syarat kualifikasi, nominal gaji, jam kerja, atau kontak perekrut untuk hasil evaluasi yang paling akurat."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/40 p-5 text-sm leading-relaxed font-normal text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none sm:text-base"
                  />
                  {teks.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setTeks("");
                        setSumberOcr(false);
                      }}
                      className="absolute right-4 bottom-4 cursor-pointer rounded-lg bg-slate-200/80 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-300"
                    >
                      Bersihkan
                    </button>
                  )}
                </div>
              </div>

              {/* Location Input Group */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-baseline justify-between">
                  <label
                    htmlFor="lokasi"
                    className="text-sm font-bold text-slate-900"
                  >
                    Lokasi Penempatan
                  </label>
                  <span className="text-xs text-slate-400">Opsional</span>
                </div>
                <input
                  id="lokasi"
                  type="text"
                  value={lokasi}
                  onChange={(perubahan) => setLokasi(perubahan.target.value)}
                  placeholder="Contoh: DKI Jakarta, Surabaya, Jawa Barat, Bali..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-3.5 text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none sm:text-base"
                />
                <p className="text-xs text-slate-500">
                  Membantu sistem membandingkan tawaran upah terhadap batas Upah
                  Minimum Provinsi (UMP/UMK) daerah bersangkutan.
                </p>
              </div>

              {/* Error Alert */}
              {pesan && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
                >
                  <svg
                    className="size-5 shrink-0 text-rose-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <span className="font-bold">Kendala Evaluasi: </span>
                    <span>{pesan}</span>
                  </div>
                </div>
              )}

              {/* Submit Button & Privacy Note */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <svg
                    className="size-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                  <span>Teks yang Anda masukkan tidak disimpan di server.</span>
                </div>

                <button
                  type="submit"
                  disabled={!bolehKirim}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                >
                  {mengirim ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Sedang Memeriksa...</span>
                    </>
                  ) : (
                    <>
                      <span>Mulai Periksa Lowongan</span>
                      <svg
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
