"use client";

import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

export function AuthInitializer() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // ✅ use existing route
        const res = await axios.get("/api/me");
        setUser(res.data);
      } catch {
        clearUser();
      } finally {
        setInitialized();
      }
    };

    restoreSession();
  }, [setUser, clearUser, setInitialized]);

  return null;
}