import { describe, expect, it } from "vitest";

import {
  hitungJenis,
  jenisAturan,
  LABEL_JENIS_RULE,
  JENIS_RULE,
} from "@/lib/evaluation/jenis";
import { RULES } from "@/lib/evaluation/rules";

describe("jenisAturan", () => {
  it("hukum: aturan dengan minimal satu rujukan hukum", () => {
    expect(jenisAturan({ rujukanHukumIds: ["uu-13-2003-pasal-38"] })).toBe(
      "hukum",
    );
  });

  it("pola: aturan tanpa rujukan hukum", () => {
    expect(jenisAturan({ rujukanHukumIds: [] })).toBe("pola");
  });
});

describe("hitungJenis atas katalog aturan nyata", () => {
  it("jumlah hukum + pola selalu sama dengan total aturan", () => {
    const { hukum, pola } = hitungJenis(RULES);
    expect(hukum + pola).toBe(RULES.length);
  });

  it("hanya aturan ber-rujukan yang terhitung sebagai hukum", () => {
    const { hukum } = hitungJenis(RULES);
    const manual = RULES.filter(
      (rule) => rule.rujukanHukumIds.length > 0,
    ).length;
    expect(hukum).toBe(manual);
  });

  it("label tersedia untuk semua jenis", () => {
    for (const jenis of JENIS_RULE) {
      expect(LABEL_JENIS_RULE[jenis].trim().length).toBeGreaterThan(0);
    }
  });
});
