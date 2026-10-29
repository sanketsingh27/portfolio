import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const cli = fileURLToPath(new URL("../scripts/writing.mjs", import.meta.url));
const entry = {
  id: "existing",
  title: "Existing",
  summary: "An existing article.",
  url: "https://example.com/post?edition=2",
  platform: "Example",
  tags: ["Original"],
};
async function fixture(t, data = []) {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-writing-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const file = join(directory, "writing.json");
  await writeFile(file, JSON.stringify(data));
  return {
    file,
    directory,
    run: (...args) =>
      spawnSync(process.execPath, [cli, "--file", file, ...args], {
        encoding: "utf8",
      }),
    read: async () => JSON.parse(await readFile(file, "utf8")),
  };
}
const metadata = [
  "--title",
  "A new article",
  "--summary",
  "A factual summary.",
];

test("prepends a validated publication and preserves unrelated entries", async (t) => {
  const f = await fixture(t, [entry]);
  const result = f.run(
    "--url",
    "https://news.example.com/new",
    ...metadata,
    "--date",
    "2024-02-29",
    "--tags",
    "AI, Design",
  );
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(await f.read(), [
    {
      id: "a-new-article",
      title: "A new article",
      summary: "A factual summary.",
      url: "https://news.example.com/new",
      platform: "news.example.com",
      publishedAt: "2024-02-29",
      tags: ["AI", "Design"],
    },
    entry,
  ]);
});

test("updates a normalized URL in place while preserving its ID and optional metadata", async (t) => {
  const f = await fixture(t, [
    { ...entry, id: "first", url: "https://other.example.com" },
    entry,
  ]);
  const result = f.run(
    "--url",
    "https://EXAMPLE.com/post/?utm_source=test&fbclid=x&gclid=x&edition=2#top",
    ...metadata,
  );
  assert.equal(result.status, 0, result.stderr);
  const records = await f.read();
  assert.equal(records.length, 2);
  assert.equal(records[1].id, "existing");
  assert.equal(records[1].title, "A new article");
  assert.deepEqual(records[1].tags, ["Original"]);
});

test("meaningful query differences remain distinct and colliding titles get unique IDs", async (t) => {
  const f = await fixture(t, [entry]);
  for (const edition of [3, 4]) {
    const result = f.run(
      "--url",
      `https://example.com/post?edition=${edition}`,
      "--title",
      "Existing",
      "--summary",
      "Another edition.",
    );
    assert.equal(result.status, 0, result.stderr);
  }
  assert.deepEqual(
    (await f.read()).map((record) => record.id),
    ["existing-3", "existing-2", "existing"],
  );
});

for (const [name, args] of [
  ["missing metadata", ["--url", "https://example.com/new"]],
  ["unsafe URL", ["--url", "http://example.com/new", ...metadata]],
  [
    "credential URL",
    ["--url", "https://user:pass@example.com/new", ...metadata],
  ],
  [
    "impossible date",
    ["--url", "https://example.com/new", ...metadata, "--date", "2025-02-29"],
  ],
  [
    "empty tag",
    ["--url", "https://example.com/new", ...metadata, "--tags", "AI,,Design"],
  ],
])
  test(`rejects ${name} without changing the file`, async (t) => {
    const f = await fixture(t, [entry]);
    const before = await readFile(f.file, "utf8");
    const result = f.run(...args);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Writing update failed:/);
    assert.equal(await readFile(f.file, "utf8"), before);
    assert.deepEqual(await readdir(f.directory), ["writing.json"]);
  });

test("rejects an invalid existing collection without rewriting it", async (t) => {
  const f = await fixture(t, [entry, entry]);
  const before = await readFile(f.file, "utf8");
  const result = f.run("--url", "https://example.com/new", ...metadata);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Writing update failed:/);
  assert.equal(await readFile(f.file, "utf8"), before);
});
