/**
 * Checklist 24 jam pertama untuk halaman /bantuan.
 *
 * Logika murni (pure): tidak menyentuh sessionStorage maupun DOM.
 * Antarmuka hanya menampilkan daftar langkah yang dihitung dari jawaban
 * pengguna, tanpa bergantung pada urutan klik tertentu.
 */

export const PILIHAN_SITUASI = [
  { id: "sudah-transfer", label: "Sudah transfer uang" },
  {
    id: "sudah-kirim-data",
    label: "Sudah kirim KTP/ijazah/data rekening",
  },
  { id: "sudah-klik-tautan", label: "Sudah klik tautan atau instal aplikasi" },
  {
    id: "hanya-obrol",
    label: "Hanya sudah mengobrol dan belum kehilangan apa pun",
  },
] as const;

export type IdSituasi = (typeof PILIHAN_SITUASI)[number]["id"];

/** Semua langkah checklist yang mungkin muncul, berurutan. */
export interface LangkahChecklist {
  id: string;
  teks: string;
  /** Bila true, langkah muncul bila situasi "sudah-transfer" dipilih. */
  butuhTransfer?: boolean;
  /** Bila true, langkah muncul bila situasi "sudah-kirim-data" dipilih. */
  butuhDataPribadi?: boolean;
  /** Bila true, langkah muncul bila situasi "sudah-klik-tautan" dipilih. */
  butuhPerangkat?: boolean;
  /** Bila true, langkah selalu muncul. */
  selalu?: boolean;
}

export const LANGKAH_CHECKLIST: readonly LangkahChecklist[] = [
  {
    id: "hentikan-kontak",
    teks: "Hentikan kontak dan jangan transfer lagi.",
    selalu: true,
  },
  {
    id: "simpan-bukti",
    teks: "Simpan bukti: tangkapan layar iklan dan percakapan, bukti transfer, nomor rekening/telepon/akun pelaku.",
    selalu: true,
  },
  {
    id: "hubungi-bank",
    teks: "Jika sudah transfer: hubungi bank sesegera mungkin.",
    butuhTransfer: true,
  },
  {
    id: "waspada-data",
    teks: "Jika data pribadi terkirim: waspada penyalahgunaan data dan ganti kata sandi akun terkait.",
    butuhDataPribadi: true,
  },
  {
    id: "putuskan-perangkat",
    teks: "Jika sudah instal aplikasi atau klik tautan: putuskan akses internet perangkat itu bila perlu, ganti kata sandi dari perangkat lain.",
    butuhPerangkat: true,
  },
] as const;

/**
 * Menghitung langkah checklist yang sesuai dengan jawaban situasi.
 * Urutan hasil selalu mengikuti urutan LANGKAH_CHECKLIST (tetap),
 * bukan urutan jawaban pengguna.
 */
export function hitungLangkah(
  jawaban: Readonly<Partial<Record<IdSituasi, boolean>>>,
): readonly LangkahChecklist[] {
  const aktif = new Set<string>();
  for (const situasi of PILIHAN_SITUASI) {
    if (jawaban[situasi.id] === true) aktif.add(situasi.id);
  }

  return LANGKAH_CHECKLIST.filter((langkah) => {
    if (langkah.selalu) return true;
    if (langkah.butuhTransfer && aktif.has("sudah-transfer")) return true;
    if (langkah.butuhDataPribadi && aktif.has("sudah-kirim-data"))
      return true;
    if (langkah.butuhPerangkat && aktif.has("sudah-klik-tautan")) return true;
    return false;
  });
}

/** Kunci penyimpanan sessionStorage untuk checklist /bantuan. */
export const KUNCI_CHECKLIST = "bantuan-checklist-v1";

export interface StatusChecklist {
  /** Situasi yang dipilih (boleh lebih dari satu). */
  situasi: IdSituasi[];
  /** Langkah yang sudah dicentang pengguna. */
  selesai: string[];
}

/** Serialisasi status checklist ke string JSON; aman untuk sessionStorage. */
export function simpanStatus(status: StatusChecklist): string {
  return JSON.stringify({
    situasi: status.situasi,
    selesai: status.selesai,
  });
}

/** Baca status checklist dari string JSON; kembalikan null bila tak valid. */
export function bacaStatus(mentah: string | null): StatusChecklist | null {
  if (mentah === null) return null;
  try {
    const nilai = JSON.parse(mentah) as { situasi?: unknown; selesai?: unknown };
    if (
      nilai === null ||
      typeof nilai !== "object" ||
      !Array.isArray(nilai.situasi) ||
      !Array.isArray(nilai.selesai)
    ) {
      return null;
    }
    const situasi = nilai.situasi.filter(
      (s): s is IdSituasi => PILIHAN_SITUASI.some((p) => p.id === s),
    );
    const selesai = nilai.selesai.filter(
      (s): s is string => typeof s === "string" && s.length > 0,
    );
    return { situasi, selesai };
  } catch {
    return null;
  }
}