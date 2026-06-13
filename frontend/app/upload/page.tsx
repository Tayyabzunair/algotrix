"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Type for the profile report coming from the Python backend
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
// Type for the cleaning report from the Python backend
type CleaningReport = {
  actions: string[];
  rows_after_cleaning: number;
  columns_after_cleaning: number;
  cleaned_file: string;
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState<ProfileReport | null>(null);
  const [cleaning, setCleaning] = useState<CleaningReport | null>(null);


  async function handleUpload() {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    setUploading(true);
    setMessage("");
    setReport(null);
    setCleaning(null);

    const supabase = createClient();

    // Get the current logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("You must be logged in to upload.");
      setUploading(false);
      return;
    }

    // File path: user-id/timestamp-filename.csv
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

    // 2) Save a record in the database
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

    setMessage("File uploaded successfully ✅ Now analyzing...");

    // 3) Send the same file to the Python backend for profiling
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/profile", {
        method: "POST",
        body: formData,
      });

            if (!response.ok) {
        setMessage("Uploaded, but analysis failed.");
      } else {
        const data: ProfileReport = await response.json();
        setReport(data);
        setMessage("Profiling done. Now cleaning the dataset...");

        // Send the file again to the cleaning endpoint
        const cleanForm = new FormData();
        cleanForm.append("file", file);

        const cleanResponse = await fetch("http://localhost:8000/clean", {
          method: "POST",
          body: cleanForm,
        });

        if (cleanResponse.ok) {
          const cleanData: CleaningReport = await cleanResponse.json();
          setCleaning(cleanData);
          setMessage("Done! Profile and cleaning report are ready:");
        } else {
          setMessage("Profiled, but cleaning failed.");
        }
      }

    } catch {
      setMessage("Uploaded, but could not reach the analysis server.");
    }

    setUploading(false);
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "700px" }}>
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

      {/* Show the profile report if we have one */}
      {report && (
        <div style={{ marginTop: "30px" }}>
          <h2>Dataset Profile</h2>
          <p>Rows: {report.num_rows}</p>
          <p>Columns: {report.num_columns}</p>
          <p>Duplicate rows: {report.duplicate_rows}</p>

          <table
            style={{
              marginTop: "15px",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <th style={cellStyle}>Column</th>
                <th style={cellStyle}>Type</th>
                <th style={cellStyle}>Missing</th>
                <th style={cellStyle}>Unique</th>
              </tr>
            </thead>
            <tbody>
              {report.columns.map((col) => (
                <tr key={col.name}>
                  <td style={cellStyle}>{col.name}</td>
                  <td style={cellStyle}>{col.dtype}</td>
                  <td style={cellStyle}>{col.missing_values}</td>
                  <td style={cellStyle}>{col.unique_values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        {/* Show the cleaning report if we have one */}
      {cleaning && (
        <div style={{ marginTop: "30px" }}>
          <h2>Cleaning Report</h2>
          <p>Rows after cleaning: {cleaning.rows_after_cleaning}</p>
          <ul style={{ marginTop: "10px" }}>
            {cleaning.actions.length === 0 ? (
              <li>No issues found. Dataset was already clean!</li>
            ) : (
              cleaning.actions.map((action, index) => (
                <li key={index} style={{ marginBottom: "6px" }}>
                  {action}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </main>
  );
}

const cellStyle: React.CSSProperties = {
  border: "1px solid #444",
  padding: "8px",
  textAlign: "left",
};
