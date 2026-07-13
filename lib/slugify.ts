// Turns a video title into a URL-safe slug
// e.g. "How to Fix a Leaky Faucet!" → "how-to-fix-a-leaky-faucet"
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove anything that isn't a letter, number, space, or hyphen
    .replace(/\s+/g, "-")           // spaces → hyphens
    .replace(/-+/g, "-")            // collapse multiple hyphens
    .slice(0, 80);                  // keep it reasonably short
}