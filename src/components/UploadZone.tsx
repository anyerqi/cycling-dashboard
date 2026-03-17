"use client";

import { useState, useCallback, useRef } from "react";
import { Activity } from "@/lib/mockData";

interface UploadZoneProps {
  onActivityAdded: (activity: Activity) => void;
}

export default function UploadZone({ onActivityAdded }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setLastResult(null);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/activities/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();

        const newActivity: Activity = {
          id: data.id,
          date: data.date,
          routeName: file.name.replace(/\.(gpx|fit)$/i, ""),
          distance: data.distance,
          duration: data.duration,
          elevation: data.elevation,
        };

        onActivityAdded(newActivity);
        setLastResult(`✓ Parsed: ${data.distance.toFixed(1)} km, ${data.elevation} m elevation`);
      } catch {
        setLastResult("✗ Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [onActivityAdded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
      e.target.value = "";
    },
    [uploadFile]
  );

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/30"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".gpx,.fit"
          className="hidden"
          onChange={handleChange}
        />
        <div className="text-3xl mb-2">{isUploading ? "⏳" : "📁"}</div>
        {isUploading ? (
          <p className="text-sm text-gray-400">Uploading and parsing…</p>
        ) : (
          <>
            <p className="text-sm text-gray-300 font-medium">
              Drop a GPX or FIT file here
            </p>
            <p className="text-xs text-gray-500 mt-1">or click to browse</p>
          </>
        )}
      </div>
      {lastResult && (
        <p
          className={`text-xs px-3 py-2 rounded-lg ${
            lastResult.startsWith("✓")
              ? "bg-green-900/30 text-green-400 border border-green-800"
              : "bg-red-900/30 text-red-400 border border-red-800"
          }`}
        >
          {lastResult}
        </p>
      )}
    </div>
  );
}
