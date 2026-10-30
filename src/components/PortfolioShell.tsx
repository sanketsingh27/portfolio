"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Portfolio } from "@/lib/content";
import Chat from "./Chat";

export default function PortfolioShell({
  data,
  children,
}: {
  data: Portfolio;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const chat = pathname === "/chat";
  const home = pathname === "/" || pathname === "/about";
  return (
    <div className="d2-site" id="top">
      <a href="#portfolio-content" className="skip-link">
        Skip to content
      </a>
      <header className="d2-header">
        <Link href="/" className="d2-brand" aria-label="Sanket Singh home">
          <span className="d2-monogram" aria-hidden="true">
            s.
          </span>
          <span>{data.profile.name}</span>
        </Link>
        <div className="d2-navigation-group">
          <nav className="d2-nav" aria-label="Main navigation">
            <Link
              href="/#work"
              aria-current={
                pathname.startsWith("/projects") ? "page" : undefined
              }
            >
              Work
            </Link>
            <Link href="/#about">About</Link>
          </nav>
          <nav className="d2-social-pill" aria-label="Social links">
            {data.settings.socials.map((social) => (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} (opens in a new tab)`}
                title={social.label}
              >
                <span aria-hidden="true">
                  {/linkedin/i.test(social.label)
                    ? "in"
                    : /twitter|\bx\b/i.test(social.label)
                      ? "𝕏"
                      : social.label}
                </span>
              </a>
            ))}
            {data.settings.email && (
              <a
                href={`mailto:${data.settings.email}`}
                aria-label="Email"
                title="Email"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 6 9 7 9-7" />
                </svg>
              </a>
            )}
          </nav>
        </div>
        <a
          className="d2-resume"
          href="/sanket-singh-resume.pdf"
          download="Sanket-Singh-Resume.pdf"
        >
          Résumé <span aria-hidden="true">↓</span>
        </a>
      </header>
      <main
        id="portfolio-content"
        aria-label="Portfolio content"
        tabIndex={-1}
        className={home ? "d2-main" : "d2-page"}
      >
        {!chat && children}
        <div hidden={!chat}>
          <Chat data={data} onNavigate={() => {}} active={chat} />
        </div>
      </main>
      <footer className="d2-footer" id="contact">
        <div className="d2-footer-top">
          <span className="d2-status">
            <i aria-hidden="true" /> Open to full-time roles · Immediate joiner
          </span>
          <a href="#top" className="d2-back-top">
            Back to top ↑
          </a>
        </div>
        <h2>
          Let’s build something
          <br />
          <span>worth shipping.</span>
        </h2>
        <p>
          Hiring a full-stack engineer who cares about the product? I’d love to
          hear from you.
        </p>
        <div className="d2-actions">
          <a
            className="d2-button d2-button-orange"
            href={data.settings.bookingUrl || "/book"}
            target={data.settings.bookingUrl ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            Book a call ↗
          </a>
          {data.settings.email && (
            <a className="d2-button" href={`mailto:${data.settings.email}`}>
              Email me ↗
            </a>
          )}
        </div>
        <div className="d2-footer-bottom">
          <span>
            © {new Date().getFullYear()} {data.profile.name}
          </span>
          <nav aria-label="Contact and social links">
            {data.settings.socials.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label} ↗
              </a>
            ))}
            {data.settings.email && (
              <a href={`mailto:${data.settings.email}`}>Email ↗</a>
            )}
            <a
              href="/sanket-singh-resume.pdf"
              download="Sanket-Singh-Resume.pdf"
            >
              Résumé ↓
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
