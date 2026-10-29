"use client";

import type { Portfolio } from "@/lib/content";
import { AboutView } from "./views/AboutView";
import { ProjectsView } from "./views/ProjectsView";
import { WritingView } from "./views/WritingView";
import { CredentialsView } from "./views/CredentialsView";
import { LogView } from "./views/LogView";
import { ContactView } from "./views/ContactView";
import { MissingView } from "./views/MissingView";

export function ContentView({
  data,
  segments,
}: {
  data: Portfolio;
  segments: string[];
}) {
  const section = segments[0] || "about";
  const id = segments[1];
  if (section === "about") return <AboutView data={data} />;
  if (section === "projects") return <ProjectsView data={data} id={id} />;
  if (section === "writing") return <WritingView data={data} />;
  if (section === "credentials") return <CredentialsView data={data} id={id} />;
  if (section === "log") return <LogView data={data} id={id} />;
  if (section === "contact" || section === "book")
    return <ContactView data={data} section={section} />;
  return <MissingView />;
}
export default ContentView;
