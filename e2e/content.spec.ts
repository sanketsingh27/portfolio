import { test, expect } from "@playwright/test";

test("Writing stays removed even when publication fixtures exist", async ({
  page,
}) => {
  const response = await page.goto("/writing");
  expect(response?.status()).toBe(404);
  await page.goto("/");
  await expect(page.locator("#writing")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Writing", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator("a[href=\"/writing\"]")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /A fixture note/ })).toHaveCount(0);
});

test("project filters, details and direct links describe the same approved record", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "AI", exact: true }).click();
  await expect(
    page.getByRole("link", { name: /Fixture web project/ }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: /Fixture project/ }).click();
  await expect(page).toHaveURL(/\/projects\/fixture-project$/);
  await expect(
    page.getByRole("heading", { name: "The problem" }),
  ).toBeVisible();
  await expect(page.getByText("A fixture problem.")).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Fixture project", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Repository/ })).toHaveAttribute(
    "href",
    "https://example.org/repository",
  );
});

test("scheduling links use configured external destinations", async ({
  page,
}) => {
  await page.goto("/book");
  await expect(
    page.getByRole("link", { name: /Book a call.*opens in a new tab/ }),
  ).toHaveAttribute("href", "https://example.org/schedule");
  await expect(
    page.getByRole("link", { name: /test@example.org/ }),
  ).toHaveAttribute("href", "mailto:test@example.org");
});

test("invalid detail destinations return a real not-found response", async ({
  request,
  page,
}) => {
  for (const path of [
    "/projects/unknown",
    "/credentials",
    "/credentials/fixture-credential",
    "/writing/unknown",
    "/about/unknown",
    "/not-a-section",
  ]) {
    const result = await request.get(path);
    expect(result.status(), path).toBe(404);
  }
  await page.goto("/not-a-section");
  await expect(
    page.getByRole("heading", { name: "A wrong turn." }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Back to About/ }).click();
  await expect(
    page.getByRole("heading", { name: "I build products and I ship them." }),
  ).toBeVisible();
});

test("mobile layout stays within a narrow viewport with chat open", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/projects");
  await page.goto("/chat");
  await expect(
    page.getByRole("textbox", { name: "Your question" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
