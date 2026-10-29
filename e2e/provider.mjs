// External provider substitute. Production code still uses the real AI SDK/HTTP adapter.
import { createServer } from "node:http";

createServer(async (req, res) => {
  if (req.url === "/health") return res.end("ok");
  let body = "";
  for await (const chunk of req) body += chunk;
  const { messages } = JSON.parse(body);
  const question = messages.at(-1).content;
  if (question.includes("provider failure")) {
    res.writeHead(503);
    return res.end("fixture unavailable");
  }
  if (question.includes("budget limit")) {
    res.writeHead(429);
    return res.end("fixture budget exhausted");
  }
  let answer =
    "I don’t have that information about Sanket. You can explore the available projects or contact him.";
  if (/AI projects|project/i.test(question))
    answer =
      "Sanket’s fixture project is an experiment in AI. Explore Projects for the verified details.";
  if (/follow.up/i.test(question))
    answer = messages.some((m) => /AI projects/i.test(m.content))
      ? "Following up on the AI project you asked about earlier."
      : "There was no earlier project question.";
  if (/call|book|free|available/i.test(question))
    answer =
      "Use Book a call to check availability on the scheduling page. I cannot see live slots or confirm a booking.";
  if (/writing/i.test(question))
    answer =
      "The writing collection includes a supplied summary, not the full external article.";
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  const words = answer.split(/(?<=\s)/);
  const delay = question.includes("slow response") ? 150 : 8;
  let index = 0;
  const timer = setInterval(() => {
    if (index >= words.length) {
      res.write(
        `data: ${JSON.stringify({ id: "fixture", object: "chat.completion.chunk", created: 0, model: "fixture", choices: [{ index: 0, delta: {}, finish_reason: "stop" }] })}\n\ndata: [DONE]\n\n`,
      );
      clearInterval(timer);
      res.end();
      return;
    }
    res.write(
      `data: ${JSON.stringify({ id: "fixture", object: "chat.completion.chunk", created: 0, model: "fixture", choices: [{ index: 0, delta: { content: words[index++] }, finish_reason: null }] })}\n\n`,
    );
  }, delay);
  res.on("close", () => clearInterval(timer));
}).listen(4319, "127.0.0.1");
