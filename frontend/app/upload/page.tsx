"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    setUploading(true);
    setMessage("");

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

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("datasets")
      .upload(filePath, file);

    if (error) {
      setMessage("Upload failed: " + error.message);
    } else {
      // 👇 NEW: Save a record in the database after successful upload
      const { error: dbError } = await supabase.from("datasets").insert({
        user_id: user.id,
        file_name: file.name,
        file_path: filePath,
      });

      if (dbError) {
        setMessage("File uploaded but record failed: " + dbError.message);
      } else {
        setMessage("File uploaded successfully ✅ Path: " + filePath);
      }
    }

    setUploading(false);
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "500px" }}>
      <h1>Upload Dataset</h1>
      <p>Select a CSV file to upload.</p>

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
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </main>
  );
}
