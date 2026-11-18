import { describe, expect, it } from "vitest";

import { evaluasiLowongan } from "@/lib/evaluation/evaluate";
import { penjelasanPenentuLevel } from "@/lib/evaluation/penentu";
import type { HasilEvaluasi } from "@/lib/evaluation/types";

import { FIXTURES_EVALUASI } from "@/tests/fixtures/evaluation";

function ambilHasil(id: string): HasilEvaluasi {
  const kasus = FIXTURES_EVALUASI.find((butir) => butir.id === id);
  if (kasus === undefined) {
    throw new Error(`Fixture ${id} tidak ditemukan`);
  }

  return evaluasiLowongan({
    teksLowongan: kasus.teks,
    ...(kasus.lokasi ? { lokasi: kasus.lokasi } : {}),
  });
}

describe("penjelasanPenentuLevel", () => {
  it("menyebut nama indikator penentu dan skor saat level naik lewat aturan", () => {
    // t1_biaya_administrasi: band tinggi via aturan pungutan_biaya
    const hasil = ambilHasil("t1_biaya_administrasi");
    const kalimat = penjelasanPenentuLevel(hasil);

    expect(kalimat).toContain("indikator");
    expect(kalimat).toContain("17");
    expect(kalimat).toContain("berapa pun skornya");
    // Nama aturan (judul) ikut disebut, bukan id mentah.
    expect(kalimat).not.toContain("pungutan_biaya");
  });

  it("menyebut skor saat level murni dari akumulasi skor", () => {
    // d2_operator_produksi: band perlu_dicek murni dari skor 16
    const hasil = ambilHasil("d2_operator_produksi");
    const kalimat = penjelasanPenentuLevel(hasil);

    expect(kalimat).toContain("akumulasi skor");
    expect(kalimat).toContain("16");
  });

  it("memakai id mentah bila aturan penentu tidak dikenal (jaring pengaman)", () => {
    const hasil: HasilEvaluasi = {
      band: "tinggi",
      skor: 12,
      penentu_level: "aturan_penentu",
      id_aturan_penentu: "aturan_karangan_sendiri",
      temuan: [],
      saran: [],
      ringkasan: "",
      versi: "1.0.0",
    };

    expect(penjelasanPenentuLevel(hasil)).toContain("aturan_karangan_sendiri");
  });

  it("menulis kalimat generik bila hasil tidak membawa informasi penentu", () => {
    const hasil: HasilEvaluasi = {
      band: "perlu_dicek",
      skor: 20,
      temuan: [],
      saran: [],
      ringkasan: "",
      versi: "1.0.0",
    };

    expect(penjelasanPenentuLevel(hasil)).toContain("berapa pun skornya");
  });
});
