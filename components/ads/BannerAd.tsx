"use client";

import { useEffect, useRef } from "react";

export default function BannerAd({
  adKey,
  width,
  height,
}: {
  adKey: string | undefined;
  width: number;
  height: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adKey || !containerRef.current) return;
    containerRef.current.innerHTML = "";

    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    containerRef.current.appendChild(configScript);

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    containerRef.current.appendChild(invokeScript);
  }, [adKey, width, height]);

  if (!adKey) return null;

  return <div ref={containerRef} className="flex justify-center my-4" />;
}