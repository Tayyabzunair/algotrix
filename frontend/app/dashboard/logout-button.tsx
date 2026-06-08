"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <button onClick={handleLogout} style={{ padding: "10px 20px", cursor: "pointer", marginTop: "20px" }}>
      Logout
    </button>
  );
}
