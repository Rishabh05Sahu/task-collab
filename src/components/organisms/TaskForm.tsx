"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createTaskSchema } from "@/modules/tasks/task.schema";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useTaskStore } from "@/store/task.store";
import { ConflictDialog } from "./ConflictDialog";

type TaskFormValues = z.infer<typeof createTaskSchema>;

interface TaskFormProps {
  mode: "create" | "edit";
  defaultValues?: any;
  onSuccess?: () => void;
}

function toDateInputValue(value: any): string | undefined {
  if (!value) return undefined;
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toISOString().slice(0, 10); // yyyy-mm-dd
  } catch {
    return undefined;
  }
}

export function TaskForm({ mode, defaultValues, onSuccess }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: defaultValues || {},
  });

  const { optimisticCreate, optimisticUpdate, fetchTaskById } =
    useTaskStore();

  const [conflictOpen, setConflictOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const computedDefaults = useMemo(() => {
    if (!defaultValues) return undefined;
    return {
      ...defaultValues,
      dueDate: toDateInputValue(defaultValues.dueDate),
    };
  }, [defaultValues]);

  useEffect(() => {
    if (computedDefaults) reset(computedDefaults);
  }, [computedDefaults, reset]);

  const onSubmit = async (data: TaskFormValues) => {
    setErrorMsg(null);

    try {
      if (mode === "create") {
        const tempTask = {
          ...data,
          _id: Date.now().toString(),
          status: data.status || "todo",
          priority: data.priority || "medium",
        };

        optimisticCreate(tempTask);

        const res = await axios.post("/api/tasks", data);
        await fetchTaskById(res.data._id);
      } else {
        // edit mode
        const updatedTask = {
          ...defaultValues,
          ...data,
        };

        optimisticUpdate(updatedTask);

        await axios.patch(`/api/tasks/${defaultValues._id}`, {
          ...data,
          version: defaultValues.version,
        });

        await fetchTaskById(defaultValues._id);
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setConflictOpen(true);
      } else {
        setErrorMsg(
          error?.response?.data?.error ||
            error?.message ||
            "Operation failed"
        );
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">
            Title
          </label>
          <Input
            placeholder="e.g. Study for exam"
            {...register("title")}
            className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-sky-500/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">
            Description
          </label>
          <textarea
            placeholder="Add some details (optional)"
            {...register("description")}
            className="w-full min-h-[92px] rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus-visible:ring-3 focus-visible:ring-sky-500/30"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus-visible:ring-3 focus-visible:ring-sky-500/30"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus-visible:ring-3 focus-visible:ring-sky-500/30"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">
            Due Date
          </label>
          <Input
            type="date"
            {...register("dueDate")}
            className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-sky-500/40"
          />
          <p className="text-xs text-slate-500">
            Leave empty if you don’t want overdue tracking.
          </p>
        </div> */}

        {errorMsg && (
          <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sky-500 hover:bg-sky-400 text-white border border-sky-400"
        >
          {mode === "create"
            ? isSubmitting
              ? "Creating..."
              : "Create Task"
            : isSubmitting
              ? "Updating..."
              : "Update Task"}
        </Button>
      </form>

      <ConflictDialog
        open={conflictOpen}
        onClose={() => setConflictOpen(false)}
        onRefresh={async () => {
          await fetchTaskById(defaultValues._id);
          setConflictOpen(false);
        }}
      />
    </>
  );
}