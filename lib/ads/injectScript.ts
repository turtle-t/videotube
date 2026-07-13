"use client";

// Adsterra (and most ad networks) give you a raw <script> snippet.
// React won't execute a script tag just because it's in JSX/HTML,
// so this manually creates a real <script> element and appends it.
export function injectScript(options: {
  src?: string;
  innerHTML?: string;
  async?: boolean;
  attributes?: Record<string, string>;
  container: HTMLElement;
}) {
  const script = document.createElement("script");
  if (options.src) script.src = options.src;
  if (options.innerHTML) script.innerHTML = options.innerHTML;
  if (options.async) script.async = true;
  if (options.attributes) {
    for (const [key, value] of Object.entries(options.attributes)) {
      script.setAttribute(key, value);
    }
  }
  options.container.appendChild(script);
}