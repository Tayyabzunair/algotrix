"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup() {
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Account created successfully! You can now log in.");
    }
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "400px" }}>
      <h1>Sign Up for Algotrix</h1>

      <div style={{ marginTop: "20px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button
          onClick={handleSignup}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Sign Up
        </button>
      </div>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </main>
  );
}
