"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

import { cn } from "@/components/ui/cn";

/**
 * Reveal sekali jalan saat elemen masuk viewport.
 * Konten terlihat penuh secara default (aman untuk no-JS); .reveal-init
 * hanya ditambahkan sebelum paint pada elemen di bawah layar, lalu
 * .is-visible menambahinya saat masuk viewport.
 * prefers-reduced-motion mematikan animasi sepenuhnya lewat CSS.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Jeda stagger dalam milidetik. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Elemen di dalam layar saat mount tetap terlihat, tanpa animasi.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      return;
    }

    el.classList.add("reveal-init");

    const tampilkan = () => el.classList.add("is-visible");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entri of entries) {
          if (entri.isIntersecting) {
            entri.target.classList.add("is-visible");
            observer.unobserve(entri.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);

    // Cadangan: konten tidak boleh tertinggal tak terlihat.
    const cadangan = window.setTimeout(tampilkan, 1600);
    return () => {
      observer.disconnect();
      window.clearTimeout(cadangan);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
