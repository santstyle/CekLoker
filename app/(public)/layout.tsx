import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

import { Navigasi } from "@/components/situs/navigasi";
import { NAV, NAV_LEGAL } from "@/components/situs/nav";
import { Container } from "@/components/ui/container";
import { TautanTombol } from "@/components/ui/tombol";

export default function LayoutPublik({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
        <div
          aria-hidden="true"
          className="garis-gradasi absolute inset-x-0 bottom-0 h-[2px] opacity-80"
        />
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link
            href="/"
            className="inline-flex items-center transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo-header.png"
              alt="CekLoker"
              width={146}
              height={56}
              priority
              sizes="146px"
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

      <footer className="relative overflow-hidden border-t border-white/5 bg-ink-deep text-slate-400">
        <div
          aria-hidden="true"
          className="pola-kisi-gelap absolute inset-0 opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -left-40 size-[34rem] rounded-full bg-[radial-gradient(circle,rgb(37_99_235/0.28),transparent_65%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -bottom-40 size-[34rem] rounded-full bg-[radial-gradient(circle,rgb(56_189_248/0.25),transparent_65%)] blur-3xl"
        />
        <Container className="relative pt-14 pb-8 md:pt-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="flex max-w-sm flex-col gap-4 md:col-span-5">
              <p className="font-display text-2xl font-semibold tracking-tight text-white">
                Cek<span className="teks-gradasi-terang">Loker</span>
              </p>
              <p className="font-mono text-[0.6rem] tracking-[0.22em] text-slate-500 uppercase">
                Alat pra-lamaran · Ketenagakerjaan Indonesia
              </p>
              <p className="text-sm leading-relaxed text-slate-400">
                CekLoker memberikan rentang risiko berbasis aturan, bukan vonis.
                Keputusan akhir tetap di tangan Anda: verifikasi selalu ke
                sumber resmi.
              </p>
              <p className="text-xs text-slate-500">
                Teks lowongan yang Anda tempel tidak disimpan di server.
              </p>
            </div>

            <nav
              aria-label="Jelajah"
              className="flex flex-col gap-2 md:col-span-3"
            >
              <p className="font-mono text-[0.6rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                Jelajah
              </p>
              {NAV.map((butir) => (
                <Link
                  key={butir.href}
                  href={butir.href}
                  className="inline-flex min-h-9 w-fit items-center text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  {butir.label}
                </Link>
              ))}
            </nav>

            <nav
              aria-label="Legal"
              className="flex flex-col gap-2 md:col-span-4"
            >
              <p className="font-mono text-[0.6rem] font-semibold tracking-[0.22em] text-slate-500 uppercase">
                Legal
              </p>
              {NAV_LEGAL.map((butir) => (
                <Link
                  key={butir.href}
                  href={butir.href}
                  className="inline-flex min-h-9 w-fit items-center text-sm font-medium text-slate-300 transition-colors hover:text-white"
                >
                  {butir.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 font-mono text-[0.62rem] tracking-[0.14em] text-slate-500 uppercase">
            <p>© 2026 Tim CekLoker · Lisensi MIT</p>
            <p>Inisiatif SDG 8: Decent Work &amp; Economic Growth</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
