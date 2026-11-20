"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/components/ui/cn";

const KUNCI_TEMA = "tema-cekloker";

type Tema = "terang" | "gelap";

function temaHtml(): Tema {
  if (typeof document === "undefined") return "terang";
  return document.documentElement.classList.contains("dark")
    ? "gelap"
    : "terang";
}

function temaServer(): Tema {
  return "terang";
}

function langgananTema(saatBerubah: () => void): () => void {
  const pengamat = new MutationObserver(saatBerubah);
  pengamat.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => pengamat.disconnect();
}

/**
 * Tombol ganti tema terang/gelap.
 *
 * Tema disimpan di localStorage dan diterapkan sebagai kelas `dark` pada
 * elemen <html>. Skrip anti-kedip di app/layout.tsx membaca nilai yang sama
 * lebih awal supaya halaman tidak berkedip putih saat dimuat.
 */
export function ToggleTema({ className }: { className?: string }) {
  const tema = useSyncExternalStore(langgananTema, temaHtml, temaServer);

  function gantiTema() {
    const berikutnya: Tema = tema === "gelap" ? "terang" : "gelap";

    document.documentElement.classList.toggle("dark", berikutnya === "gelap");

    try {
      localStorage.setItem(KUNCI_TEMA, berikutnya);
    } catch {
      // Penyimpanan bisa diblokir peramban; tema tetap berlaku di sesi ini.
    }
  }

  const gelap = tema === "gelap";

  return (
    <button
      type="button"
      onClick={gantiTema}
      aria-label={gelap ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      aria-pressed={gelap}
      title={gelap ? "Tema terang" : "Tema gelap"}
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-paper text-slate-700 transition-colors",
        "hover:border-blue-300 hover:text-slate-900",
        "focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:outline-none",
        className,
      )}
    >
      <span className="sr-only">
        {gelap ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      </span>
      {gelap ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}
