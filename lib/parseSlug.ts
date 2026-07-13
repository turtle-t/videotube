// Extracts the numeric id from a URL like "how-to-fix-a-leaky-faucet-42"
// Returns null if the format doesn't match
export function parseIdFromSlug(slugAndId: string): number | null {
  const match = slugAndId.match(/-(\d+)$/);
  if (!match) return null;
  return parseInt(match[1], 10);
}