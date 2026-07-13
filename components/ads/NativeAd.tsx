"use client";

import { useEffect, useRef } from "react";

export default function NativeAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptUrl = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_URL;
    const containerId = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID;

    if (!scriptUrl || !containerId || !containerRef.current) return;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = scriptUrl;
    containerRef.current.appendChild(script);
  }, []);

  if (!process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_URL) return null;

  return (
    <div className="col-span-1">
      <div
        id={process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID}
        ref={containerRef}
      />
    </div>
  );
}