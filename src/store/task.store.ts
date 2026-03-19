// src/store/task.store.ts
"use client";

import { create } from "zustand";
import axios from "axios";

interface TaskStore {
  tasks: any[];
  nextCursor: string | null;

  setTasks: (tasks: any[]) => void;
  appendTasks: (tasks: any[]) => void;
  setNextCursor: (cursor: string | null) => void;

  optimisticCreate: (task: any) => void;
  optimisticUpdate: (task: any) => void;
  optimisticDelete: (taskId: string) => any | null;

  restoreTask: (task: any) => void;

  fetchTaskById: (taskId: string) => Promise<void>;

  // assuming you already have this in your store:
  removeTask?: (taskId: string) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  nextCursor: null,

  setTasks: (tasks) => set({ tasks }),
  appendTasks: (newTasks) =>
    set((state) => ({
      tasks: [...state.tasks, ...newTasks],
    })),
  setNextCursor: (cursor) => set({ nextCursor: cursor }),

  optimisticCreate: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),

  optimisticUpdate: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === updatedTask._id ? updatedTask : t
      ),
    })),

  optimisticDelete: (taskId) => {
    const existing = get().tasks.find((t) => t._id === taskId);

    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
    }));

    return existing || null;
  },

  restoreTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),

  fetchTaskById: async (taskId) => {
    try {
      const res = await axios.get(`/api/tasks/${taskId}`);
      const task = res.data;

      set((state) => ({
        tasks: state.tasks.map((t) =>
          t._id === task._id ? task : t
        ),
      }));
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn("Task not found, skipping", taskId);
        return;
      }
      console.error("Fetch failed:", error);
    }
  },
}));