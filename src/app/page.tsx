"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    if (initialized && user) {
      router.replace("/dashboard");
    }
  }, [initialized, user, router]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p className="animate-pulse">Loading...</p>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-white px-6">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto flex justify-between items-center py-6">
        <h1 className="text-xl font-bold tracking-tight">
          TaskFlow
        </h1>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>

          <Button
            className="bg-indigo-600 hover:bg-indigo-500"
            onClick={() => router.push("/signup")}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mt-24 space-y-8">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
          Real-Time Task
          <span className="text-indigo-500">
            {" "}
            Collaboration{" "}
          </span>
          System
        </h2>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Built with scalable architecture — Redis
          powered realtime, optimistic locking,
          conflict resolution, and enterprise-grade
          RBAC.
        </p>

        <div className="flex justify-center gap-6 mt-8">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-500 px-8"
            onClick={() => router.push("/signup")}
          >
            Start Free
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-gray-600 bg-transparent text-white hover:bg-white px-8"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-8 pb-24">
        <FeatureCard
          title="⚡ Real-Time Sync"
          description="Instant updates across multiple users using Redis + Server-Sent Events."
        />

        <FeatureCard
          title="🛡 Conflict Resolution"
          description="Optimistic locking prevents silent data overwrites in concurrent environments."
        />

        <FeatureCard
          title="📊 Scalable Architecture"
          description="MongoDB + Redis + Serverless-ready design built for 100k+ tasks."
        />
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-indigo-500 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-4">
        {title}
      </h3>
      <p className="text-gray-400">
        {description}
      </p>
    </div>
  );
}