import "server-only";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function configuredModel() {
  if (
    process.env.AI_ENABLED !== "true" ||
    process.env.AI_SPEND_LIMIT_CONFIGURED !== "true" ||
    process.env.AI_ABUSE_PROTECTION_CONFIGURED !== "true"
  )
    return null;
  const {
    AI_BASE_URL: baseURL,
    AI_API_KEY: apiKey,
    AI_MODEL: model,
  } = process.env;
  if (!baseURL || !apiKey || !model) return null;
  const url = new URL(baseURL);
  const localTest =
    process.env.NODE_ENV !== "production" &&
    process.env.PLAYWRIGHT_TEST === "true" &&
    url.hostname === "127.0.0.1";
  if ((!localTest && url.protocol !== "https:") || url.username || url.password)
    return null;
  return createOpenAICompatible({
    name: "portfolio",
    baseURL,
    apiKey,
  }).chatModel(model);
}
