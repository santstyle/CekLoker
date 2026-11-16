/**
 * Penggabungan hasil OCR multi-pass (murni, tanpa efek samping).
 *
 * Pengamatan di peramban: PSM AUTO sering melewatkan blok besar (mis.
 * headline poster) walau keyakinan rata-ratanya tinggi, sedangkan
 * PSM SPARSE_TEXT menemukan blok-blok besar itu. Tidak ada satu pun mode
 * yang selalu unggul, jadi kedua pass dijalankan dan seluruh baris unik
 * digabungkan. Pass SPARSE_TEXT membaca tekstur foto, logo, dan QR sebagai
 * karakter ("K2", "(Re") — baris sampah semacam itu disaring lewat
 * barisBermakna sebelum digabung. Teks hasil tetap ditinjau pengguna di
 * textarea sebelum dikirim ke mesin evaluasi.
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
 * Penyaring baris hasil OCR. Sebuah baris layak dipertahankan bila:
 * - memuat minimal 3 karakter alfanumerik,
 * - mayoritas karakternya alfanumerik (bukan sup simbol), dan
 * - memuat token bermakna: kata >= 3 huruf, angka >= 3 digit, atau
 *   pola domain (mis. kaiter.kai.id).
 *
 * Aturan ini membuang sampah khas pass SPARSE_TEXT pada poster padat
 * (tekstur foto, logo, QR) tanpa bergantung pada bahasa tertentu.
 */
export function barisBermakna(baris: string): boolean {
  const tanpaSpasi = baris.replace(/\s+/g, "");
  const jumlahAlnum = (tanpaSpasi.match(/[A-Za-z0-9]/g) ?? []).length;
  if (jumlahAlnum < 3) return false;
  if (jumlahAlnum / tanpaSpasi.length < 0.55) return false;
  // Token bermakna: kata koheren kasusnya (semua kapital, semua kecil,
  // atau kapital di awal), angka >= 3 digit, atau pola domain. Huruf
  // acak ber-campur-besar-kecil ("gDtKi") khas hallucination pass sparse.
  return /(?:[A-Z]{3,}|[a-z]{3,}|[A-Z][a-z]{2,}|\d{3,}|[A-Za-z0-9.-]+\.[A-Za-z]{2,})/.test(
    tanpaSpasi,
  );
}

/**
 * Menggabungkan dua hasil OCR: baris dari teks utama dipertahankan lebih
 * dulu (urutan dokumen), lalu baris baru dari teks tambahan ditambahkan
 * bila belum pernah muncul secara ternormalisasi. Baris kosong dan baris
 * sampah hasil OCR dibuang (lihat barisBermakna).
 */
export function gabungkanTeks(utama: string, tambahan: string): string {
  const barisUtama = utama
    .split("\n")
    .map((b) => b.trim())
    .filter(barisBermakna);
  const barisTambahan = tambahan
    .split("\n")
    .map((b) => b.trim())
    .filter(barisBermakna);

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
