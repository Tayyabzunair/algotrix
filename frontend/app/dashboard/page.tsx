import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Algotrix Dashboard</h1>
      <p>Welcome, {user.email} 👋</p>
      <p>You are logged in successfully.</p>
      <LogoutButton />
    </main>
  );
}
