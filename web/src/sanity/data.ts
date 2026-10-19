import { cacheLife, cacheTag } from "next/cache";
import { client } from "./client";
import {
  AUTHOR_QUERY,
  POST_QUERY,
  POST_SLUGS_QUERY,
  POSTS_QUERY,
  RELATED_POSTS_QUERY,
} from "./queries";

export async function getPosts() {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch(POSTS_QUERY);
}

export async function getPostSlugs() {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch(POST_SLUGS_QUERY);
}

export async function getPost(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch(POST_QUERY, { slug });
}

export async function getRelatedPosts(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch(RELATED_POSTS_QUERY, { slug });
}

export async function getAuthor() {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client.fetch(AUTHOR_QUERY);
}
