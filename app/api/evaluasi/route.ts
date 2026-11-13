import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { getDb } from "@/lib/db/client";
import { checks } from "@/lib/db/schema";
import {
  evaluasiLowongan,
  skemaInputEvaluasi,
} from "@/lib/evaluation/evaluate";
import {
  ambilKunciKlien,
  buatPembatasJendelaTetap,
  type HasilPembatas,
  type PembatasLaju,
} from "@/lib/security/rate-limit";

/** Kuota permintaan evaluasi per klien dalam satu menit. */
const BATAS_PER_MENIT = 20;
const JENDELA_MS = 60_000;

const globalForPembatas = globalThis as unknown as {
  __ceklokerPembatasEvaluasi?: PembatasLaju;
};

function pembatasEvaluasi(): PembatasLaju {
  if (!globalForPembatas.__ceklokerPembatasEvaluasi) {
    globalForPembatas.__ceklokerPembatasEvaluasi = buatPembatasJendelaTetap({
      batas: BATAS_PER_MENIT,
      jendelaMs: JENDELA_MS,
    });
  }

  return globalForPembatas.__ceklokerPembatasEvaluasi;
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
  const kuota = pembatasEvaluasi().periksa(ambilKunciKlien(request));
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

  const terurai = skemaInputEvaluasi.safeParse(body);
  if (!terurai.success) {
    const pesan = terurai.error.issues.map((isue) => isue.message).join(" ");
    return NextResponse.json(
      { error: pesan },
      { status: 400, headers: headerPembatas(kuota) },
    );
  }

  const hasil = evaluasiLowongan(terurai.data);
  const id = nanoid(21);

  try {
    await getDb()
      .insert(checks)
      .values({
        id,
        region: terurai.data.lokasi || null,
        band: hasil.band,
        score: hasil.skor,
        triggeredRuleCodes: hasil.temuan.map((temuan) => temuan.ruleId),
        usedAi: false,
        inputLength: terurai.data.teksLowongan.length,
      });
  } catch (error) {
    console.warn("Pencatatan agregat gagal; hasil tetap dikirim.", error);
  }

  return NextResponse.json(
    { id, hasil },
    { status: 201, headers: headerPembatas(kuota) },
  );
}
