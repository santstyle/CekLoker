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

/**
 * Meta iklan yang diketik pengguna di formulir (posisi, lokasi, sumber, upah).
 *
 * Disimpan hanya di peramban agar laporan PDF bisa mencantumkannya; tidak
 * pernah dikirim ke server dan ikut terhapus saat sesi peramban ditutup.
 */
export interface MetaSesi {
  posisi?: string;
  lokasi?: string;
  sumber?: string;
  upah?: string;
}

/** Kunci penyimpanan sementara meta iklan di peramban (sessionStorage). */
export function kunciSimpananMeta(id: string): string {
  return `cekloker-meta-${id}`;
}
