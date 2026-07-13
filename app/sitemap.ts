import { MetadataRoute } from "next";
import { getAllVideos } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://yourdomain.com"; // update once you have a real domain
  const videos = await getAllVideos();

  const videoUrls: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${baseUrl}/watch/${video.slug}-${video.id}`,
    lastModified: new Date(video.created_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...videoUrls,
  ];
}