import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const firstName =
    user.user_metadata?.first_name ||
    user.email?.split("@")[0] ||
    "there";

  const { data: datasets } = await supabase
    .from("datasets")
    .select("file_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardClient
      firstName={firstName}
      email={user.email ?? ""}
      datasets={datasets ?? []}
    />
  );
}
