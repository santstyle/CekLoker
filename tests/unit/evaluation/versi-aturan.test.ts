import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  DIPERBARUI_ATURAN,
  formatTanggalAturan,
  VERSI_ATURAN,
} from "@/lib/evaluation/versi";

const ISI_CHANGELOG = readFileSync(
  join(process.cwd(), "CHANGELOG-ATURAN.md"),
  "utf8",
);

/** Entri changelog pertama, mis. "## [1.0.0] - 2026-11-16". */
function entriTeratas(): { versi: string; tanggal: string } {
  const cocok = /^##\s+\[([^\]]+)\]\s+-\s+(\d{4}-\d{2}-\d{2})\s*$/m.exec(
    ISI_CHANGELOG,
  );

  if (!cocok) {
    throw new Error(
      "CHANGELOG-ATURAN.md tidak memiliki entri berformat '## [versi] - YYYY-MM-DD'.",
    );
  }

  return { versi: cocok[1], tanggal: cocok[2] };
}

describe("versi katalog aturan", () => {
  it("memakai versi semver", () => {
    expect(VERSI_ATURAN).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("memakai tanggal ISO yang valid", () => {
    expect(DIPERBARUI_ATURAN).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(DIPERBARUI_ATURAN))).toBe(false);
  });

  it("sinkron dengan entri teratas CHANGELOG-ATURAN.md", () => {
    const teratas = entriTeratas();

    expect(teratas.versi).toBe(VERSI_ATURAN);
    expect(teratas.tanggal).toBe(DIPERBARUI_ATURAN);
  });

  it("memformat tanggal ke Bahasa Indonesia", () => {
    expect(formatTanggalAturan("2026-11-16")).toBe("16 November 2026");
    expect(formatTanggalAturan("bukan-tanggal")).toBe("bukan-tanggal");
  });
});
