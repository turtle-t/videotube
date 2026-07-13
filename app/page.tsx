import React from "react";
import Link from "next/link";
import { getAllVideos } from "@/lib/db";
import BannerAd from "@/components/ads/BannerAd";
import NativeAd from "@/components/ads/NativeAd";

export default async function HomePage() {
  const videos = await getAllVideos();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 px-6 py-4">
        <h1 className="text-xl font-semibold text-amber-400">VideoTube</h1>
      </header>

      <main className="px-6 py-8 max-w-6xl mx-auto">
        <BannerAd />

        {videos.length === 0 ? (
          <p className="text-neutral-400 text-center py-20">
            No videos yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <React.Fragment key={video.id}>
                <Link href={`/watch/${video.slug}-${video.id}`} className="group">
                  <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden mb-2">
                    {video.thumbnail_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <h2 className="font-medium text-sm line-clamp-2 group-hover:text-amber-400 transition">
                    {video.title}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    {video.views} views ·{" "}
                    {new Date(video.created_at).toLocaleDateString()}
                  </p>
                </Link>
                {/* Insert a native ad after every 6th video */}
                {(index + 1) % 6 === 0 && <NativeAd />}
              </React.Fragment>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}