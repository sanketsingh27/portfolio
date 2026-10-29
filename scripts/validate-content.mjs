import { readFile } from "node:fs/promises";
import { parsePortfolio } from "../src/lib/content-schema.mjs";

try {
  const names = ["site", "projects", "credentials", "logs", "writing"];
  const entries = await Promise.all(
    names.map(async (name) => [
      name,
      JSON.parse(
        await readFile(
          new URL(`../content/${name}.json`, import.meta.url),
          "utf8",
        ),
      ),
    ]),
  );
  const { site, ...collections } = Object.fromEntries(entries);
  parsePortfolio({ ...site, ...collections });
  console.log("Portfolio content is valid.");
} catch (error) {
  console.error(`Content validation failed: ${error.message}`);
  process.exitCode = 1;
}
