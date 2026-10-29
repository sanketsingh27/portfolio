import type { Portfolio } from "@/lib/content";
import { Empty, DateLabel } from "../content-primitives";
export function WritingView({ data }: { data: Portfolio }) {
  return (
    <>
      <div className="eyebrow">Notebook / thinking out loud</div>
      <h1 className="content-heading">Notes from the middle.</h1>
      <p className="section-intro">
        Writing published around the web, collected here.
      </p>
      {data.writing.length ? (
        data.writing.map((w) => (
          <a
            className="project-row"
            key={w.id}
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="description">
              <span className="tag">
                {w.platform}
                {w.publishedAt && (
                  <>
                    {" "}
                    · <DateLabel date={w.publishedAt} />
                  </>
                )}
              </span>
              <h2 className="card-title">{w.title}</h2>
              <p>{w.summary}</p>
              <span className="external-note">
                Read original · opens in a new tab
              </span>
            </div>
            <span className="orange">↗</span>
          </a>
        ))
      ) : (
        <Empty title="The notebook is open.">
          No writing links have been added yet. Published pieces will appear
          here.
        </Empty>
      )}
    </>
  );
}
