import { revalidateTag } from "next/cache";
import { after, type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { announcePost } from "@/newsletter/notify";

export const maxDuration = 300; // seconds; a large list is sent in the background after we respond

/**
 * Sanity -> this endpoint, on publish. Signed with SANITY_WEBHOOK_SECRET; unsigned or badly signed
 * requests are rejected before anything else happens.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] SANITY_WEBHOOK_SECRET is not set");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<{ _id?: string; _type?: string }>(
    request,
    secret,
    true,
  );
  if (!isValidSignature) return NextResponse.json({ ok: false }, { status: 401 });
  if (!body?._id || body._type !== "post" || body._id.startsWith("drafts.")) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  // Show the change on the site immediately instead of waiting for the cache to expire.
  revalidateTag("sanity", { expire: 0 });

  // Answer Sanity right away (it times out quickly) and send in the background. A failed send is
  // recorded as such and retried by the daily cron job.
  const postId = body._id;
  after(async () => {
    try {
      console.info("[webhook] announce", postId, await announcePost(postId));
    } catch (error) {
      console.error("[webhook] announce failed", postId, error instanceof Error ? error.message : error);
    }
  });
  return NextResponse.json({ ok: true, accepted: true }, { status: 202 });
}
