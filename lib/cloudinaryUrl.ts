// Builds an optimized Cloudinary delivery URL by inserting
// transformation parameters right after "/upload/"
//
// q_auto  → automatically picks the best quality-to-filesize tradeoff
// f_auto  → automatically serves the best format for the visitor's browser
export function getOptimizedVideoUrl(secureUrl: string, extra = ""): string {
  return secureUrl.replace("/upload/", `/upload/q_auto,f_auto${extra ? "," + extra : ""}/`);
}