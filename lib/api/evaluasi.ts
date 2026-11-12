import type { HasilEvaluasi } from "@/lib/evaluation/types";

/** Respons POST /api/evaluasi yang dipakai bersama oleh server dan klien. */
export interface ResponsEvaluasi {
  id: string;
  hasil: HasilEvaluasi;
}

/** Kunci penyimpanan sementara hasil di peramban (sessionStorage). */
export function kunciSimpananHasil(id: string): string {
  return `cekloker-hasil-${id}`;
}
