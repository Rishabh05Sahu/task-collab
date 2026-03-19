"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./TaskForm";

interface TaskDialogProps {
  mode: "create" | "edit";
  task?: any;
}

export function TaskDialog({ mode, task }: TaskDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="bg-sky-500 hover:bg-sky-400 text-white border border-sky-400">
            Create Task
          </Button>
        ) : (
          <Button
            variant="outline"
            className="border-slate-700  hover:bg-slate-800"
          >
            Edit
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-slate-950 text-slate-50 border border-slate-800">
        <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900/40">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-semibold">
              {mode === "create" ? "Create Task" : "Edit Task"}
            </DialogTitle>
            <p className="text-sm text-slate-400 mt-1">
              {mode === "create"
                ? "Add a new task and collaborate in real-time."
                : "Update task fields. Conflicts are handled safely."}
            </p>
          </DialogHeader>
        </div>

        <div className="p-5">
          <TaskForm
            mode={mode}
            defaultValues={task}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}