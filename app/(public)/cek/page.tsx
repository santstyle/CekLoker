"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { PilihLokasi } from "@/components/check/pilih-lokasi";
import { UnggahPoster } from "@/components/check/unggah-poster";
import { Container } from "@/components/ui/container";
import { kunciSimpananHasil, type ResponsEvaluasi } from "@/lib/api/evaluasi";
import { RULES } from "@/lib/evaluation/rules";
import { CATATAN_DATA_UPAH } from "@/lib/evaluation/wages";

const MINIMAL_KARAKTER = 30;
const MAKSIMAL_KARAKTER = 20_000;
const JUMLAH_ATURAN = RULES.length;

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

const KLAUSUL_KEPERCAYAAN = [
  {
    judul: "Tanpa akun dan tanpa biaya",
    teks: "Langsung periksa, tanpa daftar atau membayar apa pun.",
  },
  {
    judul: "Teks Anda tidak disimpan",
    teks: "Diproses saat itu juga; hasil hanya hidup di sesi peramban Anda.",
  },
  {
    judul: "Poster dipindai di peramban",
    teks: "OCR 100% lokal — gambar tidak pernah diunggah ke server.",
  },
] as const;

export default function HalamanCek() {
  const router = useRouter();
  const [tabAktif, setTabAktif] = useState<TabMode>("teks");
  const [teks, setTeks] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [mengirim, setMengirim] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);
  const [sumberOcr, setSumberOcr] = useState(false);
  const [contohAktif, setContohAktif] = useState<"tinggi" | "rendah" | null>(
    null,
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const panjangTeks = teks.trim().length;
  const bolehKirim =
    panjangTeks >= MINIMAL_KARAKTER &&
    panjangTeks <= MAKSIMAL_KARAKTER &&
    !mengirim;

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
    setContohAktif(null);
    // Pindahkan fokus ke textarea agar pengguna memeriksa hasil bacaan
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
  }

  function isiContoh(
    teksContoh: string,
    lokasiContoh: string,
    contoh: "tinggi" | "rendah",
  ) {
    setTabAktif("teks");
    setTeks(teksContoh);
    setLokasi(lokasiContoh);
    setSumberOcr(false);
    setPesan(null);
    setContohAktif(contoh);
  }

  return (
    <div className="relative overflow-hidden bg-cream">
      {/* Latar titik halus + semburat azure */}
      <div
        aria-hidden="true"
        className="pola-titik pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(59_130_246/0.16),transparent_65%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-40 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(125_211_252/0.18),transparent_65%)] blur-3xl"
      />

      <Container className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ---- Kolom editorial (tetap di posisi sama, stabil saat tinggi kartu berubah) ---- */}
          <div className="flex flex-col gap-7 lg:col-span-5">
            <p className="inline-flex w-fit items-center gap-2.5 rounded-full border border-aksen/25 bg-aksen/5 px-4 py-1.5 font-mono text-[0.6rem] font-semibold tracking-[0.22em] text-aksen-pekat uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-aksen"
              />
              Pemeriksaan deterministik
            </p>

            <h1 className="font-display text-[clamp(2.5rem,5.6vw,4rem)] leading-[1.02] font-extrabold tracking-tight text-balance text-ink">
              Tempel iklannya.{" "}
              <span className="teks-gradasi">Risikonya terbaca.</span>
            </h1>

            <p className="max-w-md text-base leading-relaxed text-muted sm:text-lg">
              CekLoker memindai {JUMLAH_ATURAN} aturan baku ketenagakerjaan
              Indonesia dan memperlihatkan kutipan bukti beserta rujukan
              pasalnya. Bukan vonis — keputusan akhir tetap di tangan Anda.
            </p>

            <ul className="flex flex-col gap-4">
              {KLAUSUL_KEPERCAYAAN.map((item) => (
                <li key={item.judul} className="flex items-start gap-3.5">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-aksen/20 bg-aksen/5 text-aksen"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                      <path d="M9.5 12.5 11.5 14.5 15 10.5" />
                    </svg>
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">
                      {item.judul}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                      {item.teks}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="border-t border-line pt-5 font-mono text-[0.6rem] tracking-[0.2em] text-muted uppercase">
              {JUMLAH_ATURAN} aturan baku&ensp;·&ensp;0 akun&ensp;·&ensp;0 teks
              disimpan
            </p>
          </div>

          {/* ---- Kartu formulir ---- */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_1px_2px_rgb(15_23_42/0.05),0_32px_64px_-32px_rgb(15_23_42/0.3)]">
              {/* Kepala dokumen */}
              <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-3.5 font-mono text-[0.6rem] font-semibold tracking-[0.2em] text-muted uppercase sm:px-8">
                <span>Formulir pemeriksaan</span>
                <span className="text-aksen-pekat">Gratis · 0 akun</span>
              </div>

              <div className="p-6 sm:p-8">
                {/* Tab sumber masukan */}
                <div
                  role="tablist"
                  aria-label="Sumber teks lowongan"
                  className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-cream p-1"
                >
                  {(
                    [
                      { mode: "teks", label: "Tempel Teks Iklan" },
                      { mode: "poster", label: "Pindai Poster (OCR)" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.mode}
                      type="button"
                      role="tab"
                      aria-selected={tabAktif === tab.mode}
                      onClick={() => setTabAktif(tab.mode)}
                      className={`cursor-pointer rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 sm:text-sm ${
                        tabAktif === tab.mode
                          ? "bg-ink text-white shadow-sm"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Muat contoh iklan */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[0.55rem] font-semibold tracking-[0.18em] text-muted uppercase">
                    Muat contoh iklan:
                  </span>
                  <button
                    type="button"
                    aria-pressed={contohAktif === "tinggi"}
                    onClick={() =>
                      isiContoh(
                        CONTOH_LOWONGAN_MENCURIGAKAN,
                        "Jakarta Pusat",
                        "tinggi",
                      )
                    }
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.7rem] font-semibold transition-all duration-200 ${
                      contohAktif === "tinggi"
                        ? "border-rose-600 bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/25"
                        : "border-rose-300/70 bg-rose-50 text-rose-800 hover:border-rose-400 hover:bg-rose-100"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${
                        contohAktif === "tinggi" ? "bg-white" : "bg-rose-500"
                      }`}
                    />
                    Contoh Iklan Risiko Tinggi
                  </button>
                  <button
                    type="button"
                    aria-pressed={contohAktif === "rendah"}
                    onClick={() =>
                      isiContoh(
                        CONTOH_LOWONGAN_WAJAR,
                        "Jakarta Timur",
                        "rendah",
                      )
                    }
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.7rem] font-semibold transition-all duration-200 ${
                      contohAktif === "rendah"
                        ? "border-aksen bg-aksen text-white shadow-sm ring-2 ring-aksen/25"
                        : "border-aksen/30 bg-aksen/5 text-aksen-pekat hover:border-aksen/60 hover:bg-aksen/10"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${
                        contohAktif === "rendah" ? "bg-white" : "bg-aksen"
                      }`}
                    />
                    Contoh Iklan Risiko Rendah
                  </button>
                </div>

                {tabAktif === "poster" && (
                  <div className="mt-5 rounded-2xl border border-line bg-cream/50 p-5">
                    <UnggahPoster
                      onTeksTerbaca={handleTeksOcr}
                      onMulaiMemproses={() => setPesan(null)}
                      disabled={mengirim}
                    />
                  </div>
                )}

                <form onSubmit={kirim} className="mt-5 flex flex-col gap-6">
                  {sumberOcr && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="flex items-start gap-3 rounded-2xl border border-aksen/25 bg-aksen/5 p-4 text-xs text-ink sm:text-sm"
                    >
                      <svg
                        className="mt-0.5 size-5 shrink-0 text-aksen"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
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
                        Periksa dan perbaiki ejaan, nominal gaji, atau nomor
                        telepon yang kurang tepat sebelum mengirim.
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-baseline justify-between gap-4">
                      <label
                        htmlFor="teks-lowongan"
                        className="text-sm font-bold text-ink"
                      >
                        Teks iklan lowongan{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <span
                        className={`font-mono text-[0.62rem] font-semibold tabular-nums ${
                          panjangTeks > MAKSIMAL_KARAKTER
                            ? "text-rose-600"
                            : panjangTeks >= MINIMAL_KARAKTER
                              ? "text-muted"
                              : "text-amber-600"
                        }`}
                      >
                        {panjangTeks} /{" "}
                        {MAKSIMAL_KARAKTER.toLocaleString("id-ID")} karakter
                      </span>
                    </div>

                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        id="teks-lowongan"
                        value={teks}
                        onChange={(perubahan) => {
                          setTeks(perubahan.target.value);
                          setContohAktif(null);
                        }}
                        rows={11}
                        required
                        maxLength={MAKSIMAL_KARAKTER}
                        placeholder="Tempel seluruh isi teks lowongan di sini — posisi, kualifikasi, gaji, jam kerja, kontak perekrut — untuk hasil evaluasi paling akurat."
                        className="w-full rounded-2xl border border-line bg-cream/60 p-5 text-sm leading-relaxed text-ink transition-all duration-200 placeholder:text-slate-400 focus:border-aksen focus:bg-paper focus:ring-4 focus:ring-aksen/10 focus:outline-none sm:text-base"
                      />
                      {teks.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setTeks("");
                            setSumberOcr(false);
                            setContohAktif(null);
                          }}
                          className="absolute right-4 bottom-4 cursor-pointer rounded-lg bg-ink/5 px-2.5 py-1 text-[0.65rem] font-semibold text-muted transition-colors hover:bg-ink/10 hover:text-ink"
                        >
                          Bersihkan
                        </button>
                      )}
                    </div>
                    <p className="text-[0.65rem] text-muted">
                      Minimal {MINIMAL_KARAKTER} karakter. Jangan kirim NIK,
                      KTP, atau nomor rekening.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <label
                        htmlFor="lokasi"
                        className="text-sm font-bold text-ink"
                      >
                        Lokasi penempatan
                      </label>
                      <span className="font-mono text-[0.55rem] font-semibold tracking-[0.18em] text-muted uppercase">
                        Opsional
                      </span>
                    </div>
                    <PilihLokasi
                      id="lokasi"
                      nilai={lokasi}
                      onUbah={setLokasi}
                      disabled={mengirim}
                      placeholder="Kota atau provinsi, mis. Surabaya, Bandung, Bali..."
                    />
                    <p className="text-[0.65rem] text-muted">
                      Pilih dari saran agar lokasi dikenali sistem.{" "}
                      {CATATAN_DATA_UPAH}
                    </p>
                  </div>

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

                  {/* Privasi + tombol kirim */}
                  <div className="flex flex-col gap-4 border-t border-line pt-6">
                    <div className="flex items-center justify-center gap-2 font-mono text-[0.58rem] font-semibold tracking-[0.18em] text-muted uppercase sm:justify-start">
                      <svg
                        className="size-4 text-aksen"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                        />
                      </svg>
                      Teks Anda tidak disimpan di server
                    </div>
                    <button
                      type="submit"
                      disabled={!bolehKirim}
                      className="inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-ink px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink-deep disabled:pointer-events-none disabled:opacity-40"
                    >
                      {mengirim ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Sedang memeriksa...
                        </>
                      ) : (
                        <>
                          Periksa lowongan sekarang
                          <span aria-hidden="true">→</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
