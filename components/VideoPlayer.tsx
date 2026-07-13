"use client";

import { useRef, useState, useEffect } from "react";
import { getOptimizedVideoUrl } from "@/lib/cloudinaryUrl";

const QUALITY_OPTIONS = [
  { label: "Auto", transform: "" },
  { label: "1080p", transform: "h_1080,c_limit" },
  { label: "720p", transform: "h_720,c_limit" },
  { label: "480p", transform: "h_480,c_limit" },
  { label: "360p", transform: "h_360,c_limit" },
];

export default function VideoPlayer({
  secureUrl,
  thumbnailUrl,
}: {
  secureUrl: string;
  thumbnailUrl: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qualityIndex, setQualityIndex] = useState(0);

  function handleQualityChange(index: number) {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;

    setQualityIndex(index);

    const resume = () => {
      video.currentTime = currentTime;
      if (wasPlaying) video.play();
      video.removeEventListener("loadedmetadata", resume);
    };
    video.addEventListener("loadedmetadata", resume);
  }

  // Keyboard shortcuts: left/right arrow to skip 10s, only while the player has focus
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (document.activeElement !== video) return;
      if (e.key === "ArrowRight") {
        video!.currentTime = Math.min(video!.duration, video!.currentTime + 10);
      } else if (e.key === "ArrowLeft") {
        video!.currentTime = Math.max(0, video!.currentTime - 10);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const src = getOptimizedVideoUrl(secureUrl, QUALITY_OPTIONS[qualityIndex].transform);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-black rounded-lg overflow-hidden mb-2 flex items-center justify-center">
        <video
          ref={videoRef}
          key={src}
          src={src}
          controls
          className="w-full max-h-[70vh]"
          poster={thumbnailUrl || undefined}
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <span>Quality:</span>
        {QUALITY_OPTIONS.map((option, index) => (
          <button
            key={option.label}
            onClick={() => handleQualityChange(index)}
            className={`px-2 py-1 rounded ${
              index === qualityIndex
                ? "bg-amber-500 text-neutral-950"
                : "hover:bg-neutral-800"
            }`}
          >
            {option.label}
          </button>
        ))}
       
      </div>
    </div>
  );
}