"use client";

import { useState } from "react";

import { LABEL_BAND } from "@/lib/evaluation/evaluate";
import { LANGKAH_SELANJUTNYA } from "@/lib/langkah-selanjutnya";
import type { Band } from "@/lib/evaluation/types";

/**
 * Kartu "Langkah selanjutnya" di halaman hasil. Konten berbeda per level
 * risiko; seluruh teks statis (tanpa kutipan iklan maupun data pribadi).
 */
export function KartuLangkahSelanjutnya({ band }: { band: Band }) {
  const [tersalin, setTersalin] = useState(false);
  const langkah = LANGKAH_SELANJUTNYA[band];

  async function salinPesan() {
    try {
      await navigator.clipboard.writeText(langkah.templatePesan);
    } catch {
      // Cadangan bila Clipboard API tak tersedia (mis. konteks bukan HTTPS).
      const area = document.createElement("textarea");
      area.value = langkah.templatePesan;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setTersalin(true);
    window.setTimeout(() => setTersalin(false), 2000);
  }

  return (
    <section
      aria-labelledby="langkah-selanjutnya"
      className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs sm:p-9"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            id="langkah-selanjutnya"
            className="text-xl font-bold text-slate-950"
          >
            Langkah selanjutnya
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Tindakan dan pesan konfirmasi yang disesuaikan dengan rentang risiko
            hasil pemeriksaan Anda.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
          Rentang: {LABEL_BAND[band]}
        </span>
      </div>

      <h3 className="mt-6 text-sm font-bold text-slate-950">
        Tindakan yang disarankan
      </h3>
      <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-slate-700">
        {langkah.tindakan.map((tindakan) => (
          <li key={tindakan}>{tindakan}</li>
        ))}
      </ul>

      <h3 className="mt-6 text-sm font-bold text-slate-950">
        Template pesan konfirmasi ke perusahaan
      </h3>
      <pre className="mt-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
        {langkah.templatePesan}
      </pre>
      <button
        type="button"
        onClick={salinPesan}
        className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-slate-950 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-slate-800"
      >
        {tersalin ? (
          <>
            <span aria-hidden="true">✓</span> Tersalin!
          </>
        ) : (
          <>
            Salin pesan
            <span aria-hidden="true">⧉</span>
          </>
        )}
      </button>
    </section>
  );
}
