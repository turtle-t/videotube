import Link from "next/link";
import { getAllVideos } from "@/lib/db";
import DeleteVideoButton from "@/components/DeleteVideoButton";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const videos = await getAllVideos();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Your videos</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/upload"
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium rounded-lg px-4 py-2 transition"
            >
              Upload new video
            </Link>
            <LogoutButton />
          </div>
        </div>

        {videos.length === 0 ? (
          <p className="text-neutral-400">
            No videos yet.{" "}
            <Link href="/admin/upload" className="text-amber-400 underline">
              Upload your first one
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-lg p-4"
              >
                {video.thumbnail_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-32 aspect-video object-cover rounded-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{video.title}</p>
                  <p className="text-sm text-neutral-400">
                    {video.views} views ·{" "}
                    {new Date(video.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/watch/${video.slug}-${video.id}`}
                  className="text-sm text-amber-400 hover:underline"
                >
                  View
                </Link>
                <DeleteVideoButton videoId={video.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}