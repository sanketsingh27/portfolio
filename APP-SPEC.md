# Sanket’s Desktop — Full Application Specification

Status: build specification, not an implemented application.
Created: 28 October 2026.
Visual and interaction reference: [desktop-prototype.html](./desktop-prototype.html).

## Scope update — external writing and simpler hosting

**This update takes precedence over conflicting requirements below.** The original full-CMS/Convex design is retained below as historical context, not a requirement to build those superseded features.

### Confirmed writing direction

Sanket publishes on external social networks or publishing platforms. The portfolio curates links to that work; it does not host full blog articles.

**Confirmed maintenance workflow:** use the repository-local [add-writing-link skill](./.agents/skills/add-writing-link/SKILL.md) to maintain [content/writing.json](./content/writing.json). The owner supplies a publication link and any available title/summary; the agent verifies missing metadata, edits the collection, validates it, and deploys when requested using the configured Vercel workflow. No admin publishing interface is needed for Writing. The collection starts empty rather than containing fictional publications. Frontend integration and Vercel deployment setup remain implementation work.

- Keep the Writing / Blog desktop section, showing cards with title, a short owner-written summary, platform, external URL, optional date, tags and thumbnail/alt text.
- Clicking a card opens the original HTTPS publication in a new tab with `rel="noopener noreferrer"` and an accessible indication that it opens externally.
- Validate links and omit unknown metadata rather than inventing dates or reading times. Summaries describe only information actually supplied or verified.
- Use `/writing` as the shareable index. Internal article routes, article bodies, rich-text editors, post revisions, draft previews, scheduled publishing and a hosted-blog RSS feed are removed from initial scope.
- Do not automatically scrape or republish external articles. An external URL alone does not give the assistant knowledge of its contents: it may use the supplied title/summary and link to the original.
- Daily Log remains a separate optional feature; removing hosted blogs does not by itself authorize removing the log. Do not require a daily posting routine.

### Recommended architecture proposal — Vercel without Convex

The owner has asked whether Convex can be removed. **Yes; the following is a proposed replacement, pending the owner's architecture choice.** The earlier mandatory-Convex requirement should not be treated as a settled current decision while this change is being discussed.

```text
Versioned content files → Next.js portfolio on Vercel
Visitor chat → Vercel server function → AI provider → streamed reply
Book a call → configured external scheduling service
```

- Store profile, projects, credentials, writing links and approved assistant facts in typed repository content files. Updating a link means editing one entry and redeploying through the connected Git workflow.
- No admin CMS, owner authentication, database, uploads dashboard or persisted chat history is necessary for this initial version. This trades the previous no-redeploy publishing workflow for lower maintenance.
- Use a Vercel-hosted Next.js server route and AI SDK for chat, with model credentials server-side. Supply a bounded context containing approved public facts and writing summaries. Keep conversation context in the current browser session; treat client history as untrusted input.
- Limit message length, context size and output; use provider spend caps plus suitable server-side abuse controls before enabling public chat. Per-instance memory is not a reliable distributed rate limiter. Add managed durable storage only if enforceable shared quotas or persisted sessions become necessary.
- Start booking with an owner-configured external scheduling page. The assistant can offer its link but must not claim to know live availability or confirm a booking. The scheduling service checks availability and completes the booking.
- Live availability inside chat is a later integration. It needs the scheduling/calendar provider API and server-side credentials. Direct booking also requires durable state and duplicate/conflict handling; Vercel hosting alone does not supply that state.
- Vercel Functions can call and stream responses from an external model; Vercel hosting does not itself replace the AI model or a calendar service.

