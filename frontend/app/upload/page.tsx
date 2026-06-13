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

// Type for each scored column from the target analyzer
type TargetColumn = {
  name: string;
  score: number;
  problem_type: string;
  unique_values: number;
  missing_values: number;
  reason: string;
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

    // 1) Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("datasets")
      .upload(filePath, file);

    if (error) {
      setMessage("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    // 2) Save record in database
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
      // 3) Profile
      const profileForm = new FormData();
      profileForm.append("file", file);
      const profileRes = await fetch("http://localhost:8000/profile", {
        method: "POST",
        body: profileForm,
      });
      if (profileRes.ok) {
        setReport(await profileRes.json());
      }

      // 4) Clean
      const cleanForm = new FormData();
      cleanForm.append("file", file);
      const cleanRes = await fetch("http://localhost:8000/clean", {
        method: "POST",
        body: cleanForm,
      });
      if (cleanRes.ok) {
        setCleaning(await cleanRes.json());
      }

      // 5) Analyze target columns
      const targetForm = new FormData();
      targetForm.append("file", file);
      const targetRes = await fetch("http://localhost:8000/analyze-target", {
        method: "POST",
        body: targetForm,
      });
      if (targetRes.ok) {
        const targetData: TargetAnalysis = await targetRes.json();
        setTargetAnalysis(targetData);
        // Pre-select the recommended target
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

  // Helper: choose a color based on score
  function scoreColor(score: number): string {
    if (score >= 80) return "#10B981"; // green
    if (score >= 50) return "#F59E0B"; // amber
    return "#EF4444"; // red
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

      {/* Profile report */}
      {report && (
        <div style={{ marginTop: "30px" }}>
          <h2>Dataset Profile</h2>
          <p>Rows: {report.num_rows} | Columns: {report.num_columns} | Duplicates: {report.duplicate_rows}</p>
        </div>
      )}

      {/* Cleaning report */}
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

      {/* Target selection with confidence scoring */}
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

                {/* Confidence bar */}
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
        </div>
      )}
    </main>
  );
}
