"use client";

import { useEffect } from "react";

export default function GlobalAdScript({
  scriptUrl,
}: {
  scriptUrl: string | undefined;
}) {
  useEffect(() => {
    if (!scriptUrl) return;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptUrl;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [scriptUrl]);

  return null;
}