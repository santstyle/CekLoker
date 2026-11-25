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

/**
 * Pola email sederhana untuk mendeteksi fragment yang seharusnya satu baris.
 */
const POLA_EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

/**
 * Gabungkan fragment teks yang terpecah akibat OCR. Jika dua baris berurutan
 * tidak diakhiri/diawali spasi dan penggabungannya (tanpa spasi) menghasilkan
 * email/URL yang valid, gabungkan tanpa spasi. Jika tidak, pertahankan
 * pemisah baris.
 */
export function gabungkanFragmentTeks(teks: string): string {
  const baris = teks.split("\n").map((b) => b.trim());
  const hasil: string[] = [];
  const terpakai = new Set<number>();

  for (let i = 0; i < baris.length; i++) {
    if (terpakai.has(i) || !baris[i]) {
      if (!terpakai.has(i) && !baris[i]) hasil.push(baris[i]);
      continue;
    }

    // Coba semua kombinasi subset baris berikutnya untuk membentuk email.
    // Mulai dari baris i, coba tambahkan baris j (j > i) satu per satu.
    const grup: number[] = [i];
    terpakai.add(i);
    let berubah = true;

    while (berubah) {
      berubah = false;
      for (let j = i + 1; j < baris.length; j++) {
        if (terpakai.has(j) || !baris[j]) continue;

        // Coba semua permutasi urutan fragment dalam grup + j.
        const kandidat = [...grup, j];
        let ditemukan = false;

        // Coba semua urutan (untuk grup kecil, maks 4 elemen = 24 permutasi)
        if (kandidat.length <= 4) {
          const permutasi = permutasiArray(kandidat);
          for (const perm of permutasi) {
            const gabungan = perm.map((idx) => baris[idx]).join("");
            if (POLA_EMAIL.test(gabungan)) {
              // Urutkan baris sesuai permutasi yang valid
              grup.length = 0;
              grup.push(...perm);
              terpakai.add(j);
              berubah = true;
              ditemukan = true;
              break;
            }
          }
        } else {
          // Untuk grup besar, coba hanya urutan asli
          const gabungan = kandidat.map((idx) => baris[idx]).join("");
          if (POLA_EMAIL.test(gabungan)) {
            grup.push(j);
            terpakai.add(j);
            berubah = true;
            ditemukan = true;
          }
        }

        if (ditemukan) break;
      }
    }

    // Gabungkan grup: jika membentuk email, gabungkan tanpa spasi.
    const teksGrup = grup.map((idx) => baris[idx]).join("");
    if (POLA_EMAIL.test(teksGrup) && grup.length > 1) {
      hasil.push(teksGrup);
    } else if (grup.length > 1) {
      // Tidak membentuk email, pertahankan sebagai baris terpisah
      for (const idx of grup) {
        hasil.push(baris[idx]);
      }
    } else {
      hasil.push(baris[i]);
    }
  }

  // Tambahkan baris yang tidak terpakai
  for (let i = 0; i < baris.length; i++) {
    if (!terpakai.has(i) && baris[i]) {
      hasil.push(baris[i]);
    }
  }

  return hasil.join("\n");
}

/**
 * Generate semua permutasi dari array.
 */
function permutasiArray<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  const hasil: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutasiArray(rest)) {
      hasil.push([arr[i], ...perm]);
    }
  }
  return hasil;
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
