import { NextResponse } from "next/server";

/**
 * Penjaga ukuran body (pertahanan berlapis terhadap body-bomb).
 *
 * Membaca `content-length` bila tersedia dan menolak permintaan yang
 * melampaui batas sebelum pembatas laju menguras kuota klien. Bila header
 * tidak dikirim, kembalikan null — pembacaan body dan Zod yang menyaring
 * sisanya.
 */
export function periksaUkuranBody(
  request: Request,
  batasByte: number,
): Response | null {
  const iklan = request.headers.get("content-length");
  if (iklan === null) {
    return null;
  }

  const jumlah = Number(iklan);
  if (!Number.isInteger(jumlah) || jumlah < 0 || jumlah <= batasByte) {
    return null;
  }

  const kilobita = Math.round(batasByte / 1024);
  return NextResponse.json(
    { error: `Ukuran kiriman terlalu besar (maksimal ${kilobita} KB).` },
    { status: 413 },
  );
}
