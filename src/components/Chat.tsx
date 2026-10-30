"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Portfolio } from "@/lib/content";
import { CHAT_LIMITS } from "@/lib/chat-contract";

type Message = { role: "user" | "assistant"; content: string };

export default function Chat({
  data,
  onNavigate,
  active,
}: {
  data: Portfolio;
  onNavigate: () => void;
  active: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const operation = useRef(0);
  const abort = useRef<AbortController | null>(null);
  const [lastRequest, setLastRequest] = useState<Message[] | null>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      operation.current++;
      abort.current?.abort();
    },
    [],
  );
  useEffect(
    () => () => {
      abort.current?.abort();
    },
    [active],
  );
  useEffect(() => {
    if (end.current) end.current.scrollTop = end.current.scrollHeight;
  }, [messages, busy]);

  function stop() {
    operation.current++;
    abort.current?.abort();
    setBusy(false);
  }

  async function send(history: Message[]) {
    stop();
    const id = ++operation.current;
    const controller = new AbortController();
    abort.current = controller;
    setLastRequest(history);
    setMessages([...history, { role: "assistant", content: "" }]);
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body)
        throw new Error(
          response.status === 503
            ? "The assistant is currently unavailable."
            : response.status === 429
              ? "The assistant has reached its usage limit. Please try later."
              : "The response failed. Please retry.",
        );
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (controller.signal.aborted || id !== operation.current) {
          await reader.cancel();
          return;
        }
        answer += done
          ? decoder.decode()
          : decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
        if (done) break;
      }
      if (!answer.trim()) throw new Error("No response arrived. Please retry.");
    } catch (cause) {
      if (id === operation.current && !controller.signal.aborted)
        setError(
          cause instanceof Error
            ? cause.message
            : "The response was interrupted. Please retry.",
        );
    } finally {
      if (id === operation.current) setBusy(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question || busy) return;
    // Bound history to the same public contract as the server.
    const history = [
      ...messages.filter((message) => message.content.trim()),
      { role: "user" as const, content: question },
    ].slice(-(CHAT_LIMITS.messages - 1));
    if (
      new TextEncoder().encode(JSON.stringify({ messages: history })).length >
      CHAT_LIMITS.requestBytes
    ) {
      setError(
        "This conversation is full. Clear it to start a new conversation.",
      );
      return;
    }
    setInput("");
    void send(history);
  }

  return (
    <section
      className="chat chat-in-window"
      aria-label="Ask anything about Sanket"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        const href = (event.target as HTMLElement)
          .closest("a")
          ?.getAttribute("href");
        if (href?.startsWith("/")) {
          onNavigate();
        }
      }}
    >
      <div className="eyebrow">A conversation / Sanket’s AI assistant</div>
      <h1 id="assistant-title" className="content-heading">
        Ask anything about Sanket
      </h1>
      <div id="assistant-panel" aria-labelledby="assistant-title">
        <p>
          I’m an AI assistant. I use approved portfolio information and may make
          mistakes. Messages go to an external AI provider. Avoid sharing
          sensitive information.
        </p>
        <div
          ref={end}
          className="chat-messages"
          role="log"
          aria-label="Conversation"
          aria-live="off"
        >
          {!messages.length && (
            <p>Ask about projects, writing, or how to get in touch.</p>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message chat-message-${message.role}`}
            >
              <strong>
                {message.role === "user" ? "You" : "AI assistant"}
              </strong>
              <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                {message.content ||
                  (busy
                    ? "Thinking…"
                    : error
                      ? "No answer received."
                      : "Response stopped.")}
              </p>
            </div>
          ))}
        </div>
        <p role="status">
          {busy
            ? "Responding…"
            : messages.length && !error
              ? "Response finished or stopped."
              : ""}
        </p>
        {error && (
          <p role="alert">
            {error} You can still browse <Link href="/writing">Writing</Link> or{" "}
            <Link href="/contact">Contact</Link>.
          </p>
        )}
        <form onSubmit={submit} className="chat-composer">
          <label htmlFor="chat-question">Your question</label>
          <textarea
            id="chat-question"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={CHAT_LIMITS.questionCharacters}
            rows={2}
            placeholder="What would you like to know?"
          />
          <div className="chat-controls">
            <button type="submit" disabled={busy || !input.trim()}>
              Send
            </button>
            {busy && (
              <button type="button" onClick={stop}>
                Stop
              </button>
            )}
            {!busy && lastRequest && (
              <button type="button" onClick={() => void send(lastRequest!)}>
                Retry
              </button>
            )}
            <button
              type="button"
              disabled={!messages.length && !input}
              onClick={() => {
                stop();
                setMessages([]);
                setInput("");
                setError("");
                setLastRequest(null);
              }}
            >
              Clear conversation
            </button>
          </div>
        </form>
        <nav aria-label="Approved portfolio sources" className="chat-sources">
          <p>
            <strong>Explore &amp; verify</strong> · Approved public sources
          </p>
          <Link href="/projects">Projects</Link>
          {" · "}
          <Link href="/writing">Writing</Link>
          {" · "}
          <Link href="/contact">Contact</Link>
          {data.projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              {project.title}
            </Link>
          ))}
          {data.writing.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.title} (opens in a new tab)
            </a>
          ))}
          {data.logs.map((log) => (
            <Link key={log.date} href={`/log/${log.date}`}>
              {log.title} · {log.date}
            </Link>
          ))}
          {data.settings.bookingUrl && (
            <a
              href={data.settings.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a call (opens in a new tab)
            </a>
          )}
        </nav>
      </div>
    </section>
  );
}
