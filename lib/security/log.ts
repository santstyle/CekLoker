/**
 * Ringkasan galat yang aman untuk perluaran (log) sisi server.
 *
 * Galat dari driver database (mis. postgres-js/Neon) dapat memuat query dan
 * nilai parameter di dalam pesan galatnya; menulis objek galat mentah ke
 * konsol membocorkan isi tersebut ke platform log. Karena itu hanya nama
 * kelas galat dan kode galat berukuran pendek yang boleh dicatat — tidak
 * pernah pesan (`message`), parameter, atau stack.
 */
export function ringkasGalat(error: unknown): string {
  if (!(error instanceof Error)) {
    return "GalatTidakDikenal";
  }

  const kode = (error as { code?: unknown }).code;
  const kodeAman =
    typeof kode === "string" && /^[A-Za-z0-9_.-]{1,32}$/.test(kode)
      ? ` kode=${kode}`
      : "";

  // Nama kelas galat umumnya aman (mis. "PostgresError"); tetap dibatasi
  // alfabetnya agar tidak menyeret pesan apa pun dari galat buatan tangan.
  const nama = /^[A-Za-z0-9_.-]{1,64}$/.test(error.name) ? error.name : "Error";

  return `${nama}${kodeAman}`;
}
