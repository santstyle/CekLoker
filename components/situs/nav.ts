/**
 * Item navigasi utama.
 *
 * Tiga item terakhir (Sumber, Uji Konsistensi, Tren) adalah "Transparansi"
 * — daftar rujukan, alat uji konsistensi, dan tren pemeriksaan. Di desktop
 * ketiganya muncul dalam dropdown; di mobile semua item tampil sebagai
 * daftar rata (termasuk sub-item Transparansi) agar tidak ada perbedaan
 * konten antar perangkat.
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
  { href: "/tren", label: "Tren" },
] as const;

export const NAV_LEGAL = [
  { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
  { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;
