"use client";

import { useCallback, useRef, useState } from "react";

import { renderHasilKePNG, namaFileHasil, unduhBlob } from "@/lib/hasil/gambar";
import type { HasilEvaluasi } from "@/lib/evaluation/types";

/**
 * Kontrol bagikan & cetak halaman hasil.
 *
 * - Unduh PNG: render kartu hasil yang sudah ada di DOM ke PNG di peramban,
 *   lalu unduh. Tidak ada data yang meninggalkan peramban.
 * - Bagikan: berbagi ringkasan teks via Web Share API, fallback salin ke
 *   clipboard.
 * - Cetak: window.print().
 *
 * Semua teks yang muncul di PNG/ringkasan adalah hasil evaluasi (skor,
 * band, ringkasan) — bukan teks iklan asli pengguna.
 */
export function KartuHasilBagikan({
  hasil,
  id,
}: {
  hasil: HasilEvaluasi;
  id: string;
}) {
  const refKartu = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"siap" | "menyiapkan" | "selesai">(
    "siap",
  );

  const tanganiUnduh = useCallback(async () => {
    const elemen = refKartu.current;
    if (!elemen) return;
    setStatus("menyiapkan");
    try {
      const blob = await renderHasilKePNG(elemen);
      unduhBlob(blob, namaFileHasil({ band: hasil.band, id }));
      setStatus("selesai");
    } catch (galat) {
      // Gambar gagal — kembalikan tombol ke keadaan semula; pengguna tetap
      // dapat memakai tombol Bagikan/Cetak. Detail galat disimpan di objek
      // galat internal tanpa bocor ke konsol produksi.
      if (process.env.NODE_ENV === "development") {
        console.error("[kartu-hasil-bagikan] render PNG gagal:", galat);
      }
      setStatus("siap");
    } finally {
      window.setTimeout(() => setStatus("siap"), 1500);
    }
  }, [hasil.band, id]);

  const ringkasanBagikan = `Hasil pemeriksaan lowongan CekLoker: ${hasil.ringkasan}\nSkor: ${hasil.skor}/100 (${hasil.band}).\nEstimasi risiko deterministik berbasis teks, bukan vonis hukum.`;

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

  const labelAksi =
    status === "menyiapkan"
      ? "Memuatkan gambar…"
      : status === "selesai"
        ? "Selesai"
        : undefined;

  return (
    <section
      aria-labelledby="bagian-bagikan-cetak"
      className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs sm:p-9"
    >
      <h2 id="bagian-bagikan-cetak" className="sr-only">
        Bagikan dan cetak hasil
      </h2>

      {/* Preview kartu yang dirender ke PNG.
          Sengaja memakai inline style hex (bukan kelas Tailwind) karena
          html2canvas tidak dapat mem-parse warna oklch()/lab() bawaan
          Tailwind v4. */}
      <div
        ref={refKartu}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          borderRadius: "1rem",
          border: "1px solid #e2e8f0",
          background: "#f8fafc",
          padding: "1.5rem",
          color: "#0f172a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            CekLoker
          </span>
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.75rem",
              color: "#94a3b8",
            }}
          >
            Sesi #{id.slice(0, 8)}
          </span>
        </div>

        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "#020617",
            margin: 0,
          }}
        >
          Hasil Pemeriksaan Iklan
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              display: "inline-block",
              borderRadius: "9999px",
              padding: "0.125rem 0.625rem",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              background:
                hasil.band === "rendah"
                  ? "#dbeafe"
                  : hasil.band === "perlu_dicek"
                    ? "#fef3c7"
                    : "#ffe4e6",
              color:
                hasil.band === "rendah"
                  ? "#1d4ed8"
                  : hasil.band === "perlu_dicek"
                    ? "#b45309"
                    : "#be123d",
            }}
          >
            Rentang risiko:{" "}
            {hasil.band === "rendah"
              ? "Rendah"
              : hasil.band === "perlu_dicek"
                ? "Perlu dicek"
                : "Tinggi"}
          </span>
          <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
            Skor {hasil.skor}/100
          </span>
        </div>
        <p style={{ fontSize: "0.875rem", color: "#334155", margin: 0 }}>
          {hasil.ringkasan}
        </p>
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "10px",
            lineHeight: 1.6,
            color: "#94a3b8",
            marginBottom: 0,
          }}
        >
          Estimasi risiko deterministik berbasis teks, bukan vonis hukum.
          CekLoker tidak menyimpan teks lowongan Anda di server.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="tombol-unduh-png"
          disabled={status === "menyiapkan"}
          onClick={tanganiUnduh}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            status === "menyiapkan"
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-slate-950 text-white hover:bg-slate-800"
          }`}
        >
          {labelAksi || (
            <>
              Unduh PNG <span aria-hidden="true">↓</span>
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
          {labelAksi || (
            <>
              Bagikan <span aria-hidden="true">↗</span>
            </>
          )}
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
