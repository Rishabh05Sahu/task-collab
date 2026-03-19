
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "../atoms/StatusBadge";
import { PriorityBadge } from "../atoms/PriorityBadge";
import { TaskDialog } from "../organisms/TaskDialog";
import { DeleteTaskDialog } from "../organisms/DeleteTaskDialog";
import { useAuthStore } from "@/store/auth.store";

export function TaskCard({ task }: { task: any }) {
  const user = useAuthStore((s) => s.user);

  const canEdit =
    user?.role === "admin" || user?.id === task.createdBy;
  const canDelete = user?.role === "admin";

  return (
    <Card className="bg-transparent border-none rounded-none">
      <CardContent className="py-3 px-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-medium text-slate-100">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-1">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {task.dueDate && (
              <span className="text-xs text-slate-400">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {canEdit && (
            <TaskDialog mode="edit" task={task} />
          )}
          {canDelete && (
            <DeleteTaskDialog task={task} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}