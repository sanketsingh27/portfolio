import Link from "next/link";
const pictures: Record<string, React.ReactNode> = {
  projects: (
    <>
      <path d="M5 12V8q0-3 4-3h14l5 6h20q4 0 4 4v27H5Z" fill="#bfa47b" />
      <path d="M4 17q0-3 4-3h41q4 0 3 5l-4 24H7Z" fill="#d6bb8d" />
      <path d="M24 24v11m-5-5h10" fill="none" />
    </>
  ),
  log: (
    <>
      <rect x="8" y="7" width="40" height="38" rx="3" fill="#faf6e9" />
      <path d="M8 18h40V10q0-3-3-3H11q-3 0-3 3Z" fill="#b95635" />
      <path d="M18 3v9m20-9v9M18 27h20m-20 8h13" />
    </>
  ),
  writing: (
    <>
      <rect x="10" y="4" width="35" height="42" rx="3" fill="#bbb7a0" />
      <path d="M16 4v42" />
      <rect x="22" y="13" width="17" height="13" rx="1" fill="#ece7d7" />
      <path d="M25 18h11m-11 4h8" />
    </>
  ),
  credentials: (
    <>
      <path d="M7 7h42v32H7Z" fill="#f4eedc" />
      <path d="M14 15h28m-23 6h18m-21 6h13" />
      <path d="m34 39-2 10 6-4 5 4-2-10" fill="#b26a45" />
      <circle cx="38" cy="34" r="7" fill="#c07b53" />
    </>
  ),
};
export function DesktopIcon({
  section,
  label,
  active,
  onOpen,
}: {
  section: string;
  label: string;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <Link
      href={`/${section}`}
      className="desktop-icon"
      aria-current={active ? "page" : undefined}
      onClick={onOpen}
    >
      <svg
        className="object"
        viewBox="0 0 56 50"
        stroke="#8d7656"
        strokeWidth="1"
        aria-hidden="true"
      >
        {pictures[section]}
      </svg>
      <span>{label}</span>
    </Link>
  );
}
