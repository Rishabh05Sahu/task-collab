"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useAnalyticsStore } from "@/store/analytics.store";

export function AnalyticsCards() {
  const { data, fetchAnalytics, loading } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading || !data) {
    return <p className="mt-6 text-slate-400">Loading analytics...</p>;
  }

  const total = data.totalTasks?.[0]?.count || 0;
  const overdue = data.overdue?.[0]?.count || 0;
  const completed = data.completed?.[0]?.count || 0;

  const completionRate =
    total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
      <Card className="bg-slate-900/60 border-slate-800">
        <CardContent className="p-4">
          <p className="text-sm text-slate-400">Total Tasks</p>
          <h2 className="text-2xl font-bold text-slate-50">
            {total}
          </h2>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/60 border-slate-800">
        <CardContent className="p-4">
          <p className="text-sm text-slate-400">Overdue</p>
          <h2 className="text-2xl font-bold text-rose-400">
            {overdue}
          </h2>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/60 border-slate-800">
        <CardContent className="p-4">
          <p className="text-sm text-slate-400">Completed</p>
          <h2 className="text-2xl font-bold text-emerald-400">
            {completed}
          </h2>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/60 border-slate-800">
        <CardContent className="p-4">
          <p className="text-sm text-slate-400">Completion Rate</p>
          <h2 className="text-2xl font-bold text-sky-400">
            {completionRate}%
          </h2>
        </CardContent>
      </Card>
    </div>
  );
}