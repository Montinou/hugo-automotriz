export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://gateway.ai.vercel.dev/v1",
  headers: {
    "X-Access-Token": process.env.AI_GATEWAY_API_KEY || "",
  },
});
