import type { Band } from "@/lib/evaluation/types";

import { cn } from "./cn";

const LABEL: Record<Band, string> = {
  rendah: "Rendah",
  perlu_dicek: "Perlu dicek",
  tinggi: "Tinggi",
};

const GAYA_BAND: Record<Band, string> = {
  rendah: "border-emerald-200 bg-emerald-50 text-emerald-800",
  perlu_dicek: "border-amber-200 bg-amber-50 text-amber-800",
  tinggi: "border-rose-200 bg-rose-50 text-rose-800",
};

const TITIK_BAND: Record<Band, string> = {
  rendah: "bg-emerald-600",
  perlu_dicek: "bg-amber-600",
  tinggi: "bg-rose-600",
};

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
      <span
        aria-hidden
        className={cn("size-1.5 shrink-0 rounded-full", TITIK_BAND[band])}
      />
      <span>{LABEL[band]}</span>
    </span>
  );
}
