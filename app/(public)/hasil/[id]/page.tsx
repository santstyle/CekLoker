import type { Metadata } from "next";
import { Suspense } from "react";

import { Bagian } from "@/components/ui/bagian";
import { Container } from "@/components/ui/container";

import KontenHasil from "./konten-hasil";

export const metadata: Metadata = {
  title: "Hasil Evaluasi",
  description:
    "Ringkasan rentang risiko, bukti yang ditemukan, dan rujukan hukum dari evaluasi lowongan kerja yang baru Anda jalankan.",
  robots: { index: false, follow: false },
};

export default function HalamanHasil() {
  return (
    <Suspense
      fallback={
        <Bagian>
          <Container>
            <p className="text-muted">Memuat hasil...</p>
          </Container>
        </Bagian>
      }
    >
      <KontenHasil />
    </Suspense>
  );
}
