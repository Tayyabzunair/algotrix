"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { Lock, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleUpdate() {
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);

    // Redirect to login after 2 seconds
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <main className="relative min-h-screen bg-grid flex items-center justify-center px-6 overflow-hidden">
      <div
        className="glow-blob"
        style={{
          width: "450px",
          height: "450px",
          background: "#10b981",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.2,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md glass rounded-3xl p-8"
      >
        {done ? (
          <div className="text-center py-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold">Password updated!</h1>
            <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
              Redirecting you to login...
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gradient">
              Set new password
            </h1>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Enter a new password for your account.
            </p>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-ink-dim)]" />
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-strong text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] outline-none focus:border-brand-400/40 transition-colors"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-ink-dim)]" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-strong text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] outline-none focus:border-brand-400/40 transition-colors"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`w-full py-3.5 rounded-2xl font-semibold transition-all ${
                  loading
                    ? "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] cursor-not-allowed"
                    : "bg-brand-500 text-black hover:bg-brand-400 hover:shadow-xl hover:shadow-brand-500/30"
                }`}
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
