import type { Portfolio } from "@/lib/content";
import { External } from "../content-primitives";
export function ContactView({
  data,
  section,
}: {
  data: Portfolio;
  section: "contact" | "book";
}) {
  return (
    <>
      <div className="eyebrow">
        {section === "book"
          ? "Book a call / let’s talk"
          : "Contact / say hello"}
      </div>
      <h1 className="content-heading">
        Good things start
        <br />
        with a conversation.
      </h1>
      <p className="section-intro">
        Have a question or an idea? Here’s how to reach me.
      </p>
      <div className="long-copy">
        {data.settings.bookingUrl ? (
          <>
            <External href={data.settings.bookingUrl}>Book a call</External>
            <p>
              The scheduling page shows availability and confirms your meeting.
            </p>
          </>
        ) : (
          <p>Online scheduling isn’t configured yet.</p>
        )}
        {data.settings.email ? (
          <p>
            <a className="contact-email" href={`mailto:${data.settings.email}`}>
              {data.settings.email} ↗
            </a>
          </p>
        ) : (
          <p>An email address hasn’t been published yet.</p>
        )}
        <div className="project-links">
          {data.settings.socials.map((s) => (
            <External key={s.url} href={s.url}>
              {s.label}
            </External>
          ))}
        </div>
      </div>
    </>
  );
}
