import type { Portfolio } from "./content";

export function resolveView(segments: string[], data: Portfolio) {
  const section = segments[0] || "about";
  const id = segments[1];
  if (segments.length > 2) return null;
  const titles: Record<string, string> = {
    about: "About",
    projects: "Projects",
    contact: "Contact",
    book: "Book a call",
    log: "Daily Log",
    chat: "Ask anything about Sanket",
  };
  if (!(section in titles)) return null;
  if (!id)
    return {
      title: titles[section],
      description:
        section === "about"
          ? data.profile.bio ||
            `Explore ${data.profile.name}’s work and experience.`
          : `${titles[section]} from ${data.profile.name}.`,
    };
  const detail =
    section === "projects"
      ? data.projects.find((item) => item.id === id)
      : section === "credentials"
        ? data.credentials.find((item) => item.id === id)
        : section === "log"
          ? data.logs.find((item) => item.date === id)
          : null;
  return detail
    ? {
        title: detail.title,
        description:
          "summary" in detail
            ? detail.summary
            : `${detail.title} — ${data.profile.name}`,
      }
    : null;
}
