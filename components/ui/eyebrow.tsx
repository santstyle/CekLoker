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
        "inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-800 shadow-2xs",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-1.5 shrink-0 animate-pulse rounded-full bg-blue-600"
      />
      <span>{children}</span>
    </div>
  );
}
