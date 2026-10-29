import { z } from "zod";

const text = z.string().trim().min(1);
const id = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const https = text.refine((value) => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !!url.hostname &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}, "Expected a public HTTPS URL without credentials");
const date = text.regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const instant = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(instant.valueOf()) &&
    instant.toISOString().slice(0, 10) === value
  );
}, "Expected a real calendar date");

export function normalizeWritingUrl(value) {
  const url = new URL(value);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/^utm_/i.test(key) || /^(fbclid|gclid)$/i.test(key))
      url.searchParams.delete(key);
  }
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  url.searchParams.sort();
  return url.href;
}

const writingSchema = z
  .array(
    z
      .object({
        id,
        title: text,
        summary: text,
        url: https,
        platform: text,
        publishedAt: date.optional(),
        tags: z.array(text).optional(),
      })
      .strict(),
  )
  .superRefine((records, ctx) => {
    const ids = new Set();
    const urls = new Set();
    records.forEach((record, index) => {
      if (ids.has(record.id))
        ctx.addIssue({
          code: "custom",
          path: [index, "id"],
          message: "Duplicate ID",
        });
      ids.add(record.id);
      let normalized;
      try {
        normalized = normalizeWritingUrl(record.url);
      } catch {
        return;
      }
      if (urls.has(normalized))
        ctx.addIssue({
          code: "custom",
          path: [index, "url"],
          message: "Duplicate publication URL",
        });
      urls.add(normalized);
    });
  });

const uniqueIds = (records) =>
  new Set(records.map((record) => record.id)).size === records.length;
const projectSchema = z
  .object({
    id,
    title: text,
    summary: text,
    category: text,
    status: z.enum(["experiment", "shipped"]),
    problem: text.optional(),
    approach: text.optional(),
    role: text.optional(),
    technologies: z.array(text),
    outcomes: z.array(text),
    steps: z.array(text),
    demoUrl: https.optional(),
    repositoryUrl: https.optional(),
  })
  .strict();
const credentialSchema = z
  .object({
    id,
    title: text,
    issuer: text,
    issuedAt: date.optional(),
    description: text.optional(),
    verificationUrl: https.optional(),
  })
  .strict();

export const portfolioSchema = z
  .object({
    profile: z
      .object({
        name: text,
        role: text.optional(),
        bio: text.optional(),
        portrait: text
          .refine(
            (value) => /^\/(?!\/)/.test(value),
            "Use a local public image path",
          )
          .optional(),
        portraitAlt: text.optional(),
      })
      .strict()
      .refine(
        (profile) => !profile.portrait || !!profile.portraitAlt,
        "Portrait requires alt text",
      ),
    settings: z
      .object({
        siteUrl: https.optional(),
        email: z.email().optional(),
        bookingUrl: https.optional(),
        socials: z.array(z.object({ label: text, url: https }).strict()),
        timezone: text.refine((value) => {
          try {
            new Intl.DateTimeFormat("en", { timeZone: value });
            return true;
          } catch {
            return false;
          }
        }, "Invalid IANA timezone"),
        tagline: text,
      })
      .strict(),
    facts: z.array(text),
    projects: z.array(projectSchema).refine(uniqueIds, "Duplicate project ID"),
    credentials: z
      .array(credentialSchema)
      .refine(uniqueIds, "Duplicate credential ID"),
    logs: z
      .array(z.object({ date, title: text, items: z.array(text) }).strict())
      .refine(
        (records) =>
          new Set(records.map((record) => record.date)).size === records.length,
        "Duplicate log date",
      ),
    writing: writingSchema,
  })
  .strict();

export const parseWriting = (input) => writingSchema.parse(input);
export const parsePortfolio = (input) => portfolioSchema.parse(input);
