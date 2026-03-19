"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface ConflictDialogProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function ConflictDialog({
  open,
  onClose,
  onRefresh,
}: ConflictDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-slate-950 text-slate-50 border border-slate-800">
        <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900/40">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-semibold">
              Conflict Detected
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-300">
            This task was updated by another user while you were editing.
            Refresh to see the latest version.
          </p>

          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-700 text-slate-100 hover:bg-slate-800"
            >
              Cancel
            </Button>

            <Button
              onClick={onRefresh}
              className="bg-sky-500 hover:bg-sky-400 text-white border border-sky-400"
            >
              Refresh Task
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}