References: [Vercel streaming functions](https://vercel.com/docs/functions/streaming-functions), [AI Gateway SDKs and APIs](https://vercel.com/docs/ai-gateway/sdks-and-apis), [Vercel storage options](https://vercel.com/docs/storage).

### Revised first slice and acceptance

Start with the desktop shell and a Writing card linking to a real external publication. If the Vercel-only proposal is selected, replace the remaining legacy Convex-specific sections with the repository-content and server-function contracts before implementation.

- [ ] Writing cards show accurate summaries and open the correct original publication.
- [ ] No hosted article editor or publishing workflow is required.
- [ ] Assistant answers from approved facts and summaries, without pretending to have read linked articles.
- [ ] Booking link works without chat; no live availability is asserted without a provider lookup.
- [ ] Choose repository edits versus a future CMS, and scheduling-link versus in-chat booking, before building those integrations.

## 1. The product in one minute

Build a personal portfolio that feels like exploring Sanket’s desktop. Visitors can browse projects, read writing and daily updates, verify credentials, ask an AI assistant about Sanket, and arrange a call.

**Required stack decisions:** Convex is the source of truth for all editable content and application data. Vercel hosts the frontend. AI and calendar integrations run through the backend.

**Proposed implementation defaults:** Next.js App Router, React, TypeScript, plain CSS with reusable design tokens, Convex database/functions/file storage, and a private owner admin interface. Use Google Calendar as the initial calendar adapter; the calendar provider, authentication provider, and AI provider still need owner selection before their integration work begins.

**Start here:** build one complete publishing flow: owner signs in → writes a blog draft → previews → publishes → visitor reads it in the Writing window and at its shareable URL. This proves the core architecture before AI is added.

## 2. Current prototype and production gaps

The reference is a standalone HTML/CSS/JavaScript demonstration. It has no application framework, package scripts, database, authentication, real AI connection, or calendar integration.

| Prototype behavior | Production requirement |
| --- | --- |
| About opens on initial load | Load published profile from Convex; preserve initial About view |
| Projects, Daily Log, Writing, Credentials desktop icons | Keep these four primary icons and their recognizable illustrations |
| Contact, GitHub, LinkedIn, X dock | Use owner-managed, validated destinations; hide missing links |
| One active window with a title, path, minimize and close | Preserve this model; multiple simultaneous windows are outside initial scope |
| Desktop titlebar dragging | Keep pointer dragging on larger screens; bound it to usable viewport space |
| Mobile window uses normal flow | Preserve mobile adaptation; improve reading space and keyboard behavior |
| `projects` array, `logs` object, essay and credential template functions | Replace editable content with Convex documents and typed queries |
| `guide(command)` matches regular expressions | Replace with contextual chat and validated navigation tools |
| Fixed October 2026 dates and day numbers | Use real dates, full date keys, owner timezone, and published records |
| Fictional Thread, Relay, Fieldnotes and sample credentials | Development fixtures only; never present as real achievements |
| `hello@example.com`, service homepages, portrait initials | Supply verified owner information or show intentional empty states |
| “SCRIPTED GUIDE · NO AI CONNECTION” | Show accurate AI status and a clear assistant identity when connected |

The other file, `prototype.html`, is an alternate concept. `desktop-prototype.html` controls the initial product direction.

## 3. Scope and capability map

| Module | Responsibility | Depends on |
| --- | --- | --- |
| `owner-access` | Owner authentication, permissions, protected integrations | — |
| `content` | Public profile, projects, posts, logs, credentials, media and settings | owner-access for writes |
| `desktop` | Desktop shell, routes, readable views and navigation | content |
| `assistant` | Visitor sessions, published-content answers, navigation cards | content, desktop navigation contract |
| `booking` | Availability rules, calendar adapter, booking lifecycle | owner-access |
| `assistant-booking` | Availability and booking tools inside chat | assistant, booking |

Build order: owner-access → content + desktop → assistant + booking → assistant-booking.

Initial release includes all six portfolio sections, owner publishing, text chat, live availability, and confirmed booking. Public visitor accounts are unnecessary. Comments, subscriptions, payments, voice chat, multiple owners, and a multi-window operating system are later extensions.

## 4. Visual and interaction contract

Preserve the warm paper desktop rather than replacing it with a generic portfolio layout.

| Token | Reference value |
| --- | --- |
| Paper | `#f1eee5` |
| Ink | `#302f29` |
| Muted | `#77756b` |
| Divider | `#d7d3c6` |
| Accent | `#b44e2d` |
| Window surface | `#fcfbf5` |
| Headings | Georgia / Times New Roman, regular weight |
| Body | System sans-serif |
| Labels | System monospace |

Keep the dotted wallpaper, “stay curious.” lettering, small desktop objects, warm titlebars, restrained shadows, bottom dock, and “Explore with me” entry point. Owner-editable wallpaper copy lives in Convex; design tokens and SVG interface assets live in source code.

- Initial route opens About. Brand button returns to About.
- Minimize hides the window and preserves the current view; opening the same app restores it.
- Close reveals the desktop empty state and restores focus to a sensible trigger.
- Switching apps resets their detail view predictably; Back returns to the relevant list and preserves useful filters.
- Escape closes the active dismissible layer first. Do not close a window while the visitor is editing chat text or completing a confirmation without preserving that state.
- Keep dragged windows reachable after resizing. Dragging cannot be the only way to access content.
- Use links for navigable destinations and buttons for local actions. Browser Back/Forward must match visible navigation.
- At widths near the prototype’s 650px breakpoint, disable dragging, use normal document flow, and allow long content to scroll naturally.
- Expanded chat on mobile becomes a dedicated panel; the dock, keyboard and composer must not cover reading or booking controls.
- Support 320px phones, tablets, desktop, 200% zoom, keyboard navigation, visible focus, meaningful labels, and reduced motion. Target WCAG 2.2 AA.
- Decorative text and illustrations should not clutter the screen-reader reading order. Announce message completion and action results without reading every streaming token.

## 5. Screens and content requirements

### About

Published name, role, short introduction, longer bio, portrait and alt text, optional location and public work preferences. Include Contact and Open the workbench actions. Resume link is optional and only appears when a real file is supplied.

### Projects / workbench

Paginated ordered list, category filters such as All / AI / Web, title, summary, tags and project detail. Each detail supports problem, approach, owner role, technologies, process steps, images with alt text, outcomes with evidence, real demo/repository links, related posts and daily logs. Clearly distinguish experiments from shipped work. Support featured ordering and archived projects.

### Daily Log

Date navigation, title, ordered update bullets, related projects/posts and optional external links. Use full `YYYY-MM-DD` dates in the owner’s timezone. The seven-date strip may remain as a navigation pattern, but visitors must be able to reach older entries across months and years.

“Yesterday” means the previous calendar day in the owner’s timezone. If no entry exists, say so and offer the latest published update; never silently label another date as yesterday.

### Writing / blog

Writing is a curated index of external publications. Each card shows a title, short summary, platform and original URL, with optional tags, date and thumbnail. Open the original in a new tab and indicate that behavior accessibly. There is no hosted article body or blog editor. See the scope update above for the current requirements; legacy publishing requirements elsewhere in this document are superseded for Writing.

### Credentials

Title, issuer, issue date, optional expiration date, description, certificate file/image and verification URL. Missing verification must be shown honestly. Do not turn prototype examples into asserted qualifications.

### Contact and booking

Show verified public email, supplied social links, work inquiry preferences and a Book a call action. A contact form is optional; direct email and booking cover the initial scope. If no calendar connection exists, keep email available and say booking is unavailable.

## 6. Routes, sharing and search engines

| Route | Opens |
| --- | --- |
| `/` | Desktop with About |
| `/about` | About window |
| `/projects` | Workbench |
| `/projects/[slug]` | Project detail |
| `/log` and `/log/[date]` | Daily log list / selected date |
| `/writing` and `/writing/[slug]` | Blog index / article |
| `/credentials` and `/credentials/[slug]` | Credential list / detail |
| `/contact` | Contact |
| `/book` | Booking flow, usable without chat |
| `/admin` | Authenticated owner dashboard |
| `/admin/[section]` | Content, media, assistant or booking management |

All public deep links must work on direct load, refresh, sharing and browser history. Render public content in the desktop shell, with an expanded reading mode for long articles. SEO metadata, canonical URLs, social previews, sitemap and RSS must derive from published Convex content. Unknown/unpublished items return a real 404 to public visitors. Keep slug redirects when an existing public slug changes.

## 7. Architecture and ownership

```text
Visitor browser
   ├── Next.js frontend on Vercel
   │      └── server-rendered public content from Convex
   └── Convex client: live queries + authenticated/session-bound requests
          ├── Database: published content, drafts, chats, bookings
          ├── Storage: owner-uploaded images, certificates, resume
          ├── Queries/mutations: validated reads and transactional writes
          └── Actions: AI provider, calendar API, external delivery

Owner admin → verified owner identity → Convex-protected publishing
```

Vercel serves the frontend; Convex remains a separately deployed backend. A Vercel deployment does not move the Convex database into Vercel. All editable information, including future blog entries, must originate in Convex rather than hardcoded frontend arrays, local JSON, or repository Markdown files.

Queries handle bounded reads. Mutations handle transactional database changes. External AI/calendar requests belong in actions, which access database data through queries/mutations. This follows the [Convex action model](https://docs.convex.dev/functions/actions).

Avoid unnecessary Next.js API wrappers for standard Convex operations. A small server endpoint may be used where required for secure session issuance, abuse protection or OAuth callbacks, with business data and state still owned by Convex.

## 8. Proposed Convex data model

This is a schema contract for implementation, not existing schema code. Validate arguments and return shapes; use typed IDs for relations, explicit optional fields and indexes for actual access patterns.

| Table | Core fields / role | Required access paths |
| --- | --- | --- |
| `ownerAccounts` | Trusted auth issuer + subject, role; provisioning restricted | by identity |
| `siteSettings` | Singleton key, public branding/contact/socials, owner timezone, feature flags | by key |
| `profiles` | Published owner bio, role, portrait asset, work preferences | by owner/key |
| `projects` | Stable ID, slug, category, sort order, visibility, published revision ID | by slug; visibility + sort |
| `posts` | Stable ID, slug, tags, publishedAt, visibility, published revision ID | by slug; visibility + publication date |
| `dailyLogs` | Full local date, visibility, published revision ID | by date; visibility + date |
| `credentials` | Slug, issuer, sort order, visibility, published revision ID | by slug; visibility + sort |
| `contentRevisions` | Parent ID/type, revision number, structured body, draft/published state, timestamps, editor | by parent + revision |
| `contentRelations` | Source and target IDs/types for related public content | by source; by target |
| `assets` | Storage ID, kind, MIME type, size, dimensions, alt text, visibility, ownership | by storage ID; owner + createdAt |
| `redirects` | Previous public path, destination path | by previous path |
| `assistantSettings` | Model config, enabled state, approved FAQ/public facts, limits | singleton key; public/private projections |
| `knowledgeChunks` | Published source ID, revision, text, optional embedding, active flag | by source + revision; search index |
| `chatSessions` | Opaque session binding, createdAt, expiresAt, consent version | by session binding; expiry |
| `chatMessages` | Session ID, role, content, citations, tool status, request ID | by session + createdAt; request ID |
| `bookingSettings` | Timezone, working hours, duration, buffers, lead time, horizon, exceptions | singleton key |
| `calendarConnections` | Provider/account references and protected credential reference | owner only |
| `bookings` | Session ID, UTC start/end, visitor timezone, private name/email/topic, status, provider event ID, request key | by time/status; session; request key |
| `rateLimits` | Bound session/abuse key, window, usage | by key + window |
| `auditEvents` | Actor, operation, record reference, timestamp; no secret payloads | actor/time; resource/time |

Common content fields: `createdAt`, `updatedAt`, `publishedAt`, status, revision, SEO title/description and optional social image. Use UTC timestamps for instants and IANA timezone identifiers for conversion rules. Slugs must be unique within their collection, enforced by mutations rather than assuming indexes are unique constraints.

Keep credentials, calendar tokens, visitor contact details, drafts and private settings out of public query responses. Public queries must explicitly project allowed fields; do not return complete private records to filter on the client.

## 9. Owner CMS and publishing contract

The owner should publish a blog or update without a code change or Vercel redeploy.

1. Authenticate using a supported Convex identity integration; no public self-service owner registration.
2. Every protected Convex function verifies identity and owner authorization. Hiding `/admin` is insufficient.
3. Dashboard shows drafts, published content, upcoming scheduled posts, recent failures and booking connection status.
4. Editors provide validation, explicit save state, revision conflict detection, preview and publish controls.
5. Publishing atomically switches the published revision and records an audit event. Related-content projections resolve only currently public targets.
6. Scheduled jobs verify the intended revision, schedule version and current status before publishing; canceled/changed schedules must not publish stale drafts.
7. Public queries, search, feeds and assistant retrieval must exclude drafts, future publications and archived/unpublished content.
8. Publish/update/unpublish invalidates relevant caches and updates the assistant’s eligible knowledge. Stale chunks must be filtered against current source visibility/revision even if re-indexing is pending.
9. Confirm destructive deletion and explain affected references. Archive is the default for previously published material.

Uploads require owner authorization, size/type validation and tracked ownership. Private draft uploads must not become public through a shared storage URL. Publish public media deliberately; serve private preview assets through authorized access. Revoke/delete public assets when privacy requires it, accounting for downstream caches.

## 10. “Explore with me” AI assistant

### Visitor experience

Keep the compact entry panel and familiar suggestions. Expand into a scrollable conversation with messages, timestamps where useful, response status, relevant content cards, Stop, Retry and Clear conversation. Suggestions: “Show AI projects”, “Latest writing”, “What did you build yesterday?” and “Book a call”.

The assistant introduces itself as Sanket’s AI assistant. It speaks about Sanket rather than impersonating him. It answers from published profile/projects/posts/logs/credentials and explicitly approved FAQ facts. It must say when information is missing, rather than inventing experience, prices, results or availability.

### Backend flow

1. Establish a server-verified anonymous session; an arbitrary client-supplied session ID is not authorization.
2. Enforce message size, session lifetime, concurrent-request and usage limits before model work.
3. Retrieve relevant published content and current revisions from Convex. For a small corpus, bounded structured retrieval is sufficient; add text/vector search when needed.
4. Call the selected model from a Convex action using server-side credentials. Convex stores context and orchestrates calls; a separate AI provider runs inference.
5. Save incremental response batches to Convex and subscribe from the UI for progressive output. Avoid a database write for every token. Stop/cancel state must prevent further tools and delivery; propagate cancellation to the provider when supported.
6. Return citations pointing to real public routes and cards for relevant content.
7. Record bounded usage/latency/error metadata, excluding secrets and unnecessary message content.

### Allowed tools

| Tool | Contract |
| --- | --- |
| `findPublishedContent` | Bounded query against current public records |
| `openPortfolioView` | Typed allowlisted section or existing public slug; client performs navigation |
| `getAvailability` | Calls the booking service for a requested date range/timezone |
| `prepareBooking` | Validates a proposed slot and produces a confirmation summary |
| `confirmBooking` | Requires an explicit visitor confirmation tied to the exact slot and details |

Validate tool inputs on the server. Never execute arbitrary model-supplied URLs, database functions or code. Content and visitor messages are untrusted instructions; they cannot grant admin access or widen tool permissions. The assistant cannot publish content, expose private calendar events, or claim a successful booking before provider confirmation.

If AI is unavailable or limited, browsing remains usable. Show a clear retry state and offer Contact/Book a call directly.

## 11. Availability and booking

The Booking view and chat must call the same backend booking service.

### Availability rules

- Owner configures calendar provider, booking timezone, working days/hours, call duration, buffers, minimum notice, maximum advance window and date exceptions.
- Availability = configured bookable windows minus provider busy intervals, buffers, active local holds and confirmed local bookings.
- Ask for/confirm visitor timezone; show date, time, timezone and duration on every slot/confirmation. Handle daylight saving changes correctly.
- Calendar-free does not automatically mean owner-available. Do not reveal busy event titles, attendees or descriptions.
- If provider access fails, report unavailable; never substitute invented slots. Keep cached suggestions short-lived and recheck before confirmation.

### Booking sequence

```text
Choose date/timezone → show live slots → choose slot
→ collect name/email/topic → show exact confirmation summary
→ visitor confirms → reserve and recheck → create calendar event
→ confirm booking + invitation status
```

Use states `held`, `confirming`, `confirmed`, `failed`, `expired`, `canceled`, and `reconciliation_required` where an external outcome is uncertain. Short holds expire automatically.

- Use a transactional Convex mutation to reject overlapping active local reservations and create a hold. Do not rely on a disabled button to prevent duplicates.
- The action rechecks external availability immediately before event creation. External calendar writes and Convex writes are not one atomic transaction; conflicts outside this app remain possible and require reconciliation.
- Use a stable request key and provider-compatible event ID/deduplication strategy. Retrying the same confirmation must not create a second meeting.
- If an external timeout might have followed successful event creation, look up/reconcile that event before retrying. Do not simply release the hold and create another event.
- Store provider event ID and only show success after event creation is verified. Distinguish meeting creation from invitation delivery if delivery cannot be verified.
- Include the call link only if actually generated. Notify both parties through verified provider capabilities.
- Provide secure, expiring cancellation/rescheduling links or clear owner-contact instructions at launch. Rescheduling must recheck availability; it must not accidentally create a second active booking.
- Disconnecting the calendar revokes access and disables new bookings without breaking public browsing.

Google Calendar offers separate [free/busy queries](https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query) and [event creation](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert). Request the least permissions needed, keep OAuth refresh credentials server-side, validate callback state, and handle revoked access.

## 12. Proposed public function contracts

Names below are intended module/function names, not existing callable APIs.

| Function family | Access and behavior |
| --- | --- |
| `site.getPublic`, `profile.getPublic` | Public, allowlisted fields |
| `projects.listPublished/getBySlug` | Public, validated filters and pagination |
| `posts.listPublished/getBySlug` | Public, only live published revision |
| `dailyLogs.listPublished/getByDate` | Public, full local date validation |
| `credentials.listPublished/getBySlug` | Public, verified link fields |
| `admin.*` save/preview/publish/archive/upload | Authenticated owner only |
| `assistant.sendMessage/stop/getMessages` | Session-bound, bounded and rate-limited |
| `booking.getAvailability/prepare/confirm` | Session-bound actions; explicit confirmation required |
| `booking.cancel/reschedule` | Verified owner or scoped signed visitor capability |
| Calendar credentials, indexing, scheduling, audit helpers | Internal functions only |

All list functions paginate; choose indexes before adding collection scans. Return stable machine-readable errors such as `UNAUTHORIZED`, `NOT_FOUND`, `RATE_LIMITED`, `PROVIDER_UNAVAILABLE`, `REVISION_CONFLICT` and `SLOT_UNAVAILABLE`, with readable UI messages.

## 13. Rendering, freshness and performance

- Server-render meaningful published content for direct loads and SEO; hydrate interactive desktop controls and subscribe only where useful.
- Convex documents [`preloadQuery` and `usePreloadedQuery`](https://docs.convex.dev/client/nextjs/app-router/server-rendering) for initial data plus reactivity. Its preload path uses `no-store`; do not assume these routes are automatically static CDN pages. Confirm current integration stability when implementing.
- Default to fresh server reads for published content and reactive updates in open views. Introduce static/ISR caching only with explicit publish/unpublish invalidation, authenticated invalidation endpoints and a tested bounded freshness target.
- Public content should update within 5 seconds after a successful publish in an online subscribed view. New page loads must respect current publication state; do not serve stale drafts or newly private records through caches.
- Cache static code, fonts and decorative assets through Vercel. Optimize public image sizes and reserve dimensions to avoid layout jumps. Keep private media out of public image caches.
- Lazy-load chat/provider-heavy code and fetch detail bodies when opened. Do not ship the full blog corpus, chat history or admin code in the initial portfolio bundle.
- Measure mobile performance: target LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 under representative conditions. These are acceptance targets, not guarantees from choosing Vercel.
- Measure AI response-start latency and calendar latency separately; both depend on external providers. Initial goal: visible progress immediately and useful AI output starting within 5 seconds under normal provider operation.

## 14. Project structure and development conventions

```text
src/app/                 Public routes, metadata, admin routes
src/components/desktop/  Shell, titlebar, icons, dock, window state
src/components/content/  Profile, project, article, log, credential views
src/components/chat/     Conversation, sources, tool and booking cards
src/components/admin/    Editors and publishing controls
src/lib/                 Shared validation, timezones, navigation contracts
src/styles/              Prototype-derived tokens and responsive styling
convex/schema.ts         Validated tables and indexes
convex/                  Content functions, auth checks, AI/booking actions
convex/lib/              Private backend helpers and provider adapters
tests/                   Domain and backend tests
e2e/                     Browser journeys
public/                  Static interface assets only
APP-SPEC.md              This product/build contract
desktop-prototype.html   Preserved visual reference
```

Use strict TypeScript, camelCase function/variable names, PascalCase React components, typed generated Convex API references and small modules organized by capability. Keep business validation in backend functions rather than duplicating trust decisions in the UI.

Example shared interface style:

```ts
type PortfolioDestination =
  | { section: "about" | "contact" | "writing" | "projects" }
  | { section: "project" | "post"; slug: string }
  | { section: "log"; date: string };
```

Planned local commands after scaffolding (not executable in the current HTML-only folder):

```sh
npm install
npx convex dev
# In a second terminal:
npm run dev

# Required package scripts to establish:
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Use Vitest for domain/backend tests, Convex-compatible function testing for authorization and transactional logic, and Playwright for key browser journeys. Establish these scripts in the implementation; do not report them as passing before the app exists.

## 15. Vercel / Convex deployment contract

Use separate development, preview and production data. Preview builds must never silently target production writes, real owner calendar actions or unrestricted AI spending.

1. Create the Next.js app and Convex project, configure local development and generated types.
2. Connect the repository to Vercel and provision production Convex deployment.
3. Follow the [official Convex/Vercel deployment guide](https://docs.convex.dev/production/hosting/vercel). Its documented build command is:

   ```sh
   npx convex deploy --cmd 'npm run build'
   ```

4. Set the production `CONVEX_DEPLOY_KEY` only in Vercel’s Production environment. Use the documented preview deployment flow and preview credentials for previews. Configure frontend Convex URL injection for the selected Next.js setup and verify it points at the deployment just built.
5. Configure the chosen auth issuer/audience, permitted owner identity, OAuth callbacks, allowed origins and site URL per environment.
6. Store AI and calendar secrets in the backend environment where actions execute. Never use `NEXT_PUBLIC_` for secrets.
7. Configure the domain, canonical site URL, HTTPS and real social links; test direct deep links, RSS, sitemap and metadata on the deployed domain.
8. Smoke-test publish → public route → assistant citation, and calendar availability → one real controlled test booking → cancellation.
9. Record rollback procedure for frontend/functions and take a verified content backup/export before data migrations. An older frontend must not be paired blindly with incompatible schema changes.

| Configuration | Location / exposure |
| --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | Frontend environment; public endpoint, not a secret |
| `CONVEX_DEPLOY_KEY` | Vercel deployment secret with environment-specific scope |
| `CONVEX_DEPLOYMENT` | Local CLI configuration generated by setup where applicable |
| Public site URL | Vercel frontend / backend as needed; public |
| Auth issuer/audience and trusted owner ID | Provider-specific configuration; verify identity server-side |
| AI model and provider credential | Convex backend environment; secret credential |
| Calendar client credentials / refresh credential | Backend secret environment or protected encrypted secret store |
| Abuse protection/signing credentials | Relevant server environment only |

Names for provider-specific variables must be finalized after those providers are selected; the table does not imply credentials already exist.

## 16. Privacy, reliability and operational requirements

- Anonymous chat sessions are isolated; guessing another session identifier must not reveal its messages or bookings.
- Default proposal: expire chat content after 7 days, with a visitor Clear conversation action that deletes session history. Owner must confirm retention and privacy copy before public AI launch.
- Booking contact information is private, used for the requested meeting only, and excluded from model retrieval, public queries and routine logs. Define booking/audit retention before launch.
- Apply session and abuse-based rate limits, message/context caps, model output limits and a global daily AI budget. A client-generated session ID alone cannot enforce a global abuse limit. Choose concrete limits before AI launch and test budget exhaustion behavior.
- Add a brief notice explaining AI processing, chat retention and calendar booking data at the point of use.
- Capture provider failures, latency, usage, publishing errors and stuck booking states. Expose useful owner diagnostics without logging secrets or full private records.
- Monitor environment/provider connectivity and provide an owner-accessible AI/booking disable switch.
- Handle loading, empty, offline, permission-denied, validation, timeout and retry states for every network-dependent screen. Core portfolio navigation must remain available during AI failure.

Boundaries: always validate inputs, check backend authorization and preserve published/draft separation. Confirm new paid providers, retention choices or expansion beyond this scope with the owner. Never commit secrets, fabricate personal claims, trust model output as authorization or connect preview booking flows to real calendar writes by default.

## 17. Acceptance checklist

### Portfolio and publishing

- [ ] Desktop matches the reference’s visual identity at phone, tablet and desktop sizes.
- [ ] All six sections use Convex content; no production dependency on sample arrays.
- [ ] Window open/minimize/restore/close, keyboard focus and browser history behave consistently.
- [ ] Owner creates, previews and publishes a blog without redeploying Vercel.
- [ ] Editing a published post leaves its previous revision visible until republished.
- [ ] Unpublished content stays out of public queries, HTML, feeds, search and AI answers.
- [ ] Scheduled publishing, rescheduling and canceled schedules publish only the intended revision.
- [ ] Full-date logs work across month/year boundaries; yesterday handles missing entries correctly.
- [ ] Direct links, refreshed detail pages, metadata, canonical URLs, RSS and sitemap work.
- [ ] Empty/missing content and links render honestly; fictional fixtures never appear as real work.

### AI and booking

- [ ] Chat answers verified questions with current sources and handles unknown facts honestly.
- [ ] Follow-up questions retain context; Stop, Retry and Clear conversation work.
- [ ] Navigation tools can open only allowlisted destinations for published records.
- [ ] Publication changes remove stale/private content from subsequent retrieval and tool results.
- [ ] Another session cannot read chat history, booking details or private contact information.
- [ ] Availability respects working hours, busy intervals, buffers, notice, exceptions and timezones.
- [ ] DST transitions and owner/visitor timezone differences are covered by meaningful tests.
- [ ] Booking requires exact visitor confirmation and a fresh availability check.
- [ ] Concurrent attempts and duplicate retries do not create duplicate local bookings/events.
- [ ] Provider timeouts after event creation are reconciled without a second meeting.
- [ ] Revoked calendar access, AI outages and exhausted usage budgets have useful fallbacks.

### Deployment and quality

- [ ] Lint, type checks, meaningful backend/domain tests, browser journeys and production build pass.
- [ ] Backend tests prove owner-only writes, public field filtering and draft protection.
- [ ] Mobile browser QA covers keyboard-open chat, long articles and booking confirmations.
- [ ] Keyboard navigation, reduced motion, contrast and focus behavior are checked.
- [ ] Performance targets are measured on representative public pages.
- [ ] Production and previews use isolated backend/provider configuration.
- [ ] No secrets appear in browser bundles, public query results or logs.
- [ ] Backup/export and restore procedure, diagnostics and rollback instructions are documented.

## 18. Delivery milestones

| Order | Deliverable | Completion evidence |
| --- | --- | --- |
| 1 | Next.js + Convex + owner access; one blog publishing flow | Real draft/publish/read cycle on a preview |
| 2 | Complete desktop and all content editors/routes | Every prototype section uses live Convex data |
| 3 | Published-content assistant and navigation tools | Grounded answers, citations, isolation and limits pass |
| 4 | Standalone booking service and view | Availability + confirmed booking + retry/reconciliation tests |
| 5 | Booking tools in chat | Same booking contract works through conversation |
| 6 | Production readiness | Accessibility, performance, SEO, privacy and deployment checks pass |

## 19. Inputs still needed

These inputs do not prevent building the desktop/content foundation. They gate the associated content or external integration before public release.

- **Real content:** approved bio, portrait, actual projects and outcomes, first writing/log entries, real credentials, email, social URLs and optional resume.
- **Accounts:** repository, Vercel project, Convex project and production domain.
- **Owner access:** preferred auth provider and exact trusted owner identity.
- **AI:** provider/model, spending limit, approved public FAQ and retention choice.
- **Booking:** calendar provider/account, timezone, working hours, call duration, buffers, notice, horizon and cancellation policy.

Do not silently substitute mock data, fake availability or production credentials for missing inputs. Keep incomplete integrations disabled with a clear fallback until configured.

## 20. Official implementation references

Technical recommendations were checked against these primary sources on 28 October 2026. Recheck provider APIs and integration guidance when implementation starts.

- [Convex with Vercel](https://docs.convex.dev/production/hosting/vercel) — frontend/backend deployment integration.
- [Convex actions](https://docs.convex.dev/functions/actions) — external service calls and indirect database access.
- [Convex Next.js server rendering](https://docs.convex.dev/client/nextjs/app-router/server-rendering) — initial rendering, reactivity and caching implications.
- [Convex authorization in functions](https://docs.convex.dev/auth/functions-auth) — verified server-side identity.
- [Google Calendar free/busy](https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query) — busy interval lookup.
- [Google Calendar event creation](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert) — confirmed meeting creation.
