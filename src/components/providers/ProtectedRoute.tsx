"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore(
    (s) => s.initialized
  );

  useEffect(() => {
    if (initialized && !user) {
      router.replace("/login");
    }
  }, [initialized, user, router]);

  // Still checking auth
  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null; // redirect happens
  }

  // Logged in
  return <>{children}</>;
}