import { APICallError, streamText } from "ai";
import { z } from "zod";
import { getPortfolio } from "@/lib/content";
import { configuredModel } from "@/lib/ai-provider";
import { assistantContext } from "@/lib/assistant";
import { CHAT_LIMITS } from "@/lib/chat-contract";

export const runtime = "nodejs";
export const maxDuration = 30;
const schema = z
  .object({
    messages: z
      .array(
        z
          .object({
            role: z.enum(["user", "assistant"]),
            content: z.string().trim().min(1).max(CHAT_LIMITS.answerCharacters),
          })
          .strict()
          .refine(
            (message) =>
              message.role !== "user" ||
              message.content.length <= CHAT_LIMITS.questionCharacters,
            "Questions must be at most 2000 characters",
          ),
      )
      .min(1)
      .max(CHAT_LIMITS.messages),
  })
  .strict();
const error = (message: string, status: number) =>
  Response.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next's internal request URL can use localhost even when the browser used the
  // deployment host. Compare the browser's origin with the received Host instead.
  let sameOrigin = false;
  try {
    const source = new URL(origin || "");
    sameOrigin =
      source.origin === origin &&
      source.host === request.headers.get("host") &&
      source.protocol === new URL(request.url).protocol;
  } catch {
    /* Missing or malformed origins are rejected. */
  }
  if (!sameOrigin) return error("Request origin is not allowed.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return error("Send JSON.", 415);
  // The actual stream is bounded, even if Content-Length is missing or inaccurate.
  const reader = request.body?.getReader();
  if (!reader) return error("Missing messages.", 400);
  const bodyTimer = setTimeout(() => void reader.cancel(), 5000);
  let length = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > CHAT_LIMITS.requestBytes) {
        await reader.cancel();
        return error("Conversation is too large.", 413);
      }
      chunks.push(value);
    }
  } catch {
    return error("Could not read messages.", 400);
  } finally {
    clearTimeout(bodyTimer);
    reader.releaseLock();
  }
  let messages: z.infer<typeof schema>["messages"];
  try {
    const buffer = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }
    messages = schema.parse(
      JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(buffer)),
    ).messages;
    if (messages.at(-1)?.role !== "user")
      return error("End with a question.", 400);
  } catch {
    return error(
      "Invalid conversation. Use up to 16 messages and questions of at most 2000 characters.",
      400,
    );
  }
  try {
    const model = configuredModel();
    if (!model)
      return error(
        "The assistant is unavailable. Browse Writing or Contact instead.",
        503,
      );
    const cancellation = new AbortController();
    let providerError: unknown;
    const result = streamText({
      model,
      instructions: assistantContext(await getPortfolio()),
      messages,
      maxOutputTokens: 500,
      maxRetries: 0,
      onError: ({ error }) => {
        providerError = error;
      },
      abortSignal: AbortSignal.any([
        request.signal,
        cancellation.signal,
        AbortSignal.timeout(25000),
      ]),
    });
    // Await the first provider chunk so startup failures retain a useful HTTP error.
    const response = result.toTextStreamResponse();
    const output = response.body!.getReader();
    const first = await output.read();
    if (providerError) throw providerError;
    if (first.done || !first.value)
      return error("The assistant could not respond. Please retry.", 502);
    let outputBytes = first.value.byteLength;
    if (outputBytes > CHAT_LIMITS.responseBytes) {
      cancellation.abort();
      await output.cancel();
      return error("Response length limit reached.", 502);
    }
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(first.value);
      },
      async pull(controller) {
        try {
          const next = await output.read();
          if (providerError) throw providerError;
          if (next.done) controller.close();
          else {
            outputBytes += next.value.byteLength;
            if (outputBytes > CHAT_LIMITS.responseBytes) {
              cancellation.abort();
              await output.cancel();
              controller.error(new Error("Response length limit reached."));
            } else controller.enqueue(next.value);
          }
        } catch {
          controller.error(
            new Error("The response was interrupted. Please retry."),
          );
        }
      },
      async cancel() {
        cancellation.abort();
        await output.cancel();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (cause) {
    if (APICallError.isInstance(cause) && cause.statusCode === 429)
      return error(
        "Assistant usage limit reached. Please try later or use Contact.",
        429,
      );
    return error(
      "The assistant could not respond. Please retry or use Contact.",
      502,
    );
  }
}
