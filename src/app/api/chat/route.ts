import { openai } from '@/lib/ai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();

  // Replace with your actual Cloudflare Worker URL
  const WORKER_URL = "https://ai-worker.agusmontoya.workers.dev"; 

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Worker error: ${response.statusText}`);
    }

    // Stream the response from the worker
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Error communicating with AI service" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
