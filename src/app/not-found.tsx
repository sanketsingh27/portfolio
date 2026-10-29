import Link from "next/link";
export default function NotFound() {
  return (
    <>
      <div className="eyebrow">Folder not found</div>
      <h1 className="content-heading">A wrong turn.</h1>
      <p className="section-intro">That page isn’t on this desktop.</p>
      <Link href="/" className="text-btn">
        Back to About ↗
      </Link>
    </>
  );
}
