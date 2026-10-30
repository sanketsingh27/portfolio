import Link from "next/link";
import type { Portfolio } from "@/lib/content";

function Eyes({ className = "" }: { className?: string }) {
  return (
    <span className={`d2-creature ${className}`} aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

function ProjectArt({ id, title }: { id: string; title: string }) {
  const kind =
    id === "noro" ? "voice" : id === "bibi" ? "research" : "matching";
  return (
    <div
      className={`d2-art d2-art-${kind}`}
      aria-label={`${title} concept diagram`}
    >
      <span className="d2-tape" aria-hidden="true" />
      <div className="d2-art-top">
        <span>{title.toLowerCase()}</span>
        <span>CONCEPT DIAGRAM</span>
      </div>
      {kind === "voice" ? (
        <>
          <div className="d2-voice-title">
            A little less noise.
            <br />
            <em>A little more done.</em>
          </div>
          <div className="d2-wave" aria-hidden="true">
            {[
              12, 26, 42, 24, 57, 70, 40, 25, 52, 65, 32, 17, 35, 50, 22, 12,
            ].map((h, i) => (
              <i key={i} style={{ height: h }} />
            ))}
          </div>
          <div className="d2-diagram-line">
            <span>Voice input</span>
            <b>→</b>
            <span>Tasks + schedule</span>
          </div>
        </>
      ) : kind === "research" ? (
        <>
          <div className="d2-research-title">
            Find the signal
            <br />
            in the feedback<span>✳</span>
          </div>
          <div className="d2-review-notes">
            <span>
              App Store
              <br />
              reviews ↗
            </span>
            <span>
              Evidence-backed
              <br />
              insights ↗
            </span>
          </div>
          <div className="d2-diagram-line">
            <span>Collect</span>
            <b>→</b>
            <span>Understand</span>
            <b>→</b>
            <span>Build</span>
          </div>
        </>
      ) : (
        <>
          <div className="d2-match-title">
            Your next
            <br />
            <em>{id === "onward" ? "onward." : "opportunity."}</em>
          </div>
          <div className="d2-match-flow">
            <span>
              YOUR
              <br />
              <b>RESUME</b>
            </span>
            <span className="d2-match-symbol">✳</span>
            <span>
              RELEVANT
              <br />
              <b>OPPORTUNITIES</b>
            </span>
          </div>
          <div className="d2-diagram-line">
            <span>Retrieve</span>
            <b>→</b>
            <span>Rerank by fit</span>
          </div>
        </>
      )}
    </div>
  );
}

const capabilities = [
  [
    "Backend systems",
    "APIs, microservices, and the systems that keep a product moving.",
    "Python / FastAPI / Distributed systems",
  ],
  [
    "AI-powered products",
    "Turning language models into useful workflows, with validation and tracing.",
    "LLMs / Agents / Retrieval",
  ],
  [
    "From idea to interface",
    "Building across the stack, from a first prototype to a shipped product.",
    "React / SwiftUI / Cloudflare",
  ],
  [
    "Real-world engineering",
    "Experience across financial services, e-commerce, and logistics.",
    "Product thinking / End-to-end ownership",
  ],
];
const experience = [
  ["Edgewaters Markets", "Jun 2025 — May 2026"],
  ["Napses Technology", "May 2024 — May 2025"],
  ["ANK Upsurge Digital", "May 2023 — May 2024"],
  ["Undocked Technology", "Aug 2022 — Apr 2023"],
];

export function PortfolioHome({ data }: { data: Portfolio }) {
  return (
    <div className="d2-home">
      <section className="d2-hero" aria-labelledby="d2-hero-title">
        <p className="d2-availability">
          <span />
          Actively looking · Can join immediately
        </p>
        <div className="d2-hero-stage">
          <Eyes className="d2-mascot-blue" />
          <Eyes className="d2-mascot-orange" />
          <h1 id="d2-hero-title" aria-label="I build products and I ship them.">
            <span className="d2-hero-line">
              I <span className="d2-tile d2-blue">build</span>{" "}
              <span className="d2-tile d2-yellow">products</span>
            </span>
            <span className="d2-hero-line">
              and I <span className="d2-tile d2-orange">ship</span>{" "}
              <span className="d2-tile d2-green">them.</span>
            </span>
          </h1>
          <span className="d2-hero-star" aria-hidden="true">
            ✳
          </span>
        </div>
        <p className="d2-hero-copy">
          Hey, I’m {data.profile.name.split(" ")[0]}. A full-stack engineer
          building
          <br className="d2-desktop-break" /> thoughtful products, dependable
          systems, and useful AI.
        </p>
        <div className="d2-actions">
          <a
            className="d2-button d2-button-primary"
            href={data.settings.bookingUrl || "/book"}
            target={data.settings.bookingUrl ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            Book a call <span>↗</span>
          </a>
          <a className="d2-button d2-button-outline" href="#work">
            See my work <span>↓</span>
          </a>
        </div>
        <div className="d2-hero-bottom">
          <span>BACKEND SYSTEMS · GENERATIVE AI · PRODUCT ENGINEERING</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>
      <section className="d2-work" id="work" aria-labelledby="d2-work-title">
        <div className="d2-section-title">
          <span className="d2-mono">A FEW THINGS I’VE BUILT</span>
          <h2 id="d2-work-title">Selected work</h2>
          <span className="d2-mono">
            [{String(data.projects.length).padStart(2, "0")} PROJECT FILES]
          </span>
        </div>
        <div className="d2-projects">
          {data.projects.map((project, index) => (
            <article
              className={`d2-project d2-project-${index % 3}`}
              key={project.id}
            >
              <div className="d2-folder-tab">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{project.title.toUpperCase()}</span>
                <span>↗</span>
              </div>
              <div className="d2-project-content">
                <div className="d2-project-copy">
                  <span className="d2-project-meta">
                    {project.category} <span>·</span>{" "}
                    {project.status === "shipped" ? "Shipped" : "Experiment"}
                  </span>
                  <h3>
                    {project.title}
                    <span>↗</span>
                  </h3>
                  <p>{project.summary}</p>
                  <div className="d2-tech">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                  <Link
                    className="d2-project-link"
                    aria-label={`Explore ${project.title} project`}
                    href={`/projects/${project.id}`}
                  >
                    Explore project <span>↗</span>
                  </Link>
                </div>
                <ProjectArt id={project.id} title={project.title} />
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        className="d2-capabilities"
        aria-labelledby="d2-capabilities-title"
      >
        <div className="d2-section-intro">
          <span className="d2-mono">A LITTLE BIT OF EVERYTHING</span>
          <h2 id="d2-capabilities-title">
            What I<br />
            work on
            <span className="d2-lime-star" aria-hidden="true">
              ✳
            </span>
          </h2>
          <p>
            I like connecting the dots between a useful idea and the engineering
            it takes to make it real.
          </p>
        </div>
        <div className="d2-capability-list">
          {capabilities.map(([title, copy, tech], i) => (
            <div className="d2-capability" key={title}>
              <span className="d2-mono">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="d2-mono">{tech}</span>
              </div>
              <span aria-hidden="true">↗</span>
            </div>
          ))}
        </div>
      </section>
      <section
        className="d2-experience"
        id="about"
        aria-labelledby="d2-experience-title"
      >
        <div className="d2-section-intro">
          <span className="d2-mono">THE PATH SO FAR</span>
          <h2 id="d2-experience-title">
            Built along
            <br />
            the way.
          </h2>
          <p>
            {data.profile.bio ||
              "Teams, products, and problems that have shaped how I work."}
          </p>
          <a
            href="/sanket-singh-resume.pdf"
            className="d2-button d2-button-outline"
          >
            Full résumé <span>↓</span>
          </a>
        </div>
        <div className="d2-career-list">
          {experience.map(([name, dates], index) => (
            <div className="d2-career" key={name}>
              <span className="d2-mono">0{index + 1}</span>
              <h3>{name}</h3>
              <span className="d2-mono">{dates}</span>
            </div>
          ))}
          <p className="d2-career-note">
            Previously at CommitCamp, HighPeak, and Coutloot.
            <br />
            The full journey is in my résumé.
          </p>
        </div>
      </section>
      {data.writing.length > 0 && (
        <section className="d2-writing">
          <span className="d2-mono">NOTES FROM THE WORKBENCH</span>
          <h2>Thinking out loud.</h2>
          {data.writing.map((item) => (
            <a
              href={item.url}
              key={item.id}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <span className="d2-mono">
                  Read original · opens in a new tab
                </span>
              </div>
              <span>↗</span>
            </a>
          ))}
        </section>
      )}
    </div>
  );
}
