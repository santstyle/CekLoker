import type { ComponentPropsWithoutRef } from "react";

import { cn } from "./cn";

const UKURAN = {
  /** Lebar baca nyaman untuk konten artikel/formulir. */
  standar: "max-w-6xl",
  /** Hampir penuh layar untuk blok lebar. */
  lebar: "max-w-[92rem]",
  /** Penuh layar, hanya padding tepi — untuk seksi beranda. */
  penuh: "max-w-none",
} as const;

export function Container({
  className,
  ukuran = "standar",
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  ukuran?: keyof typeof UKURAN;
}) {
  return (
    <div
      {...props}
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16",
        UKURAN[ukuran],
        className,
      )}
    />
  );
}
