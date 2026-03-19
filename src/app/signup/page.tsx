"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isValidEmail = (value: string) => {
    return /^\S+@\S+\.\S+$/.test(value.trim());
  };

  const handleSignup = async () => {
    setErrorMsg(null);

    // Frontend validation (fast UX)
    if (name.trim().length < 2) {
      setErrorMsg("Name must be at least 2 characters.");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      setUser(res.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">Create Account</h1>

      <Input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        type="email"
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

      {errorMsg && (
        <p className="text-sm text-rose-300">{errorMsg}</p>
      )}

      <Button
        onClick={handleSignup}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Creating..." : "Sign Up"}
      </Button>

      <p className="text-sm text-center">
        Already have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}