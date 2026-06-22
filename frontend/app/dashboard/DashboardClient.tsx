"use client";

import { motion } from "motion/react";
import Link from "next/link";
import LogoutButton from "./logout-button";
import Logo from "../components/Logo";
import {
  FileText,
  Database,
  Sparkles,
  TrendingUp,
  Upload,
  BarChart3,
  Target,
  Clock,
  ArrowRight,
  Zap,
} from "lucide-react";

type Dataset = {
  file_name: string;
  created_at: string | null;
};

type Props = {
  firstName: string;
  email: string;
  datasets: Dataset[];
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function DashboardClient({ firstName, email, datasets }: Props) {
  const totalDatasets = datasets.length;

  // ✅ Only show 3 most recent on the dashboard
  const recentDatasets = datasets.slice(0, 3);

  const lastActivity =
    datasets.length > 0 && datasets[0].created_at
      ? new Date(datasets[0].created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : "—";

  const now = new Date();
  const thisMonth = datasets.filter((d) => {
    if (!d.created_at) return false;
    const date = new Date(d.created_at);
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <main className="relative min-h-screen bg-grid overflow-hidden">
      {/* Ambient glows */}
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
      <div
        className="glow-blob"
        style={{
          width: "400px",
          height: "400px",
          background: "#10b981",
          bottom: "-100px",
          left: "-150px",
          opacity: 0.12,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <LogoutButton />
        </motion.div>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-brand-300 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
            Dashboard
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gradient">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-3 text-[var(--color-ink-muted)]">
            Logged in as{" "}
            <span className="text-brand-300 font-medium">{email}</span>
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10"
        >
          <StatCard
            icon={<Database className="w-5 h-5" strokeWidth={1.5} />}
            label="Total Datasets"
            value={totalDatasets}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" strokeWidth={1.5} />}
            label="This Month"
            value={thisMonth}
          />
          <StatCard
            icon={<Clock className="w-5 h-5" strokeWidth={1.5} />}
            label="Last Activity"
            value={lastActivity}
          />
          <StatCard
            icon={<Zap className="w-5 h-5" strokeWidth={1.5} />}
            label="Status"
            value="Active"
            accent
          />
        </motion.div>

        {/* Quick actions */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-10"
        >
          <motion.h2 variants={item} className="text-xl font-bold mb-5">
            Quick actions
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div variants={item} className="md:col-span-2">
              <Link
                href="/upload"
                className="group block glass rounded-3xl p-7 h-full hover:border-brand-400/40 transition-all relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl group-hover:bg-brand-500/20 transition-all" />
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-5">
                    <Upload className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold">Build a new model</h3>
                  <p className="text-sm text-[var(--color-ink-muted)] mt-2 max-w-md">
                    Upload a CSV and let Algotrix automatically clean, analyze,
                    train, and tune a machine learning model for you.
                  </p>
                  <span className="inline-flex items-center gap-2 mt-5 text-brand-300 font-semibold text-sm">
                    Start building
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={item} className="flex flex-col gap-4">
              {/* ✅ View all datasets quick link */}
              <Link
                href="/dashboard/datasets"
                className="group glass rounded-3xl p-6 flex items-center gap-4 hover:border-brand-400/30 transition-all flex-1"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                  <Database className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-semibold text-sm">All datasets</div>
                  <div className="text-xs text-[var(--color-ink-muted)]">
                    {totalDatasets} uploaded
                  </div>
                </div>
              </Link>

              <Link
                href="/#how"
                className="group glass rounded-3xl p-6 flex items-center gap-4 hover:border-brand-400/30 transition-all flex-1"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                  <Target className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-semibold text-sm">How it works</div>
                  <div className="text-xs text-[var(--color-ink-muted)]">
                    Learn the flow
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Recent datasets — only 3 + View all */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-8 mt-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Recent datasets</h2>
            {totalDatasets > 0 && (
              <Link
                href="/dashboard/datasets"
                className="text-sm text-brand-300 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {recentDatasets.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mx-auto mb-4">
                <Sparkles className="w-7 h-7" strokeWidth={1.5} />
              </div>
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
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {recentDatasets.map((ds, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] hover:border-brand-400/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                      <FileText className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="font-medium text-[var(--color-ink)]">
                        {ds.file_name}
                      </div>
                      <div className="text-xs text-[var(--color-ink-dim)]">
                        {ds.created_at
                          ? new Date(ds.created_at).toLocaleString()
                          : "Date unavailable"}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 font-medium">
                    Uploaded
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

/* ---------- Reusable Stat Card ---------- */
function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      className="glass rounded-3xl p-6 transition-colors hover:border-brand-400/30"
    >
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${
          accent
            ? "bg-brand-500/20 text-brand-300"
            : "bg-brand-500/10 text-brand-400"
        }`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold text-[var(--color-ink)]">{value}</div>
      <div className="text-sm text-[var(--color-ink-muted)] mt-1">{label}</div>
    </motion.div>
  );
}
