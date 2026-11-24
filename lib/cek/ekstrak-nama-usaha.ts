/**
 * Ekstraksi nama usaha yang diduga dari teks iklan lowongan.
 */
const BADAN_USAHA = [
  "PT",
  "P.T.",
  "CV",
  "C.V.",
  "UD",
  "U.D.",
  "Koperasi",
  "Yayasan",
] as const;

const USAHA_KECIL = [
  "Rumah Makan",
  "Stand",
  "Kedai",
  "Warung",
  "Toko",
  "Kafe",
  "Cafe",
  "Outlet",
  "Depot",
  "Warkop",
] as const;

const KATA_HENTI_SETELAH = new Set([
  "in",
  "di",
  "at",
  "untuk",
  "dekat",
  "near",
  "dan",
  "yang",
  "membuka",
  "mencari",
  "dibutuhkan",
  "butuh",
  "lowongan",
]);

const KATA_SIFAT_UMUM = new Set(["new", "baru", "open"]);

function bersihkanNama(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?]+$/g, "")
    .trim();
}

function titleCase(nama: string): string {
  const singkatan = new Set(["PT", "CV", "UD", "P.T.", "C.V.", "U.D."]);
  return nama
    .split(/\s+/)
    .map((kata) => {
      if (singkatan.has(kata.toUpperCase())) return kata.toUpperCase();
      if (kata === kata.toUpperCase() && kata.length > 1) {
        return kata.charAt(0) + kata.slice(1).toLowerCase();
      }
      return kata;
    })
    .join(" ");
}

function cariKataKunci(
  teks: string,
  daftar: readonly string[],
): { kata: string; indeks: number }[] {
  const hasil: { kata: string; indeks: number }[] = [];
  for (const k of daftar) {
    const pola = new RegExp(`\\b${k.replace(/\s+/g, "\\s+")}\\b`, "gi");
    for (const m of teks.matchAll(pola)) {
      if (m.index !== undefined) {
        hasil.push({ kata: m[0], indeks: m.index });
      }
    }
  }
  return hasil;
}

function ambilNamaSetelah(teks: string, mulai: number, maks: number): string[] {
  const words: string[] = [];
  let pos = mulai;
  const lewatiSpasi = (): boolean => {
    let adaBarisBaru = false;
    while (pos < teks.length && /\s/.test(teks[pos])) {
      if (teks[pos] === "\n") adaBarisBaru = true;
      pos++;
    }
    return adaBarisBaru;
  };
  lewatiSpasi();
  while (words.length < maks) {
    const m = teks.slice(pos).match(/^([A-Z][\w&.\-]*)/);
    if (!m) break;
    const w = m[1];
    if (KATA_HENTI_SETELAH.has(w.toLowerCase())) break;
    words.push(w);
    pos += w.length;
    // Nama usaha tidak boleh menyeberang baris: baris berikutnya biasanya
    // kolom lain (mis. "Penempatan: Jakarta Selatan"), bukan bagian nama.
    if (lewatiSpasi()) break;
    // stop if next char is punctuation
    if (pos < teks.length && /[.,;:!?]/.test(teks[pos])) break;
  }
  return words;
}

function kandidatDariTeks(teks: string): { nama: string; indeks: number }[] {
  const hasil: { nama: string; indeks: number }[] = [];

  for (const k of cariKataKunci(teks, BADAN_USAHA)) {
    const words = ambilNamaSetelah(teks, k.indeks + k.kata.length, 5);
    if (words.length === 0) continue;
    const namaMentah = bersihkanNama(`${k.kata} ${words.join(" ")}`);
    hasil.push({ nama: namaMentah, indeks: k.indeks });
  }

  for (const k of cariKataKunci(teks, USAHA_KECIL)) {
    const words = ambilNamaSetelah(teks, k.indeks + k.kata.length, 4);
    if (words.length === 0) continue;
    const namaMentah = bersihkanNama(`${k.kata} ${words.join(" ")}`);
    hasil.push({ nama: namaMentah, indeks: k.indeks });
  }

  return hasil;
}

export function ekstrakNamaUsaha(teks: string): string | null {
  if (!teks || teks.trim().length < 5) return null;

  const kandidat = kandidatDariTeks(teks);
  if (kandidat.length === 0) return null;

  kandidat.sort((a, b) => a.indeks - b.indeks);

  for (const k of kandidat) {
    const kata = k.nama.split(/\s+/);
    if (kata.length < 2) continue;
    const bagianNama = kata.slice(1).join(" ").toLowerCase();
    if (["kami", "makan", "kita", "anda"].includes(bagianNama)) continue;
    if (!/[A-Za-z]/.test(bagianNama)) continue;

    // Kata sifat umum sebelum keyword: buang jika setelah keyword tidak ada nama jelas.
    const sebelum = teks
      .slice(0, k.indeks)
      .trim()
      .split(/\s+/)
      .pop()
      ?.toLowerCase();
    if (sebelum && KATA_SIFAT_UMUM.has(sebelum)) {
      // jika nama hanya satu kata setelah keyword, buang
      if (kata.length < 3) continue;
    }

    const nama = titleCase(k.nama);
    return nama;
  }

  return null;
}
