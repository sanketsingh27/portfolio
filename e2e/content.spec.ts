import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

test("owner can add a publication with the local CLI and see it in Writing", async ({
  page,
}) => {
  // This collection is used only by the local fixture server, never production.
  const file = path.resolve("e2e/fixtures/writing.json");
  const original = await readFile(file, "utf8");
  try {
    const result = spawnSync(
      process.execPath,
      [
        "scripts/writing.mjs",
        "--file",
        file,
        "--url",
        "https://example.org/new-publication",
        "--title",
        "Added through the local workflow",
        "--summary",
        "One new link, written once elsewhere.",
      ],
      { encoding: "utf8" },
    );
    expect(result.status, result.stderr).toBe(0);
    await page.goto("/writing");
    const publication = page.getByRole("link", {
      name: /Added through the local workflow/,
    });
    await expect(publication).toContainText(
      "One new link, written once elsewhere.",
    );
    await expect(publication).toHaveAttribute(
      "href",
      "https://example.org/new-publication",
    );
    await expect(
      page.getByRole("link", { name: /A fixture note/ }),
    ).toBeVisible();
  } finally {
    await writeFile(file, original);
  }
});

test("Writing remains useful when the collection is empty", async ({
  page,
}) => {
  const file = path.resolve("e2e/fixtures/writing.json");
  const original = await readFile(file, "utf8");
  try {
    await writeFile(file, "[]\n");
    await page.goto("/writing");
    await expect(
      page.getByRole("heading", { name: "The notebook is open." }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "No writing links have been added yet. Published pieces will appear here.",
      ),
    ).toBeVisible();
  } finally {
    await writeFile(file, original);
  }
});

test("writing links show supplied summaries and open the original publication", async ({
  page,
}) => {
  await page.goto("/writing");
  const publication = page.getByRole("link", { name: /A fixture note/ });
  await expect(publication).toContainText(
    "A short summary supplied for a local test.",
  );
  await expect(publication).toContainText("opens in a new tab");
  await expect(publication).toHaveAttribute(
    "href",
    "https://example.org/original",
  );
  await expect(publication).toHaveAttribute("target", "_blank");
  await expect(publication).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page).toHaveTitle("Writing · Sanket Singh");
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
  await page.goto("/writing");
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
