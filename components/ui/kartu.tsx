import type { ComponentPropsWithoutRef } from "react";

import { cn } from "./cn";

type KartuProps = ComponentPropsWithoutRef<"div"> & { unggulan?: boolean };

export function Kartu({ unggulan = false, className, ...props }: KartuProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 sm:p-7",
        unggulan
          ? "border-blue-500/40 bg-gradient-to-b from-white to-blue-50/20 shadow-md ring-1 ring-blue-500/10"
          : "hover:border-slate-300 hover:shadow-md",
        className,
      )}
    />
  );
}
