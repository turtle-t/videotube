import { NextRequest, NextResponse } from "next/server";
import { createVideo } from "@/lib/db";
import { slugify } from "@/lib/slugify";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, public_id, secure_url, thumbnail_url, duration } = body;

  if (!title || !public_id || !secure_url) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const video = await createVideo({
    title,
    slug: slugify(title),
    description: description || "",
    public_id,
    secure_url,
    thumbnail_url: thumbnail_url || null,
    duration: duration || null,
  });

  return NextResponse.json({ video });
}