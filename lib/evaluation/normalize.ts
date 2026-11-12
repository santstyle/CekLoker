/**
 * Normalisasi teks dan pembacaan angka rupiah.
 *
 * Fungsi di sini murni:keluaran hanya bergantung pada masukan, tanpa
 * bergantung pada locale sistem.
 */

const KARAKTER_HIASI =
  /[\p{Extended_Pictographic}\u200B-\u200D\uFEFF\uFE0E\uFE0F\u{1F3FB}-\u{1F3FF}]/gu;

/**
 * Menyeragamkan teks sebelum pencocokan kata kunci.
 *
 * Urutan penting: NFKC lebih dulu agar bentuk lebar penuh (mis. "ＲＰ")
 * menjadi ASCII, lalu huruf kecil, buang emoji/karakter tak terlihat,
 * dan rapikan spasi.
 */
export function normalizeText(teks: string): string {
  return teks
    .normalize("NFKC")
    .toLowerCase()
    .replace(KARAKTER_HIASI, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(nilai: string): string {
  return nilai.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const cachePola = new Map<string, RegExp>();

function polaFrasa(frasa: string): RegExp {
  const kunci = normalizeText(frasa);
  const tersimpan = cachePola.get(kunci);
  if (tersimpan) return tersimpan;

  const pola = new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(kunci)}(?![\\p{L}\\p{N}])`,
    "u",
  );
  cachePola.set(kunci, pola);
  return pola;
}

/** Mencocokkan frasa utuh dengan batas kata, bukan potongan kata. */
export function containsPhrase(teks: string, frasa: string): boolean {
  const kunci = normalizeText(frasa);
  if (!kunci) return false;
  return polaFrasa(kunci).test(teks);
}

/** Mengembalikan frasa yang benar-benar cocok, dipakai sebagai bukti. */
export function containsAny(teks: string, frasa: readonly string[]): string[] {
  const hasil: string[] = [];
  for (const kandidat of frasa) {
    if (containsPhrase(teks, kandidat)) hasil.push(kandidat);
  }
  return hasil;
}

const MAGNITUDO: Record<string, number> = {
  juta: 1_000_000,
  jt: 1_000_000,
  ribu: 1_000,
  rb: 1_000,
  miliar: 1_000_000_000,
};

const BATAS_GAJI_BAWAH = 300_000;
const BATAS_GAJI_ATAS = 5_000_000_000;

/**
 * Mengurai angka bergaya Indonesia.
 *
 * Aturan pemisah: bila titik dan koma sama-sama ada, pemisah terakhir
 * dianggap desimal. Bila hanya ada satu jenis pemisah dan berpola ribuan,
 * pemisah dibuang; selain itu dianggap desimal.
 */
function parseAngkaIndo(mentah: string): number | null {
  const nilai = mentah.replace(/\s+/g, "");
  if (!/^[0-9][0-9.,]*$/.test(nilai)) return null;

  const adaTitik = nilai.includes(".");
  const adaKoma = nilai.includes(",");
  let ternormalisasi = nilai;

  if (adaTitik && adaKoma) {
    const titikTerakhir = nilai.lastIndexOf(".");
    const komaTerakhir = nilai.lastIndexOf(",");
    ternormalisasi =
      komaTerakhir > titikTerakhir
        ? nilai.replace(/\./g, "").replace(",", ".")
        : nilai.replace(/,/g, "");
  } else if (adaTitik) {
    ternormalisasi = /^\d{1,3}(\.\d{3})+$/.test(nilai)
      ? nilai.replace(/\./g, "")
      : nilai;
  } else if (adaKoma) {
    ternormalisasi = /^\d{1,3}(,\d{3})+$/.test(nilai)
      ? nilai.replace(/,/g, "")
      : nilai.replace(",", ".");
  }

  const angka = Number(ternormalisasi);
  return Number.isFinite(angka) ? angka : null;
}

const POLA_RP = /\brp\.?\s*([0-9][0-9.,]*)\s*(juta|jt|ribu|rb|miliar)?/g;

const POLA_LANJUTAN_RENTANG =
  /^\s*(?:-|–|—|s\/d\.?|sd\.?|sampai|hingga)\s*(?:rp\.?\s*)?([0-9][0-9.,]*)\s*(juta|jt|ribu|rb|miliar)?/;

const POLA_RENTANG_MAGNITUDO =
  /(?<![\d.,])([0-9][0-9.,]*)\s*(?:-|–|—|s\/d\.?|sd\.?|sampai|hingga)\s*(?:rp\.?\s*)?([0-9][0-9.,]*)\s*(juta|jt|ribu|rb|miliar)\b/g;

const POLA_MAGNITUDO =
  /(?<![\d.,])([0-9][0-9.,]*)\s*(juta|jt|ribu|rb|miliar)\b/g;

function wajar(nilai: number): boolean {
  return nilai >= BATAS_GAJI_BAWAH && nilai <= BATAS_GAJI_ATAS;
}

/**
 * Mengambil semua nominal gaji bulanan yang masuk akal dari teks.
 *
 * Tahun, usia, dan nomor telepon otomatis tersaring lewat rentang
 * kewajaran 300 ribu - 5 miliar. Satuan "k"/"m" sengaja diabaikan
 * karena terlalu rawan salah tafsir.
 */
export function extractSalaries(teks: string): number[] {
  const hasil = new Set<number>();

  const tambah = (mentah: string, satuan?: string): void => {
    const angka = parseAngkaIndo(mentah);
    if (angka === null) return;

    const pengali = satuan ? (MAGNITUDO[satuan] ?? 1) : 1;
    const nilai = angka * pengali;
    if (!wajar(nilai)) return;
    hasil.add(Math.round(nilai));
  };

  POLA_RP.lastIndex = 0;
  let cocok: RegExpExecArray | null;
  let akhirTerakhir = 0;

  while ((cocok = POLA_RP.exec(teks)) !== null) {
    tambah(cocok[1], cocok[2]);
    akhirTerakhir = cocok.index + cocok[0].length;

    const sisa = teks.slice(akhirTerakhir);
    const lanjutan = POLA_LANJUTAN_RENTANG.exec(sisa);
    if (lanjutan) {
      tambah(lanjutan[1], lanjutan[2]);
      akhirTerakhir += lanjutan[0].length;
      POLA_RP.lastIndex = akhirTerakhir;
    }
  }

  for (const rentang of teks.matchAll(POLA_RENTANG_MAGNITUDO)) {
    tambah(rentang[1], rentang[3]);
    tambah(rentang[2], rentang[3]);
  }

  for (const tunggal of teks.matchAll(POLA_MAGNITUDO)) {
    tambah(tunggal[1], tunggal[2]);
  }

  return [...hasil].sort((a, b) => a - b);
}

/** Format rupiah tanpa bergantung pada locale: Rp3.500.000 */
export function formatRupiah(nilai: number): string {
  const bulat = Math.round(nilai);
  const negatif = bulat < 0;
  const digit = Math.abs(bulat).toString();
  const berkala = digit.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negatif ? "-" : ""}Rp${berkala}`;
}
