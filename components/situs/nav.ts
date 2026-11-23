/**
 * Item navigasi utama. Semua rute publik utama tampil sebagai daftar
 * rata (desktop maupun mobile) agar tidak ada perbedaan konten antar
 * perangkat.
 */

export const NAV = [
  { href: "/cek", label: "Cek Lowongan" },
  { href: "/edukasi", label: "Edukasi" },
  { href: "/metodologi", label: "Metodologi" },
  { href: "/sumber", label: "Sumber" },
  { href: "/uji-akurasi", label: "Uji Konsistensi" },
  { href: "/tentang", label: "Tentang" },
] as const;

export const NAV_LEGAL = [
  { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
  { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;
