"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Upload,
  ScanSearch,
  Brush,
  Target,
  Cpu,
  Sliders,
  BarChart3,
  Download,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload your CSV",
    desc: "Drag and drop any CSV dataset. Algotrix securely stores it and instantly starts reading your data — no formatting or setup required.",
  },
  {
    icon: ScanSearch,
    title: "Automatic profiling",
    desc: "We scan every column to detect data types, missing values, duplicates, and unique counts — giving you a complete health report of your dataset.",
  },
  {
    icon: Brush,
    title: "Smart cleaning",
    desc: "Duplicates are removed, missing values are handled, categorical columns are encoded, and numeric features are scaled — all without leaking the target.",
  },
  {
    icon: Target,
    title: "Target suggestion",
    desc: "Algotrix analyzes each column and recommends the best target to predict, with a confidence score and a clear reason for every suggestion.",
  },
  {
    icon: Cpu,
    title: "Auto model training",
    desc: "We automatically detect classification vs regression and train three models with cross-validation, then pick the best performer for you.",
  },
  {
    icon: Sliders,
    title: "Hyperparameter tuning",
    desc: "The winning model is fine-tuned with grid search to squeeze out the best possible performance — automatically.",
  },
  {
    icon: BarChart3,
    title: "Charts & metrics",
    desc: "View histograms, correlation heatmaps, and honest metrics — accuracy, precision, recall, F1 for classification, or MAE, RMSE, R² for regression.",
  },
  {
    icon: Download,
    title: "Download your model",
    desc: "Get your trained model as a ready-to-use .pkl file. Plug it into your own apps and start making predictions right away.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen bg-grid overflow-hidden">
      <Navbar />

      {/* Glow */}
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

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-brand-300 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
            How it works
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gradient leading-tight">
            From raw data to a trained model — in 8 steps
          </h1>
          <p className="mt-5 text-lg text-[var(--color-ink-muted)] max-w-2xl mx-auto">
            Algotrix automates the entire machine learning pipeline. Here&apos;s
            exactly what happens after you upload a CSV.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="mt-16 relative">
          {/* vertical line */}
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-500/50 via-brand-500/20 to-transparent hidden sm:block" />

          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex gap-5 items-start"
                >
                  {/* Number + icon */}
                  <div className="relative shrink-0">
                    <div className="h-14 w-14 rounded-2xl glass-strong flex items-center justify-center text-brand-400 relative z-10">
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-brand-500 text-black text-xs font-bold flex items-center justify-center z-20">
                      {i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="glass rounded-3xl p-6 flex-1 hover:border-brand-400/30 transition-colors">
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm text-[var(--color-ink-muted)] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-10 mt-16 text-center relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-brand-500/10 blur-3xl" />
          <h2 className="text-3xl font-bold text-gradient relative">
            Ready to build your first model?
          </h2>
          <p className="mt-3 text-[var(--color-ink-muted)] relative">
            No code, no setup. Just upload and let Algotrix do the rest.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-400 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5 relative"
          >
            Start Building Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
