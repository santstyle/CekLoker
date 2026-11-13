import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

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
    <div className="border-b border-line bg-cream py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-aksen uppercase">
            Dokumen Legal
          </p>
          <h1 className="mt-3 font-display text-3xl leading-tight font-medium tracking-tight text-balance text-ink sm:text-4xl">
            {judul}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {ringkasan}
          </p>
          <p className="mt-3 text-xs text-slate-500">
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
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">
        {judul}
      </h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
        {children}
      </div>
    </section>
  );
}
