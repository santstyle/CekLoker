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

export function labelRujukan(id: string): string {
  return LABEL_RUJUKAN[id] ?? id;
}
