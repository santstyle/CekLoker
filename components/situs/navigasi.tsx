"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV } from "@/components/situs/nav";
import { cn } from "@/components/ui/cn";

export function Navigasi() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="hidden items-center gap-8 md:flex"
    >
      {NAV.map((butir) => {
        const aktif =
          pathname === butir.href || pathname.startsWith(`${butir.href}/`);

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
    </nav>
  );
}
