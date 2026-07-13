import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Check your .env.local file.");
}

export const sql = neon(process.env.DATABASE_URL);

// Represents one row in the "videos" table
export type Video = {
  id: number;
  title: string;
  slug: string;
  description: string;
  public_id: string;
  secure_url: string;
  thumbnail_url: string | null;
  duration: number | null;
  views: number;
  created_at: string;
};

// Fetch every video, newest first — used on the homepage
export async function getAllVideos(): Promise<Video[]> {
  const rows = await sql`
    SELECT * FROM videos ORDER BY created_at DESC
  `;
  return rows as Video[];
}

// Fetch a single video by its numeric id — used on the watch page
export async function getVideoById(id: number): Promise<Video | null> {
  const rows = await sql`
    SELECT * FROM videos WHERE id = ${id} LIMIT 1
  `;
  return (rows[0] as Video) ?? null;
}

// Increase a video's view count by 1
export async function incrementViews(id: number): Promise<void> {
  await sql`
    UPDATE videos SET views = views + 1 WHERE id = ${id}
  `;
}

// Insert a new video row after a successful Cloudinary upload
export async function createVideo(data: {
  title: string;
  slug: string;
  description: string;
  public_id: string;
  secure_url: string;
  thumbnail_url: string | null;
  duration: number | null;
}): Promise<Video> {
  const rows = await sql`
    INSERT INTO videos (title, slug, description, public_id, secure_url, thumbnail_url, duration)
    VALUES (${data.title}, ${data.slug}, ${data.description}, ${data.public_id}, ${data.secure_url}, ${data.thumbnail_url}, ${data.duration})
    RETURNING *
  `;
  return rows[0] as Video;
}

// Delete a video row by id — used by the admin dashboard
export async function deleteVideo(id: number): Promise<void> {
  await sql`
    DELETE FROM videos WHERE id = ${id}
  `;
}