"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/store/task.store";

export function useRealtimeTasks() {
  const fetchTaskById = useTaskStore((s) => s.fetchTaskById);
  const removeTask = useTaskStore((s: any) => s.removeTask);

  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      let message: any;

      try {
        message = JSON.parse(event.data);
      } catch {
        // Ignore malformed events (e.g. "[object Object]")
        console.warn("Invalid SSE message, skipping:", event.data);
        return;
      }

      if (!message?.taskId) return;

      if (message.type === "task:created") {
        fetchTaskById(message.taskId);
      }

      if (message.type === "task:updated") {
        fetchTaskById(message.taskId);
      }

      if (message.type === "task:deleted") {
        removeTask(message.taskId);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [fetchTaskById, removeTask]);
}