"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "../components/Navbar";
import { Brush, BarChart3, Download, Star, Check, Sparkles } from "lucide-react";
import { useToast } from "../components/Toast";

type ColumnInfo = {
  name: string;
  dtype: string;
  missing_values: number;
  unique_values: number;
};

type ProfileReport = {
  num_rows: number;
  num_columns: number;
  duplicate_rows: number;
  columns: ColumnInfo[];
};

type CleaningReport = {
  actions: string[];
  rows_after_cleaning: number;
  columns_after_cleaning: number;
  cleaned_file: string;
};

type TargetColumn = {
  name: string;
  score: number;
  problem_type: string;
  unique_values: number;
  missing_values: number;
  reason: string;
};

type ModelResult = {
  model: string;
  cv_score: number;
  train_score: number;
};

type TrainingReport = {
  problem_type: string;
  target_column: string;
  rows_used: number;
  features_used: string[];
  results: ModelResult[];
  best_model: string;
  best_score: number;
  tuning: {
    default_score: number;
    tuned_score: number;
    best_params: Record<string, string | number | null>;
  };
  detailed_metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1_score?: number;
    mae?: number;
    mse?: number;
    rmse?: number;
    r2_score?: number;
  };
  model_file: string;
};

type TargetAnalysis = {
  recommended_target: string | null;
  columns: TargetColumn[];
};

type EdaChart = {
  title: string;
  type: string;
  image: string;
};

type EdaReport = {
  charts: EdaChart[];
};

