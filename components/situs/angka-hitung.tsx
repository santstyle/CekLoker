"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Angka yang menghitung naik dari 0 sampai penuh saat masuk viewport.
 * Tampil penuh sejak awal untuk no-JS, prefers-reduced-motion, atau yang
 * sudah terlihat saat halaman dimuat (pola yang sama dengan Reveal).
 */
export function AngkaHitung({
  angka,
  durasi = 900,
}: {
  angka: number;
  durasi?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [tampil, setTampil] = useState(angka);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      el.getBoundingClientRect().top < window.innerHeight * 0.92
    ) {
      return;
    }

    setTampil(0);
    let raf = 0;
    let cadangan = 0;
    const mulai = performance.now();
    const detak = (kini: number) => {
      const kemajuan = Math.min(1, (kini - mulai) / durasi);
      setTampil(Math.round(angka * (1 - Math.pow(1 - kemajuan, 3))));
      if (kemajuan < 1) {
        raf = requestAnimationFrame(detak);
      } else {
        window.clearTimeout(cadangan);
      }
    };

    const observer = new IntersectionObserver(
      (entri) => {
        for (const entriViewport of entri) {
          if (entriViewport.isIntersecting) {
            raf = requestAnimationFrame(detak);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    // Cadangan: angka penuh tetap terlihat walau observer tak pernah jalan.
    cadangan = window.setTimeout(() => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      setTampil(angka);
    }, 3000);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(cadangan);
    };
  }, [angka, durasi]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">{tampil}</span>
      <span className="sr-only">{angka}</span>
    </span>
  );
}
