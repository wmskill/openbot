export function OpenAIStream(response: Response): ReadableStream {
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      let buffer = "";
      const encoder = new TextEncoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const json = JSON.parse(line.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }

        const remaining = buffer.trim();
        if (remaining.startsWith("data: ") && remaining !== "data: [DONE]") {
          try {
            const json = JSON.parse(remaining.slice(6));
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          } catch {
            // skip
          }
        }
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });
}

export class StreamingTextResponse extends Response {
  constructor(stream: ReadableStream) {
    super(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
}
