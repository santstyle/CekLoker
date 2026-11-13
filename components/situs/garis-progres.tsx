"use client";

import { useEffect, useRef } from "react";

/**
 * Garis tipis di tepi atas layar yang menampilkan progres gulir halaman.
 * Diperbarui langsung dari posisi scroll (bukan animasi dekoratif), tanpa
 * transisi sehingga tetap lembut di perangkat rendah; dinonaktifkan saat
 * pengguna memilih prefers-reduced-motion.
 */
export function GarisProgresGulir() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let ticking = false;

    const perbarui = () => {
      ticking = false;
      const dokumen = document.documentElement;
      const sisaGulir = dokumen.scrollHeight - dokumen.clientHeight;
      const progres = sisaGulir > 0 ? dokumen.scrollTop / sisaGulir : 0;
      el.style.transform = `scaleX(${progres})`;
    };

    const padaGulir = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(perbarui);
    };

    perbarui();
    window.addEventListener("scroll", padaGulir, { passive: true });
    window.addEventListener("resize", padaGulir);

    return () => {
      window.removeEventListener("scroll", padaGulir);
      window.removeEventListener("resize", padaGulir);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="garis-progres-gulir" />;
}
