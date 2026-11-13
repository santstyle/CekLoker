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
    <div className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
      >
        <div className="aspect-[1155/678] w-[65rem] flex-none bg-gradient-to-tr from-blue-400/20 to-indigo-400/15 opacity-60" />
      </div>

      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
            Dokumen Legal
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-balance text-slate-950 sm:text-4xl">
            {judul}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
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
      <h2 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
        {judul}
      </h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600 sm:text-base">
        {children}
      </div>
    </section>
  );
}
