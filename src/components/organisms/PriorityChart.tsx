// src/components/organisms/PriorityChart.tsx
"use client";

import { useAnalyticsStore } from "@/store/analytics.store";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const PRIORITY_COLORS: Record<string, string> = {
  low: "#22c55e",       // green
  medium: "#eab308",    // yellow
  high: "#ef4444",      // red
};

export function PriorityChart() {
  const { data } = useAnalyticsStore();

  if (!data) return null;

  const chartData =
    data.byPriority?.map((item: any) => ({
      name: item._id,
      value: item.count,
    })) || [];

  return (
    <div className="mt-10 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4 text-slate-100">
        Tasks by Priority
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            innerRadius={50}
          >
            {chartData.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={PRIORITY_COLORS[entry.name] || "#38bdf8"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1f2937",
              color: "#e5e7eb",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}