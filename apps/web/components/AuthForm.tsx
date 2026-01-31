"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch, safeErrorMessage } from "@/lib/api";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);
    const endpoint = mode === "login" ? "login" : "signup";
    const result = await apiFetch<{ detail?: string }>(`/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!result.ok) {
      setStatus(safeErrorMessage(result, "Unable to authenticate"));
      return;
    }
    setStatus(mode === "login" ? "Logged in! Redirecting to dashboard." : "Account created. Redirecting.");
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </label>
      <button className="w-full rounded-lg bg-violetfund-700 px-4 py-2 text-white">
        {mode === "login" ? "Login" : "Create account"}
      </button>
      {status && <p className="text-sm text-slate-600">{status}</p>}
    </form>
  );
}
