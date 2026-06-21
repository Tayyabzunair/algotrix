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
    <button
      onClick={handleLogout}
      className="px-5 py-2.5 rounded-xl text-sm font-semibold glass-strong text-[var(--color-ink)] hover:border-red-400/40 hover:text-red-300 transition-all"
    >
      Log out
    </button>
  );
}
