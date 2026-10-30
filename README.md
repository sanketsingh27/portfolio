# Sanket Singh — Portfolio

A Next.js portfolio. The `design_2` branch follows the dark, playful typography and folder-card layout of [owoetoni.com](https://owoetoni.com/), using Sanket's own résumé and project content. The prior desktop design is saved on `feat/portfolio-personalization`. Content lives in versioned JSON files; Writing links to original publications elsewhere. No Convex, CMS or application database is required.

## Start locally

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The site works without AI credentials. Profile details and projects use the owner's supplied résumé and confirmed contact links. Writing and daily logs remain empty until publications or updates are added.

The homepage includes selected work, engineering focus, career history, and contact links. A separate social-links pill sits beside Work and About. Writing and Credentials are removed from navigation and public routes; Daily Log remains reachable directly. The chat launcher is hidden; the existing `/chat` implementation is retained for later. The résumé download is available in the header and footer. The existing writing data and local CLI are retained, but do not publish a Writing page.

## Add your information

Edit `content/site.json` for your name, optional role/bio/local portrait, contact information, social links, scheduling URL, site URL, owner timezone and approved assistant facts. Add real work to `content/projects.json`, qualifications to `content/credentials.json`, and optional dated updates to `content/logs.json`.

The executable content contract is `src/lib/content-schema.mjs`. Run `npm run validate:content` after editing. Unknown optional values should be omitted, not replaced with placeholder contact details. Use full dates in `YYYY-MM-DD` format. The site timezone is used to interpret date-relative assistant questions.

Writing entries live in `content/writing.json`. Ask the repository-local **add-writing-link** skill to add a publication URL and verified summary, or use:

```sh
npm run writing:add -- --url https://your-platform.example/your-post --title "Your title" --summary "A short, verified summary."
```

Optional flags: `--platform`, `--date`, `--tags` (comma-separated). The CLI validates the collection, updates duplicate destinations in place, and preserves unrelated entries. It does not commit or deploy. The skill can perform a deployment when requested and the project connection exists.

## Enable the assistant

Copy `.env.example` to `.env.local` and configure an OpenAI-compatible provider's base URL, API key and model. The example URL is a configuration example, not a requirement to choose that provider. Consult your provider's model/access documentation. Keys stay server-side.

Before enabling public AI:

1. Configure the provider's actual spending limit or credit budget and alerts.
2. Configure Vercel Firewall/rate limiting for `/api/chat`, with limits appropriate to your budget. Confirm that your plan supports the chosen controls; otherwise leave AI disabled or add a deliberately scoped managed rate-limit store.
3. Set both configuration attestations to `true`, then set `AI_ENABLED=true`.
4. Check grounded answers, unknown facts and failure handling with the real provider.

The flags are fail-closed setup gates, **not a distributed rate limiter or spending enforcement**. The endpoint independently bounds request bytes, message count, message length, output and timeout. Browsing remains usable when AI is disabled or unavailable. Conversation state exists only in the open browser session; messages are sent to the configured external AI provider, whose own retention policy applies.

The assistant cannot read full linked articles, access private calendar events or book a meeting. Source links are selected from the approved content, never taken from arbitrary model URLs. Booking opens the external scheduling URL shared with Contact; that service owns availability, confirmation, cancellation and rescheduling.

## Verify changes

```sh
npx playwright install chromium
npm run typecheck
npm run lint
npm run test:unit
npm run test:e2e
npm run build
```

`npm test` runs the full unit/CLI and browser suites. Playwright launches the app with explicitly local test content and a local OpenAI-compatible provider substitute. These fixture paths are disabled in production. The browser tests exercise the actual server handler and substitute only the external provider boundary. Tests never make real calendar bookings or paid model calls.

If your preview already uses port 3000, run `PLAYWRIGHT_PORT=3002 npm test`. Tests use an isolated `.next-test` output directory so they do not replace the running preview's development assets. Local development explicitly permits the loopback hosts `localhost` and `127.0.0.1`.

## Deploy to Vercel

1. Import `sanketsingh27/portfolio` into your own Vercel account as a Next.js project.
2. Use `npm run build`, which validates content before building. Use the committed lockfile with `npm ci`.
3. Add server environment variables separately for Preview and Production. Leave AI disabled in previews unless intentionally configured with a bounded test account.
4. Set the real `settings.siteUrl` in your content before production launch so canonical links, robots and sitemap point at your domain.
5. Deploy, then verify About, a direct project link, Writing destinations, mobile navigation and Contact. If configured, verify a real assistant answer and scheduling handoff.

Later authorized pushes to the connected deployment branch trigger Vercel builds. A local content edit alone does not publish anything. A failed deployment leaves the last successful deployment live; use Vercel rollback to restore a previous deployment, and revert the relevant content/code commit for a durable correction. The Git history is the backup for repository content; keep the remote current when publishing is requested.

Account access, real biography/projects/contact details, model credentials, scheduling destination and production domain are owner-supplied launch inputs. No production Vercel project or paid provider is created automatically by running the app.

## Specification

The current product contract is [GitHub specification #1](https://github.com/sanketsingh27/portfolio/issues/1). `APP-SPEC.md` summarizes the current architecture and supersedes the historical Convex/CMS plan.
