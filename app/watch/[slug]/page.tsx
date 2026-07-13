import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getVideoById, incrementViews } from "@/lib/db";
import { parseIdFromSlug } from "@/lib/parseSlug";
import VideoPlayer from "@/components/VideoPlayer";
import BannerAd from "@/components/ads/BannerAd";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = parseIdFromSlug(slug);
  if (id === null) return {};

  const video = await getVideoById(id);
  if (!video) return {};

  const description = video.description || `Watch ${video.title} on VideoTube.`;

  return {
    title: video.title,
    description,
    openGraph: {
      title: video.title,
      description,
      type: "video.other",
      images: video.thumbnail_url ? [video.thumbnail_url] : [],
      videos: [{ url: video.secure_url }],
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description,
      images: video.thumbnail_url ? [video.thumbnail_url] : [],
    },
  };
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = parseIdFromSlug(slug);

  if (id === null) {
    notFound();
  }

  const video = await getVideoById(id);

  if (!video) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description || video.title,
    thumbnailUrl: video.thumbnail_url ? [video.thumbnail_url] : [],
    uploadDate: video.created_at,
    contentUrl: video.secure_url,
    duration: video.duration ? `PT${Math.round(video.duration)}S` : undefined,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/WatchAction",
      userInteractionCount: video.views,
    },
  };

  // Bump the view count every time the page loads
  await incrementViews(id);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="border-b border-neutral-800 px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-amber-400">
          VideoTube
        </Link>
      </header>

      <main className="px-6 py-8 max-w-4xl mx-auto">
        <VideoPlayer
          secureUrl={video.secure_url}
          thumbnailUrl={video.thumbnail_url}
        />

        <BannerAd
          adKey={process.env.NEXT_PUBLIC_ADSTERRA_BANNER_300X250_KEY}
          width={300}
          height={250}
        />

        <h1 className="text-xl font-semibold mt-4 mb-2">{video.title}</h1>
        <p className="text-sm text-neutral-500 mb-4">
          {video.views + 1} views ·{" "}
          {new Date(video.created_at).toLocaleDateString()}
        </p>

        {video.description && (
          <div className="bg-neutral-900 rounded-lg p-4">
            <p className="text-sm text-neutral-300 whitespace-pre-wrap">
              {video.description}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}