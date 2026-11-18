/**
 * Titik masuk pengujian untuk kasus acuan evaluasi.
 *
 * Kasus acuan kanonik kini tinggal di `lib/evaluation/kasus-acuan.ts` agar
 * halaman publik `/uji-konsistensi` dan pengujian memakai sumber data yang sama.
 * Berkas ini hanya menjadi alias tipis demi kompatibilitas nama lama.
 */
export type { KasusAcuan as FixtureEvaluasi } from "@/lib/evaluation/kasus-acuan";
export { KASUS_ACUAN as FIXTURES_EVALUASI } from "@/lib/evaluation/kasus-acuan";
