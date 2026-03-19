import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let lastIndex = 0;
      let closed = false;

      const interval = setInterval(async () => {
        if (closed) return;

        try {
          const len = await redis.llen("task_events");
          if (len > lastIndex) {
            const newEvents = await redis.lrange(
              "task_events",
              lastIndex,
              -1
            );

            for (const event of newEvents) {
              const data = `data: ${event}\n\n`;

              try {
                controller.enqueue(encoder.encode(data));
              } catch (err: any) {
                // Stream is closed; stop the loop
                console.error("SSE enqueue error:", err);
                closed = true;
                clearInterval(interval);
                try {
                  controller.close();
                } catch {}
                return;
              }
            }

            lastIndex = len;
          }
        } catch (err) {
          console.error("SSE error:", err);
        }
      }, 2000);

      // Called when the stream is cancelled/closed by the client
      return () => {
        closed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {}
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}