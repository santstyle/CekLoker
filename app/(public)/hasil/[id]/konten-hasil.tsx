"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";

import { Container } from "@/components/ui/container";
import { kunciSimpananHasil } from "@/lib/api/evaluasi";
import { LABEL_BAND } from "@/lib/evaluation/evaluate";
import type {
  Band,
  HasilEvaluasi,
  Kekuatan,
  KategoriRule,
} from "@/lib/evaluation/types";

const TEMA_BAND: Record<
  Band,
  {
    badge: string;
    border: string;
    bgBanner: string;
    textTitle: string;
    barColor: string;
  }
> = {
  rendah: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    border: "border-emerald-200",
    bgBanner: "bg-gradient-to-r from-emerald-50 via-teal-50 to-white",
    textTitle: "text-emerald-950",
    barColor: "bg-emerald-500",
  },
  perlu_dicek: {
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    border: "border-amber-200",
    bgBanner: "bg-gradient-to-r from-amber-50 via-orange-50 to-white",
    textTitle: "text-amber-950",
    barColor: "bg-amber-500",
  },
  tinggi: {
    badge: "bg-rose-100 text-rose-800 border-rose-300",
    border: "border-rose-200",
    bgBanner: "bg-gradient-to-r from-rose-50 via-red-50 to-white",
    textTitle: "text-rose-950",
    barColor: "bg-rose-500",
  },
};

const LABEL_KATEGORI: Record<KategoriRule, string> = {
  upah: "Kompensasi & Upah",
  kontak: "Saluran Komunikasi",
  identitas: "Identitas Perusahaan",
  dokumen: "Dokumen & Data Pribadi",
  seleksi: "Prosedur Rekrutmen",
  tekanan: "Tekanan Waktu",
  diskriminasi: "Klausul Diskriminasi",
  penempatan: "Penempatan Kerja",
  lainnya: "Indikator Lain",
};

const LABEL_KEKUATAN: Record<Kekuatan, string> = {
  lemah: "Bobot Lemah",
  sedang: "Bobot Sedang",
  kuat: "Bobot Kuat",
};

const CACHE_HASIL = new Map<string, HasilEvaluasi | null>();

function bacaHasilSesi(id: string): HasilEvaluasi | null {
  const tercache = CACHE_HASIL.get(id);
  if (tercache !== undefined) {
    return tercache;
  }
  let hasil: HasilEvaluasi | null = null;
  try {
    const mentah = window.sessionStorage.getItem(kunciSimpananHasil(id));
    if (mentah) {
      const terurai = JSON.parse(mentah) as { hasil?: HasilEvaluasi };
      if (terurai.hasil && terurai.hasil.band) {
        hasil = terurai.hasil;
      }
    }
  } catch {
    hasil = null;
  }
  CACHE_HASIL.set(id, hasil);
  return hasil;
}

function langgananKosong(): () => void {
  return () => {};
}

