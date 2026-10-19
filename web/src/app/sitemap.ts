import type { MetadataRoute } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { absoluteUrl, hreflangs, localePath } from "@/lib/site";
import { getFeedPosts } from "@/sanity/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getFeedPosts();
  const latest = posts[0]?._updatedAt;

  const homes: MetadataRoute.Sitemap = locales.map((lang) => ({
    url: absoluteUrl(localePath(lang)),
    lastModified: latest ? new Date(latest) : undefined,
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: hreflangs(
        Object.fromEntries(locales.map((l) => [l, absoluteUrl(localePath(l))])),
      ),
    },
  }));

  const entries: MetadataRoute.Sitemap = posts.flatMap((post) => {
    if (!post.lang || !isLocale(post.lang) || !post.slug) return [];
    const urls: Partial<Record<Locale, string>> = {
      [post.lang]: absoluteUrl(`${localePath(post.lang)}/posts/${post.slug}`),
    };
    for (const tr of post.translations ?? []) {
      if (tr.lang && tr.slug && isLocale(tr.lang)) {
        urls[tr.lang] = absoluteUrl(`${localePath(tr.lang)}/posts/${tr.slug}`);
      }
    }
    return [
      {
        url: urls[post.lang]!,
        lastModified: new Date(post._updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: Object.keys(urls).length > 1 ? { languages: hreflangs(urls) } : undefined,
      },
    ];
  });

  return [...homes, ...entries];
}
