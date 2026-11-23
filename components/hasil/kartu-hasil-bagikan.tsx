"use client";

import { useCallback, useState } from "react";

import { LABEL_BAND } from "@/lib/evaluation/evaluate";
import type { HasilEvaluasi } from "@/lib/evaluation/types";
import { unduhLaporanPdf } from "@/lib/hasil/pdf";
import type { MetaLaporan } from "@/lib/hasil/laporan";
import type { Band } from "@/lib/evaluation/types";

function normalisasiBand(band: string): Band {
  if (band === "rendah" || band === "tinggi") return band;
  return "perlu_dicek";
}

/**
 * Kontrol unduh laporan PDF, bagikan, dan cetak di halaman hasil.
 *
 * - Unduh PDF: menyusun laporan A4 dari data hasil evaluasi (bukan tangkapan
 *   layar), lalu mengunduhnya. Font, logo, dan watermark diambil dari berkas
 *   statis situs ini; tidak ada data yang meninggalkan peramban.
 * - Bagikan: berbagi ringkasan teks via Web Share API, fallback salin ke
 *   clipboard.
 * - Cetak: window.print().
 *
 * Nilai yang tampil di laporan (level, skor, jumlah temuan) diambil apa
 * adanya dari hasil evaluasi. Teks iklan hanya ikut ke dalam PDF bila opsi
 * "Sertakan kutipan dari iklan" dinyalakan, dan tetap tidak pernah dikirim
 * ke server.
 */
export function KartuHasilBagikan({
  hasil,
  id,
  meta,
}: {
  hasil: HasilEvaluasi;
  id: string;
  meta?: MetaLaporan;
}) {
  const [status, setStatus] = useState<"siap" | "menyiapkan" | "selesai">(
    "siap",
  );
  const [sertakanKutipan, setSertakanKutipan] = useState(false);

  const band = normalisasiBand(hasil.band);
  const labelBand = LABEL_BAND[band];

  const tanganiUnduh = useCallback(async () => {
    setStatus("menyiapkan");
    try {
      await unduhLaporanPdf(hasil, {
        id,
        sertakanKutipan,
        ...(meta ? { meta } : {}),
      });
      setStatus("selesai");
    } catch (galat) {
      // Laporan gagal disusun — kembalikan tombol ke keadaan semula;
      // pengguna tetap dapat memakai tombol Bagikan/Cetak. Detail galat
      // hanya muncul di konsol pengembangan.
      if (process.env.NODE_ENV === "development") {
        console.error("[kartu-hasil-bagikan] laporan PDF gagal:", galat);
      }
      setStatus("siap");
      return;
    }
    window.setTimeout(() => setStatus("siap"), 1800);
  }, [hasil, id, meta, sertakanKutipan]);

  const ringkasanBagikan = `Hasil pemeriksaan lowongan CekLoker: ${hasil.ringkasan}\nSkor: ${hasil.skor}/100 (${labelBand}).\nEstimasi risiko deterministik berbasis teks, bukan vonis hukum.`;

  const tanganiBagikan = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Hasil CekLoker",
          text: ringkasanBagikan,
        });
        return;
      }
    } catch {
      // Abaikan, fallback di bawah.
    }
    // Fallback: salin ringkasan ke clipboard.
    try {
      await navigator.clipboard.writeText(ringkasanBagikan);
    } catch {
      // Biarkan pengguna salin sendiri.
    }
    setStatus("selesai");
    window.setTimeout(() => setStatus("siap"), 1500);
  }, [ringkasanBagikan]);

  const tanganiCetak = useCallback(() => {
    window.print();
  }, []);

  const labelUnduh =
    status === "menyiapkan"
      ? "Menyiapkan PDF…"
      : status === "selesai"
        ? "Selesai"
        : undefined;

  return (
    <section
      aria-labelledby="bagian-laporan-pdf"
      className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs sm:p-9"
    >
      <h2
        id="bagian-laporan-pdf"
        className="text-xl font-bold text-slate-950 sm:text-2xl"
      >
        Laporan PDF &amp; cetak hasil
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Laporan A4 berisi ringkasan skor, daftar temuan beserta dasar
        rujukannya, langkah selanjutnya, dan contoh pesan konfirmasi. Disusun
        langsung di perangkat Anda.
      </p>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-5 py-4">
        <span className="text-lg font-bold text-slate-950">
          Skor {hasil.skor}/100
        </span>
        <span className="text-sm font-semibold text-slate-600">
          · Rentang risiko {labelBand}
        </span>
        <span className="text-xs text-slate-500">
          Estimasi risiko deterministik berbasis teks, bukan vonis hukum.
        </span>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          type="checkbox"
          id="sertakan-kutipan"
          data-testid="centang-kutipan"
          checked={sertakanKutipan}
          onChange={(peristiwa) => setSertakanKutipan(peristiwa.target.checked)}
          className="mt-0.5 shrink-0"
        />
        <label htmlFor="sertakan-kutipan" className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">
            Sertakan kutipan dari iklan
          </span>
          <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
            Bila dicentang, potongan teks iklan ikut tertulis di dalam berkas
            PDF. Teks iklan tetap tidak dikirim ke server CekLoker.
          </span>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="tombol-unduh-pdf"
          disabled={status === "menyiapkan"}
          onClick={tanganiUnduh}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            status === "menyiapkan"
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-slate-950 text-white hover:bg-slate-800"
          }`}
        >
          {labelUnduh || (
            <>
              Unduh PDF <span aria-hidden="true">↓</span>
            </>
          )}
        </button>

        <button
          type="button"
          data-testid="tombol-bagikan"
          disabled={status === "menyiapkan"}
          onClick={tanganiBagikan}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            status === "menyiapkan"
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-slate-950 text-white hover:bg-slate-800"
          }`}
        >
          Bagikan <span aria-hidden="true">↗</span>
        </button>

        <button
          type="button"
          data-testid="tombol-cetak"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50"
          onClick={tanganiCetak}
        >
          Cetak <span aria-hidden="true">🖨</span>
        </button>

        {status === "selesai" && (
          <span className="rounded bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
            Tersimpan / Dibagikan
          </span>
        )}
      </div>
    </section>
  );
}
