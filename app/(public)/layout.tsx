import Link from "next/link";
import { Suspense } from "react";

import { Navigasi } from "@/components/situs/navigasi";
import { NAV } from "@/components/situs/nav";
import { Container } from "@/components/ui/container";
import { TautanTombol } from "@/components/ui/tombol";

export default function LayoutPublik({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 transition-opacity hover:opacity-90"
          >
            CekLoker
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full bg-emerald-500"
            />
          </Link>

          <Suspense
            fallback={
              <div aria-hidden="true" className="hidden h-11 md:block" />
            }
          >
            <Navigasi />
          </Suspense>

          <TautanTombol href="/cek" className="md:hidden">
            Cek lowongan
          </TautanTombol>
        </Container>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-slate-50/70">
        <Container className="py-12 md:py-16">
          <nav
            aria-label="Navigasi footer"
            className="mb-8 flex flex-wrap gap-x-6 gap-y-3 md:hidden"
          >
            {NAV.map((butir) => (
              <Link
                key={butir.href}
                href={butir.href}
                className="inline-flex min-h-11 items-center text-sm font-medium text-slate-700 hover:text-emerald-600"
              >
                {butir.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2">
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
              CekLoker memberikan rentang risiko berbasis aturan, bukan vonis.
              Keputusan akhir tetap di tangan Anda — verifikasi selalu ke sumber
              resmi.
            </p>
            <p className="max-w-2xl text-xs text-slate-500">
              Teks lowongan yang Anda tempel tidak disimpan di server.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
