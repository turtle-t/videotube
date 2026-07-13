import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST() {
  const timestamp = Math.round(Date.now() / 1000);

  // Only these exact parameters get signed — the browser can't add
  // extra ones later, since that would invalidate the signature
  const paramsToSign = {
    timestamp,
    folder: "videotube",
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder: "videotube",
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
