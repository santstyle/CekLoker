/**
 * Penggabungan hasil OCR multi-pass (murni, tanpa efek samping).
 *
 * Pengamatan di peramban: PSM AUTO sering melewatkan blok besar (mis.
 * headline poster) walau keyakinan rata-ratanya tinggi, sedangkan
 * PSM SPARSE_TEXT menemukan blok-blok besar itu. Tidak ada satu pun mode
 * yang selalu unggul, jadi kedua pass dijalankan dan seluruh baris unik
 * digabungkan. Teks hasil tetap ditinjau pengguna di textarea sebelum
 * dikirim ke mesin evaluasi.
 */

export interface RingkasanOcr {
  teks: string;
  /** Keyakinan rata-rata Tesseract, 0-100. */
  keyakinan: number;
}

/** Panjang minimum teks hasil ekstraksi sebelum dianggap bermakna. */
export const PANJANG_MINIMUM = 15;

export function teksBermakna(teks: string): boolean {
  return teks.trim().length >= PANJANG_MINIMUM;
}

/** Normalisasi untuk deduplication: lowercase + spasi diringkas + trim. */
export function normalisasiBaris(baris: string): string {
  return baris.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Menggabungkan dua hasil OCR: baris dari teks utama dipertahankan lebih
 * dulu (urutan dokumen), lalu baris baru dari teks tambahan ditambahkan
 * bila belum pernah muncul secara ternormalisasi. Baris kosong dibuang.
 */
export function gabungkanTeks(utama: string, tambahan: string): string {
  const barisUtama = utama
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);
  const barisTambahan = tambahan
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);

  const terlihat = new Set(barisUtama.map(normalisasiBaris));
  const gabungan = [...barisUtama];
  for (const baris of barisTambahan) {
    const kunci = normalisasiBaris(baris);
    if (terlihat.has(kunci)) continue;
    terlihat.add(kunci);
    gabungan.push(baris);
  }
  return gabungan.join("\n");
}
