import { getFeedPosts } from "@/sanity/data";
import { absoluteUrl, AUTHOR, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const posts = await getFeedPosts();
  const updated = posts[0]?._updatedAt;

  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/posts/${p.slug}`);
      const summary = p.excerpt ?? (p.text ?? "").slice(0, 280);
      return `    <item>
      <title>${esc(p.title ?? "")}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.publishedAt ?? p._updatedAt).toUTCString()}</pubDate>
      <dc:creator>${esc(p.authorName ?? AUTHOR.name)}</dc:creator>${p.category ? `\n      <category>${esc(p.category)}</category>` : ""}
      <description>${esc(summary)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>en</language>${updated ? `\n    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>` : ""}
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
