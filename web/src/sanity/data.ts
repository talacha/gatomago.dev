import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/i18n/config";
import { client } from "./client";
import {
  AUTHOR_QUERY,
  FEED_QUERY,
  POST_QUERY,
  POST_SLUGS_QUERY,
  POSTS_QUERY,
  RELATED_POSTS_QUERY,
} from "./queries";

export async function getPosts(lang: Locale) {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch(POSTS_QUERY, { lang });
}

export async function getPostSlugs() {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch(POST_SLUGS_QUERY);
}

export async function getPost(lang: Locale, slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch(POST_QUERY, { lang, slug });
}

export async function getRelatedPosts(lang: Locale, slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch(RELATED_POSTS_QUERY, { lang, slug });
}

export async function getAuthor(lang: Locale) {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch(AUTHOR_QUERY, { lang });
}

export async function getFeedPosts() {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch(FEED_QUERY);
}
