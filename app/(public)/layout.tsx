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
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
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

      <footer className="border-t border-line bg-cream">
        <Container className="py-12 md:py-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex max-w-2xl flex-col gap-2">
                <p className="text-sm leading-relaxed text-muted">
                  CekLoker memberikan rentang risiko berbasis aturan, bukan
                  vonis. Keputusan akhir tetap di tangan Anda — verifikasi
                  selalu ke sumber resmi.
                </p>
                <p className="text-xs text-muted">
                  Teks lowongan yang Anda tempel tidak disimpan di server.
                </p>
              </div>

              <nav
                aria-label="Navigasi legal"
                className="flex flex-wrap gap-x-6 gap-y-3"
              >
                {NAV_LEGAL.map((butir) => (
                  <Link
                    key={butir.href}
                    href={butir.href}
                    className="inline-flex min-h-11 items-center text-sm font-medium text-ink transition-colors hover:text-aksen"
                  >
                    {butir.label}
                  </Link>
                ))}
              </nav>
            </div>

            <nav
              aria-label="Navigasi footer"
              className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 md:hidden"
            >
              {NAV.map((butir) => (
                <Link
                  key={butir.href}
                  href={butir.href}
                  className="inline-flex min-h-11 items-center text-sm font-medium text-ink transition-colors hover:text-aksen"
                >
                  {butir.label}
                </Link>
              ))}
            </nav>

            <p className="border-t border-line pt-6 text-xs text-muted md:border-t-0 md:pt-0">
              © 2026 Tim CekLoker · Kode sumber dirilis dengan lisensi MIT.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
