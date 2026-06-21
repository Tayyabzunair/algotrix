"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import AuthRobot from "../components/AuthRobot";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    setMessage("");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Error: " + error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="relative min-h-screen flex bg-grid overflow-hidden">
      {/* LEFT — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-bold text-black text-lg">
              A
            </div>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Algotrix
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-gradient">
            Welcome back
          </h1>
          <p className="mt-2 text-[var(--color-ink-muted)]">
            Log in to continue building models.
          </p>

          <div className="glass rounded-3xl p-8 mt-8 space-y-4">
            <div>
              <label className="text-sm text-[var(--color-ink-muted)]">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-brand-400/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-[var(--color-ink-muted)]">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-brand-400/50 transition-colors"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                loading
                  ? "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] cursor-not-allowed"
                  : "bg-brand-500 text-black hover:bg-brand-400 hover:shadow-xl hover:shadow-brand-500/30"
              }`}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            {message && (
              <p className="text-sm text-red-400 text-center">{message}</p>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-[var(--color-ink-muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-300 hover:text-brand-400 font-semibold">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* RIGHT — Robot (desktop only) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <AuthRobot />
      </div>
    </main>
  );
}
