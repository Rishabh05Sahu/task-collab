// src/components/molecules/FilterBar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { useTaskStore } from "@/store/task.store";

export function FilterBar() {
  const [search, setSearch] = useState("");
  const setTasks = useTaskStore((state) => state.setTasks);
  const setNextCursor = useTaskStore((state: any) => state.setNextCursor);

  const handleSearch = async (value: string) => {
    setSearch(value);

    try {
      const res = await axios.get(
        `/api/tasks?limit=10&search=${encodeURIComponent(value)}`
      );

      // ✅ use the array from the API
      setTasks(res.data.tasks || []);
      // ✅ keep pagination consistent with filtered result
      setNextCursor(res.data.nextCursor ?? null);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="flex gap-4 ">
      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}