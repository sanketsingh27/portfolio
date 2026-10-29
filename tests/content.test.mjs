import { test } from "node:test";
import assert from "node:assert/strict";
import { parseWriting } from "../src/lib/content-schema.mjs";

test("content boundary rejects duplicate destinations and impossible publication dates", () => {
  const record = {
    id: "one",
    title: "A note",
    summary: "A verified summary.",
    platform: "example.org",
    url: "https://example.org/post",
  };
  assert.deepEqual(parseWriting([record]), [record]);
  assert.throws(() =>
    parseWriting([
      record,
      {
        ...record,
        id: "two",
        url: "https://EXAMPLE.org/post/?utm_source=x#top",
      },
    ]),
  );
  assert.throws(() => parseWriting([{ ...record, publishedAt: "2026-02-30" }]));
  assert.throws(() =>
    parseWriting([{ ...record, url: "javascript:alert(1)" }]),
  );
});
