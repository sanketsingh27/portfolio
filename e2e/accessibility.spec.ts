import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("public portfolio and direct chat meet automated WCAG AA checks", async ({
  page,
}) => {
  await page.goto("/");
  const audit = () =>
    new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
  expect((await audit()).violations).toEqual([]);
  await page.goto("/chat");
  expect((await audit()).violations).toEqual([]);
  for (const route of ["/projects", "/writing", "/contact", "/log"]) {
    await page.goto(route);
    expect((await audit()).violations, route).toEqual([]);
  }
});
