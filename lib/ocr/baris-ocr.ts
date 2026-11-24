import { barisBermakna, normalisasiBaris } from "./kualitas";

export interface KotakBbox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface BarisOcr {
  teks: string;
  keyakinan: number;
  bbox: KotakBbox;
}

/**
 * Urutkan baris OCR dari atas ke bawah lalu kiri ke kanan, buang baris
 * dengan keyakinan rendah atau baris sampah, dan hapus duplikat
 * (pertahankan yang keyakinannya lebih tinggi / posisi lebih awal).
 */
export function urutkanDanSaringBaris(
  baris: readonly BarisOcr[],
  ambangKeyakinan = 35,
): string {
  const layak = baris.filter((b) => {
    if (b.keyakinan < ambangKeyakinan) return false;
    if (!barisBermakna(b.teks)) return false;
    return true;
  });

  // Urutkan untuk dedup: keyakinan lebih tinggi dulu, lalu posisi lebih awal.
  const untukDedup = [...layak].sort((a, b) => {
    if (b.keyakinan !== a.keyakinan) return b.keyakinan - a.keyakinan;
    if (a.bbox.y0 !== b.bbox.y0) return a.bbox.y0 - b.bbox.y0;
    return a.bbox.x0 - b.bbox.x0;
  });

  const terlihat = new Set<string>();
  const unik: BarisOcr[] = [];
  for (const b of untukDedup) {
    const kunci = normalisasiBaris(b.teks);
    if (terlihat.has(kunci)) continue;
    terlihat.add(kunci);
    unik.push(b);
  }

  // Urutkan hasil akhir dari atas ke bawah, kiri ke kanan.
  unik.sort((a, b) => {
    if (a.bbox.y0 !== b.bbox.y0) return a.bbox.y0 - b.bbox.y0;
    return a.bbox.x0 - b.bbox.x0;
  });

  return unik.map((b) => b.teks.trim()).join("\n");
}

/**
 * Rata-rata keyakinan baris (0-100). Dipakai untuk memilih pass terbaik.
 */
/**
 * Gabungkan baris dari beberapa varian berdasarkan posisi (tumpang tindih
 * vertikal > 50%). Dalam tiap kelompok ambil baris terbaik (keyakinan +
 * kebermaknaan). Pertahankan baris unik. Urutkan atas->bawah, kiri->kanan.
 */
export interface BarisBervarian extends BarisOcr {
  varian?: string;
}

function tumpangTindihVertikal(a: BarisOcr, b: BarisOcr): boolean {
  const overlap =
    Math.min(a.bbox.y1, b.bbox.y1) - Math.max(a.bbox.y0, b.bbox.y0);
  const tinggiMin = Math.min(a.bbox.y1 - a.bbox.y0, b.bbox.y1 - b.bbox.y0);
  if (tinggiMin <= 0) return false;
  return overlap / tinggiMin > 0.5;
}

function skorKebermaknaan(b: BarisOcr): number {
  const alnum = (b.teks.match(/[A-Za-z0-9]/g) ?? []).length;
  const rasio = b.teks.length > 0 ? alnum / b.teks.length : 0;
  const penalti = (b.teks.match(/[^A-Za-z0-9\s.,:/@-]/g) ?? []).length;
  return b.keyakinan * (0.5 + rasio) - penalti * 5;
}

export function gabungkanBarisPosisi(
  baris: readonly BarisBervarian[],
): BarisOcr[] {
  const kelompok: BarisBervarian[][] = [];
  for (const b of baris) {
    let ditempatkan = false;
    for (const g of kelompok) {
      if (g.some((x) => tumpangTindihVertikal(x, b))) {
        g.push(b);
        ditempatkan = true;
        break;
      }
    }
    if (!ditempatkan) kelompok.push([b]);
  }
  const hasil: BarisOcr[] = [];
  for (const g of kelompok) {
    const terbaik = g.reduce((a, c) =>
      skorKebermaknaan(c) > skorKebermaknaan(a) ? c : a,
    );
    hasil.push(terbaik);
  }
  hasil.sort((a, b) => {
    if (a.bbox.y0 !== b.bbox.y0) return a.bbox.y0 - b.bbox.y0;
    return a.bbox.x0 - b.bbox.x0;
  });
  // dedup normalisasi
  const terlihat = new Set<string>();
  const unik: BarisOcr[] = [];
  for (const b of hasil) {
    const k = b.teks.trim().toLowerCase().replace(/\s+/g, " ");
    if (terlihat.has(k)) continue;
    terlihat.add(k);
    unik.push(b);
  }
  return unik;
}
export function rataKeyakinan(baris: readonly BarisOcr[]): number {
  if (baris.length === 0) return 0;
  const total = baris.reduce((s, b) => s + b.keyakinan, 0);
  return total / baris.length;
}
