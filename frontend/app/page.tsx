"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {
  Bot,
  BarChart3,
  Sparkles,
  LineChart,
  Target,
  Download,
  CircleCheck,
} from "lucide-react";


// Reusable animation presets
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-grid">
      <Navbar />

      {/* Ambient glow blobs */}
      <div
        className="glow-blob"
        style={{
          width: "500px",
          height: "500px",
          background: "#10b981",
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <div
        className="glow-blob"
        style={{
          width: "400px",
          height: "400px",
          background: "#059669",
          bottom: "-100px",
          right: "-100px",
          opacity: 0.3,
        }}
      />

      {/* ============ HERO ============ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-[var(--color-ink-muted)] mb-8"
        >
          <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
          Powered by AutoML — no code required
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight"
        >
          <span className="text-gradient">From raw data to a</span>
          <br />
          <span className="text-gradient-brand">trained model</span>
          <span className="text-gradient"> in minutes</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-7 text-lg text-[var(--color-ink-muted)] max-w-2xl mx-auto leading-relaxed"
        >
          Upload a CSV and Algotrix automatically cleans, analyzes, trains, and
          tunes machine learning models for you — complete with charts, metrics,
          and a downloadable model.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/signup"
            className="px-7 py-3.5 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-400 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5"
          >
            Start Building Free →
          </Link>
          <Link
            href="/#how"
            className="px-7 py-3.5 rounded-xl glass text-[var(--color-ink)] font-medium hover:border-brand-400/40 transition-all"
          >
            See How it Works
          </Link>
        </motion.div>
      </section>

      {/* ============ BENTO FEATURES ============ */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">
            Everything you need, automated
          </h2>
          <p className="mt-4 text-[var(--color-ink-muted)] max-w-xl mx-auto">
            A complete machine learning pipeline that runs end-to-end, so you can
            focus on results.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]"
        >
          {/* Big feature — spans 2 cols + 2 rows */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-8 md:col-span-2 md:row-span-2 flex flex-col justify-between hover:border-brand-400/30 transition-all group relative overflow-hidden"
          >
            <div
              className="glow-blob"
              style={{ width: "300px", height: "300px", background: "#10b981", top: "-80px", right: "-80px", opacity: 0.2 }}
            />
            <div className="relative z-10">
              <Bot className="w-10 h-10 text-brand-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-3">Smart Auto-Training</h3>
              <p className="text-[var(--color-ink-muted)] leading-relaxed max-w-md">
                Algotrix auto-detects whether your problem is classification or
                regression, trains multiple models, runs cross-validation, and
                picks the best one — then tunes its hyperparameters with GridSearch.
              </p>
            </div>
            <div className="relative z-10 flex gap-2 flex-wrap mt-6">
              {["Logistic Regression", "Random Forest", "Decision Tree", "GridSearch"].map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Profiling */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="glass rounded-3xl p-6 hover:border-brand-400/30 transition-all flex flex-col justify-between">
            <BarChart3 className="w-8 h-8 text-brand-400" strokeWidth={1.5} />
            <div>
              <h3 className="text-lg font-bold mb-1">Auto Data Profiling</h3>
              <p className="text-sm text-[var(--color-ink-muted)]">Rows, columns, duplicates & missing values detected instantly.</p>
            </div>
          </motion.div>

          {/* Cleaning */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="glass rounded-3xl p-6 hover:border-brand-400/30 transition-all flex flex-col justify-between">
            <Sparkles className="w-8 h-8 text-brand-400" strokeWidth={1.5} />
            <div>
              <h3 className="text-lg font-bold mb-1">Smart Cleaning</h3>
              <p className="text-sm text-[var(--color-ink-muted)]">Removes duplicates, imputes missing data, scales & encodes automatically.</p>
            </div>
          </motion.div>

          {/* EDA Charts — wide */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="glass rounded-3xl p-6 md:col-span-2 hover:border-brand-400/30 transition-all flex items-center gap-5">
            <LineChart className="w-8 h-8 text-brand-400" strokeWidth={1.5} />
            <div>
              <h3 className="text-lg font-bold mb-1">Visual EDA Charts</h3>
              <p className="text-sm text-[var(--color-ink-muted)]">Histograms, correlation heatmaps & missing-value charts generated for every dataset.</p>
            </div>
          </motion.div>

          {/* Target recommendation */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="glass rounded-3xl p-6 hover:border-brand-400/30 transition-all flex flex-col justify-between">
            <Target className="w-8 h-8 text-brand-400" strokeWidth={1.5} />
            <div>
              <h3 className="text-lg font-bold mb-1">Target Suggestion</h3>
              <p className="text-sm text-[var(--color-ink-muted)]">Confidence-scored recommendations for the best column to predict.</p>
            </div>
          </motion.div>

          {/* Download */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="glass rounded-3xl p-6 hover:border-brand-400/30 transition-all flex flex-col justify-between">
            <Download className="w-8 h-8 text-brand-400" strokeWidth={1.5} />
            <div>
              <h3 className="text-lg font-bold mb-1">Download Model</h3>
              <p className="text-sm text-[var(--color-ink-muted)]">Export the full trained pipeline as a ready-to-use .pkl file.</p>
            </div>
          </motion.div>

          {/* Metrics */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="glass rounded-3xl p-6 hover:border-brand-400/30 transition-all flex flex-col justify-between">
            <CircleCheck className="w-8 h-8 text-brand-400" strokeWidth={1.5} />
            <div>
              <h3 className="text-lg font-bold mb-1">Honest Metrics</h3>
              <p className="text-sm text-[var(--color-ink-muted)]">Accuracy, F1, R², RMSE & more — with leakage-free cross-validation.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gradient">
            Three steps. That&apos;s it.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { n: "01", t: "Upload your CSV", d: "Drag in any dataset. Algotrix profiles and cleans it automatically." },
            { n: "02", t: "Pick your target", d: "Choose what to predict — we recommend the best column for you." },
            { n: "03", t: "Train & download", d: "Models are trained, tuned, and ready to download in one click." },
          ].map((step) => (
            <motion.div
              key={step.n}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="glass rounded-3xl p-8 hover:border-brand-400/30 transition-all"
            >
              <div className="text-5xl font-bold text-gradient-brand mb-4">{step.n}</div>
              <h3 className="text-xl font-bold mb-2">{step.t}</h3>
              <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">{step.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="glow-blob" style={{ width: "400px", height: "400px", background: "#10b981", top: "-150px", left: "50%", transform: "translateX(-50%)", opacity: 0.25 }} />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-4">
              Ready to build your first model?
            </h2>
            <p className="text-[var(--color-ink-muted)] mb-8 max-w-md mx-auto">
              No setup, no code. Upload your data and get a trained model in minutes.
            </p>
            <Link
              href="/upload"
              className="inline-block px-8 py-4 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-400 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5"
            >
              Get Started — It&apos;s Free
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
       </main>
  );
}
