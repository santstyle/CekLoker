/**
 * Label manusiawi untuk id rujukan hukum yang dipakai aturan evaluasi.
 *
 * Halaman publik tidak boleh menampilkan id mentah. Setiap id yang dipakai
 * RULES wajib terdaftar di sini; id tak dikenal dikembalikan apa adanya
 * sebagai jaring pengaman agar tampilan tidak pernah kosong.
 */

export const LABEL_RUJUKAN: Readonly<Record<string, string>> = {
  "uu-13-2003-pasal-5": "UU No. 13/2003 Pasal 5",
  "uu-13-2003-pasal-6": "UU No. 13/2003 Pasal 6",
  "uu-13-2003-pasal-38": "UU No. 13/2003 Pasal 38",
  "uu-13-2003-pasal-77": "UU No. 13/2003 Pasal 77",
  "uu-13-2003-pasal-78": "UU No. 13/2003 Pasal 78",
  "uu-13-2003-pasal-89": "UU No. 13/2003 Pasal 89",
  "permenaker-39-2016": "Permenaker No. 39/2016",
  "uu-27-2022": "UU No. 27/2022",
  "uu-18-2017": "UU No. 18/2017",
};

/**
 * Peta URL resmi untuk setiap rujukan hukum.
 * Sumber: peraturan.go.id, JDIH Kemenaker, dan situs resmi terkait.
 * Dipisah dari LABEL_RUJUKAN agar komponen yang hanya butuh label (seperti
 * gambar-og.tsx) tidak terdampak perubahan URL.
 */
export const URL_RUJUKAN: Readonly<Record<string, string>> = {
  "uu-13-2003-pasal-5": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "uu-13-2003-pasal-6": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "uu-13-2003-pasal-38": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "uu-13-2003-pasal-77": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "uu-13-2003-pasal-78": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "uu-13-2003-pasal-89": "https://peraturan.go.id/uu/nomor-13-tahun-2003.html",
  "permenaker-39-2016": "https://jdih.kemnaker.go.id/peraturan/permenaker-no-39-tahun-2016",
  "uu-27-2022": "https://peraturan.go.id/uu/nomor-27-tahun-2022.html",
  "uu-18-2017": "https://peraturan.go.id/uu/nomor-18-tahun-2017.html",
};

/**
 * Mengambil URL resmi untuk id rujukan.
 * Mengembalikan undefined jika id tidak dikenal agar pemanggil bisa
 * memutuskan fallback (mis. link ke peraturan.go.id pencarian).
 */
export function urlRujukan(id: string): string | undefined {
  return URL_RUJUKAN[id];
}

export function labelRujukan(id: string): string {
  return LABEL_RUJUKAN[id] ?? id;
}
