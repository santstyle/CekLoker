import type { Band } from "@/lib/evaluation/types";

import { cn } from "./cn";

const LABEL: Record<Band, string> = {
  rendah: "Rendah",
  perlu_dicek: "Perlu dicek",
  tinggi: "Tinggi",
};

const GAYA_BAND: Record<Band, string> = {
  rendah: "border-blue-200 bg-blue-50 text-blue-800",
  perlu_dicek: "border-amber-200 bg-amber-50 text-amber-800",
  tinggi: "border-rose-200 bg-rose-50 text-rose-800",
};

/**
 * Ikon pembeda band yang tidak bergantung warna: centang untuk `rendah`,
 * lingkaran seru untuk `perlu_dicek`, dan segitiga peringatan untuk `tinggi`.
 * Warna tetap dipakai, tetapi makna band juga terbaca tanpa warna.
 */
function IkonBand({ band }: { band: Band }) {
  const gaya = cn("size-3.5 shrink-0");

  if (band === "rendah") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={gaya}
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  if (band === "perlu_dicek") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={gaya}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4.5" />
        <path d="M12 16.25h.01" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={gaya}
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function Lencana({
  band,
  className,
}: {
  band: Band;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-2xs",
        GAYA_BAND[band],
        className,
      )}
    >
      <IkonBand band={band} />
      <span>{LABEL[band]}</span>
    </span>
  );
}
