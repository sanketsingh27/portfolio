"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <>
      <h1 className="content-heading">A little interruption.</h1>
      <p>Something went wrong loading this view.</p>
      <button className="primary" onClick={reset}>
        Try again
      </button>
    </>
  );
}
