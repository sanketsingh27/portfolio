// Public request/response limits shared by the browser and the server.
export const CHAT_LIMITS = {
  messages: 16,
  requestBytes: 16_384,
  questionCharacters: 2_000,
  answerCharacters: 8_000,
  responseBytes: 8_000,
} as const;
