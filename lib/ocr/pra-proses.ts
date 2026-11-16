/**
 * Pra-pemrosesan piksel murni untuk OCR poster lowongan.
 *
 * Seluruh fungsi di sini deterministik dan tanpa efek samping (tanpa DOM,
 * canvas, maupun jaringan) supaya dapat diuji unit di Node. Komponen
 * unggah poster hanya bertugas menggambar ke canvas lalu memanggil fungsi
 * di sini.
 *
 * Alur: RGBA -> luminansi grayscale -> ambang batas Otsu -> biner.
 * Ambang tetap (mis. 130/90) menghancurkan teks pada poster berlatar
 * warna; Otsu menyesuaikan ambang dengan histogram tiap gambar.
 */

/** Jumlah piksel = width * height; data RGBA berurutan (4 nilai per piksel). */
export interface DataPiksel {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

/** Konversi RGBA ke luminansi grayscale 0-255 (formula luminans BT.601). */
export function luminansi(
  rgba: Uint8ClampedArray,
  jumlahPiksel: number,
): Uint8ClampedArray {
  const abu = new Uint8ClampedArray(jumlahPiksel);
  for (let i = 0, p = 0; i < jumlahPiksel; i++, p += 4) {
    abu[i] = Math.round(
      0.299 * rgba[p] + 0.587 * rgba[p + 1] + 0.114 * rgba[p + 2],
    );
  }
  return abu;
}

/**
 * Ambang batas Otsu: memaksimalkan variansi antar-kelas dari histogram
 * luminansi. Cocok untuk poster berlatar warna karena ambang mengikuti
 * sebaran gelap-terang gambar, bukan angka tetap.
 */
export function ambangOtsu(histogram: number[], jumlahPiksel: number): number {
  if (jumlahPiksel <= 0) return 128;

  const peluang = new Array<number>(256).fill(0);
  for (let i = 0; i < 256; i++) {
    peluang[i] = histogram[i] / jumlahPiksel;
  }

  let rataKeseluruhan = 0;
  for (let i = 0; i < 256; i++) {
    rataKeseluruhan += i * peluang[i];
  }

  let jumlahTerbaik = 0;
  let rataAntara = 0;
  let peluangAntara = 0;
  let ambang = 128;

  for (let i = 0; i < 256; i++) {
    peluangAntara += peluang[i];
    if (peluangAntara === 0) continue;
    if (peluangAntara === 1) break;

    rataAntara += i * peluang[i];

    const rataKelas1 = rataAntara / peluangAntara;
    const rataKelas2 = (rataKeseluruhan - rataAntara) / (1 - peluangAntara);
    const variansAntara =
      peluangAntara *
      (1 - peluangAntara) *
      Math.pow(rataKelas1 - rataKelas2, 2);

    if (variansAntara > jumlahTerbaik) {
      jumlahTerbaik = variansAntara;
      ambang = i;
    }
  }

  return ambang;
}

/** Histogram luminansi 256 tingkat dari larik grayscale. */
export function histogramLuminansi(abu: Uint8ClampedArray): number[] {
  const histogram = new Array<number>(256).fill(0);
  for (let i = 0; i < abu.length; i++) {
    histogram[abu[i]] += 1;
  }
  return histogram;
}

/**
 * Binerisasi in-place: piksel > ambang menjadi putih (255), sisanya hitam
 * (0). Batas ketat (>) memastikan kelas gelap yang tepat di ambang tidak
 * ikut memutih; saluran alfa dibiarkan utuh.
 */
export function binarisasi(
  rgba: Uint8ClampedArray,
  abu: Uint8ClampedArray,
  ambang: number,
): void {
  for (let i = 0, p = 0; i < abu.length; i++, p += 4) {
    const nilai = abu[i] > ambang ? 255 : 0;
    rgba[p] = nilai;
    rgba[p + 1] = nilai;
    rgba[p + 2] = nilai;
  }
}

/**
 * Satu pipa lengkap: RGBA -> grayscale -> Otsu -> biner, di tempat.
 * Mengembalikan ambang yang dipakai (berguna untuk uji coba & debug).
 */
export function prosesPiksel(piksel: DataPiksel): number {
  const jumlahPiksel = piksel.width * piksel.height;
  const abu = luminansi(piksel.data, jumlahPiksel);
  const ambang = ambangOtsu(histogramLuminansi(abu), jumlahPiksel);
  binarisasi(piksel.data, abu, ambang);
  return ambang;
}
