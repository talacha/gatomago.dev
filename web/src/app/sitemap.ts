import type { MetadataRoute } from "next";
import { getFeedPosts } from "@/sanity/data";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getFeedPosts();
  const latest = posts[0]?._updatedAt;

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latest ? new Date(latest) : undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: absoluteUrl(`/posts/${post.slug}`),
      lastModified: new Date(post._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
