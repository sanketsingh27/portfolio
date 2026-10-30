"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Portfolio } from "@/lib/content";
import { DesktopIcon } from "./DesktopIcon";
import { ContactDock } from "./ContactDock";
import Chat from "./Chat";
const sections = [
  ["projects", "Projects"],
  ["log", "Daily Log"],
  ["writing", "Writing"],
];
export default function Desktop({
  data,
  children,
}: {
  data: Portfolio;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const section = pathname.split("/")[1] || "about";
  const [state, setState] = useState<"open" | "minimized" | "closed">("open");
  const [position, setPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const windowRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLAnchorElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
  } | null>(null);
  const previousPath = useRef(pathname);
  const open = () => {
    lastTrigger.current = document.activeElement as HTMLElement;
    setState("open");
    requestAnimationFrame(() => contentRef.current?.focus());
  };
  const dismiss = (next: "minimized" | "closed") => {
    setState(next);
    requestAnimationFrame(() => {
      const target = lastTrigger.current;
      if (target?.isConnected && !windowRef.current?.contains(target))
        target.focus();
      else homeRef.current?.focus();
    });
  };
  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      setState("open");
      contentRef.current?.scrollTo(0, 0);
      contentRef.current?.focus();
    }
  }, [pathname]);
  useEffect(() => {
    const resize = () => setPosition(null);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  const move = (e: PointerEvent<HTMLElement>) => {
    if (!drag.current || !windowRef.current) return;
    const r = windowRef.current.getBoundingClientRect();
    setPosition({
      left: Math.max(
        8,
        Math.min(
          innerWidth - r.width - 8,
          drag.current.left + e.clientX - drag.current.x,
        ),
      ),
      top: Math.max(
        8,
        Math.min(
          Math.max(8, innerHeight - 49 - r.height - 12),
          drag.current.top + e.clientY - drag.current.y,
        ),
      ),
    });
  };
  return (
    <>
      <a href="#portfolio-content" className="skip-link" onClick={open}>
        Skip to content
      </a>
      <header className="topbar">
        <Link
          href="/"
          ref={homeRef}
          className="row brand-home"
          aria-label="About Sanket"
          onClick={open}
        >
          <span className="orange" aria-hidden="true">
            ✳
          </span>
          <span className="brand">Sanket’s desktop</span>
        </Link>
        <nav className="top-nav" aria-label="Desktop menu">
          <a
            href="/sanket-singh-resume.pdf"
            download="Sanket-Singh-Resume.pdf"
            className="text-btn"
          >
            Résumé ↓
          </a>
          <Link href="/book" onClick={open} className="text-btn">
            Book a call ↗
          </Link>
          <span className="mono orange">PERSONAL OS / 01</span>
        </nav>
      </header>
      <main className="desktop">
        <div className="wallpaper-note">
          a place for things
          <br />
          I’m making &amp;
          <br />
          figuring out. ↙
        </div>
        <nav className="desktop-icons" aria-label="Desktop apps">
          {sections.map(([id, label]) => (
            <DesktopIcon
              key={id}
              section={id}
              label={label}
              active={section === id && state === "open"}
              onOpen={open}
            />
          ))}
        </nav>
        {state !== "open" && (
          <div className="desktop-empty">
            <h2>Room to explore.</h2>
            <p>Open a folder to explore.</p>
            {state === "minimized" && (
              <button
                className="text-btn"
                onClick={() => {
                  setState("open");
                  requestAnimationFrame(() => contentRef.current?.focus());
                }}
              >
                Restore window ↗
              </button>
            )}
          </div>
        )}
        <section
          ref={windowRef}
          className={`window${section === "chat" ? " window-chat" : ""}`}
          aria-label="Portfolio window"
          hidden={state !== "open"}
          style={
            position ? { left: position.left, top: position.top } : undefined
          }
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              dismiss("closed");
              e.preventDefault();
            }
          }}
        >
          <header
            className="titlebar"
            onPointerDown={(e) => {
              if (
                (e.target as HTMLElement).closest("button") ||
                matchMedia("(max-width:650px)").matches
              )
                return;
              const r = windowRef.current!.getBoundingClientRect();
              drag.current = {
                x: e.clientX,
                y: e.clientY,
                left: r.left,
                top: r.top - 49,
              };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={move}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
          >
            <span className="title-caption">
              {section === "chat"
                ? "chat / conversation"
                : section === "about"
                  ? "about-me.txt"
                  : `${section} / ${pathname.split("/")[2] || "index"}`}
            </span>
            <div className="window-controls">
              <button
                className="window-control"
                aria-label="Minimize window"
                onClick={() => dismiss("minimized")}
              >
                −
              </button>
              <button
                className="window-control close"
                aria-label="Close window"
                onClick={() => dismiss("closed")}
              >
                ×
              </button>
            </div>
          </header>
          <div
            ref={contentRef}
            className="window-content"
            id="portfolio-content"
            tabIndex={-1}
          >
            {section !== "chat" && children}
            <div hidden={section !== "chat"}>
              <Chat
                data={data}
                onNavigate={open}
                active={section === "chat" && state === "open"}
              />
            </div>
          </div>
          <footer className="window-footer">
            <span>sanket / {section}</span>
            <span>MADE WITH CURIOSITY</span>
          </footer>
        </section>
        <div className="wallpaper-word" aria-hidden="true">
          stay
          <br />
          curious.
        </div>
      </main>
      <ContactDock data={data} />
      <p className="desk-note">
        A personal desktop, in progress.
        <br />
        {data.settings.tagline}
      </p>
    </>
  );
}
