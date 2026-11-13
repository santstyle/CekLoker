import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "./cn";

type Varian = "primer" | "sekunder" | "hantu";

const GAYA_DASAR =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

const GAYA_VARIAN: Record<Varian, string> = {
  primer:
    "bg-ink text-white shadow-sm hover:bg-ink-deep hover:-translate-y-0.5 active:translate-y-0",
  sekunder:
    "border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none",
  hantu: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
};

type TombolProps = ComponentPropsWithoutRef<"button"> & { varian?: Varian };

export function Tombol({
  varian = "primer",
  type = "button",
  className,
  ...props
}: TombolProps) {
  return (
    <button
      type={type}
      {...props}
      className={cn(GAYA_DASAR, GAYA_VARIAN[varian], className)}
    />
  );
}

type TautanTombolProps = ComponentPropsWithoutRef<typeof Link> & {
  varian?: Varian;
};

export function TautanTombol({
  varian = "primer",
  className,
  ...props
}: TautanTombolProps) {
  return (
    <Link
      {...props}
      className={cn(GAYA_DASAR, GAYA_VARIAN[varian], className)}
    />
  );
}
