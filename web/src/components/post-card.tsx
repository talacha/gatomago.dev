import Image from "next/image";
import Link from "next/link";
import type { POSTS_QUERY_RESULT } from "@/sanity/types";
import { localeMeta, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/site";
import { urlFor } from "@/sanity/image";
import { Moon, Spark, Triskele } from "./glyphs";

type PostSummary = POSTS_QUERY_RESULT[number];

export function formatDate(iso: string | null, lang: Locale) {
  if (!iso) return "";
  return new Intl.DateTimeFormat(localeMeta[lang].dateLocale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function meta(
  post: Pick<PostSummary, "publishedAt" | "readMinutes">,
  lang: Locale,
  t: Dictionary,
) {
  const read = post.readMinutes ? ` · ${Math.max(1, post.readMinutes)} ${t.post.minRead}` : "";
  return `${formatDate(post.publishedAt, lang)}${read}`;
}

const fallbacks = [
  <Moon key="moon" size={86} />,
  <Spark key="spark" size={86} className="text-teal motion-safe:animate-twinkle" />,
  <Triskele key="tri" size={86} />,
];

export function PostCard({
  post,
  index,
  lang,
  t,
}: {
  post: PostSummary;
  index: number;
  lang: Locale;
  t: Dictionary;
}) {
  return (
    <Link
      href={`${localePath(lang)}/posts/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-[14px] border border-gold/40 bg-panel text-parch transition duration-300 hover:-translate-y-1 hover:border-gold hover:text-parch hover:shadow-[0_12px_40px_rgba(226,178,92,0.12)]"
    >
      <div className="relative flex h-[170px] items-center justify-center overflow-hidden bg-void text-gold transition-transform duration-500 [&>svg]:transition-transform [&>svg]:duration-700 group-hover:[&>svg]:rotate-12 group-hover:[&>svg]:scale-110">
        {post.mainImage?.asset ? (
          <Image
            src={urlFor(post.mainImage).width(720).height(340).url()}
            alt={post.mainImage.alt ?? ""}
            fill
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-cover"
          />
        ) : (
          fallbacks[index % fallbacks.length]
        )}
      </div>
      <div className="flex flex-col gap-3 p-7">
        {post.category && (
          <div className="font-heading text-base font-semibold uppercase tracking-[0.16em] text-gold">
            {post.category}
          </div>
        )}
        <h3 className="font-heading text-[30px] font-semibold leading-[1.15]">{post.title}</h3>
        {post.excerpt && <p className="text-base text-muted">{post.excerpt}</p>}
        <div className="text-[15px] text-muted">{meta(post, lang, t)}</div>
      </div>
    </Link>
  );
}
