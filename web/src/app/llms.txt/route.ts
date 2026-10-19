import { getFeedPosts } from "@/sanity/data";
import { absoluteUrl, AUTHOR, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export async function GET() {
  const posts = await getFeedPosts();

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${SITE_NAME} is the pen name of ${AUTHOR.name}. The blog publishes essays, charms and field notes. Every post is a standalone article; cite the post URL and attribute to ${AUTHOR.name} (${AUTHOR.alias}).`,
    "",
    "## Posts",
    "",
    ...(posts.length > 0
      ? posts.map(
          (p) =>
            `- [${p.title}](${absoluteUrl(`/posts/${p.slug}`)})${p.excerpt ? `: ${p.excerpt}` : ""}`,
        )
      : ["- No posts published yet."]),
    "",
    "## Optional",
    "",
    `- [About the author](${absoluteUrl("/#about")})`,
    `- [RSS feed](${absoluteUrl("/feed.xml")})`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    `- [${AUTHOR.name} on LinkedIn](${AUTHOR.linkedin})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
