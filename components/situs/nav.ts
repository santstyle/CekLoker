/**
 * Item navigasi utama.
 *
 * Sumber dan Uji Konsistensi adalah "Transparansi" — daftar rujukan dan alat
 * uji konsistensi. Di desktop keduanya muncul dalam dropdown; di mobile semua
 * item tampil sebagai daftar rata agar tidak ada perbedaan konten antar
 * perangkat.
 */

export const NAV = [
  { href: "/cek", label: "Cek Lowongan" },
  { href: "/edukasi", label: "Edukasi" },
  { href: "/metodologi", label: "Metodologi" },
] as const;

/** Kelompok "Transparansi" — rincian yang bisa diperiksa ulang. */
export const NAV_TRANSPARANSI = [
  { href: "/sumber", label: "Sumber" },
  { href: "/uji-akurasi", label: "Uji Konsistensi" },
] as const;

export const NAV_LEGAL = [
  { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
  { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;
