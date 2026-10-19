import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KnotDivider, Spark, Triskele } from "@/components/glyphs";
import { JsonLd } from "@/components/json-ld";
import { formatDate, PostCard } from "@/components/post-card";
import { PortableTextBody } from "@/components/portable-text-body";
import { getPost, getPostSlugs, getRelatedPosts } from "@/sanity/data";
import { urlFor } from "@/sanity/image";
import { absoluteUrl, AUTHOR, OG_IMAGE, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// Cache Components requires at least one param at build time; the placeholder
// 404s via notFound() until the first post is published.
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  const params = slugs.flatMap((s) => (s.slug ? [{ slug: s.slug }] : []));
  return params.length > 0 ? params : [{ slug: "_empty" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.seo.title || post.title || SITE_NAME;
  const description = post.seo.description || SITE_DESCRIPTION;
  const url = `/posts/${slug}`;
  const image = post.seo.image?.asset
    ? {
        url: urlFor(post.seo.image).width(1200).height(630).fit("crop").url(),
        width: 1200,
        height: 630,
        alt: post.mainImage?.alt ?? title,
      }
    : OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: post.seo.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post._updatedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.categories?.filter((c): c is string => !!c),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const [post, related] = await Promise.all([getPost(slug), getRelatedPosts(slug)]);
  if (!post) notFound();

  const { author } = post;
  const category = post.categories?.[0];
  const readMinutes = post.readMinutes ? Math.max(1, post.readMinutes) : null;
  const personId = absoluteUrl("/#person");
  const postUrl = absoluteUrl(`/posts/${slug}`);
  const image = post.seo.image?.asset
    ? urlFor(post.seo.image).width(1200).height(630).fit("crop").url()
    : absoluteUrl(OG_IMAGE.url);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        url: postUrl,
        headline: post.title,
        description: post.seo.description || post.excerpt || undefined,
        image: [image],
        datePublished: post.publishedAt,
        dateModified: post._updatedAt,
        inLanguage: "en",
        wordCount: post.wordCount ?? undefined,
        articleSection: category ?? undefined,
        keywords: post.categories?.filter(Boolean).join(", ") || undefined,
        author: {
          "@type": "Person",
          "@id": personId,
          name: post.author?.name ?? AUTHOR.name,
          alternateName: post.author?.alias ?? AUTHOR.alias,
          url: absoluteUrl("/#about"),
          sameAs: [post.author?.linkedin ?? AUTHOR.linkedin],
        },
        publisher: { "@id": personId },
        isPartOf: { "@id": absoluteUrl("/#blog") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: post.title, item: postUrl },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <article className="mx-auto max-w-[720px] pb-10 pt-18">
        <Link href="/" className="inline-flex min-h-11 items-center font-heading text-[19px] font-semibold">
          ← Back to the grimoire
        </Link>

        <div className="mt-8 flex items-center gap-3 font-heading text-[17px] font-semibold uppercase tracking-[0.18em] text-gold">
          <Spark size={16} />
          <span>
            {category && <>{category} · </>}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            )}
            {readMinutes && ` · ${readMinutes} min read`}
          </span>
        </div>
        <h1 className="mt-5 font-heading text-[clamp(40px,6vw,68px)] font-semibold leading-[1.02] tracking-tight text-parch">
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-6 text-[22px] italic text-muted">{post.excerpt}</p>}

        {author && (
          <div className="mt-9 flex items-center gap-4">
            <div className="size-14 rounded-full border-[1.5px] border-gold p-[3px]">
              {author.image?.asset ? (
                <Image
                  src={urlFor(author.image).width(112).height(112).url()}
                  alt={author.name ?? ""}
                  width={112}
                  height={112}
                  className="size-full rounded-full object-cover"
                />
              ) : (
                <Image
                  src="/gato-mago.jpg"
                  alt="Gato Mago"
                  width={112}
                  height={112}
                  className="size-full rounded-full object-cover object-[52%_42%]"
                />
              )}
            </div>
            <div className="leading-snug">
              <div className="font-heading text-[21px] font-semibold text-parch">{author.name}</div>
              {author.alias && (
                <div className="text-[15px] text-muted">writing as {author.alias}</div>
              )}
            </div>
          </div>
        )}

        {post.mainImage?.asset && (
          <figure className="mt-12">
            <div className="rounded-[160px_160px_14px_14px] border-2 border-gold p-2.5">
              <Image
                src={urlFor(post.mainImage).width(1440).height(900).url()}
                alt={post.mainImage.alt ?? ""}
                width={1440}
                height={900}
                priority
                sizes="(min-width: 768px) 720px, 100vw"
                className="aspect-[16/10] w-full rounded-[150px_150px_6px_6px] object-cover"
              />
            </div>
            {post.mainImage.caption && (
              <figcaption className="mt-3 text-center text-[15px] italic text-muted">
                {post.mainImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="mt-14">
          {post.body && <PortableTextBody value={post.body} />}
        </div>

        <div
          aria-hidden="true"
          className="mt-14 flex items-center justify-center gap-5 text-gold"
        >
          <KnotDivider className="max-w-[220px]" />
          <Triskele size={30} />
          <KnotDivider className="max-w-[220px]" />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-6 rounded-2xl border border-gold/40 bg-panel p-8">
          <div className="flex-[1_1_280px]">
            <div className="font-heading text-[26px] font-semibold text-parch">
              Enjoyed this entry?
            </div>
            <div className="text-base text-muted">Get the next one by letter.</div>
          </div>
          <Link
            href="/#circle"
            className="inline-flex min-h-12 items-center rounded-full bg-gold px-[30px] font-heading text-[21px] font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:text-ink"
          >
            Join the Circle
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="pb-6 pt-14">
          <h2 className="mb-7 font-heading text-4xl font-semibold text-parch">Keep reading</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7">
            {related.map((p, i) => (
              <PostCard key={p._id} post={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
