/**
 * Pengenalan provinsi dari teks lokasi bebas.
 *
 * Pencocokan memakai alias terpanjang lebih dulu agar "Papua Barat Daya"
 * tidak tertukar dengan "Papua Barat", dan "Bali" tidak menyerempet
 * "Balikpapan" (batas kata menahan kasus itu).
 */

import { containsPhrase, normalizeText } from "./normalize";

export const PROVINSI = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Bengkulu",
  "Sumatera Selatan",
  "Kepulauan Bangka Belitung",
  "Lampung",
  "Banten",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Sulawesi Tengah",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Gorontalo",
  "Sulawesi Barat",
  "Maluku",
  "Maluku Utara",
  "Papua",
  "Papua Barat",
  "Papua Barat Daya",
  "Papua Tengah",
  "Papua Pegunungan",
  "Papua Selatan",
] as const;

export type Provinsi = (typeof PROVINSI)[number];

const ALIAS_TAMBAHAN: readonly (readonly [string, Provinsi])[] = [
  ["jakarta", "DKI Jakarta"],
  ["jkt", "DKI Jakarta"],
  ["dki", "DKI Jakarta"],
  ["jabodetabek", "DKI Jakarta"],
  ["jabar", "Jawa Barat"],
  ["jateng", "Jawa Tengah"],
  ["jatim", "Jawa Timur"],
  ["jogja", "DI Yogyakarta"],
  ["yogyakarta", "DI Yogyakarta"],
  ["sumut", "Sumatera Utara"],
  ["sumbar", "Sumatera Barat"],
  ["sumsel", "Sumatera Selatan"],
  ["babel", "Kepulauan Bangka Belitung"],
  ["kepri", "Kepulauan Riau"],
  ["kalbar", "Kalimantan Barat"],
  ["kalteng", "Kalimantan Tengah"],
  ["kalsel", "Kalimantan Selatan"],
  ["kaltim", "Kalimantan Timur"],
  ["kaltara", "Kalimantan Utara"],
  ["sulut", "Sulawesi Utara"],
  ["sulteng", "Sulawesi Tengah"],
  ["sulsel", "Sulawesi Selatan"],
  ["sultra", "Sulawesi Tenggara"],
  ["sulbar", "Sulawesi Barat"],
  ["ntb", "Nusa Tenggara Barat"],
  ["ntt", "Nusa Tenggara Timur"],
  ["malut", "Maluku Utara"],
  ["medan", "Sumatera Utara"],
  ["padang", "Sumatera Barat"],
  ["pekanbaru", "Riau"],
  ["palembang", "Sumatera Selatan"],
  ["banda aceh", "Aceh"],
  ["batam", "Kepulauan Riau"],
  ["tanjungpinang", "Kepulauan Riau"],
  ["pangkalpinang", "Kepulauan Bangka Belitung"],
  ["bandar lampung", "Lampung"],
  ["tangerang", "Banten"],
  ["serang", "Banten"],
  ["cilegon", "Banten"],
  ["bandung", "Jawa Barat"],
  ["bekasi", "Jawa Barat"],
  ["depok", "Jawa Barat"],
  ["bogor", "Jawa Barat"],
  ["cirebon", "Jawa Barat"],
  ["semarang", "Jawa Tengah"],
  ["solo", "Jawa Tengah"],
  ["surakarta", "Jawa Tengah"],
  ["surabaya", "Jawa Timur"],
  ["malang", "Jawa Timur"],
  ["denpasar", "Bali"],
  ["mataram", "Nusa Tenggara Barat"],
  ["kupang", "Nusa Tenggara Timur"],
  ["pontianak", "Kalimantan Barat"],
  ["banjarmasin", "Kalimantan Selatan"],
  ["balikpapan", "Kalimantan Timur"],
  ["samarinda", "Kalimantan Timur"],
  ["tarakan", "Kalimantan Utara"],
  ["manado", "Sulawesi Utara"],
  ["palu", "Sulawesi Tengah"],
  ["makassar", "Sulawesi Selatan"],
  ["kendari", "Sulawesi Tenggara"],
  ["gorontalo", "Gorontalo"],
  ["mamuju", "Sulawesi Barat"],
  ["ambon", "Maluku"],
  ["ternate", "Maluku Utara"],
  ["jayapura", "Papua"],
  ["manokwari", "Papua Barat"],
  ["sorong", "Papua Barat Daya"],
  ["timika", "Papua Tengah"],
  ["wamena", "Papua Pegunungan"],
  ["merauke", "Papua Selatan"],
];

const ALIAS: readonly (readonly [string, Provinsi])[] = [
  ...PROVINSI.map((provinsi) => [provinsi, provinsi] as const),
  ...ALIAS_TAMBAHAN,
];

const ALIAS_TERURUT = ALIAS.map(([alias, provinsi]) => ({ alias, provinsi })).sort(
  (a, b) =>
    b.alias.length - a.alias.length ||
    (a.alias < b.alias ? -1 : a.alias > b.alias ? 1 : 0),
);

/** Mengembalikan provinsi pertama yang cocok, atau null bila tak dikenali. */
export function matchProvinsi(mentah: string | null | undefined): Provinsi | null {
  if (!mentah) return null;

  const teks = normalizeText(mentah);
  if (!teks) return null;

  for (const { alias, provinsi } of ALIAS_TERURUT) {
    if (containsPhrase(teks, alias)) return provinsi;
  }

  return null;
}
