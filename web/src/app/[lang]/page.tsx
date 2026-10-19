import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { KnotDivider, Moon, Spark, Triskele } from "@/components/glyphs";
import { JsonLd } from "@/components/json-ld";
import { Newsletter } from "@/components/newsletter";
import { meta, PostCard } from "@/components/post-card";
import { SiteHeader } from "@/components/site-header";
import { SparkleField } from "@/components/sparkle-field";
import { isLocale, locales, localeMeta } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { newsletterEnabled } from "@/lib/features";
import { absoluteUrl, AUTHOR, hreflangs, localePath, ogImage, SITE_NAME } from "@/lib/site";
import { getAuthor, getPosts } from "@/sanity/data";
import { urlFor } from "@/sanity/image";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  const image = ogImage(lang, t.meta.ogAlt);
  return {
    title: { absolute: t.meta.homeTitle },
    description: t.meta.description,
    alternates: {
      canonical: localePath(lang),
      languages: hreflangs(Object.fromEntries(locales.map((l) => [l, localePath(l)]))),
      types: { "application/rss+xml": `${localePath(lang)}/feed.xml` },
    },
    openGraph: {
      url: localePath(lang),
      title: SITE_NAME,
      description: t.meta.description,
      locale: localeMeta[lang].ogLocale,
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

const ctaPrimary =
  "inline-flex min-h-12 items-center rounded-full bg-gold px-[30px] font-heading text-[21px] font-semibold tracking-wide text-ink transition duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:text-ink hover:shadow-[0_8px_30px_rgba(226,178,92,0.3)]";
const ctaGhost =
  "inline-flex min-h-12 items-center rounded-full border-[1.5px] border-gold px-[30px] font-heading text-[21px] font-semibold tracking-wide text-gold transition duration-300 hover:-translate-y-0.5 hover:bg-gold/10 hover:text-gold-light";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const [posts, author] = await Promise.all([getPosts(lang), getAuthor(lang)]);
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p._id !== featured?._id);

  const home = absoluteUrl(localePath(lang));
  const personId = absoluteUrl("/#person");
  const linkedin = author?.linkedin ?? AUTHOR.linkedin;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        url: home,
        name: SITE_NAME,
        description: t.meta.description,
        inLanguage: lang,
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: author?.name ?? AUTHOR.name,
        alternateName: author?.alias ?? AUTHOR.alias,
        url: `${home}#about`,
        image: absoluteUrl("/gato-mago.jpg"),
        sameAs: [linkedin],
      },
      {
        "@type": "Blog",
        "@id": `${home}#blog`,
        url: home,
        name: SITE_NAME,
        description: t.meta.description,
        inLanguage: lang,
        author: { "@id": personId },
        publisher: { "@id": personId },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: absoluteUrl(`${localePath(lang)}/posts/${p.slug}`),
          datePublished: p.publishedAt,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <SiteHeader lang={lang} t={t} />
      <main id="main" tabIndex={-1}>
      <section className="relative flex flex-wrap items-center gap-x-14 gap-y-12 pb-22 pt-12 sm:pt-18">
        <SparkleField />
        <div className="relative min-w-0 flex-[1_1_440px]">
          <div
            aria-hidden="true"
            className="flex items-center gap-3 font-ogham text-[22px] tracking-[0.2em] text-gold motion-safe:animate-reveal"
          >
            <Spark size={18} />
            <span>ᚌᚐᚈᚑ ᚋᚐᚌᚑ</span>
          </div>
          <h1 className="mt-5 font-heading motion-safe:animate-reveal [animation-delay:120ms] text-[clamp(48px,7vw,76px)] font-semibold leading-none tracking-tight text-parch">
            {t.hero.titleLead} <em className="text-gold">{t.hero.titleEm}</em>
          </h1>
          <p className="mt-7 max-w-[520px] text-xl text-muted motion-safe:animate-reveal [animation-delay:240ms]">
            {t.hero.sub}
          </p>
          <div className="mt-10 flex flex-wrap gap-4 motion-safe:animate-reveal [animation-delay:360ms]">
            <Link
              href={featured ? `${localePath(lang)}/posts/${featured.slug}` : `${localePath(lang)}#grimoire`}
              className={ctaPrimary}
            >
              {t.hero.cta}
            </Link>
            {newsletterEnabled() && (
              <Link href={`${localePath(lang)}#circle`} className={ctaGhost}>
                {t.nav.circle}
              </Link>
            )}
          </div>
        </div>
        <div className="relative min-w-[280px] flex-[0_1_460px] motion-safe:animate-reveal [animation-delay:200ms]">
          <div className="rounded-[240px_240px_14px_14px] border-2 border-gold p-2.5 shadow-[0_0_90px_rgba(111,214,201,0.16)] motion-safe:animate-glow">
            <Image
              src="/gato-mago.jpg"
              alt={t.hero.imageAlt}
              width={1200}
              height={1200}
              priority
              sizes="(min-width: 768px) 460px, 90vw"
              className="aspect-[1/1.18] w-full rounded-[230px_230px_6px_6px] object-cover object-[55%_40%]"
            />
          </div>
          <Spark size={26} className="absolute left-[-14px] top-[6%] text-teal motion-safe:animate-twinkle" />
          <Spark size={16} className="absolute right-[-10px] top-[22%] text-gold motion-safe:animate-twinkle [animation-delay:1.3s]" />
          <Moon size={34} className="absolute bottom-[14%] right-[-18px] text-gold motion-safe:animate-float" />
        </div>
      </section>

      {featured && (
        <section className="pb-22">
          <div className="mb-7 flex items-center gap-4">
            <Moon size={22} className="text-gold" />
            <h2 className="font-display text-[22px] font-normal tracking-[0.12em] text-gold">
              {t.featured.label}
            </h2>
          </div>
          <Link
            href={`${localePath(lang)}/posts/${featured.slug}`}
            className="group flex flex-wrap overflow-hidden rounded-[18px] border border-gold/40 bg-panel text-parch transition duration-300 hover:border-gold hover:text-parch hover:shadow-[0_12px_50px_rgba(226,178,92,0.12)]"
          >
            <div className="relative flex min-h-80 flex-[1_1_340px] items-center justify-center border-r border-gold/20 bg-void text-gold">
              {featured.mainImage?.asset ? (
                <Image
                  src={urlFor(featured.mainImage).width(900).height(640).url()}
                  alt={featured.mainImage.alt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover"
                />
              ) : (
                <Triskele size={190} weight={1.6} className="transition-transform duration-700 group-hover:rotate-[24deg]" />
              )}
            </div>
            <div className="flex flex-[1.4_1_420px] flex-col justify-center gap-4 p-8 sm:p-12">
              <div className="font-heading text-lg font-semibold uppercase tracking-[0.18em] text-gold">
                {[featured.category, meta(featured, lang, t)].filter(Boolean).join(" · ")}
              </div>
              <h3 className="font-heading text-[clamp(32px,5vw,44px)] font-semibold leading-[1.1] text-parch">
                {featured.title}
              </h3>
              {featured.excerpt && <p className="text-muted">{featured.excerpt}</p>}
              <div className="font-heading text-xl font-semibold text-gold">{t.featured.cta}</div>
            </div>
          </Link>
        </section>
      )}

      <section id="grimoire" className="scroll-mt-8 pb-24">
        <h2 className="mb-8 font-heading text-[clamp(34px,5vw,46px)] font-semibold leading-tight text-parch">
          {t.grimoire.title}
        </h2>
        {rest.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7">
            {rest.map((post, i) => (
              <PostCard key={post._id} post={post} index={i} lang={lang} t={t} />
            ))}
          </div>
        ) : (
          <p className="text-muted">
            {posts.length === 0 ? t.grimoire.empty : t.grimoire.more}
          </p>
        )}
      </section>

      <KnotDivider />

      <section id="about" className="flex scroll-mt-8 flex-wrap items-center gap-14 py-24">
        <div className="min-w-[220px] flex-[0_1_300px]">
          <div className="aspect-square w-full max-w-[300px] rounded-full border-2 border-gold p-2">
            {author?.image?.asset ? (
              <Image
                src={urlFor(author.image).width(600).height(600).url()}
                alt={author.name ?? "Author portrait"}
                width={600}
                height={600}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <Image
                src="/gato-mago.jpg"
                alt={t.about.portraitAlt}
                width={600}
                height={600}
                className="h-full w-full rounded-full object-cover object-[52%_42%]"
              />
            )}
          </div>
        </div>
        <div className="min-w-0 flex-[1_1_420px]">
          <div aria-hidden="true" className="font-ogham text-xl tracking-[0.2em] text-gold">
            ᚔᚒᚐᚅ ᚂᚒᚔᚄ
          </div>
          <h2 className="mt-3 font-heading text-[clamp(34px,5vw,46px)] font-semibold leading-[1.1] text-parch">
            {t.about.heading} {author?.name ?? AUTHOR.name}
          </h2>
          <div className="mt-5 flex max-w-[620px] flex-col gap-4 text-muted">
            {author?.bio?.length ? <PortableText value={author.bio} /> : <p>{t.about.fallbackBio}</p>}
          </div>
          <div className="mt-7 flex flex-wrap gap-6 font-heading text-[21px] font-semibold">
            <a
              href={
                author?.linkedin ?? "https://www.linkedin.com/in/juanluisvillase%C3%B1or/"
              }
              rel="me noopener"
              className="inline-flex min-h-11 items-center"
            >
              {t.about.linkedin}
            </a>
          </div>
        </div>
      </section>

      {newsletterEnabled() && <Newsletter lang={lang} t={t} />}
      </main>
    </>
  );
}
