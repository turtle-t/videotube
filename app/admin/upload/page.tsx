"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please choose a video file.");
      return;
    }

    try {
      // 1. Get a signed upload permission from our server
      setStatus("uploading");
      const signRes = await fetch("/api/upload/sign", { method: "POST" });
      const signData = await signRes.json();

      // 2. Upload the file directly to Cloudinary from the browser
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp);
      formData.append("signature", signData.signature);
      formData.append("folder", signData.folder);

      const cloudinaryResult = await uploadToCloudinary(
        signData.cloudName,
        formData,
        setProgress
      );

      // 3. Save the video's metadata in our database
      setStatus("saving");
      const saveRes = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          public_id: cloudinaryResult.public_id,
          secure_url: cloudinaryResult.secure_url,
          thumbnail_url: cloudinaryResult.thumbnail_url,
          duration: cloudinaryResult.duration,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save video details.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
      setStatus("idle");
    }
  }

  const isBusy = status !== "idle";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Upload a video</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Video file
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-neutral-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {status === "uploading" && (
            <div>
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-neutral-400 mt-1">
                Uploading... {progress}%
              </p>
            </div>
          )}

          {status === "saving" && (
            <p className="text-sm text-neutral-400">Saving details...</p>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isBusy}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-medium rounded-lg py-2 transition"
          >
            {isBusy ? "Please wait..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Uploads a file straight to Cloudinary and tracks progress,
// using XMLHttpRequest instead of fetch() because fetch() can't report upload progress
function uploadToCloudinary(
  cloudName: string,
  formData: FormData,
  onProgress: (percent: number) => void
): Promise<{
  public_id: string;
  secure_url: string;
  thumbnail_url: string;
  duration: number;
}> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          public_id: data.public_id,
          secure_url: data.secure_url,
          thumbnail_url: data.secure_url.replace(/\.[^/.]+$/, ".jpg"),
          duration: data.duration,
        });
      } else {
        console.error("Cloudinary error response:", xhr.status, xhr.responseText);
        reject(new Error("Cloudinary upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}