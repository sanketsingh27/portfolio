import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { parsePortfolio, portfolioSchema } from "./content-schema.mjs";

export type Portfolio = z.infer<typeof portfolioSchema>;

export function getPortfolio(): Portfolio {
  // Fixture directories are restricted to local test runs and never used in production.
  const directory =
    process.env.NODE_ENV !== "production" &&
    process.env.PLAYWRIGHT_TEST === "true"
      ? process.env.CONTENT_TEST_DIR || "content"
      : "content";
  const read = (name: string) =>
    JSON.parse(
      readFileSync(path.join(process.cwd(), directory, `${name}.json`), "utf8"),
    );
  return parsePortfolio({
    ...read("site"),
    projects: read("projects"),
    writing: read("writing"),
    credentials: read("credentials"),
    logs: read("logs"),
  });
}
