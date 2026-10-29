import { readFile, open, rename, unlink, stat } from "node:fs/promises";
import { resolve, dirname, basename, join } from "node:path";
import { randomUUID } from "node:crypto";
import {
  parseWriting,
  normalizeWritingUrl,
} from "../src/lib/content-schema.mjs";

function argumentsFrom(args) {
  const options = {};
  const allowed = new Set([
    "url",
    "title",
    "summary",
    "platform",
    "date",
    "tags",
    "file",
  ]);
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index].replace(/^--/, "");
    if (
      !args[index].startsWith("--") ||
      !allowed.has(key) ||
      options[key] !== undefined ||
      args[index + 1] === undefined ||
      args[index + 1].startsWith("--")
    ) {
      throw new Error(`Invalid option: ${args[index]}`);
    }
    options[key] = args[index + 1].trim();
  }
  for (const key of ["url", "title", "summary"]) {
    if (!options[key])
      throw new Error(
        `--${key} is required. Verify the publication metadata before adding it.`,
      );
  }
  return options;
}

async function main() {
  const options = argumentsFrom(process.argv.slice(2));
  const file = resolve(options.file || "content/writing.json");
  const original = await readFile(file, "utf8");
  const records = parseWriting(JSON.parse(original));
  const url = new URL(options.url);
  const index = records.findIndex(
    (record) =>
      normalizeWritingUrl(record.url) === normalizeWritingUrl(options.url),
  );
  const existing = index < 0 ? undefined : records[index];
  const base =
    options.title
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "publication";
  let id = base;
  for (let suffix = 2; records.some((record) => record.id === id); suffix++)
    id = `${base}-${suffix}`;
  const record = {
    ...existing,
    id: existing?.id || id,
    title: options.title,
    summary: options.summary,
    url: options.url,
    platform: options.platform ?? existing?.platform ?? url.hostname,
    ...(options.date !== undefined ? { publishedAt: options.date } : {}),
    ...(options.tags !== undefined
      ? { tags: options.tags.split(",").map((tag) => tag.trim()) }
      : {}),
  };
  const updated = [...records];
  if (index < 0) updated.unshift(record);
  else updated[index] = record;
  parseWriting(updated);

  const temporary = join(
    dirname(file),
    `.${basename(file)}.${randomUUID()}.tmp`,
  );
  let handle;
  try {
    handle = await open(temporary, "wx", (await stat(file)).mode & 0o777);
    await handle.writeFile(`${JSON.stringify(updated, null, 2)}\n`);
    await handle.sync();
    await handle.close();
    handle = undefined;
    if ((await readFile(file, "utf8")) !== original)
      throw new Error(
        "Writing collection changed during this update; retry with the latest file.",
      );
    await rename(temporary, file);
  } finally {
    if (handle) await handle.close();
    await unlink(temporary).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
  console.log(`${existing ? "Updated" : "Added"} writing entry: ${record.id}`);
}

main().catch((error) => {
  console.error(`Writing update failed: ${error.message}`);
  process.exitCode = 1;
});
