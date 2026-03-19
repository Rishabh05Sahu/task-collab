// src/components/organisms/StatusChart.tsx
"use client";

import { useAnalyticsStore } from "@/store/analytics.store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function StatusChart() {
  const { data } = useAnalyticsStore();

  if (!data) return null;

  const chartData =
    data.byStatus?.map((item: any) => ({
      name: item._id,
      count: item.count,
    })) || [];

  return (
    <div className="mt-10 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4 text-slate-100">
        Tasks by Status
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
          />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1f2937",
              color: "#e5e7eb",
            }}
          />
          {/* ✅ custom bar color */}
          <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}