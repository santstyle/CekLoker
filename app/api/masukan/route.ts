import { NextResponse } from "next/server";

import { getDb } from "@/lib/db/client";
import { masukanHasil } from "@/lib/db/schema";
import { skemaMasukan } from "@/lib/api/masukan";
import { RULES } from "@/lib/evaluation/rules";
import {
  ambilKunciKlien,
  buatPembatasJendelaTetap,
  type HasilPembatas,
  type PembatasLaju,
} from "@/lib/security/rate-limit";
import { ringkasGalat } from "@/lib/security/log";
import { periksaUkuranBody } from "@/lib/security/ukuran-body";

/** Kuota kiriman masukan per klien dalam satu menit. */
const BATAS_PER_MENIT = 10;
const JENDELA_MS = 60_000;

/** Batas maksimum body permintaan masukan dalam byte (16 KB). */
const BATAS_BODY_BYTE = 16 * 1024;

/** Kode temuan yang dikenal mesin evaluasi; masukan hanya boleh menunjuk ini. */
const ID_RULE_DIKENAL: ReadonlySet<string> = new Set(
  RULES.map((rule) => rule.id),
);

const globalForPembatas = globalThis as unknown as {
  __ceklokerPembatasMasukan?: PembatasLaju;
};

function pembatasMasukan(): PembatasLaju {
  if (!globalForPembatas.__ceklokerPembatasMasukan) {
    globalForPembatas.__ceklokerPembatasMasukan = buatPembatasJendelaTetap({
      batas: BATAS_PER_MENIT,
      jendelaMs: JENDELA_MS,
    });
  }

  return globalForPembatas.__ceklokerPembatasMasukan;
}

function headerPembatas(hasil: HasilPembatas): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(hasil.batas),
    "X-RateLimit-Remaining": String(hasil.sisa),
    "X-RateLimit-Reset": String(
      Math.floor(Date.now() / 1000) + hasil.resetDetik,
    ),
  };
}

export async function POST(request: Request) {
  const bodyTerlaluBesar = periksaUkuranBody(request, BATAS_BODY_BYTE);
  if (bodyTerlaluBesar) {
    return bodyTerlaluBesar;
  }

  const kuota = pembatasMasukan().periksa(ambilKunciKlien(request));
  if (!kuota.diizinkan) {
    return NextResponse.json(
      {
        error:
          "Terlalu banyak permintaan. Tunggu sebentar sebelum mencoba lagi.",
      },
      {
        status: 429,
        headers: {
          ...headerPembatas(kuota),
          "Retry-After": String(kuota.resetDetik),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body permintaan bukan JSON yang valid." },
      { status: 400, headers: headerPembatas(kuota) },
    );
  }

  const terurai = skemaMasukan.safeParse(body);
  if (!terurai.success) {
    const pesan = terurai.error.issues.map((isue) => isue.message).join(" ");
    return NextResponse.json(
      { error: pesan },
      { status: 400, headers: headerPembatas(kuota) },
    );
  }

  const ruleCode = terurai.data.ruleCode || null;
  if (ruleCode && !ID_RULE_DIKENAL.has(ruleCode)) {
    return NextResponse.json(
      { error: "Temuan yang dipilih tidak dikenal." },
      { status: 400, headers: headerPembatas(kuota) },
    );
  }

  try {
    await getDb().insert(masukanHasil).values({
      checkId: terurai.data.checkId,
      alasan: terurai.data.alasan,
      ruleCode,
    });
  } catch (error) {
    // Berbeda dari evaluasi, masukan tidak punya nilai bila tidak tercatat —
    // karena itu kegagalan penyimpanan dibalas 503, bukan diabaikan. Pesan
    // galat driver tidak ikut ditulis ke log; cukup nama kelas + kode.
    console.warn(`Penyimpanan masukan gagal. (${ringkasGalat(error)})`);
    return NextResponse.json(
      { error: "Masukan belum dapat disimpan. Coba lagi nanti." },
      { status: 503, headers: headerPembatas(kuota) },
    );
  }

  return NextResponse.json(
    { ok: true },
    { status: 201, headers: headerPembatas(kuota) },
  );
}
