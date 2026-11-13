import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

/**
 * Kepala halaman publik: kanvas gelap dengan cahaya gradasi senja dan
 * tekstur titik, kicker mono, dan judul display. Membuat halaman selain
 * beranda tetap berkarakter dokumen resmi.
 */
export function Kepala({
  kicker,
  judul,
  deskripsi,
}: {
  kicker: string;
  judul: ReactNode;
  deskripsi: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-white/5 bg-ink-deep text-white">
      <div aria-hidden="true" className="pola-kisi-gelap absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 right-[-12rem] size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(109_40_217/0.5),transparent_65%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 left-[-12rem] size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(37_99_235/0.5),transparent_65%)] blur-3xl"
      />

      <Container ukuran="penuh" className="relative py-14 sm:py-16">
        <p className="flex items-center gap-2.5 font-mono text-[0.62rem] font-medium tracking-[0.24em] text-blue-300 uppercase">
          <span
            aria-hidden="true"
            className="inline-block size-1.5 rounded-[2px] bg-gradient-to-r from-blue-400 to-fuchsia-400"
          />
          {kicker}
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-white sm:text-5xl">
          {judul}
        </h1>
        <div className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          {deskripsi}
        </div>
      </Container>
    </div>
  );
}
