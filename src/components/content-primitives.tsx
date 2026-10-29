export function External({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-btn"
    >
      {children} ↗ <span className="external-note">(opens in a new tab)</span>
    </a>
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="empty-copy">
      <h2 className="card-title">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
export function DateLabel({ date }: { date: string }) {
  return (
    <time dateTime={date}>
      {new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${date}T12:00:00Z`))}
    </time>
  );
}
