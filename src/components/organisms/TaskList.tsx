"use client";

import { useTaskStore } from "@/store/task.store";
import { TaskCard } from "../molecules/TaskCard";
import { Button } from "@/components/ui/button";
import axios from "axios";

export function TaskList() {
  const {
    tasks,
    nextCursor,
    appendTasks,
    setNextCursor,
  } = useTaskStore();

  const loadMore = async () => {
    if (!nextCursor) return;
    try {
      const res = await axios.get(
        `/api/tasks?limit=10&cursor=${nextCursor}`
      );
      appendTasks(res.data.tasks);
      setNextCursor(res.data.nextCursor);
    } catch (error) {
      console.error("Failed to load more:", error);
    }
  };

  if (!tasks.length) {
    return (
      <div className="mt-4 bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        No tasks found. Create your first task to get started.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl">
      <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-800">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>


    </div>
  );
}