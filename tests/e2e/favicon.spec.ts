import { expect, test } from "@playwright/test";

/**
 * Favicon CekLoker.
 *
 * Tab browser memakai /favicon.svg (mark perisai yang tebal, mengisi penuh
 * kanvas) karena mark lama di-shrink dari logo horizontal sehingga tidak
 * terlihat di 16–32 px. PNG berukuran tetap disediakan sebagai cadangan
 * klien yang belum mengerti SVG, termasuk apple-touch-icon untuk iOS.
 */
test.describe("Favicon", () => {
  test("halaman memuat tautan favicon SVG lebih dulu", async ({ page }) => {
    await page.goto("/");

    const href = await page
      .locator('head link[rel="icon"]')
      .evaluateAll(
        (elemen) => elemen.map((e) => e.getAttribute("href")) as string[],
      );
    expect(href[0]).toBe("/favicon.svg");
    expect(href).toContain("/favicon-32x32.png");
  });

  test("favicon.svg dan apple-touch-icon.png terlayani 200", async ({
    page,
  }) => {
    await page.goto("/");

    const responsSVG = await page.request.get("/favicon.svg");
    expect(responsSVG.status()).toBe(200);
    expect(responsSVG.headers()["content-type"]).toContain("image/svg+xml");

    const responsApple = await page.request.get("/apple-touch-icon.png");
    expect(responsApple.status()).toBe(200);
    expect(responsApple.headers()["content-type"]).toContain("image/png");

    const responsPNG = await page.request.get("/favicon-32x32.png");
    expect(responsPNG.status()).toBe(200);
    expect(responsPNG.headers()["content-type"]).toContain("image/png");
  });
});
