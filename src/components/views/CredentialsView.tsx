import Link from "next/link";
import type { Portfolio } from "@/lib/content";
import { Empty, External, DateLabel } from "../content-primitives";
import { MissingView as Missing } from "./MissingView";
export function CredentialsView({
  data,
  id,
}: {
  data: Portfolio;
  id?: string;
}) {
  const credential = id ? data.credentials.find((c) => c.id === id) : null;
  if (id && !credential) return <Missing />;
  return (
    <>
      {id && (
        <Link href="/credentials" className="back">
          ← Back to credentials
        </Link>
      )}
      <div className="eyebrow">Credentials / learning shelf</div>
      <h1 className="content-heading">
        {credential?.title || "Always a student."}
      </h1>
      {credential ? (
        <div className="long-copy">
          <p>
            {credential.issuer}
            {credential.issuedAt && (
              <>
                {" "}
                · <DateLabel date={credential.issuedAt} />
              </>
            )}
          </p>
          {credential.description && <p>{credential.description}</p>}
          {credential.verificationUrl && (
            <External href={credential.verificationUrl}>
              Verify credential
            </External>
          )}
        </div>
      ) : data.credentials.length ? (
        data.credentials.map((c, i) => (
          <Link className="credential" key={c.id} href={`/credentials/${c.id}`}>
            <span className="stamp">{i + 1}</span>
            <div>
              <h2 className="card-title">{c.title} ↗</h2>
              <p>{c.issuer}</p>
              {c.description && <p>{c.description}</p>}
            </div>
          </Link>
        ))
      ) : (
        <Empty title="Learning, with room to grow.">
          No credentials have been published yet.
        </Empty>
      )}
    </>
  );
}
