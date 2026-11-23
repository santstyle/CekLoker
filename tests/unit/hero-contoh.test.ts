import { describe, expect, it } from "vitest";

import { KASUS_ACUAN } from "@/lib/evaluation/kasus-acuan";
import { RULES } from "@/lib/evaluation/rules";
import { bandDariSkor } from "@/lib/evaluation/score";
import { BATAS_TEMUAN_TAMPIL, CONTOH_LAPORAN } from "@/lib/hero-contoh";

const JUDUL_RULE = new Set(RULES.map((rule) => rule.judul));

function kasusUntuk(id: string) {
  const kasus = KASUS_ACUAN.find((butir) => butir.id === id);
  if (!kasus) throw new Error(`Kasus acuan "${id}" tidak ditemukan.`);
  return kasus;
}

describe("contoh laporan hero", () => {
  it("menyediakan tiga contoh dengan nomor berurutan", () => {
    expect(CONTOH_LAPORAN).toHaveLength(3);
    expect(CONTOH_LAPORAN.map((contoh) => contoh.nomor)).toEqual([
      "001",
      "002",
      "003",
    ]);
  });

  it("mewakili ketiga band risiko", () => {
    const band = CONTOH_LAPORAN.map((contoh) => contoh.hasil.band).sort();
    expect(band).toEqual(["perlu_dicek", "rendah", "tinggi"]);
  });

  it("menghasilkan skor dan band yang sama dengan kasus acuan", () => {
    for (const contoh of CONTOH_LAPORAN) {
      const kasus = kasusUntuk(contoh.id);
      expect(contoh.hasil.band, contoh.id).toBe(kasus.expectedBand);
      expect(contoh.hasil.skor, contoh.id).toBe(kasus.expectedSkor);
    }
  });

  it("hanya menampilkan judul yang berasal dari katalog aturan", () => {
    for (const contoh of CONTOH_LAPORAN) {
      expect(contoh.temuanTampil.length).toBeLessThanOrEqual(
        BATAS_TEMUAN_TAMPIL,
      );
      for (const judul of contoh.temuanTampil) {
        expect(JUDUL_RULE.has(judul), judul).toBe(true);
      }
    }
  });

  it("menghitung sisa temuan di luar yang ditampilkan", () => {
    for (const contoh of CONTOH_LAPORAN) {
      expect(contoh.sisaTemuan).toBe(
        contoh.hasil.temuan.length - contoh.temuanTampil.length,
      );
      expect(contoh.sisaTemuan).toBeGreaterThanOrEqual(0);
    }
  });

  it("menandai contoh yang rentangnya naik karena indikator penentu", () => {
    for (const contoh of CONTOH_LAPORAN) {
      expect(contoh.penentuBand, contoh.id).toBe(
        contoh.hasil.band !== bandDariSkor(contoh.hasil.skor),
      );
    }
  });

  it("memakai ringkasan asli dari mesin evaluasi", () => {
    for (const contoh of CONTOH_LAPORAN) {
      if (contoh.hasil.temuan.length === 0) {
        expect(contoh.hasil.ringkasan).toContain("Tidak ditemukan");
      } else {
        expect(contoh.hasil.ringkasan).toContain(
          `${contoh.hasil.temuan.length} indikator ditemukan`,
        );
      }
    }
  });
});
