import type { Message } from "../types/chat";
import type { OaiMsg } from "../lib/openai";

export const toOai = (msgs: Message[]): OaiMsg[] =>
  msgs.map((m) => ({
    role:
      m.author === 'me'
        ? 'user'
        : m.author === 'bot'
        ? 'assistant'
        : 'system',
    content: m.content,
  }));
