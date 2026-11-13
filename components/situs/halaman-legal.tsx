import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Kepala } from "@/components/situs/kepala";
import { Reveal } from "@/components/situs/reveal";

export function HalamanLegal({
  judul,
  ringkasan,
  diperbarui,
  children,
}: {
  judul: string;
  ringkasan: string;
  diperbarui: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-cream">
      <Kepala kicker="Dokumen Legal" judul={judul} deskripsi={ringkasan} />

      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[0.6rem] font-medium tracking-[0.2em] text-muted uppercase">
            Terakhir diperbarui: {diperbarui}
          </p>

          <div className="mt-10 flex flex-col gap-10">{children}</div>
        </div>
      </Container>
    </div>
  );
}

export function BagianLegal({
  judul,
  children,
}: {
  judul: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section className="flex flex-col gap-3 border-l-2 border-transparent pl-0 transition-colors hover:border-sky-300 sm:pl-5">
        <h2 className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
          {judul}
        </h2>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {children}
        </div>
      </section>
    </Reveal>
  );
}
