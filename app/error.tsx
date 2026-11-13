"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { Container } from "@/components/ui/container";
import { TautanTombol, Tombol } from "@/components/ui/tombol";

export default function Galat({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
              Terjadi galat
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-balance text-slate-950 sm:text-4xl">
              Ada yang tidak berjalan sesuai rencana
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Halaman ini gagal dimuat karena kendala teknis tak terduga. Anda
              dapat mencoba memuat ulang, atau kembali ke beranda dan memulai
              lagi.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Tombol onClick={() => retry()}>Coba lagi</Tombol>
              <TautanTombol href="/" varian="sekunder">
                Kembali ke beranda
              </TautanTombol>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
