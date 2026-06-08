"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleLogin() {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "400px" }}>
      <h1>Login to Algotrix</h1>
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
        <button onClick={handleLogin} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Login
        </button>
      </div>
      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </main>
  );
}