export default function KontenHasil() {
  const { id } = useParams<{ id: string }>();
  const hasil = useSyncExternalStore<HasilEvaluasi | null | undefined>(
    langgananKosong,
    () => bacaHasilSesi(id),
    () => undefined,
  );

  if (hasil === undefined) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50/50">
        <span className="size-10 rounded-full border-3 border-slate-200 border-t-emerald-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Memuat analisis hasil evaluasi...</p>
      </div>
    );
  }

  if (hasil === null) {
    return (
      <div className="py-24 sm:py-32 bg-slate-50/60">
        <Container>
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <div className="rounded-full bg-slate-200/60 p-3">
              <svg className="size-6 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">
              Sesi Tidak Ditemukan
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Hasil evaluasi disimpan sementara di sesi peramban Anda. Bila sesi tertutup atau Anda membuka dari peramban lain, data dihapus otomatis demi menjaga privasi Anda.
            </p>
            <Link
              href="/cek"
              className="mt-6 rounded-full bg-slate-950 px-7 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800"
            >
              Periksa Lowongan Baru
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const tema = TEMA_BAND[hasil.band];

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          {/* Top Breadcrumb & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/cek"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              <span>Periksa Iklan Lain</span>
            </Link>

            <span className="font-mono text-xs text-slate-400">
              Evaluator Engine {hasil.versi} &bull; Sesi #{id.slice(0, 8)}
            </span>
          </div>

          {/* Dribbble Style Main Score Hero Card */}
          <div className={`overflow-hidden rounded-3xl border ${tema.border} ${tema.bgBanner} p-7 sm:p-10 shadow-lg`}>
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-3">
                <span className={`w-fit rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${tema.badge}`}>
                  Rentang Risiko: {LABEL_BAND[hasil.band]}
                </span>
                <h1 className={`text-3xl font-black tracking-tight sm:text-4xl ${tema.textTitle}`}>
                  Hasil Pemeriksaan Iklan
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  {hasil.ringkasan}
                </p>
              </div>

              {/* Gauge Meter Box */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-md backdrop-blur-xs min-w-[180px]">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Indeks Risiko
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-950">
                    {hasil.skor}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ 100</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${tema.barColor}`}
                    style={{ width: `${Math.min(hasil.skor, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Temuan Indikator Section */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  Temuan Indikator ({hasil.temuan.length})
                </h2>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Kutipan spesifik dan aturan yang teridentifikasi dalam teks lowongan.
                </p>
              </div>
            </div>

            {hasil.temuan.length === 0 ? (
              <div className="flex items-start gap-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-sm text-emerald-950 shadow-xs">
                <svg className="size-5 shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                <div className="leading-relaxed">
                  <span className="font-bold">Tidak ditemukan indikator bermasalah. </span>
                  Teks iklan tidak memuat kata kunci atau pola yang melanggar standar aturan ketenagakerjaan CekLoker. Tetap lakukan verifikasi keabsahan izin perusahaan sebelum melamar.
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {hasil.temuan.map((temuan) => (
                  <div
                    key={temuan.ruleId}
                    className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <h3 className="text-base font-bold text-slate-950 sm:text-lg">
                        {temuan.judul}
                      </h3>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full w-fit">
                        Kontribusi Skor: +{temuan.kontribusi}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-700">
                        {LABEL_KATEGORI[temuan.kategori]}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-500">
                        {LABEL_KEKUATAN[temuan.kekuatan]}
                      </span>
                    </div>

                    {temuan.bukti.length > 0 && (
                      <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Kutipan Bukti Langsung dari Teks:
                        </span>
                        <ul className="mt-2 flex flex-col gap-2">
                          {temuan.bukti.map((bukti, idx) => (
                            <li
                              key={`${temuan.ruleId}-${idx}`}
                              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 font-mono text-xs text-slate-800 shadow-2xs leading-relaxed"
                            >
                              &ldquo;{bukti}&rdquo;
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {temuan.penjelasan}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Saran Langkah Berikutnya Section */}
          <section className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xs">
            <h2 className="text-xl font-bold text-slate-950">
              Saran Langkah Sebelum Melamar
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Rekomendasi tindakan preventif berdasarkan hasil evaluasi lowongan ini.
            </p>

            {hasil.saran.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">
                Tidak ada anjuran khusus. Ikuti prosedur pencarian kerja baku pada halaman Edukasi.
              </p>
            ) : (
              <ol className="mt-5 flex list-decimal flex-col gap-3.5 pl-5 text-sm leading-relaxed text-slate-700">
                {hasil.saran.map((saran, idx) => (
                  <li key={`${saran}-${idx}`}>{saran}</li>
                ))}
              </ol>
            )}
          </section>

          {/* Disclaimer & Nav Buttons */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/80 pt-6">
            <p className="max-w-md text-xs leading-relaxed text-slate-400">
              Hasil ini bersifat estimasi risiko deterministik berbasis teks dan bukan vonis hukum. CekLoker tidak menyimpan teks lowongan Anda di server.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/cek"
                className="rounded-full bg-slate-950 px-6 py-3 text-xs font-bold text-white transition-all hover:bg-slate-800"
              >
                Periksa Lowongan Baru
              </Link>
              <Link
                href="/edukasi"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50"
              >
                Panduan Edukasi Hak Kerja
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
