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

  const handleSignup = async () => {
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // store user in global state
      setUser(res.data.user);

      router.push("/dashboard");
    } catch (error: any) {
      alert(
        error.response?.data?.error || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">
        Create Account
      </h1>

      <Input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

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
          onClick={() =>
            router.push("/login")
          }
        >
          Login
        </span>
      </p>
    </div>
  );
}