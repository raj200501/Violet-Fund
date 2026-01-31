import { test, expect } from "@playwright/test";

test("key flows do not throw client errors", async ({ page }) => {
  const errors: string[] = [];

  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.message}`);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`);
    }
  });

  const timestamp = Date.now();
  const email = `tester+${timestamp}@example.com`;

  await page.goto("/auth/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("pass123");
  await page.getByRole("button", { name: /create account/i }).click();

  await page.goto("/copilot");
  await page.getByRole("button", { name: /paste text/i }).click();
  await page.getByLabel("Paste raw text").fill(
    "Seed-stage grant for women-led climate founders in North America. Deadline Feb 12, 2026."
  );
  await page.getByRole("button", { name: /^analyze$/i }).click();
  const generatePlanButton = page.getByRole("button", { name: /generate plan/i }).first();
  if (await generatePlanButton.count()) {
    await generatePlanButton.click();
  }
  const copyEmailButton = page.getByRole("button", { name: /copy outreach email/i }).first();
  if (await copyEmailButton.count()) {
    await copyEmailButton.click();
  }
  const addToTrackerButton = page.getByRole("button", { name: /add to tracker/i }).first();
  if (await addToTrackerButton.count()) {
    await addToTrackerButton.click();
  }
  await page.goto("/tracker");

  await page.goto("/profile");
  await page.getByLabel("Industry").fill("Climate");
  await page.getByLabel("Stage").fill("Seed");
  await page.getByLabel("Location").fill("North America");
  await page.getByLabel("Revenue range").fill("$10k-$50k");
  await page.getByLabel("Keywords").fill("climate, women-led");
  await page.getByLabel("Founder goals").fill("Build climate resilience tooling");
  await page.getByRole("button", { name: /save profile/i }).click();

  await page.goto("/dashboard");
  await page.getByPlaceholder("Search by program, region, or stage").fill("climate");

  const saveButton = page.getByRole("button", { name: /^save$/i }).first();
  if (await saveButton.count()) {
    await saveButton.click();
  }
  const viewDetailButton = page.getByRole("button", { name: /view detail/i }).first();
  if (await viewDetailButton.count()) {
    await viewDetailButton.click();
  }

  await page.goto("/tracker");
  await page.getByRole("button", { name: /create application/i }).click();
  await page.getByLabel("Search opportunities").fill("climate");
  const optionButton = page.getByRole("button", { name: /climate/i }).first();
  if (await optionButton.count()) {
    await optionButton.click();
  }
  await page.getByLabel("Status").selectOption({ label: "Saved" });
  await page.getByRole("button", { name: /save application/i }).click();

  const draggableCard = page.locator('[draggable="true"]').first();
  if (await draggableCard.count()) {
    const plannedColumn = page.locator("section > div").filter({ hasText: "Planned" }).first();
    await draggableCard.dragTo(plannedColumn);
  }

  await page.goto("/opportunities");
  await page.getByPlaceholder("Search by program, region, or stage").fill("climate");
  const openButton = page.getByRole("button", { name: /view detail/i }).first();
  if (await openButton.count()) {
    await openButton.click();
  }
  const verifyButton = page.getByRole("button", { name: /verify/i }).first();
  if (await verifyButton.count()) {
    await verifyButton.click();
  }
  const improveButton = page.getByRole("button", { name: /improve/i }).first();
  if (await improveButton.count()) {
    await improveButton.click();
    const closePlanButton = page.getByRole("button", { name: /close/i }).first();
    if (await closePlanButton.count()) {
      await closePlanButton.click();
    }
  }

  await page.goto("/labeling");
  const correctionInput = page.getByLabel(/correct/i).first();
  if (await correctionInput.count()) {
    await correctionInput.fill("Updated value");
    await page.getByRole("button", { name: /save corrections/i }).first().click();
  } else {
    await page.getByRole("button", { name: /refresh queue/i }).click();
  }

  expect(errors, `Console/page errors detected: ${errors.join(" | ")}`).toEqual([]);
});
