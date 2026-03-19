"use client";

import { useEffect } from "react";
import axios from "axios";
import { useTaskStore } from "@/store/task.store";
import { TaskList } from "@/components/organisms/TaskList";
import { FilterBar } from "@/components/molecules/FilterBar";
import { useRealtimeTasks } from "@/hooks/useRealtimeTasks";
import { TaskDialog } from "@/components/organisms/TaskDialog";
import { AnalyticsCards } from "@/components/organisms/AnalyticsCards";
import { StatusChart } from "@/components/organisms/StatusChart";
import { PriorityChart } from "@/components/organisms/PriorityChart";
import { useAuthStore } from "@/store/auth.store";
import { ProtectedRoute } from "@/components/providers/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const setTasks = useTaskStore((s) => s.setTasks);
  const setNextCursor = useTaskStore((s) => s.setNextCursor);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s:any) => s.logout);
  const router = useRouter();

  useRealtimeTasks();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/tasks?limit=10");
        setTasks(res.data.tasks);
        setNextCursor(res.data.nextCursor);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    if (user) fetchTasks();
  }, [user, setTasks, setNextCursor]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch {
      // ignore network error for logout
    } finally {
      logout();
      router.replace("/login");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Task Collaboration Dashboard
              </h1>
              <p className="text-sm text-slate-400">
                Real-time tasks, analytics, and collaboration.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-red-700 px-4 py-4 text-xl bg-red-500 text-slate-100 hover:bg-red-800"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="text-sm text-slate-400">
                Track task status, priorities, and progress in real time.
              </p>
            </div>
            {user && <TaskDialog mode="create" />}
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <AnalyticsCards />
              <FilterBar />
              <TaskList />
            </div>

            <div className="space-y-4">
              <StatusChart />
              <PriorityChart />
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}