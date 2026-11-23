import { expect, test } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

/**
 * Gerbang aksesibilitas WCAG 2.2 AA untuk rute publik utama.
 *
 * Deterministik terhadap animasi reveal: reduced-motion membuat transisi
 * CSS instan, lalu halaman digulir sampai bawah dan ditunggu hingga
 * semua .reveal-init mendapat .is-visible sebelum axe memindai. Tanpa
 * ini, axe sempat membaca elemen beroOpacity di tengah transisi dan
 * melaporkan color-contrast palsu.
 */
const RUTE = [
  "/",
  "/cek",
  "/edukasi",
  "/edukasi/kuis",
  "/uji-akurasi",
  "/bantuan",
] as const;

for (const rute of RUTE) {
  test(`aksesibilitas: ${rute} bebas pelanggaran WCAG 2.2 AA`, async ({
    page,
  }) => {
    await page.goto(rute);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".reveal-init:not(.is-visible)").length === 0,
      { timeout: 10_000 },
    );

    const hasil = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const ringkas = hasil.violations.map((v) => ({
      id: v.id,
      dampak: v.impact,
      simpul: v.nodes.map((n) => n.target),
    }));

    expect(ringkas, JSON.stringify(ringkas, null, 2)).toEqual([]);
  });
}
