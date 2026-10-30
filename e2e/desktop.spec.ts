import { test, expect } from "@playwright/test";

test("chat entry stays hidden and contact links retain their destinations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /Ask anything about Sanket/ }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("textbox", { name: "Your question" }),
  ).toHaveCount(0);
  const social = page.getByRole("navigation", { name: "Social links", exact: true });
  await expect(
    social.getByRole("link", { name: /LinkedIn/ }),
  ).toHaveAttribute("href", "https://example.org/linkedin");
  await expect(
    social.getByRole("link", { name: /Twitter|X/ }),
  ).toHaveAttribute("href", "https://example.org/twitter");
  await expect(
    social.getByRole("link", { name: "Email", exact: true }),
  ).toHaveAttribute("href", "mailto:test@example.org");
  const contacts = page.getByRole("navigation", {
    name: "Contact and social links",
  });
  await expect(
    contacts.getByRole("link", { name: /LinkedIn/ }),
  ).toHaveAttribute("href", "https://example.org/linkedin");
  await expect(contacts.getByRole("link", { name: /Twitter/ })).toHaveAttribute(
    "href",
    "https://example.org/twitter",
  );
  await expect(
    contacts.getByRole("link", { name: /^Email/ }),
  ).toHaveAttribute("href", "mailto:test@example.org");
});

test("landing navigation reaches work and about and offers a downloadable resume", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "I build products and I ship them.",
      level: 1,
    }),
  ).toBeVisible();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await nav.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
  await expect(
    page.locator("#work").getByRole("link", { name: /Fixture project/ }),
  ).toBeVisible();
  await nav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator("#about")).toBeInViewport();
  const resumes = page.locator('a[download][href="/sanket-singh-resume.pdf"]');
  await expect(resumes).toHaveCount(2);
  expect((await request.get("/sanket-singh-resume.pdf")).ok()).toBe(true);
});

test("project and home routes preserve navigation, browser history and reload", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator("#work")
    .getByRole("link", { name: /Fixture project/ })
    .click();
  await expect(page).toHaveURL(/\/projects\/fixture-project$/);
  await expect(
    page.getByRole("heading", { name: "Fixture project", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "I build products and I ship them." }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Fixture project", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Fixture project", exact: true }),
  ).toBeVisible();
});

test("skip link focuses the portfolio content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("main", { name: "Portfolio content" }),
  ).toBeFocused();
});

test("phone content uses page scroll and all navigation remains reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "I build products and I ship them." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/contact");
  await expect(
    page.getByRole("heading", { name: /Good things start/ }),
  ).toBeVisible();
});
