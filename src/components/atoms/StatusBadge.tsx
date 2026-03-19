"use client";

import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const color =
    status === "done"
      ? "bg-green-500"
      : status === "in_progress"
      ? "bg-yellow-500"
      : "bg-gray-500";

  return <Badge className={`${color} text-white`}>{status}</Badge>;
}