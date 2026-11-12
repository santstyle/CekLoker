import { Suspense } from "react";

import { Bagian } from "@/components/ui/bagian";
import { Container } from "@/components/ui/container";

import KontenHasil from "./konten-hasil";

export default function HalamanHasil() {
  return (
    <Suspense
      fallback={
        <Bagian>
          <Container>
            <p className="text-body text-muted">Memuat hasil...</p>
          </Container>
        </Bagian>
      }
    >
      <KontenHasil />
    </Suspense>
  );
}
