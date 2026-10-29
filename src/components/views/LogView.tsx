import Link from "next/link";
import type { Portfolio } from "@/lib/content";
import { Empty, DateLabel } from "../content-primitives";
export function LogView({ data, id }: { data: Portfolio; id?: string }) {
  const entries = id ? data.logs.filter((l) => l.date === id) : data.logs;
  return (
    <>
      {id && (
        <Link className="back" href="/log">
          ← All updates
        </Link>
      )}
      <div className="eyebrow">Daily log / {data.settings.timezone}</div>
      <h1 className="content-heading">A little progress.</h1>
      {entries.length ? (
        entries.map((l) => (
          <article key={l.date}>
            <Link href={`/log/${l.date}`} className="text-btn">
              <DateLabel date={l.date} />
            </Link>
            <h2>{l.title}</h2>
            <ul className="log-items">
              {l.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
        ))
      ) : (
        <Empty title="Nothing logged here yet.">
          Updates are occasional. New entries will show their actual publication
          dates.
        </Empty>
      )}
    </>
  );
}
