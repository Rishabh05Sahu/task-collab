"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // ✅ IMPORTANT: Store user globally
      setUser(res.data.user);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={handleLogin} disabled={loading} className="w-full">
        {loading ? "Logging in..." : "Login"}
      </Button>
      <p className="text-sm text-center">
        Don’t have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => router.push("/signup")}
        >
          Sign up
        </span>
      </p>
    </div>
  );
}
