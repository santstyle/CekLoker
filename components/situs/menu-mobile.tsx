"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { NAV, NAV_LEGAL } from "@/components/situs/nav";
import { ToggleTema } from "@/components/situs/toggle-tema";
import { cn } from "@/components/ui/cn";

/**
 * Menu mobile hamburger (tiga garis) yang menggantikan tombol
 * "Cek lowongan" di header. Di desktop (md ke atas) tidak tampil —
 * navigasi horizontal bawaan yang digunakan.
 *
 * Menu mobile menggabungkan seluruh link NAV, link legal, link bantuan,
 * dan tombol "Cek lowongan" di dalam dropdown, supaya tidak ada tombol
 * duplikat di kanan atas. Overlay dan panel di-render via portal ke
 * document.body karena header memakai backdrop-blur (yang membuat
 * position: fixed di dalamnya diukur relatif ke header, bukan viewport).
 * Menutup cukup dengan menekan tombol hamburger (beranimasi jadi X),
 * mengklik area di luar menu, atau tombol Escape.
 */
export function MenuMobile() {
  const [terbuka, setTerbuka] = useState(false);

  useEffect(() => {
    if (!terbuka) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [terbuka]);

  function tutup() {
    setTerbuka(false);
  }

  useEffect(() => {
    if (!terbuka) return;
    function tekanTombol(e: KeyboardEvent) {
      if (e.key === "Escape") setTerbuka(false);
    }
    document.addEventListener("keydown", tekanTombol);
    return () => {
      document.removeEventListener("keydown", tekanTombol);
    };
  }, [terbuka]);

  return (
    <div className="relative flex items-center gap-2 md:hidden">
      <ToggleTema />
      <button
        type="button"
        aria-label="Menu navigasi"
        aria-expanded={terbuka}
        aria-controls="menu-mobile"
        onClick={() => setTerbuka((s) => !s)}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-paper text-slate-700 transition-colors",
          "hover:border-blue-300 hover:text-slate-900",
          "focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:outline-none",
        )}
      >
        <span className="relative inline-flex h-4 w-5 flex-col justify-center">
          <span
            className={cn(
              "absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
              terbuka ? "translate-y-0 rotate-45" : "-translate-y-1.5",
            )}
          />
          <span
            className={cn(
              "absolute h-0.5 w-5 rounded-full bg-current transition-opacity duration-200",
              terbuka ? "opacity-0" : "opacity-100",
            )}
          />
          <span
            className={cn(
              "absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
              terbuka ? "translate-y-0 -rotate-45" : "translate-y-1.5",
            )}
          />
        </span>
      </button>

      {terbuka &&
        createPortal(
          <>
            <div
              className="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/20 backdrop-blur-sm sm:top-20"
              onClick={tutup}
              aria-hidden="true"
            />
            <div
              id="menu-mobile"
              className="fixed top-16 right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-paper shadow-lg sm:top-20"
            >
              <nav aria-label="Navigasi mobile" className="flex flex-col py-1">
                {NAV.map((butir) => (
                  <Link
                    key={butir.href}
                    href={butir.href}
                    onClick={tutup}
                    className="inline-flex min-h-11 items-center px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-slate-900"
                  >
                    {butir.label}
                  </Link>
                ))}
                <div className="my-1 border-t border-line" />
                {NAV_LEGAL.map((butir) => (
                  <Link
                    key={butir.href}
                    href={butir.href}
                    onClick={tutup}
                    className="inline-flex min-h-11 items-center px-4 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                  >
                    {butir.label}
                  </Link>
                ))}
                <div className="my-1 border-t border-line" />
                <Link
                  href="/bantuan"
                  onClick={tutup}
                  className="inline-flex min-h-11 items-center px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-slate-900"
                >
                  Sudah terlanjur? Bantuan
                </Link>
                <div className="border-t border-line p-2">
                  <Link
                    href="/cek"
                    onClick={tutup}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-ink-deep"
                  >
                    Cek lowongan
                  </Link>
                </div>
              </nav>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
