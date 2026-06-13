"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
  test_accuracy: number;
  cv_accuracy: number;
  train_accuracy: number;
  health: string;
};

type TrainingReport = {
  target_column: string;
  rows_used: number;
  features_used: string[];
  results: ModelResult[];
  best_model: string;
  best_accuracy: number;
  model_file: string;
};

type TargetAnalysis = {
  recommended_target: string | null;
  columns: TargetColumn[];
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState<ProfileReport | null>(null);
  const [cleaning, setCleaning] = useState<CleaningReport | null>(null);
  const [targetAnalysis, setTargetAnalysis] = useState<TargetAnalysis | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string>("");
  const [training, setTraining] = useState<TrainingReport | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  async function handleUpload() {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    setUploading(true);
    setMessage("");
    setReport(null);
    setCleaning(null);
    setTargetAnalysis(null);
    setSelectedTarget("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to upload.");
      setUploading(false);
      return;
    }

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("datasets")
      .upload(filePath, file);

    if (error) {
      setMessage("Upload failed: " + error.message);
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
      setUploading(false);
      return;
    }

    setMessage("File uploaded. Analyzing...");

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
    } catch {
      setMessage("Uploaded, but could not reach the analysis server.");
    }

    setUploading(false);
  }

  async function handleTrain() {
    if (!file || !selectedTarget) {
      setMessage("Please select a target column first.");
      return;
    }

    setIsTraining(true);
    setTraining(null);
    setMessage("Training models... this may take a moment.");

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
        setIsTraining(false);
        return;
      }

      const data: TrainingReport = await res.json();
      setTraining(data);
      setMessage("Training complete! Here are your results.");
    } catch {
      setMessage("Could not reach the training server. Is it running?");
    }

    setIsTraining(false);
  }

  function scoreColor(score: number): string {
    if (score >= 80) return "#10B981";
    if (score >= 50) return "#F59E0B";
    return "#EF4444";
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "750px" }}>
      <h1>Upload Dataset</h1>
      <p>Select a CSV file to upload and analyze.</p>

      <div style={{ marginTop: "20px" }}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          style={{ display: "block", marginBottom: "15px" }}
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {uploading ? "Working..." : "Upload & Analyze"}
        </button>
      </div>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}

      {report && (
        <div style={{ marginTop: "30px" }}>
          <h2>Dataset Profile</h2>
          <p>Rows: {report.num_rows} | Columns: {report.num_columns} | Duplicates: {report.duplicate_rows}</p>
        </div>
      )}

      {cleaning && (
        <div style={{ marginTop: "25px" }}>
          <h2>Cleaning Report</h2>
          <ul>
            {cleaning.actions.length === 0 ? (
              <li>No issues found. Dataset was already clean!</li>
            ) : (
              cleaning.actions.map((action, index) => (
                <li key={index} style={{ marginBottom: "6px" }}>{action}</li>
              ))
            )}
          </ul>
        </div>
      )}

      {targetAnalysis && (
        <div style={{ marginTop: "30px" }}>
          <h2>Choose Target Column</h2>
          <p style={{ color: "#10B981" }}>
            ⭐ Recommended: <strong>{targetAnalysis.recommended_target}</strong>
          </p>

          <div style={{ marginTop: "15px" }}>
            {targetAnalysis.columns.map((col) => (
              <div
                key={col.name}
                onClick={() => setSelectedTarget(col.name)}
                style={{
                  border: selectedTarget === col.name ? "2px solid #10B981" : "1px solid #444",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "10px",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>
                    {col.name}
                    {col.name === targetAnalysis.recommended_target ? " ⭐" : ""}
                  </strong>
                  <span style={{ color: scoreColor(col.score) }}>{col.score}%</span>
                </div>

                <div style={{ background: "#222", borderRadius: "4px", height: "8px", marginTop: "8px" }}>
                  <div
                    style={{
                      width: `${col.score}%`,
                      background: scoreColor(col.score),
                      height: "100%",
                      borderRadius: "4px",
                    }}
                  />
                </div>

                <p style={{ fontSize: "13px", color: "#aaa", marginTop: "8px" }}>{col.reason}</p>
              </div>
            ))}
          </div>

          {selectedTarget && (
            <p style={{ marginTop: "15px" }}>
              Selected target: <strong>{selectedTarget}</strong>
            </p>
          )}

          {selectedTarget && (
            <div style={{ marginTop: "24px" }}>
              <button
                onClick={handleTrain}
                disabled={isTraining}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  backgroundColor: isTraining ? "#9CA3AF" : "#10B981",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isTraining ? "not-allowed" : "pointer",
                }}
              >
                {isTraining ? "Training..." : `Train Model on "${selectedTarget}"`}
              </button>
            </div>
          )}

          {training && (
            <div style={{ marginTop: "24px" }}>
              <h2>Training Results</h2>
              <p>
                Target column: <strong>{training.target_column}</strong> | Rows used:{" "}
                <strong>{training.rows_used}</strong>
              </p>

              <table style={{ borderCollapse: "collapse", marginTop: "12px", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Model</th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>CV Accuracy</th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Train Accuracy</th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Health</th>
                  </tr>
                </thead>
                <tbody>
                  {training.results.map((r) => (
                    <tr
                      key={r.model}
                      style={{
                        backgroundColor:
                          r.model === training.best_model ? "#D1FAE5" : "transparent",
                      }}
                    >
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {r.model}
                        {r.model === training.best_model ? " ⭐ Best" : ""}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {r.cv_accuracy}%
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {r.train_accuracy}%
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          color: r.health === "Healthy" ? "#10B981" : "#EF4444",
                        }}
                      >
                        {r.health}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p style={{ marginTop: "12px" }}>
                🏆 Best model: <strong>{training.best_model}</strong> with{" "}
                <strong>{training.best_accuracy}%</strong> CV accuracy.
              </p>

              <a
                href="http://localhost:8000/download-model"
                style={{
                  display: "inline-block",
                  marginTop: "12px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  backgroundColor: "#3B82F6",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                ⬇️ Download Model (.pkl)
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
