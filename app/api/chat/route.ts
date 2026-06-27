import { OpenAIStream, StreamingTextResponse } from "@/lib/streaming";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return new Response("OPENROUTER_API_KEY not configured", { status: 500 });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(error, { status: response.status });
  }

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