// Animation preset
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function UploadPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState<ProfileReport | null>(null);
  const [cleaning, setCleaning] = useState<CleaningReport | null>(null);
  const [targetAnalysis, setTargetAnalysis] = useState<TargetAnalysis | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string>("");
  const [training, setTraining] = useState<TrainingReport | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [eda, setEda] = useState<EdaReport | null>(null);
  const [isEda, setIsEda] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      }
    }
    checkAuth();
  }, [router]);

  async function handleUpload() {
    if (!file) {
      setMessage("Please select a CSV file first.");
      showToast("Please select a CSV file first.", "error");
      return;
    }

    setUploading(true);
    setMessage("");
    setReport(null);
    setCleaning(null);
    setTargetAnalysis(null);
    setSelectedTarget("");
    setTraining(null);
    setEda(null);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to upload.");
      showToast("You must be logged in to upload.", "error");
      setUploading(false);
      return;
    }

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("datasets")
      .upload(filePath, file);

    if (error) {
      setMessage("Upload failed: " + error.message);
      showToast("Upload failed. Please try again.", "error");
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("datasets").insert({
      user_id: user.id,
      file_name: file.name,
      file_path: filePath,
    });

    if (dbError) {
      setMessage("File uploaded but record failed: " + dbError.message);
      showToast("File uploaded but record failed.", "error");
      setUploading(false);
      return;
    }

    setMessage("File uploaded. Analyzing...");
    showToast("File uploaded! Analyzing your data...", "info");

    try {
      const profileForm = new FormData();
      profileForm.append("file", file);
      const profileRes = await fetch("http://localhost:8000/profile", {
        method: "POST",
        body: profileForm,
      });
      if (profileRes.ok) {
        setReport(await profileRes.json());
      }

      const cleanForm = new FormData();
      cleanForm.append("file", file);
      const cleanRes = await fetch("http://localhost:8000/clean", {
        method: "POST",
        body: cleanForm,
      });
      if (cleanRes.ok) {
        setCleaning(await cleanRes.json());
      }

      const targetForm = new FormData();
      targetForm.append("file", file);
      const targetRes = await fetch("http://localhost:8000/analyze-target", {
        method: "POST",
        body: targetForm,
      });
      if (targetRes.ok) {
        const targetData: TargetAnalysis = await targetRes.json();
        setTargetAnalysis(targetData);
        if (targetData.recommended_target) {
          setSelectedTarget(targetData.recommended_target);
        }
      }

      setMessage("Analysis complete! Review the report and choose a target column.");
      showToast("Analysis complete! Choose a target column.", "success");
    } catch {
      setMessage("Uploaded, but could not reach the analysis server.");
      showToast("Could not reach the analysis server.", "error");
    }

    setUploading(false);
  }

  async function handleEda() {
    if (!file) {
      setMessage("Please upload a CSV file first.");
      showToast("Please upload a CSV file first.", "error");
      return;
    }

    setIsEda(true);
    setEda(null);
    setMessage("Generating charts... this may take a moment.");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/eda", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setMessage("Could not generate charts. Please check the backend server.");
        showToast("Could not generate charts.", "error");
        setIsEda(false);
        return;
      }

      const data: EdaReport = await res.json();
      setEda(data);
      setMessage("Charts ready! Scroll down to view your EDA.");
      showToast("Charts ready! Scroll down to view your EDA.", "success");
    } catch {
      setMessage("Could not reach the EDA server. Is it running?");
      showToast("Could not reach the EDA server.", "error");
    }

    setIsEda(false);
  }

  async function handleTrain() {
    if (!file || !selectedTarget) {
      setMessage("Please select a target column first.");
      showToast("Please select a target column first.", "error");
      return;
    }

    setIsTraining(true);
    setTraining(null);
    setMessage("Training models... this may take a moment.");
    showToast("Training models... this may take a moment.", "info");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target_column", selectedTarget);

      const res = await fetch("http://localhost:8000/train", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setMessage("Training failed. Please check the backend server.");
        showToast("Training failed. Check the backend server.", "error");
        setIsTraining(false);
        return;
      }

      const data: TrainingReport = await res.json();
      setTraining(data);
      setMessage("Training complete! Here are your results.");
      showToast("Training complete! 🎉", "success");
    } catch {
      setMessage("Could not reach the training server. Is it running?");
      showToast("Could not reach the training server.", "error");
    }

    setIsTraining(false);
  }

  function scoreColor(score: number): string {
    if (score >= 80) return "#10B981";
    if (score >= 50) return "#F59E0B";
    return "#EF4444";
  }

  return (
    <main className="relative min-h-screen bg-grid overflow-hidden">
      <Navbar />

      {/* Ambient glow */}
      <div
        className="glow-blob"
        style={{
          width: "500px",
          height: "500px",
          background: "#10b981",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.25,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gradient">
            Build a Model
          </h1>
          <p className="mt-3 text-[var(--color-ink-muted)]">
            Upload a CSV and let Algotrix handle the rest — profiling, cleaning,
            analysis, training, and tuning.
          </p>
        </motion.div>

        {/* Upload card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-3xl p-8 mt-8"
        >
          <label className="block">
            <span className="text-sm font-medium text-[var(--color-ink-muted)]">
              Select your dataset
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-3 block w-full text-sm text-[var(--color-ink-muted)]
                file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0
                file:text-sm file:font-semibold file:bg-brand-500/10
                file:text-brand-300 hover:file:bg-brand-500/20
                file:cursor-pointer cursor-pointer
                rounded-xl border border-[var(--color-border)] p-3"
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`mt-5 px-6 py-3 rounded-xl font-semibold transition-all ${uploading
              ? "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] cursor-not-allowed"
              : "bg-brand-500 text-black hover:bg-brand-400 hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5"
              }`}
          >
            {uploading ? "Working..." : "Upload & Analyze"}
          </button>

          {message && (
            <p className="mt-4 text-sm text-[var(--color-ink-muted)]">{message}</p>
          )}
        </motion.div>

        {/* Profile + Cleaning bento */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            >
              {/* Profile stats */}
              <div className="glass rounded-3xl p-6 md:col-span-1">
                <h2 className="text-lg font-bold mb-4">Dataset Profile</h2>
                <div className="space-y-3">
                  <Stat label="Rows" value={report.num_rows} />
                  <Stat label="Columns" value={report.num_columns} />
                  <Stat label="Duplicates" value={report.duplicate_rows} />
                </div>
              </div>

              {/* Cleaning */}
              {cleaning && (
                <div className="glass rounded-3xl p-6 md:col-span-2">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Brush className="w-5 h-5 text-brand-400" strokeWidth={1.5} />
                    Cleaning Report
                  </h2>

                  {cleaning.actions.length === 0 ? (
                    <p className="text-sm text-[var(--color-ink-muted)]">
                      No issues found — your dataset was already clean! ✨
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {cleaning.actions.map((action, i) => (
                        <li
                          key={i}
                          className="text-sm text-[var(--color-ink-muted)] flex items-start gap-2"
                        >
                          <span className="text-brand-400 mt-0.5">✓</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* EDA section */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="glass rounded-3xl p-8 mt-6"
            >
              <h2 className="text-xl font-bold">Exploratory Data Analysis</h2>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                Generate histograms, correlation heatmap, and missing-value charts.
              </p>

              <button
                onClick={handleEda}
                disabled={isEda}
                className={`mt-5 px-6 py-3 rounded-xl font-semibold transition-all ${isEda
                  ? "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] cursor-not-allowed"
                  : "glass-strong text-[var(--color-ink)] hover:border-brand-400/40 hover:-translate-y-0.5"
                  }`}
              >
                {isEda ? (
                  "Generating..."
                ) : (
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" strokeWidth={1.5} />
                    Generate EDA Charts
                  </span>
                )}
              </button>

              {eda && (
                <div className="mt-6">
                  {eda.charts.length === 0 ? (
                    <p className="text-sm text-[var(--color-ink-muted)]">
                      No charts could be generated (no numeric columns).
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {eda.charts.map((chart, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: i * 0.06 }}
                          className="glass rounded-2xl p-4"
                        >
                          <h4 className="text-sm font-semibold mb-3">
                            {chart.title}
                          </h4>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={chart.image}
                            alt={chart.title}
                            className="w-full h-auto rounded-lg bg-white"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Target selection */}
        <AnimatePresence>
          {targetAnalysis && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="glass rounded-3xl p-8 mt-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                  <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Choose Target Column</h2>
                  <p className="text-sm text-[var(--color-ink-muted)]">
                    Algotrix recommends the best column to predict. Pick one to start training.
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {targetAnalysis.columns.map((col, i) => {
                  const isSelected = selectedTarget === col.name;
                  const isRecommended = col.name === targetAnalysis.recommended_target;
                  const scoreLabel =
                    col.score >= 80 ? "Excellent" : col.score >= 50 ? "Good" : "Weak";
                  const color = scoreColor(col.score);

                  return (
                    <motion.div
                      key={col.name}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => setSelectedTarget(col.name)}
                      className={`group relative rounded-2xl p-5 cursor-pointer overflow-hidden transition-all duration-300 ${isSelected
                          ? "ring-2 ring-brand-400 bg-brand-500/[0.06] shadow-xl shadow-brand-500/10"
                          : "border border-[var(--color-border)] hover:border-brand-400/40 hover:bg-white/[0.015]"
                        }`}
                    >
                      {/* Soft glow on selected */}
                      {isSelected && (
                        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
                      )}

                      <div className="relative">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            {/* Radio indicator */}
                            <span
                              className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${isSelected
                                  ? "border-brand-400 bg-brand-400 scale-110"
                                  : "border-[var(--color-ink-dim)] group-hover:border-brand-400/60"
                                }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-black" strokeWidth={3} />
                              )}
                            </span>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-[var(--color-ink)] text-[15px]">
                                  {col.name}
                                </span>
                                {isRecommended && (
                                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300">
                                    <Star className="w-3 h-3 fill-current" />
                                    Recommended
                                  </span>
                                )}
                                <span className="text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]">
                                  {col.problem_type}
                                </span>
                              </div>
                              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ink-muted)] max-w-md">
                                {col.reason}
                              </p>
                            </div>
                          </div>

                          {/* Score */}
                          <div className="text-right shrink-0">
                            <div className="text-xl font-bold tabular-nums" style={{ color }}>
                              {col.score}%
                            </div>
                            <div
                              className="text-[10px] font-semibold uppercase tracking-wide"
                              style={{ color }}
                            >
                              {scoreLabel}
                            </div>
                          </div>
                        </div>

                        {/* Score bar */}
                        <div className="mt-4 h-1.5 rounded-full bg-[var(--color-surface-2)] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${col.score}%` }}
                            transition={{ duration: 0.8, delay: 0.15 + i * 0.05, ease: "easeOut" }}
                            style={{ background: color }}
                          />
                        </div>

                        {/* Meta badges */}
                        <div className="mt-3.5 flex items-center gap-2 text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]">
                            <strong className="text-[var(--color-ink)]">{col.unique_values}</strong> unique
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]">
                            <strong className="text-[var(--color-ink)]">{col.missing_values}</strong> missing
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {selectedTarget && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleTrain}
                  disabled={isTraining}
                  className={`mt-7 px-7 py-3.5 rounded-xl font-semibold transition-all ${isTraining
                      ? "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] cursor-not-allowed"
                      : "bg-brand-500 text-black hover:bg-brand-400 hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5"
                    }`}
                >
                  {isTraining ? "Training..." : `Train Model on "${selectedTarget}"`}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Training results */}
        <AnimatePresence>
          {training && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-6"
            >
              {/* Header + badge */}
              <div className="glass rounded-3xl p-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-2xl font-bold text-gradient">
                    Training Results
                  </h2>
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-bold text-black"
                    style={{
                      background:
                        training.problem_type === "regression"
                          ? "#8B5CF6"
                          : "#10b981",
                    }}
                  >
                    {training.problem_type === "regression"
                      ? "📈 Regression"
                      : "🎯 Classification"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
                  Target: <strong className="text-[var(--color-ink)]">{training.target_column}</strong>{" "}
                  · Rows used:{" "}
                  <strong className="text-[var(--color-ink)]">{training.rows_used}</strong>
                </p>

                {/* Models table */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--color-surface-2)] text-left">
                        <th className="px-4 py-3 font-semibold">Model</th>
                        <th className="px-4 py-3 font-semibold">CV Score</th>
                        <th className="px-4 py-3 font-semibold">Train Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {training.results.map((r) => {
                        const isBest = r.model === training.best_model;
                        return (
                          <tr
                            key={r.model}
                            className={`border-t border-[var(--color-border)] ${isBest ? "bg-brand-500/10" : ""
                              }`}
                          >
                            <td
                              className={`px-4 py-3 ${isBest
                                ? "text-brand-300 font-semibold"
                                : "text-[var(--color-ink-muted)]"
                                }`}
                            >
                              {r.model}
                              {isBest ? " ⭐ Best" : ""}
                            </td>
                            <td className="px-4 py-3 text-[var(--color-ink)]">
                              {r.cv_score}%
                            </td>
                            <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                              {r.train_score}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* ⬇️ Comparison block YAHAN ⬇️ */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-[var(--color-ink-muted)] mb-4">
                    Model Comparison (CV Score)
                  </h3>
                  {/* ...baaki block jo maine pichle message me diya... */}
                </div>

                <p className="mt-4 text-sm">
                  🏆 Best model:{" "}
                  <strong className="text-brand-300">{training.best_model}</strong>{" "}
                  with{" "}
                  <strong className="text-brand-300">{training.best_score}%</strong>{" "}
                  CV score.
                </p>
              </div>

              {/* Hyperparameter tuning */}
              {training.tuning && (
                <div className="glass rounded-3xl p-8">
                  <h3 className="text-lg font-bold mb-5">
                    ⚙️ Hyperparameter Tuning
                  </h3>
                  <div className="flex gap-8 flex-wrap">
                    <div>
                      <div className="text-xs text-[var(--color-ink-muted)]">
                        Before Tuning
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {training.tuning.default_score}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-ink-muted)]">
                        After Tuning
                      </div>
                      <div
                        className="text-2xl font-bold mt-1"
                        style={{
                          color:
                            training.tuning.tuned_score >
                              training.tuning.default_score
                              ? "#34d399"
                              : "var(--color-ink)",
                        }}
                      >
                        {training.tuning.tuned_score}%
                        {training.tuning.tuned_score >
                          training.tuning.default_score
                          ? " ▲"
                          : ""}
                      </div>
                    </div>
                  </div>
                  {Object.keys(training.tuning.best_params).length > 0 ? (
                    <div className="mt-5 text-sm">
                      <span className="text-[var(--color-ink-muted)]">
                        Best settings:{" "}
                      </span>
                      {Object.entries(training.tuning.best_params)
                        .map(([k, v]) => `${k} = ${v}`)
                        .join(", ")}
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-[var(--color-ink-muted)]">
                      This model has no tunable settings.
                    </p>
                  )}
                </div>
              )}

              {/* Detailed metrics */}
              <div className="glass rounded-3xl p-8">
                <h3 className="text-lg font-bold mb-5">
                  Detailed Metrics (Best Model)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {training.problem_type === "classification" ? (
                    <>
                      <Metric label="Accuracy" value={`${training.detailed_metrics.accuracy}%`} />
                      <Metric label="Precision" value={`${training.detailed_metrics.precision}%`} />
                      <Metric label="Recall" value={`${training.detailed_metrics.recall}%`} />
                      <Metric label="F1 Score" value={`${training.detailed_metrics.f1_score}%`} />
                    </>
                  ) : (
                    <>
                      <Metric label="MAE" value={training.detailed_metrics.mae} />
                      <Metric label="MSE" value={training.detailed_metrics.mse} />
                      <Metric label="RMSE" value={training.detailed_metrics.rmse} />
                      <Metric label="R² Score" value={training.detailed_metrics.r2_score} />
                    </>
                  )}
                </div>

                <a
                  href="http://localhost:8000/download-model"
                  className="inline-block mt-7 px-7 py-3.5 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-400 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-5 h-5" strokeWidth={1.5} />
                    Download Model (.pkl)
                  </span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ---------- Small reusable bits ---------- */
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-[var(--color-ink-muted)]">{label}</span>
      <span className="text-lg font-bold text-[var(--color-ink)]">{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="glass-strong rounded-2xl p-4 text-center">
      <div className="text-xs text-[var(--color-ink-muted)]">{label}</div>
      <div className="text-xl font-bold mt-1 text-[var(--color-ink)]">{value}</div>
    </div>
  );
}
