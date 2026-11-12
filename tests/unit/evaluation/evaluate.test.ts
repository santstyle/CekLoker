import { describe, expect, it } from "vitest";

import {
  EVALUATOR_VERSION,
  evaluasiLowongan,
  LABEL_BAND,
  skemaInputEvaluasi,
} from "@/lib/evaluation/evaluate";
import { FIXTURES_EVALUASI } from "@/tests/fixtures/evaluation";

describe("evaluasi terhadap fixture acuan", () => {
  it.each([...FIXTURES_EVALUASI])(
    "$id menghasilkan rentang, skor, dan aturan sesuai acuan",
    (kasus) => {
      const hasil = evaluasiLowongan({
        teksLowongan: kasus.teks,
        lokasi: kasus.lokasi,
      });

      expect(hasil.band).toBe(kasus.expectedBand);
      expect(hasil.skor).toBe(kasus.expectedSkor);
      expect(hasil.temuan.map((temuan) => temuan.ruleId).sort()).toEqual(
        kasus.expectedRuleIds,
      );

      expect(hasil.versi).toBe(EVALUATOR_VERSION);
      expect(hasil.saran.length).toBeGreaterThan(0);

      for (const temuan of hasil.temuan) {
        expect(temuan.bukti.length).toBeGreaterThan(0);
        expect(new Set(temuan.bukti).size).toBe(temuan.bukti.length);
        for (const bukti of temuan.bukti) {
          expect(bukti.length).toBeLessThan(kasus.teks.length);
        }
      }

      if (kasus.expectedRuleIds.length === 0) {
        expect(hasil.ringkasan).toMatch(/^Tidak ditemukan/);
      } else {
        expect(hasil.ringkasan).toContain(LABEL_BAND[hasil.band]);
      }
    },
  );
});

describe("determinisme", () => {
  it("menghasilkan keluaran identik untuk masukan yang sama", () => {
    const kasus = FIXTURES_EVALUASI.find((f) => f.expectedRuleIds.length > 0);
    if (kasus === undefined) {
      throw new Error("Fixture dengan temuan tidak ditemukan");
    }

    const pertama = evaluasiLowongan({
      teksLowongan: kasus.teks,
      lokasi: kasus.lokasi,
    });
    const kedua = evaluasiLowongan({
      teksLowongan: kasus.teks,
      lokasi: kasus.lokasi,
    });

    expect(kedua).toEqual(pertama);
  });
});

describe("larangan vonis", () => {
  it("keluaran tidak memuat kata vonis terlarang", () => {
    for (const kasus of FIXTURES_EVALUASI) {
      const hasil = evaluasiLowongan({
        teksLowongan: kasus.teks,
        lokasi: kasus.lokasi,
      });
      const json = JSON.stringify(hasil).toLowerCase();
      expect(json).not.toMatch(/penipu/);
      expect(json).not.toMatch(/palsu/);
      expect(json).not.toMatch(/\basli\b/);
    }
  });
});

describe("validasi masukan", () => {
  it("menolak teks lebih pendek dari 30 karakter", () => {
    const hasil = skemaInputEvaluasi.safeParse({
      teksLowongan: "terlalu pendek",
    });
    expect(hasil.success).toBe(false);
    if (!hasil.success) {
      expect(hasil.error.issues[0]?.message).toContain("minimal 30 karakter");
    }
  });

  it("menolak teks hanya spasi", () => {
    const hasil = skemaInputEvaluasi.safeParse({ teksLowongan: "   " });
    expect(hasil.success).toBe(false);
  });

  it("menerima teks valid dengan lokasi opsional", () => {
    const hasil = skemaInputEvaluasi.safeParse({
      teksLowongan:
        "Kami mencari koki berpengalaman untuk dapur kami mulai pekan depan.",
      lokasi: "Jakarta",
    });
    expect(hasil.success).toBe(true);
  });
});
