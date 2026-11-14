import { expect, test } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

/**
 * Gerbang aksesibilitas WCAG 2.2 AA untuk rute publik utama.
 * Halaman digulir sampai bawah agar elemen .reveal terlihat penuh
 * sebelum axe memindai (mencegah pelanggaran semu dari opacity: 0).
 */
const RUTE = ["/", "/cek", "/edukasi"] as const;

for (const rute of RUTE) {
  test(`aksesibilitas: ${rute} bebas pelanggaran WCAG 2.2 AA`, async ({
    page,
  }) => {
    await page.goto(rute);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);

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
