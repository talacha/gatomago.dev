import Image from "next/image";
import Link from "next/link";
import type { POSTS_QUERY_RESULT } from "@/sanity/types";
import { urlFor } from "@/sanity/image";
import { Moon, Spark, Triskele } from "./glyphs";

type PostSummary = POSTS_QUERY_RESULT[number];

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function meta(post: Pick<PostSummary, "publishedAt" | "readMinutes">) {
  const read = post.readMinutes ? ` · ${Math.max(1, post.readMinutes)} min read` : "";
  return `${formatDate(post.publishedAt)}${read}`;
}

const fallbacks = [
  <Moon key="moon" size={86} />,
  <Spark key="spark" size={86} className="text-teal" />,
  <Triskele key="tri" size={86} />,
];

export function PostCard({ post, index }: { post: PostSummary; index: number }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="flex flex-col overflow-hidden rounded-[14px] border border-gold/25 bg-panel text-parch hover:border-gold/60 hover:text-parch"
    >
      <div className="relative flex h-[170px] items-center justify-center bg-void text-gold">
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
        <div className="text-[15px] text-muted">{meta(post)}</div>
      </div>
    </Link>
  );
}
