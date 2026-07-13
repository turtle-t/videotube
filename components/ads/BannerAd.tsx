"use client";

import { useEffect, useRef } from "react";

export default function BannerAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY;
    const scriptUrl = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_SCRIPT_URL;
    const width = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_WIDTH || "728";
    const height = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_HEIGHT || "90";

    if (!key || !scriptUrl || !containerRef.current) return;

    // Adsterra banners configure themselves via a global "atOptions" object
    // read by their invoke.js script right after it loads
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        'key' : '${key}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    containerRef.current.appendChild(configScript);

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = scriptUrl;
    containerRef.current.appendChild(invokeScript);
  }, []);

  // If ads aren't configured yet, render nothing (no broken empty box)
  if (!process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY) return null;

  return <div ref={containerRef} className="flex justify-center my-4" />;
}