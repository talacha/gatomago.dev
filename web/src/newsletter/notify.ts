import "server-only";
import { isLocale } from "@/i18n/config";
import { newsletterEnabled } from "@/lib/features";
import { absoluteUrl, localePath } from "@/lib/site";
import { client } from "@/sanity/client";
import { env } from "./config";
import { db } from "./db";
import { sendBroadcastBatch } from "./email";

const BATCH_SIZE = 100; // Resend batch limit
const BATCH_DELAY_MS = 600; // stays under Resend's default 2 requests/second

export type AnnounceResult =
  | { status: "skipped"; reason: string }
  | { status: "already-announced" }
  | { status: "sent"; recipients: number };

type PostForEmail = {
  _id: string;
  title: string | null;
  excerpt: string | null;
  language: string | null;
  slug: string | null;
  publishedAt: string | null;
  notifySubscribers: boolean | null;
  noIndex: boolean | null;
};

const POST_FOR_EMAIL = `*[_type == "post" && _id == $id][0]{
  _id, title, excerpt, language, "slug": slug.current, publishedAt, notifySubscribers,
  "noIndex": seo.noIndex == true
}`;

/**
 * Emails confirmed subscribers (in the post's language) about a newly published post, once.
 * The post is re-read from Sanity rather than trusting the webhook body.
 */
export async function announcePost(postId: string): Promise<AnnounceResult> {
  // Safety gates: nothing is sent until sending is deliberately switched on and compliant.
  if (!newsletterEnabled()) return { status: "skipped", reason: "NEWSLETTER_ENABLED is not true" };
  if (env("NEWSLETTER_BROADCAST_ENABLED") !== "true") {
    return { status: "skipped", reason: "NEWSLETTER_BROADCAST_ENABLED is not true" };
  }
  if (!env("NEWSLETTER_POSTAL_ADDRESS")) {
    return { status: "skipped", reason: "NEWSLETTER_POSTAL_ADDRESS is not set (required in every email)" };
  }

  const post = await client
    .withConfig({ useCdn: false })
    .fetch<PostForEmail | null>(POST_FOR_EMAIL, { id: postId });

  if (!post) return { status: "skipped", reason: "published post not found" };
  // Opt-in: posts created before this field existed (null) are never announced by accident.
  if (post.notifySubscribers !== true) return { status: "skipped", reason: "notifySubscribers is not on" };
  if (post.noIndex) return { status: "skipped", reason: "post is marked noIndex" };
  if (!post.title || !post.slug || !post.language || !isLocale(post.language)) {
    return { status: "skipped", reason: "post is missing title, slug or language" };
  }
  if (post.publishedAt && new Date(post.publishedAt).getTime() > Date.now() + 5 * 60_000) {
    return { status: "skipped", reason: "post is scheduled for the future" };
  }

  const lang = post.language;
  const sql = db();

  // Claim the post. A concurrent or repeated webhook gets no row back and stops here.
  // A failed, or long-stalled, earlier attempt may be retried (batches are idempotent).
  const claimed = await sql`
    insert into post_notifications (post_id, lang) values (${post._id}, ${lang})
    on conflict (post_id) do update set status = 'sending', started_at = now(), finished_at = null
    where post_notifications.status = 'failed'
       or (post_notifications.status = 'sending'
           and post_notifications.started_at < now() - interval '15 minutes')
    returning post_id`;
  if (claimed.length === 0) return { status: "already-announced" };

  const url = absoluteUrl(`${localePath(lang)}/posts/${post.slug}`);
  let recipients = 0;
  try {
    let cursor = "00000000-0000-0000-0000-000000000000";
    for (let batch = 0; ; batch++) {
      const rows = await sql<{ id: string; email: string }[]>`
        select id, email from subscribers
        where status = 'confirmed' and lang = ${lang} and id > ${cursor}
        order by id limit ${BATCH_SIZE}`;
      if (rows.length === 0) break;
      const result = await sendBroadcastBatch(
        lang,
        { title: post.title, excerpt: post.excerpt, url },
        rows,
        `post-${post._id}-${batch}`,
      );
      // Every message failing means something systemic (quota, key, domain): stop and mark failed.
      if (result.sent === 0 && result.failed > 0) throw new Error("no emails could be sent");
      recipients += result.sent;
      cursor = rows[rows.length - 1].id;
      if (rows.length < BATCH_SIZE) break;
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
    }
    await sql`
      update post_notifications set status = 'sent', recipients = ${recipients}, finished_at = now()
      where post_id = ${post._id}`;
    return { status: "sent", recipients };
  } catch (error) {
    await sql`
      update post_notifications set status = 'failed', recipients = ${recipients}, finished_at = now()
      where post_id = ${post._id}`;
    throw error;
  }
}

const DUE_WINDOW_DAYS = 3;

/**
 * Daily safety net, called by the cron job. Announces posts that were scheduled for later (the
 * webhook skips those), and retries announcements that failed or stalled. Posts that were already
 * announced are skipped by the claim inside announcePost.
 */
export async function announceDuePosts() {
  const since = new Date(Date.now() - DUE_WINDOW_DAYS * 24 * 3600_000).toISOString();
  const ids = await client.withConfig({ useCdn: false }).fetch<string[]>(
    `*[_type == "post" && notifySubscribers == true && !(_id in path("drafts.**"))
        && defined(publishedAt) && publishedAt <= now() && publishedAt > $since]._id`,
    { since },
  );
  const summary = { checked: ids.length, sent: 0, failed: 0 };
  for (const id of ids) {
    try {
      const result = await announcePost(id);
      if (result.status === "sent") summary.sent++;
    } catch (error) {
      summary.failed++;
      console.error("[newsletter] announce retry failed", id, error instanceof Error ? error.message : error);
    }
  }
  return summary;
}
