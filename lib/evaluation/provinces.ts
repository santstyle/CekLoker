/**
 * Pengenalan provinsi dari teks lokasi bebas.
 *
 * Pencocokan memakai alias terpanjang lebih dulu agar "Papua Barat Daya"
 * tidak tertukar dengan "Papua Barat", dan "Bali" tidak menyerempet
 * "Balikpapan" (batas kata menahan kasus itu).
 */

import { containsPhrase, normalizeText } from "./normalize";
import { WILAYAH_KAB_KOTA } from "./wilayah";

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

/**
 * Singkatan dan nama alternatif tingkat provinsi. Dipakai untuk pencocokan
 * teks bebas sekaligus sebagai kunci pencarian pada pemilih lokasi.
 */
export const SINGKATAN_PROVINSI: readonly (readonly [string, Provinsi])[] = [
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
];

/** Nama kota/kabupaten yang lazim muncul pada iklan lowongan kerja. */
export const KOTA_ALIAS: readonly (readonly [string, Provinsi])[] = [
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
  ["tangerang selatan", "Banten"],
  ["serang", "Banten"],
  ["cilegon", "Banten"],
  ["jakarta pusat", "DKI Jakarta"],
  ["jakarta selatan", "DKI Jakarta"],
  ["jakarta barat", "DKI Jakarta"],
  ["jakarta timur", "DKI Jakarta"],
  ["jakarta utara", "DKI Jakarta"],
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

/**
 * Alias tingkat kabupaten/kota dibangun dari daftar wilayah resmi
 * (WILAYAH_KAB_KOTA):
 * - nama telanjang ("sorong") hanya disertakan bila unik untuk satu provinsi
 *   ("banjar" ambigu: Kota Banjar Jawa Barat vs Kabupaten Banjar Kalimantan
 *   Selatan — alias telanjang itu dibuang);
 * - nama berprefiks ("kabupaten sorong", "kota sorong") selalu disertakan
 *   karena tidak pernah ambigu.
 */
const ALIAS_KAB_KOTA: readonly (readonly [string, Provinsi])[] = (() => {
  const SET_PROVINSI = new Set<string>(PROVINSI);
  const pemilikPerDasar = new Map<string, Set<string>>();
  for (const wilayah of WILAYAH_KAB_KOTA) {
    const dasar = normalizeText(wilayah.nama.replace(/^(Kabupaten|Kota) /, ""));
    const set = pemilikPerDasar.get(dasar);
    if (set) set.add(wilayah.provinsi);
    else pemilikPerDasar.set(dasar, new Set([wilayah.provinsi]));
  }

  const alias: [string, Provinsi][] = [];
  for (const wilayah of WILAYAH_KAB_KOTA) {
    if (!SET_PROVINSI.has(wilayah.provinsi)) continue; // dijaga tes unit
    const provinsi = wilayah.provinsi as Provinsi;
    const dasar = normalizeText(wilayah.nama.replace(/^(Kabupaten|Kota) /, ""));
    const jenis = wilayah.nama.startsWith("Kota ") ? "kota" : "kabupaten";
    alias.push([`${jenis} ${dasar}`, provinsi]);
    if (pemilikPerDasar.get(dasar)?.size === 1) alias.push([dasar, provinsi]);
  }
  return alias;
})();

/**
 * Semua alias digabung lalu didedup: alias yang sama dari beberapa sumber
 * dengan provinsi yang sama disatukan; alias yang menunjuk provinsi berbeda
 * dibuang sepenuhnya (lebih baik tidak dikenali daripada salah kenali).
 */
const ALIAS_MENTAH: readonly (readonly [string, string])[] = [
  ...PROVINSI.map((provinsi) => [provinsi, provinsi] as const),
  ...SINGKATAN_PROVINSI,
  ...KOTA_ALIAS,
  ...ALIAS_KAB_KOTA,
];

const PETA_ALIAS = new Map<string, Provinsi | null>();
for (const [alias, provinsi] of ALIAS_MENTAH) {
  const target = provinsi as Provinsi;
  const ada = PETA_ALIAS.get(alias);
  if (ada === null) continue;
  if (ada !== undefined && ada !== target) {
    PETA_ALIAS.set(alias, null); // ambigu antar sumber
    continue;
  }
  PETA_ALIAS.set(alias, target);
}

const ALIAS_TERURUT = [...PETA_ALIAS]
  .filter((entry): entry is [string, Provinsi] => entry[1] !== null)
  .map(([alias, provinsi]) => ({ alias, provinsi }))
  .sort(
    (a, b) =>
      b.alias.length - a.alias.length ||
      (a.alias < b.alias ? -1 : a.alias > b.alias ? 1 : 0),
  );

/** Mengembalikan provinsi pertama yang cocok, atau null bila tak dikenali. */
export function matchProvinsi(
  mentah: string | null | undefined,
): Provinsi | null {
  if (!mentah) return null;

  const teks = normalizeText(mentah);
  if (!teks) return null;

  for (const { alias, provinsi } of ALIAS_TERURUT) {
    if (containsPhrase(teks, alias)) return provinsi;
  }

  return null;
}
