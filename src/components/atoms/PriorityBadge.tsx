"use client";

import { Badge } from "@/components/ui/badge";

export function PriorityBadge({ priority }: { priority: string }) {
  const color =
    priority === "high"
      ? "bg-red-500"
      : priority === "medium"
      ? "bg-orange-500"
      : "bg-blue-500";

  return <Badge className={`${color} text-white`}>{priority}</Badge>;
}