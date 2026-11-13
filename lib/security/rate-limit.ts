/**
 * Pembatas laju sederhana berbasis jendela tetap di memori proses.
 *
 * Dipakai untuk meredam penyalahgunaan endpoint publik. Jendela tetap dipilih
 * karena hemat memori dan tidak butuh penyimpanan bersama: cukup untuk menahan
 * lonjakan dari satu klien. Karena disimpan di memori, batas ini berlaku per
 * instans server, bukan per seluruh armada — pengganti berbasis Redis baru
 * diperlukan bila aplikasi dijalankan di banyak instans.
 */

export interface HasilPembatas {
  /** Apakah permintaan masih dalam kuota jendela berjalan. */
  diizinkan: boolean;
  /** Batas maksimum permintaan per jendela. */
  batas: number;
  /** Sisa kuota setelah permintaan ini dihitung. */
  sisa: number;
  /** Detik sampai jendela berjalan berakhir (untuk header Retry-After). */
  resetDetik: number;
}

export interface OpsiPembatas {
  /** Jumlah permintaan maksimum per jendela. */
  batas: number;
  /** Panjang jendela dalam milidetik. */
  jendelaMs: number;
  /** Sumber waktu dalam milidetik; dapat diganti pada pengujian. */
  sekarang?: () => number;
}

export interface PembatasLaju {
  /** Menghitung satu permintaan untuk kunci tertentu. */
  periksa: (kunci: string) => HasilPembatas;
  /** Mengosongkan seluruh catatan; dipakai pada pengujian. */
  kosongkan: () => void;
}

interface Jendela {
  jumlah: number;
  mulai: number;
}

/** Ambang jumlah kunci sebelum catatan kedaluwarsa dipangkas. */
const AMBANG_PEMANGKASAN = 5_000;

/**
 * Membuat pembatas jendela tetap dengan sumber waktu yang dapat diganti.
 *
 * Setiap kunci memiliki jendela sendiri: permintaan pertama membuka jendela,
 * permintaan berikutnya menambah hitungan hingga `batas`. Setelah `jendelaMs`
 * berlalu, jendela direset.
 */
export function buatPembatasJendelaTetap(opsi: OpsiPembatas): PembatasLaju {
  const { batas, jendelaMs } = opsi;
  const sekarang = opsi.sekarang ?? (() => Date.now());
  const catatan = new Map<string, Jendela>();

  function pangkasKedaluwarsa(waktu: number) {
    for (const [kunci, jendela] of catatan) {
      if (waktu - jendela.mulai >= jendelaMs) catatan.delete(kunci);
    }
  }

  function periksa(kunci: string): HasilPembatas {
    const waktu = sekarang();
    const jendela = catatan.get(kunci);

    if (!jendela || waktu - jendela.mulai >= jendelaMs) {
      catatan.set(kunci, { jumlah: 1, mulai: waktu });
      return {
        diizinkan: true,
        batas,
        sisa: Math.max(batas - 1, 0),
        resetDetik: Math.max(Math.ceil(jendelaMs / 1000), 0),
      };
    }

    const resetDetik = Math.max(
      Math.ceil((jendela.mulai + jendelaMs - waktu) / 1000),
      0,
    );

    if (jendela.jumlah >= batas) {
      return { diizinkan: false, batas, sisa: 0, resetDetik };
    }

    jendela.jumlah += 1;
    return {
      diizinkan: true,
      batas,
      sisa: Math.max(batas - jendela.jumlah, 0),
      resetDetik,
    };
  }

  function kosongkan() {
    catatan.clear();
  }

  return {
    periksa: (kunci: string) => {
      if (catatan.size >= AMBANG_PEMANGKASAN) pangkasKedaluwarsa(sekarang());
      return periksa(kunci);
    },
    kosongkan,
  };
}

/**
 * Menyusun kunci klien dari header permintaan.
 *
 * Di belakang proxy seperti Vercel, `x-forwarded-for` memuat alamat asli klien
 * sebagai entri pertama. Bila header tidak ada, dipakai `x-real-ip`, lalu
 * penanda umum agar permintaan tanpa identitas tetap dibatasi bersama.
 */
export function ambilKunciKlien(request: Request): string {
  const diteruskan = request.headers.get("x-forwarded-for");
  if (diteruskan) {
    const pertama = diteruskan.split(",")[0]?.trim();
    if (pertama) return pertama;
  }

  const alamatNyata = request.headers.get("x-real-ip")?.trim();
  if (alamatNyata) return alamatNyata;

  return "tanpa-identitas";
}
