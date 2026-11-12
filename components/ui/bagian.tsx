import type { ComponentPropsWithoutRef } from "react";

import { cn } from "./cn";

export function Bagian({
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section {...props} className={cn("py-14 sm:py-20 lg:py-24", className)} />
  );
}
