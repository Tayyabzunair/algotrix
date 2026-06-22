"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleReset() {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setMessage("Check your email for a password reset link.");
    setLoading(false);
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
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-muted)] hover:text-brand-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {sent ? (
          <div className="text-center py-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
              We&apos;ve sent a password reset link to{" "}
              <span className="text-brand-300 font-medium">{email}</span>.
              Follow the link to set a new password.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gradient">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-ink-dim)]" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-strong text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] outline-none focus:border-brand-400/40 transition-colors"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
              {message && <p className="text-sm text-brand-300">{message}</p>}

              <button
                onClick={handleReset}
                disabled={loading}
                className={`w-full py-3.5 rounded-2xl font-semibold transition-all ${
                  loading
                    ? "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] cursor-not-allowed"
                    : "bg-brand-500 text-black hover:bg-brand-400 hover:shadow-xl hover:shadow-brand-500/30"
                }`}
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
