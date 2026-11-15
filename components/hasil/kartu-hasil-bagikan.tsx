"use client";

import { useCallback, useRef, useState } from "react";

import { renderHasilKePDF, namaFileHasil } from "@/lib/hasil/dokumen";
import type { HasilEvaluasi } from "@/lib/evaluation/types";

type Band = "rendah" | "perlu_dicek" | "tinggi";

const TEMA_BAND: Record<
  Band,
  { warnaTeks: string; warnaLatar: string; label: string; deskripsi: string }
> = {
  rendah: {
    warnaTeks: "#1d4ed8",
    warnaLatar: "#dbeafe",
    label: "Rendah",
    deskripsi: "Tidak ada sinyal risiko kuat yang terdeteksi dari teks.",
  },
  perlu_dicek: {
    warnaTeks: "#b45309",
    warnaLatar: "#fef3c7",
    label: "Perlu dicek",
    deskripsi: "Ada indikator yang perlu diverifikasi ke sumber resmi.",
  },
  tinggi: {
    warnaTeks: "#be123d",
    warnaLatar: "#ffe4e6",
    label: "Tinggi",
    deskripsi: "Banyak indikator berisiko terdeteksi dari teks iklan.",
  },
};

function normalisasiBand(band: string): Band {
  if (band === "rendah" || band === "tinggi") return band;
  return "perlu_dicek";
}

/**
 * Kontrol bagikan & cetak halaman hasil.
 *
 * - Unduh PDF: render kartu hasil yang sudah ada di DOM ke berkas PDF di
 *   peramban, lalu unduh. Tidak ada data yang meninggalkan peramban.
 * - Bagikan: berbagi ringkasan teks via Web Share API, fallback salin ke
 *   clipboard.
 * - Cetak: window.print().
 *
 * Semua teks yang muncul di PDF/ringkasan adalah hasil evaluasi (skor,
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

  const band = normalisasiBand(hasil.band);
  const tema = TEMA_BAND[band];
  const sesi = id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "sesi";
  const keliling = 2 * Math.PI * 40;
  const busur = (Math.max(0, Math.min(100, hasil.skor)) / 100) * keliling;

  const tanganiUnduh = useCallback(async () => {
    const elemen = refKartu.current;
    if (!elemen) return;
    setStatus("menyiapkan");
    try {
      await renderHasilKePDF(elemen, namaFileHasil({ band: hasil.band, id }));
      setStatus("selesai");
    } catch (galat) {
      // PDF gagal — kembalikan tombol ke keadaan semula; pengguna tetap
      // dapat memakai tombol Bagikan/Cetak. Detail galat hanya di console
      // pengembangan; tidak bocor ke konsol produksi.
      if (process.env.NODE_ENV === "development") {
        console.error("[kartu-hasil-bagikan] render PDF gagal:", galat);
      }
      setStatus("siap");
    } finally {
      window.setTimeout(() => setStatus("siap"), 1500);
    }
  }, [hasil.band, id]);

  const ringkasanBagikan = `Hasil pemeriksaan lowongan CekLoker: ${hasil.ringkasan}\nSkor: ${hasil.skor}/100 (${tema.label}).\nEstimasi risiko deterministik berbasis teks, bukan vonis hukum.`;

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
      ? "Memuatkan PDF…"
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

      {/* Pratinjau kartu yang dirender ke PDF.
          Sengaja memakai inline style hex (bukan kelas Tailwind) karena
          html2canvas tidak dapat mem-parse warna oklch()/lab() bawaan
          Tailwind v4. Struktur kartu: header / body / footer + watermark. */}
      <div
        ref={refKartu}
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          maxWidth: "540px",
          margin: "0 auto",
          borderRadius: "1.25rem",
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.10)",
          color: "#0f172a",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Watermark CekLoker — diagonal, buram, tidak menutupi isi. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-24deg)",
              fontSize: "4.5rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "rgba(15, 23, 42, 0.05)",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            CekLoker
          </span>
        </div>

        {/* ===== HEADER ===== */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            background: "#0f172a",
            padding: "1rem 1.25rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}
          >
            <div
              style={{
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "0.625rem",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0f172a"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3l7 3v5c0 4.5-3 8.25-7 10-4-1.75-7-5.5-7-10V6l7-3z" />
                <path d="M9.5 12.2l1.9 1.9 3.6-3.8" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  lineHeight: 1.1,
                }}
              >
                CekLoker
              </div>
              <div
                style={{
                  fontSize: "0.5625rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#94a3b8",
                  marginTop: "0.125rem",
                }}
              >
                Pemeriksa Iklan Lowongan
              </div>
            </div>
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.625rem",
              color: "#94a3b8",
              textAlign: "right",
              lineHeight: 1.5,
            }}
          >
            <div style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Sesi
            </div>
            <div style={{ color: "#e2e8f0", fontSize: "0.75rem" }}>#{sesi}</div>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "1.125rem",
            padding: "1.5rem 1.5rem 1.375rem",
          }}
        >
          <div
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#94a3b8",
            }}
          >
            Hasil Pemeriksaan Iklan
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
            }}
          >
            {/* Cincin skor */}
            <svg
              width="92"
              height="92"
              viewBox="0 0 100 100"
              role="img"
              aria-label={`Skor ${hasil.skor} dari 100`}
              style={{ flexShrink: 0 }}
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={tema.warnaTeks}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${busur} ${keliling}`}
                transform="rotate(-90 50 50)"
              />
              <text
                x="50"
                y="47"
                textAnchor="middle"
                fontSize="24"
                fontWeight="800"
                fill="#0f172a"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {hasil.skor}
              </text>
              <text
                x="50"
                y="64"
                textAnchor="middle"
                fontSize="9"
                fill="#64748b"
                fontFamily="Inter, system-ui, sans-serif"
              >
                dari 100
              </text>
            </svg>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "fit-content",
                  borderRadius: "9999px",
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.625rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: tema.warnaLatar,
                  color: tema.warnaTeks,
                }}
              >
                Rentang risiko: {tema.label}
              </span>
              <span
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Skor {hasil.skor}/100
              </span>
              <span
                style={{
                  fontSize: "0.6875rem",
                  lineHeight: 1.45,
                  color: "#64748b",
                }}
              >
                {tema.deskripsi}
              </span>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px dashed #cbd5e1",
              paddingTop: "0.875rem",
            }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.65,
                color: "#1e293b",
                margin: 0,
              }}
            >
              {hasil.ringkasan}
            </p>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div
          style={{
            position: "relative",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            padding: "0.75rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.625rem",
              lineHeight: 1.6,
              color: "#64748b",
            }}
          >
            <span style={{ fontWeight: 700, color: "#334155" }}>CekLoker</span>{" "}
            · Estimasi risiko deterministik berbasis teks, bukan vonis hukum.
            Tidak menyimpan teks lowongan Anda di server.
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.625rem",
              color: "#94a3b8",
              whiteSpace: "nowrap",
            }}
          >
            #{sesi}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
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
          {labelAksi || (
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
