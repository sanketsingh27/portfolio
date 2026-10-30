"use client";

import type { Portfolio } from "@/lib/content";
import { PortfolioHome } from "./PortfolioHome";
import { ProjectsView } from "./views/ProjectsView";
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
  if (section === "chat") return null;
  if (section === "about") return <PortfolioHome data={data} />;
  if (section === "projects") return <ProjectsView data={data} id={id} />;
  if (section === "credentials") return <CredentialsView data={data} id={id} />;
  if (section === "log") return <LogView data={data} id={id} />;
  if (section === "contact" || section === "book")
    return <ContactView data={data} section={section} />;
  return <MissingView />;
}
export default ContentView;
