import { test, expect } from "@playwright/test";
test("chat entry is hidden while the dock exposes the three contact destinations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Ask anything about Sanket/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Close window", exact: true }).click();
  await expect(page.locator(".assistant-launcher")).toHaveCount(0);
  await expect(page.getByText("Open a folder to explore.")).toBeVisible();
  const dock = page.getByRole("navigation", {
    name: "Contact and social links",
  });
  await expect(dock.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "href",
    "https://example.org/linkedin",
  );
  await expect(dock.getByRole("link", { name: /Twitter/ })).toHaveAttribute(
    "href",
    "https://example.org/twitter",
  );
  await expect(
    dock.getByRole("link", { name: "Email", exact: true }),
  ).toHaveAttribute("href", "mailto:test@example.org");
});
test("assistant source restores a closed window even when its URL is unchanged", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Close window" }).click();
  await page.goto("/chat");
  await page
    .getByRole("navigation", { name: "Approved portfolio sources" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "The workbench." }),
  ).toBeVisible();
});
test("desktop opens About and preserves navigation through window controls", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Hello, I’m/ })).toBeVisible();
  await page.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(
    page.getByRole("heading", { name: "The workbench." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Minimize window" }).click();
  await expect(
    page.getByRole("heading", { name: "Room to explore." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Restore window" }).click();
  await expect(
    page.getByRole("heading", { name: "The workbench." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close window" }).click();
  await expect(
    page.getByRole("heading", { name: "Room to explore." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Projects", exact: true }),
  ).toBeFocused();
  await page.getByRole("link", { name: "Writing", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Notes from the middle." }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "The workbench." }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "The workbench." }),
  ).toBeVisible();
});

test("desktop window stays reachable after dragging and viewport resize", async ({
  page,
}) => {
  await page.goto("/");
  const bar = page.locator(".titlebar");
  const box = (await bar.boundingBox())!;
  await page.mouse.move(box.x + 80, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(-400, -400);
  await page.mouse.up();
  const window = page.getByRole("region", { name: "Portfolio window" });
  const moved = (await window.boundingBox())!;
  expect(moved.x).toBeGreaterThanOrEqual(0);
  expect(moved.y).toBeGreaterThanOrEqual(0);
  await page.setViewportSize({ width: 850, height: 700 });
  await expect(
    page.getByRole("button", { name: "Close window" }),
  ).toBeInViewport();
});
test("phone content uses the page scroll and all sections remain reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("link", { name: "Writing", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Notes from the middle." }),
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
