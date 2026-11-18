import { describe, expect, it } from "vitest";

import { KASUS_ACUAN } from "@/lib/evaluation/kasus-acuan";
import { RULES } from "@/lib/evaluation/rules";
import { ujiKonsistensi, URUTAN_BAND } from "@/lib/evaluation/uji-konsistensi";
import { FIXTURES_EVALUASI } from "@/tests/fixtures/evaluation";

const ID_RULE = new Set(RULES.map((rule) => rule.id));

describe("himpunan kasus acuan", () => {
  it("berisi antara 30 dan 50 kasus", () => {
    expect(KASUS_ACUAN.length).toBeGreaterThanOrEqual(30);
    expect(KASUS_ACUAN.length).toBeLessThanOrEqual(50);
  });

  it("memakai id yang unik", () => {
    const id = KASUS_ACUAN.map((kasus) => kasus.id);
    expect(new Set(id).size).toBe(id.length);
  });

  it("menyertakan catatan pada setiap kasus", () => {
    for (const kasus of KASUS_ACUAN) {
      expect(kasus.catatan.trim().length).toBeGreaterThan(0);
    }
  });

  it("mengurutkan expectedRuleIds secara alfabetis", () => {
    for (const kasus of KASUS_ACUAN) {
      const urut = [...kasus.expectedRuleIds].sort();
      expect(kasus.expectedRuleIds).toEqual(urut);
    }
  });

  it("hanya menunjuk id aturan yang dikenal mesin evaluasi", () => {
    for (const kasus of KASUS_ACUAN) {
      for (const ruleId of kasus.expectedRuleIds) {
        expect(ID_RULE.has(ruleId)).toBe(true);
      }
    }
  });

  it("tetap diekspor lewat alias fixtures lama", () => {
    expect(FIXTURES_EVALUASI).toBe(KASUS_ACUAN);
  });
});

describe("ujiKonsistensi", () => {
  const ringkasan = ujiKonsistensi();

  it("menguji seluruh kasus acuan", () => {
    expect(ringkasan.total).toBe(KASUS_ACUAN.length);
    expect(ringkasan.kasus.length).toBe(KASUS_ACUAN.length);
  });

  it("mencocokkan seluruh kasus tanpa ketidakcocokan", () => {
    expect(ringkasan.tidakCocok).toEqual([]);
    expect(ringkasan.jumlahCocok).toBe(ringkasan.total);
    expect(ringkasan.persenCocok).toBe(100);
  });

  it("menjumlahkan rekap per rentang sama dengan total", () => {
    const totalPerBand = ringkasan.perBand.reduce(
      (jumlah, butir) => jumlah + butir.total,
      0,
    );
    expect(totalPerBand).toBe(ringkasan.total);
    expect(ringkasan.perBand.map((butir) => butir.band)).toEqual([
      ...URUTAN_BAND,
    ]);
  });

  it("menandai setiap kasus cocok dan menyimpan nilai aktual", () => {
    for (const butir of ringkasan.kasus) {
      expect(butir.cocok).toBe(true);
      expect(butir.band).toBe(butir.expectedBand);
      expect(butir.skor).toBe(butir.expectedSkor);
      expect(butir.ruleIds).toEqual(butir.expectedRuleIds);
    }
  });

  it("deterministik: dua pemanggilan menghasilkan keluaran identik", () => {
    expect(ujiKonsistensi()).toEqual(ujiKonsistensi());
  });

  it("melaporkan ketidakcocokan bila acuan digeser", () => {
    const dasar = KASUS_ACUAN[0];
    const dirusak = { ...dasar, expectedSkor: dasar.expectedSkor + 1 };

    const hasil = ujiKonsistensi([dirusak]);

    expect(hasil.total).toBe(1);
    expect(hasil.jumlahCocok).toBe(0);
    expect(hasil.persenCocok).toBe(0);
    expect(hasil.tidakCocok).toHaveLength(1);
    expect(hasil.tidakCocok[0].id).toBe(dasar.id);
  });

  it("menangani himpunan kosong tanpa pembagian nol", () => {
    const hasil = ujiKonsistensi([]);

    expect(hasil.total).toBe(0);
    expect(hasil.persenCocok).toBe(0);
    expect(hasil.tidakCocok).toEqual([]);
  });
});
