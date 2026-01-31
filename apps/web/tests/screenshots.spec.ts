import { test } from "@playwright/test";
import fs from "fs";
import path from "path";

const artifactsDir = path.resolve(__dirname, "..", "..", "..", "artifacts", "ui");

const pages = [
  { name: "landing", path: "/" },
  { name: "dashboard-cards", path: "/dashboard?view=cards" },
  { name: "dashboard-table", path: "/dashboard?view=table" },
  { name: "opportunity-detail", path: "/opportunities/120" },
  { name: "tracker", path: "/tracker" },
  { name: "labeling", path: "/labeling" },
  { name: "profile-wizard", path: "/profile" }
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 }
];

const themes = ["light", "dark"] as const;

async function preparePage(page: import("@playwright/test").Page, theme: "light" | "dark") {
  await page.addInitScript((value) => {
    window.localStorage.setItem("vf-theme", value);
    document.documentElement.setAttribute("data-theme", value);
  }, theme);
  await page.emulateMedia({ colorScheme: theme === "dark" ? "dark" : "light" });
}

test.describe("UI screenshots", () => {
  test.beforeAll(() => {
    fs.mkdirSync(artifactsDir, { recursive: true });
  });

  for (const theme of themes) {
    for (const viewport of viewports) {
      for (const pageConfig of pages) {
        test(`${pageConfig.name}-${theme}-${viewport.name}`, async ({ page }) => {
          await preparePage(page, theme);
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(pageConfig.path, { waitUntil: "networkidle" });
          await page.waitForTimeout(1500);

          const fileName = `${pageConfig.name}-${theme}-${viewport.name}.png`;
          await page.screenshot({ path: path.join(artifactsDir, fileName), fullPage: true });
        });
      }
    }
  }
});
