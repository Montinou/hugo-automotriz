import { createOpenAI } from '@ai-sdk/openai';

export const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://gateway.ai.vercel.dev/v1",
});
