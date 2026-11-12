import { Suspense } from "react";

import KontenHasil from "./konten-hasil";

export default function HalamanHasil() {
  return (
    <Suspense
      fallback={
        <p className="text-zinc-600 dark:text-zinc-400">Memuat hasil...</p>
      }
    >
      <KontenHasil />
    </Suspense>
  );
}
