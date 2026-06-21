import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { FileText } from "lucide-react";


export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's uploaded datasets
  const { data: datasets } = await supabase
    .from("datasets")
    .select("file_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const datasetList = datasets ?? [];

  return (
    <main className="relative min-h-screen bg-grid overflow-hidden">
      {/* Ambient glow */}
      <div
        className="glow-blob"
        style={{
          width: "500px",
          height: "500px",
          background: "#10b981",
          top: "-150px",
          right: "-100px",
          opacity: 0.2,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Top bar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link href="/" className="flex items-center gap-2">
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
          <LogoutButton />
        </div>

        {/* Welcome */}
        <div className="mt-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gradient">
            Welcome back 👋
          </h1>
          <p className="mt-3 text-[var(--color-ink-muted)]">
            Logged in as{" "}
            <span className="text-brand-300 font-medium">{user.email}</span>
          </p>
        </div>

        {/* Stat / Action bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {/* Datasets count */}
          <div className="glass rounded-3xl p-6">
            <div className="text-sm text-[var(--color-ink-muted)]">
              Datasets uploaded
            </div>
            <div className="text-4xl font-bold mt-2 text-gradient-brand">
              {datasetList.length}
            </div>
          </div>

          {/* CTA — build model (spans 2) */}
          <Link
            href="/upload"
            className="glass rounded-3xl p-6 md:col-span-2 flex items-center justify-between hover:border-brand-400/30 transition-all group"
          >
            <div>
              <div className="text-lg font-bold">Build a new model</div>
              <p className="text-sm text-[var(--color-ink-muted)] mt-1">
                Upload a CSV and train a model in minutes.
              </p>
            </div>
            <span className="text-2xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Recent datasets */}
        <div className="glass rounded-3xl p-8 mt-6">
          <h2 className="text-xl font-bold mb-5">Your datasets</h2>

          {datasetList.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[var(--color-ink-muted)]">
                No datasets yet. Upload your first one to get started!
              </p>
              <Link
                href="/upload"
                className="inline-block mt-5 px-6 py-3 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-400 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5"
              >
                Upload Dataset
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {datasetList.map((ds, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] hover:border-brand-400/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-brand-400" strokeWidth={1.5} />
                    <div>
                      <div className="font-medium text-[var(--color-ink)]">
                        {ds.file_name}
                      </div>
                      <div className="text-xs text-[var(--color-ink-dim)]">
                        {ds.created_at
                          ? new Date(ds.created_at).toLocaleString()
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
