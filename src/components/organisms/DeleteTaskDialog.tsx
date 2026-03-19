"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useTaskStore } from "@/store/task.store";

export function DeleteTaskDialog({ task }: { task: any }) {
  const [open, setOpen] = useState(false);

  const { optimisticDelete, restoreTask } = useTaskStore();

  const handleDelete = async () => {
    const backup = optimisticDelete(task._id);

    try {
      await axios.delete(`/api/tasks/${task._id}`);
      setOpen(false);
    } catch (error: any) {
      alert("Delete failed. Restoring task.");
      if (backup) restoreTask(backup);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="bg-rose-500 hover:bg-rose-400 border border-rose-400 text-black hover:text-black"
        >
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-slate-950 text-slate-50 border border-slate-800">
        <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900/40">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-semibold">
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>

          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-700 text-slate-100 hover:bg-slate-800"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-rose-500 hover:bg-rose-400 border border-rose-400"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}