import Link from "next/link";
import type { Portfolio } from "@/lib/content";
import Image from "next/image";
export function AboutView({ data }: { data: Portfolio }) {
  return (
    <>
      <div className="about-grid">
        <div>
          <div className="eyebrow">
            A note from the person behind the pixels
          </div>
          <h1>
            Hello, I’m
            <br />
            {data.profile.name}.
          </h1>
          {data.profile.role && <p className="role">{data.profile.role}</p>}
          <p className="bio">
            {data.profile.bio ||
              "Welcome to my personal desktop. Explore my work, writing, and things I’m learning."}
          </p>
        </div>
        <aside>
          {data.profile.portrait ? (
            <div className="portrait">
              <Image
                src={data.profile.portrait}
                alt={data.profile.portraitAlt || data.profile.name}
                width={145}
                height={171}
              />
            </div>
          ) : (
            <div
              className="portrait"
              aria-label={`${data.profile.name} monogram`}
              role="img"
            >
              <span className="portrait-initials">ss.</span>
              <span>A PERSONAL DESKTOP</span>
            </div>
          )}
          <div className="handwritten">stay curious ↖</div>
        </aside>
      </div>
      <div className="about-bottom">
        <Link href="/contact" className="text-btn">
          Contact me ↗
        </Link>
        <a
          href="/sanket-singh-resume.pdf"
          download="Sanket-Singh-Resume.pdf"
          className="text-btn"
        >
          Download résumé ↓
        </a>
        <Link href="/projects" className="primary">
          Open the workbench ↗
        </Link>
      </div>
    </>
  );
}
