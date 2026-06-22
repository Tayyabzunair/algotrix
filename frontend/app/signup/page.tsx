"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import AuthRobot from "../components/AuthRobot";
import { useRouter } from "next/navigation";


export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup() {
    setMessage("");
    setSuccess(false);

    // ----- Validation -----
    if (!firstName.trim() || !lastName.trim()) {
      setMessage("Please enter your first and last name.");
      return;
    }
    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      },
    });

    if (error) {
      setMessage("Error: " + error.message);
      setSuccess(false);
    } else {
      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
      setSuccess(true);
    }
    setLoading(false);
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
            Create your account
          </h1>
          <p className="mt-2 text-[var(--color-ink-muted)]">
            Start building ML models in minutes — no code required.
          </p>

          <div className="glass rounded-3xl p-8 mt-8 space-y-4">
            {/* First + Last name side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-[var(--color-ink-muted)]">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="Your First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-brand-400/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-ink-muted)]">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Your Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-brand-400/50 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-[var(--color-ink-muted)]">Email</label>
              <input
                type="email"
                placeholder="E-mail Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-brand-400/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-[var(--color-ink-muted)]">
                Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-brand-400/50 transition-colors"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm text-[var(--color-ink-muted)]">
                Confirm password
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-dim)] focus:outline-none focus:border-brand-400/50 transition-colors"
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${loading
                  ? "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] cursor-not-allowed"
                  : "bg-brand-500 text-black hover:bg-brand-400 hover:shadow-xl hover:shadow-brand-500/30"
                }`}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

            {message && (
              <p
                className={`text-sm text-center ${success ? "text-brand-300" : "text-red-400"
                  }`}
              >
                {message}
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-[var(--color-ink-muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-300 hover:text-brand-400 font-semibold"
            >
              Log in
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
