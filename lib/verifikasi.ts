/**
 * Aturan verifikasi sumber rujukan.
 *
 * Prinsipnya satu: sebuah sumber (kanal resmi, data upah, dsb.) hanya boleh
 * ditautkan bila benar-benar sudah diverifikasi — yaitu punya URL resmi
 * sekaligus tanggal verifikasi. Selama salah satunya kosong, sumber berstatus
 * "perlu verifikasi" dan antarmuka wajib menampilkan status itu, bukan tautan
 * karangan.
 *
 * Modul ini sengaja bebas ketergantungan agar dipakai bersama oleh lapisan
 * data evaluasi dan komponen antarmuka, sehingga tidak pernah ada dua definisi
 * "terverifikasi" yang berbeda di dalam aplikasi.
 *
 * Konvensi penamaan: camelCase (`perluVerifikasi`, `tanggalVerifikasi`,
 * `sumberUrl`) mengikuti `RegionalWage` di `lib/evaluation/types.ts`.
 */

export const STATUS_VERIFIKASI = ["terverifikasi", "perlu_verifikasi"] as const;

export type StatusVerifikasi = (typeof STATUS_VERIFIKASI)[number];

/** Label manusiawi untuk tiap status verifikasi. */
export const LABEL_STATUS_VERIFIKASI: Record<StatusVerifikasi, string> = {
  terverifikasi: "Terverifikasi",
  perlu_verifikasi: "Perlu verifikasi",
};

/** Bentuk minimum sumber apa pun yang menyimpan URL dan tanggal verifikasinya. */
export interface SumberVerifikasi {
  /** URL resmi sumber; null/kosong bila belum ada. */
  url?: string | null;
  /** Tanggal verifikasi, format ISO YYYY-MM-DD; null/kosong bila belum. */
  tanggalVerifikasi?: string | null;
}

function teksTerisi(nilai: string | null | undefined): string | null {
  const teks = nilai?.trim();
  return teks ? teks : null;
}

/**
 * Status verifikasi sebuah sumber.
 *
 * "terverifikasi" hanya bila URL dan tanggal verifikasi sama-sama terisi.
 * Selain itu selalu "perlu_verifikasi" — termasuk saat hanya salah satu yang
 * ada, karena tautan tanpa tanggal verifikasi tidak bisa dipertanggungjawabkan.
 */
export function statusVerifikasi(sumber: SumberVerifikasi): StatusVerifikasi {
  return teksTerisi(sumber.url) && teksTerisi(sumber.tanggalVerifikasi)
    ? "terverifikasi"
    : "perlu_verifikasi";
}

/** Benar hanya bila sumber boleh ditautkan di antarmuka. */
export function bolehTautkan(sumber: SumberVerifikasi): boolean {
  return statusVerifikasi(sumber) === "terverifikasi";
}

/**
 * URL yang aman ditautkan, atau null bila sumber belum terverifikasi.
 *
 * Antarmuka wajib memakai fungsi ini sebelum merender `<a href>`: selama
 * hasilnya null, tampilkan status "perlu verifikasi" alih-alih tautan.
 */
export function urlTerverifikasi(sumber: SumberVerifikasi): string | null {
  return bolehTautkan(sumber) ? teksTerisi(sumber.url) : null;
}
