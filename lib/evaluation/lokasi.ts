/**
 * Daftar pilihan lokasi untuk pemilih lokasi di halaman pemeriksaan.
 *
 * Setiap opsi dijamin dikenali `matchProvinsi`, sehingga lokasi yang dipilih
 * pengguna selalu dapat dibandingkan dengan batas upah minimum daerah. Opsi
 * dibentuk dari 38 provinsi resmi ditambah nama kota/kabupaten yang lazim
 * muncul pada iklan lowongan kerja.
 */

import { normalizeText } from "./normalize";
import {
  KOTA_ALIAS,
  matchProvinsi,
  PROVINSI,
  SINGKATAN_PROVINSI,
  type Provinsi,
} from "./provinces";

export type JenisLokasi = "provinsi" | "kota";

export type OpsiLokasi = {
  /** Nilai yang dikirim ke mesin evaluasi. */
  nilai: string;
  /** Label yang ditampilkan ke pengguna. */
  label: string;
  /** Provinsi induk, dipakai untuk keterangan tambahan. */
  provinsi: Provinsi;
  jenis: JenisLokasi;
  /** Teks ternormalisasi untuk pencarian, termasuk singkatan provinsi. */
  kunci: string;
};

/** Mengubah "jakarta pusat" menjadi "Jakarta Pusat". */
function judulKata(frasa: string): string {
  return frasa
    .split(" ")
    .map((kata) => (kata ? kata[0].toUpperCase() + kata.slice(1) : kata))
    .join(" ");
}

const SINGKATAN_PER_PROVINSI = new Map<Provinsi, string[]>();
for (const [alias, provinsi] of SINGKATAN_PROVINSI) {
  const daftar = SINGKATAN_PER_PROVINSI.get(provinsi);
  if (daftar) daftar.push(alias);
  else SINGKATAN_PER_PROVINSI.set(provinsi, [alias]);
}

const OPSI_PROVINSI: OpsiLokasi[] = PROVINSI.map((provinsi) => ({
  nilai: provinsi,
  label: provinsi,
  provinsi,
  jenis: "provinsi",
  kunci: normalizeText(
    [provinsi, ...(SINGKATAN_PER_PROVINSI.get(provinsi) ?? [])].join(" "),
  ),
}));

const NAMA_TERPAKAI = new Set<string>(PROVINSI);

const OPSI_KOTA: OpsiLokasi[] = [];
for (const [alias, provinsi] of KOTA_ALIAS) {
  const label = judulKata(alias);
  // Kota yang namanya sama dengan provinsi (mis. Gorontalo) sudah terwakili
  // oleh opsi provinsi, jadi tidak perlu diduplikasi.
  if (NAMA_TERPAKAI.has(label)) continue;
  NAMA_TERPAKAI.add(label);
  OPSI_KOTA.push({
    nilai: label,
    label,
    provinsi,
    jenis: "kota",
    kunci: normalizeText(label),
  });
}

/** Seluruh pilihan lokasi, terurut menurut label agar mudah ditelusuri. */
export const OPSI_LOKASI: readonly OpsiLokasi[] = [
  ...OPSI_PROVINSI,
  ...OPSI_KOTA,
].sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));

/** Mencari opsi yang labelnya persis sama dengan masukan (tanpa huruf besar). */
export function cariOpsiLokasi(nilai: string): OpsiLokasi | undefined {
  const kunci = normalizeText(nilai);
  if (!kunci) return undefined;
  return OPSI_LOKASI.find((opsi) => normalizeText(opsi.label) === kunci);
}

/**
 * Menyaring pilihan lokasi berdasarkan ketikan pengguna.
 *
 * Pencocokan memakai potongan teks (bukan hanya awalan) agar "jatim" atau
 * "jkt" tetap menemukan provinsi yang tepat. Opsi yang labelnya berawalan
 * kueri ditampilkan lebih dulu.
 */
export function filterOpsiLokasi(kueri: string): OpsiLokasi[] {
  const kunci = normalizeText(kueri);
  if (!kunci) return [...OPSI_LOKASI];

  const cocok: { opsi: OpsiLokasi; peringkat: number }[] = [];
  for (const opsi of OPSI_LOKASI) {
    if (!opsi.kunci.includes(kunci)) continue;
    cocok.push({ opsi, peringkat: opsi.kunci.startsWith(kunci) ? 0 : 1 });
  }

  cocok.sort(
    (a, b) =>
      a.peringkat - b.peringkat ||
      (a.opsi.label < b.opsi.label ? -1 : a.opsi.label > b.opsi.label ? 1 : 0),
  );

  return cocok.map((item) => item.opsi);
}

/** Menandai apakah teks lokasi dikenali mesin evaluasi. */
export function lokasiDikenali(nilai: string): boolean {
  return matchProvinsi(nilai) !== null;
}
