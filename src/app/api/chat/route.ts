export const maxDuration = 30;

const WORKER_URL = process.env.AI_WORKER_URL || "https://ai-worker.agusmontoya.workers.dev";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, vehicleContext } = body;

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, vehicleContext }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Worker error:", errorText);
      throw new Error(`Worker error: ${response.status}`);
    }

    // The Cloudflare AI worker returns SSE stream
    // We need to transform it to the format useChat expects
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE events
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("0:\"\"\n"));
                  continue;
                }
                try {
                  const parsed = JSON.parse(data);
                  const text = parsed.response || parsed.choices?.[0]?.delta?.content || "";
                  if (text) {
                    // Format for useChat: "0:" prefix for text chunks
                    controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
                  }
                } catch {
                  // If not JSON, send as plain text
                  if (data.trim()) {
                    controller.enqueue(encoder.encode(`0:${JSON.stringify(data)}\n`));
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream processing error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: "Error communicating with AI service" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
