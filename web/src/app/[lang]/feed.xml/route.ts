import { isLocale, locales, localeMeta, pickLocalized } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { absoluteUrl, AUTHOR, localePath, SITE_NAME } from "@/lib/site";
import { getFeedPosts } from "@/sanity/data";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function GET(_request: Request, ctx: RouteContext<"/[lang]/feed.xml">) {
  const { lang } = await ctx.params;
  if (!isLocale(lang)) return new Response("Not found", { status: 404 });

  const t = getDictionary(lang);
  const posts = (await getFeedPosts()).filter((p) => p.lang === lang);
  const updated = posts[0]?._updatedAt;
  const selfUrl = absoluteUrl(`${localePath(lang)}/feed.xml`);

  const items = posts
    .map((p) => {
      const url = absoluteUrl(`${localePath(lang)}/posts/${p.slug}`);
      const summary = p.excerpt ?? (p.text ?? "").slice(0, 280);
      const category = pickLocalized(p.categoryTitles, lang);
      return `    <item>
      <title>${esc(p.title ?? "")}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.publishedAt ?? p._updatedAt).toUTCString()}</pubDate>
      <dc:creator>${esc(p.authorName ?? AUTHOR.name)}</dc:creator>${category ? `\n      <category>${esc(category)}</category>` : ""}
      <description>${esc(summary)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(SITE_NAME)} (${localeMeta[lang].name})</title>
    <link>${absoluteUrl(localePath(lang))}</link>
    <description>${esc(t.meta.description)}</description>
    <language>${lang}</language>${updated ? `\n    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>` : ""}
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
