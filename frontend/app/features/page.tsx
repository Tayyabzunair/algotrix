"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Bot,
  BarChart3,
  Sparkles,
  LineChart,
  Target,
  Download,
  CircleCheck,
  ScanSearch,
  Sliders,
  Shield,
  Zap,
  Layers,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Smart Auto-Training",
    desc: "Automatically detects classification vs regression, trains multiple models with cross-validation, and selects the best performer — no ML knowledge needed.",
  },
  {
    icon: ScanSearch,
    title: "Auto Data Profiling",
    desc: "Instantly analyzes every column for data types, missing values, duplicates, and unique counts to give you a complete dataset health report.",
  },
  {
    icon: Sparkles,
    title: "Intelligent Cleaning",
    desc: "Removes duplicates, handles missing values, encodes categories, and scales features automatically — all while preventing target leakage.",
  },
  {
    icon: Target,
    title: "Target Suggestion",
    desc: "Recommends the best column to predict with a confidence score and a clear, human-readable reason for every suggestion.",
  },
  {
    icon: Sliders,
    title: "Hyperparameter Tuning",
    desc: "Fine-tunes the winning model with grid search to automatically extract the best possible performance from your data.",
  },
  {
    icon: LineChart,
    title: "Visual EDA Charts",
    desc: "Generates histograms, correlation heatmaps, and missing-value charts so you can understand your data at a glance.",
  },
  {
    icon: CircleCheck,
    title: "Honest Metrics",
    desc: "Shows real cross-validated scores — accuracy, precision, recall, F1 for classification, or MAE, RMSE, R² for regression. No inflated numbers.",
  },
  {
    icon: Download,
    title: "Download Your Model",
    desc: "Export your trained model as a ready-to-use .pkl file and integrate it into your own applications immediately.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your data is isolated per account with row-level security. No user can ever access another user's datasets or models.",
  },
];

const highlights = [
  { icon: Zap, label: "Minutes, not months", value: "Build models fast" },
  { icon: Layers, label: "End-to-end pipeline", value: "Fully automated" },
  { icon: BarChart3, label: "No code required", value: "Just upload a CSV" },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen bg-grid overflow-hidden">
      <Navbar />

      <div
        className="glow-blob"
        style={{
          width: "500px",
          height: "500px",
          background: "#10b981",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.2,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-brand-300 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
            Features
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gradient leading-tight">
            Everything you need to build ML models
          </h1>
          <p className="mt-5 text-lg text-[var(--color-ink-muted)] max-w-2xl mx-auto">
            Algotrix handles the entire machine learning workflow — from raw CSV
            to a tuned, downloadable model — so you can focus on results.
          </p>
        </motion.div>

        {/* Highlights row */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12"
        >
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={i}
                variants={item}
                className="glass rounded-3xl p-6 flex items-center gap-4"
              >
                <div className="h-12 w-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-bold">{h.value}</div>
                  <div className="text-sm text-[var(--color-ink-muted)]">
                    {h.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -6 }}
                className="glass rounded-3xl p-7 hover:border-brand-400/30 transition-colors group"
              >
                <div className="h-12 w-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-5 group-hover:bg-brand-500/20 transition-colors">
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)] leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-10 mt-12 text-center relative overflow-hidden"
        >
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-brand-500/10 blur-3xl" />
          <h2 className="text-3xl font-bold text-gradient relative">
            See it in action
          </h2>
          <p className="mt-3 text-[var(--color-ink-muted)] relative">
            Upload a dataset and watch Algotrix build a model in minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-400 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5 relative"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
