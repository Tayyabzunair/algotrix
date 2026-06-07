import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const supabase = createClient();

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Algotrix</h1>
      <p>Supabase client created successfully ✅</p>
      <p>Connection object exists: {supabase ? "Yes" : "No"}</p>
    </main>
  );
}
