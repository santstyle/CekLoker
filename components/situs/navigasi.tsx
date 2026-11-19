"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { NAV, NAV_TRANSPARANSI } from "@/components/situs/nav";
import { cn } from "@/components/ui/cn";

/** Apakah path aktif sama dengan href, atau berada di bawahnya. */
function jalurAktif(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigasi() {
  const pathname = usePathname();
  const [transparansiTerbuka, setTransparansiTerbuka] = useState(false);
  const transparansiRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar atau menekan Escape.
  useEffect(() => {
    if (!transparansiTerbuka) return;

    function saatKlik(e: MouseEvent) {
      if (!transparansiRef.current?.contains(e.target as Node)) {
        setTransparansiTerbuka(false);
      }
    }
    function saatTekan(e: KeyboardEvent) {
      if (e.key === "Escape") setTransparansiTerbuka(false);
    }

    document.addEventListener("mousedown", saatKlik);
    document.addEventListener("keydown", saatTekan);
    return () => {
      document.removeEventListener("mousedown", saatKlik);
      document.removeEventListener("keydown", saatTekan);
    };
  }, [transparansiTerbuka]);

  const transparansiAktif = NAV_TRANSPARANSI.some((butir) =>
    jalurAktif(pathname, butir.href),
  );

  return (
    <nav
      aria-label="Navigasi utama"
      className="hidden items-center gap-8 md:flex"
    >
      {NAV.map((butir) => {
        const aktif = jalurAktif(pathname, butir.href);

        return (
          <Link
            key={butir.href}
            href={butir.href}
            aria-current={aktif ? "page" : undefined}
            className={cn(
              "relative inline-flex min-h-11 items-center text-sm font-medium transition-colors duration-150",
              aktif
                ? "font-semibold text-slate-900"
                : "text-slate-600 hover:text-slate-900",
            )}
          >
            {butir.label}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600 transition-opacity duration-150",
                aktif ? "opacity-100" : "opacity-0",
              )}
            />
          </Link>
        );
      })}

      {/* Dropdown Transparansi: Sumber, Uji Konsistensi, Tren */}
      <div ref={transparansiRef} className="relative">
        <button
          type="button"
          aria-expanded={transparansiTerbuka}
          aria-haspopup="menu"
          onClick={() => setTransparansiTerbuka((s) => !s)}
          className={cn(
            "relative inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm font-medium transition-colors duration-150",
            transparansiTerbuka || transparansiAktif
              ? "font-semibold text-slate-900"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          Transparansi
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={cn(
              "size-4 transition-transform duration-150",
              transparansiTerbuka ? "rotate-180" : "",
            )}
          >
            <path
              fillRule="evenodd"
              d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600 transition-opacity duration-150",
              transparansiAktif && !transparansiTerbuka
                ? "opacity-100"
                : "opacity-0",
            )}
          />
        </button>

        <div
          role="menu"
          aria-label="Transparansi"
          hidden={!transparansiTerbuka}
          className="absolute top-full left-0 mt-2 flex w-56 flex-col overflow-hidden rounded-2xl border border-line bg-paper py-1 shadow-lg"
        >
          {NAV_TRANSPARANSI.map((butir) => {
            const aktif = jalurAktif(pathname, butir.href);
            return (
              <Link
                key={butir.href}
                href={butir.href}
                role="menuitem"
                aria-current={aktif ? "page" : undefined}
                onClick={() => setTransparansiTerbuka(false)}
                className={cn(
                  "inline-flex min-h-11 items-center px-4 text-sm transition-colors",
                  aktif
                    ? "bg-blue-50/60 font-semibold text-slate-900"
                    : "font-medium text-slate-700 hover:bg-blue-50 hover:text-slate-900",
                )}
              >
                {butir.label}
              </Link>
            );
          })}
        </div>
      </div>

      <Link
        href="/tentang"
        aria-current={jalurAktif(pathname, "/tentang") ? "page" : undefined}
        className={cn(
          "relative inline-flex min-h-11 items-center text-sm font-medium transition-colors duration-150",
          jalurAktif(pathname, "/tentang")
            ? "font-semibold text-slate-900"
            : "text-slate-600 hover:text-slate-900",
        )}
      >
        Tentang
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600 transition-opacity duration-150",
            jalurAktif(pathname, "/tentang") ? "opacity-100" : "opacity-0",
          )}
        />
      </Link>

      <Link
        href="/bantuan"
        className="ml-2 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        Sudah terlanjur? Bantuan
      </Link>
    </nav>
  );
}
