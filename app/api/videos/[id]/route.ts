import { NextRequest, NextResponse } from "next/server";
import { getVideoById, deleteVideo } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const videoId = parseInt(id, 10);

  if (isNaN(videoId)) {
    return NextResponse.json({ error: "Invalid video id" }, { status: 400 });
  }

  const video = await getVideoById(videoId);

  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  // Delete the actual file from Cloudinary first
  try {
    await cloudinary.uploader.destroy(video.public_id, {
      resource_type: "video",
    });
  } catch (err) {
    console.error("Failed to delete from Cloudinary:", err);
    // Continue anyway — better to remove the broken DB row than leave
    // a video that's gone from Cloudinary but still listed on the site
  }

  // Then remove the database row
  await deleteVideo(videoId);

  return NextResponse.json({ success: true });
}