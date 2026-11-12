import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { getDb } from "@/lib/db/client";
import { checks } from "@/lib/db/schema";
import { evaluasiLowongan, skemaInputEvaluasi } from "@/lib/evaluation/evaluate";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body permintaan bukan JSON yang valid." },
      { status: 400 },
    );
  }

  const terurai = skemaInputEvaluasi.safeParse(body);
  if (!terurai.success) {
    const pesan = terurai.error.issues.map((isue) => isue.message).join(" ");
    return NextResponse.json({ error: pesan }, { status: 400 });
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

  return NextResponse.json({ id, hasil }, { status: 201 });
}
