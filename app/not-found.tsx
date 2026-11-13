import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { NAV } from "@/components/situs/nav";
import { Container } from "@/components/ui/container";
import { TautanTombol } from "@/components/ui/tombol";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  description:
    "Halaman yang Anda cari tidak tersedia. Kembali ke beranda atau lanjut menjelajah CekLoker.",
  robots: { index: false, follow: false },
};

export default function TidakDitemukan() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-slate-200/80">
        <Container className="flex h-16 items-center sm:h-20">
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
        </Container>
      </header>

      <main className="flex flex-1 items-center">
        <Container className="py-20">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
              Kesalahan 404
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-balance text-slate-950 sm:text-4xl">
              Halaman tidak ditemukan
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Tautan yang Anda tuju mungkin salah tulis, sudah dipindahkan, atau
              tidak pernah ada. Silakan kembali ke beranda atau lanjut
              menjelajah.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <TautanTombol href="/">Kembali ke beranda</TautanTombol>
              <TautanTombol href="/cek" varian="sekunder">
                Cek lowongan
              </TautanTombol>
            </div>

            <nav
              aria-label="Navigasi alternatif"
              className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3"
            >
              {NAV.map((butir) => (
                <Link
                  key={butir.href}
                  href={butir.href}
                  className="inline-flex min-h-11 items-center text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                >
                  {butir.label}
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </main>
    </div>
  );
}
