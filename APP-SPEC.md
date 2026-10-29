# Sanket’s Desktop — Current Application Specification

-

+The authoritative specification is [GitHub issue #1](https://github.com/sanketsingh27/portfolio/issues/1), with 48 user stories and the approved browser-level testing approach. +
+## Current scope +
+- Preserve the warm paper desktop, illustrated icons, one active window, dock and responsive layout from [desktop-prototype.html](./desktop-prototype.html).
+- Build with Next.js App Router, React and TypeScript, hosted on Vercel.
+- Maintain public information in versioned local JSON files; no Convex, admin CMS or mandatory database.
+- About, Projects, Credentials and Contact show real supplied information or honest empty states.
+- Writing shows title, short summary, platform and a link to the original external publication. Full articles remain on the original platform.
+- The [add-writing-link skill](./.agents/skills/add-writing-link/SKILL.md) maintains [content/writing.json](./content/writing.json), validates changes and deploys when requested through the established workflow.
+- Optional Daily Log entries carry actual full dates. No posting cadence is required.
+- Explore with me uses a Vercel server endpoint and a configurable external AI provider, with trusted context built from approved public information. Chat state remains in the current browser session.
+- Booking hands off to a configured scheduling page. This release does not inspect live calendar availability or create meetings itself. +
+## Verification contract +
+Browser journeys cover desktop controls/history, writing links, project filters/details, chat and scheduling destinations. The AI provider boundary is substituted in automated tests; a real-provider smoke check is required before enabling public AI. Narrow CLI/content and public-request tests cover invalid data and trust boundaries. +
+## Launch configuration +
+Supply actual biography, work, qualifications, email/social links, writing links, optional portrait, provider/model credentials, spending limits, suitable server-side abuse controls, scheduling URL and site domain. Keep unconfigured integrations disabled; do not substitute fictional achievements or availability. +
+See [README.md](./README.md) for development, content maintenance, validation and Vercel deployment instructions. The executable content schema is [content-schema.mjs](./src/lib/content-schema.mjs). +
+## Superseded decisions +
+The original full-CMS/Convex specification was replaced by the local-content workflow discussed with the owner and published in issue #1. Hosted blog editors, draft revisions, scheduled publishing, persistent chat storage, owner login and custom calendar booking are out of scope. The HTML prototype remains the visual reference, not a source of verified personal facts. +
