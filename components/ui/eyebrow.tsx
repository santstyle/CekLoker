import type { ReactNode } from "react";

import { cn } from "./cn";

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-emerald-800 shadow-2xs",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
      <span>{children}</span>
    </div>
  );
}
