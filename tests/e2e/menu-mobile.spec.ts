import { expect, test } from "@playwright/test";

/**
 * Regresi menu hamburger mobile: toggle, tutup via klik di luar,
 * tutup via Escape, dan tersembunyi di desktop.
 */
test.describe("menu mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
  });

  test("hamburger membuka dan menutup menu", async ({ page }) => {
    const tombol = page.getByRole("button", { name: "Menu navigasi" });
    await tombol.click();
    await expect(
      page.getByRole("navigation", { name: "Navigasi mobile" }),
    ).toBeVisible();
    await tombol.click();
    await expect(
      page.getByRole("navigation", { name: "Navigasi mobile" }),
    ).toBeHidden();
  });

  test("klik di luar menu menutup menu", async ({ page }) => {
    await page.getByRole("button", { name: "Menu navigasi" }).click();
    await expect(
      page.getByRole("navigation", { name: "Navigasi mobile" }),
    ).toBeVisible();
    await page.mouse.click(2, 400);
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("navigation", { name: "Navigasi mobile" }),
    ).toBeHidden();
  });

  test("Escape menutup menu", async ({ page }) => {
    await page.getByRole("button", { name: "Menu navigasi" }).click();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("navigation", { name: "Navigasi mobile" }),
    ).toBeHidden();
  });

  test("hamburger tersembunyi di desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Menu navigasi" }),
    ).toBeHidden();
  });
});
