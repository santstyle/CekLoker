import type { Metadata } from "next";
import { Suspense } from "react";

import { Kepala } from "@/components/situs/kepala";
import { Container } from "@/components/ui/container";
import { metadataHalaman } from "@/lib/situs";
import KontenTren from "./konten-tren";

export const metadata: Metadata = metadataHalaman({
  judul: "Tren Pemeriksaan",
  deskripsi:
    "Gambaran agregat anonim pemeriksaan lowongan di CekLoker: distribusi rentang per bulan, aturan yang paling sering menyala, dan sebaran per wilayah — dibatasi minimal 10 sampel.",
  jalur: "/tren",
});

/**
 * Halaman memakai Cache Components (next.config.ts): shell statis di atas,
 * data basis data dimuat pada waktu permintaan di dalam Suspense — tanpa
 * `dynamic = "force-dynamic"`.
 */
export default function HalamanTren() {
  return (
    <div className="bg-cream">
      <Kepala
        kicker="Tren · Data agregat anonim"
        judul={
          <>
            Tren pemeriksaan,{" "}
            <span className="teks-gradasi-terang">apa adanya.</span>
          </>
        }
        deskripsi="Gambaran pemeriksaan lowongan yang telah berjalan. Seluruh data bersifat agregat dan anonim — tanpa teks iklan, nama, atau kontak. Setiap kelompok (bulan atau wilayah) hanya ditampilkan bila mencapai minimal 10 sampel."
      />

      <Suspense
        fallback={
          <Container className="py-16 sm:py-20">
            <p className="text-sm text-muted">Memuat tren pemeriksaan...</p>
          </Container>
        }
      >
        <KontenTren />
      </Suspense>
    </div>
  );
}
