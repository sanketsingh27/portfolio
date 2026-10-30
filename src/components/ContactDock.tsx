import type { Portfolio } from "@/lib/content";

export function ContactDock({ data }: { data: Portfolio }) {
  const linkedin = data.settings.socials.find(
    (s) =>
      /linkedin/i.test(s.label) ||
      new URL(s.url).hostname.endsWith("linkedin.com"),
  );
  const twitter = data.settings.socials.find(
    (s) =>
      /^(twitter|x)(\s|$)/i.test(s.label) ||
      ["twitter.com", "www.twitter.com", "x.com", "www.x.com"].includes(
        new URL(s.url).hostname,
      ),
  );
  const contacts = [
    {
      label: "LinkedIn",
      href: linkedin?.url,
      icon: (
        <span className="dock-letter" aria-hidden="true">
          in
        </span>
      ),
    },
    {
      label: "Twitter",
      href: twitter?.url,
      icon: (
        <span className="dock-letter" aria-hidden="true">
          𝕏
        </span>
      ),
    },
    {
      label: "Email",
      href: data.settings.email ? `mailto:${data.settings.email}` : undefined,
      icon: (
        <svg className="dock-symbol" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 6 9 7 9-7" />
        </svg>
      ),
    },
  ];
  return (
    <nav className="dock" aria-label="Contact and social links">
      {contacts.map((contact) =>
        contact.href ? (
          <a
            key={contact.label}
            href={contact.href}
            {...(contact.label !== "Email"
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            aria-label={`${contact.label}${contact.label !== "Email" ? " (opens in a new tab)" : ""}`}
          >
            {contact.icon}
            <span className="dock-label">{contact.label}</span>
          </a>
        ) : (
          <button
            key={contact.label}
            type="button"
            disabled
            title={`${contact.label} is not available yet`}
          >
            {contact.icon}
            <span className="dock-label">{contact.label}</span>
          </button>
        ),
      )}
    </nav>
  );
}
