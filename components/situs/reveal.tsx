"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/components/ui/cn";

/**
 * Reveal sekali jalan saat elemen masuk viewport.
 * Murni presentasional: konten tetap ada di DOM tanpa JS,
 * dan prefers-reduced-motion mematikan animasi sepenuhnya lewat CSS.
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
    return () => observer.disconnect();
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
