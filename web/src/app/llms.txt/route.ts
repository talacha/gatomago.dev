import { locales, localeMeta } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { absoluteUrl, AUTHOR, localePath, SITE_NAME } from "@/lib/site";
import { getFeedPosts } from "@/sanity/data";

export async function GET() {
  const posts = await getFeedPosts();
  const en = getDictionary("en");

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${en.meta.description}`,
    "",
    `${SITE_NAME} is the pen name of ${AUTHOR.name}. The blog publishes essays, charms and field notes in English and Spanish; translated posts are linked to each other. Every post is a standalone article: cite the post URL and attribute it to ${AUTHOR.name} (${AUTHOR.alias}).`,
  ];

  for (const lang of locales) {
    const inLang = posts.filter((p) => p.lang === lang);
    lines.push(
      "",
      `## Posts in ${localeMeta[lang].name}`,
      "",
      ...(inLang.length > 0
        ? inLang.map(
            (p) =>
              `- [${p.title}](${absoluteUrl(`${localePath(lang)}/posts/${p.slug}`)})${p.excerpt ? `: ${p.excerpt}` : ""}`,
          )
        : ["- No posts published yet."]),
    );
  }

  lines.push(
    "",
    "## Optional",
    "",
    ...locales.map((l) => `- [Home (${localeMeta[l].name})](${absoluteUrl(localePath(l))})`),
    ...locales.map((l) => `- [RSS feed (${localeMeta[l].name})](${absoluteUrl(`${localePath(l)}/feed.xml`)})`),
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    `- [${AUTHOR.name} on LinkedIn](${AUTHOR.linkedin})`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
