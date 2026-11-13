"use client";

import { useId, useState } from "react";

import { cn } from "@/components/ui/cn";

export type ButirFaq = {
  pertanyaan: string;
  jawaban: string;
};

/**
 * Accordion FAQ: keyboard-native (button), satu panel terbuka sekaligus.
 * Jawaban tetap dirender di DOM, jadi bisa dibaca tanpa JS.
 */
export function Faq({ butir }: { butir: readonly ButirFaq[] }) {
  const dasarId = useId();
  const [buka, setBuka] = useState(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {butir.map((item, indeks) => {
        const terbuka = buka === indeks;
        const idTombol = `${dasarId}-tombol-${indeks}`;
        const idPanel = `${dasarId}-panel-${indeks}`;

        return (
          <div key={item.pertanyaan}>
            <button
              type="button"
              id={idTombol}
              aria-expanded={terbuka}
              aria-controls={idPanel}
              onClick={() => setBuka(terbuka ? -1 : indeks)}
              className="flex min-h-11 w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span className="text-base font-semibold text-ink sm:text-lg">
                {item.pertanyaan}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-transform duration-300",
                  terbuka && "rotate-45 border-aksen text-aksen",
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  className="size-4"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div
              id={idPanel}
              role="region"
              aria-labelledby={idTombol}
              hidden={!terbuka}
              className="pb-5"
            >
              <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                {item.jawaban}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
