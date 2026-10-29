import Link from "next/link";
import type { Portfolio } from "@/lib/content";
import { useState } from "react";
import { Empty, External } from "../content-primitives";
import { MissingView as Missing } from "./MissingView";
export function ProjectsView({ data, id }: { data: Portfolio; id?: string }) {
  const [filter, setFilter] = useState("all");

  if (id) {
    const p = data.projects.find((p) => p.id === id);
    if (!p) return <Missing />;
    return (
      <>
        <Link href="/projects" className="back">
          ← Back to projects
        </Link>
        <div className="eyebrow">
          {p.category} /{" "}
          {p.status === "experiment" ? "Experiment" : "Shipped project"}
        </div>
        <h1 className="content-heading">{p.title}</h1>
        <p className="section-intro">{p.summary}</p>
        <div className="long-copy">
          {p.problem && (
            <>
              <h2>The problem</h2>
              <p>{p.problem}</p>
            </>
          )}
          {p.approach && (
            <>
              <h2>The approach</h2>
              <p>{p.approach}</p>
            </>
          )}
          {p.role && (
            <>
              <h2>My role</h2>
              <p>{p.role}</p>
            </>
          )}
          {p.technologies.length > 0 && (
            <>
              <h2>Built with</h2>
              <p>{p.technologies.join(" · ")}</p>
            </>
          )}
          {p.outcomes.length > 0 && (
            <>
              <h2>Outcomes</h2>
              <ul>
                {p.outcomes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        {p.steps.length > 0 && (
          <div className="flow">
            {p.steps.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        )}
        <div className="project-links">
          {p.demoUrl && <External href={p.demoUrl}>Live demo</External>}
          {p.repositoryUrl && (
            <External href={p.repositoryUrl}>Repository</External>
          )}
        </div>
      </>
    );
  }
  const categories = [...new Set(data.projects.map((p) => p.category))];
  const shown = data.projects.filter(
    (p) => filter === "all" || p.category === filter,
  );
  return (
    <>
      <div className="eyebrow">Folder / selected work</div>
      <h1 className="content-heading">The workbench.</h1>
      <p className="section-intro">A collection of projects and experiments.</p>
      {categories.length > 0 && (
        <div className="filters" aria-label="Project filters">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              className={`filter ${filter === c ? "active" : ""}`}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c === "all" ? "All projects" : c}
            </button>
          ))}
        </div>
      )}
      {shown.length ? (
        shown.map((p, i) => (
          <Link key={p.id} href={`/projects/${p.id}`} className="project-row">
            <span className="project-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="description">
              <h2 className="card-title">{p.title}</h2>
              <p>{p.summary}</p>
              <span className="tag">
                {p.category} ·{" "}
                {p.status === "experiment" ? "EXPERIMENT" : "SHIPPED"}
              </span>
            </div>
            <span className="orange">↗</span>
          </Link>
        ))
      ) : (
        <Empty title="A little room for what’s next.">
          No projects have been published yet. Check back for work from the
          bench.
        </Empty>
      )}
    </>
  );
}
