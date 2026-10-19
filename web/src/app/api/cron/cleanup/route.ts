import { timingSafeEqual } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { PENDING_RETENTION_DAYS } from "@/newsletter/config";
import { announceDuePosts } from "@/newsletter/notify";
import { purgeStaleData } from "@/newsletter/subscribers";

/** Vercel Cron calls this daily with `Authorization: Bearer $CRON_SECRET`. */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const given = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret ?? ""}`;
  const authorised =
    Boolean(secret) &&
    given.length === expected.length &&
    timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!authorised) return new NextResponse("Unauthorized", { status: 401 });

  const result = await purgeStaleData(PENDING_RETENTION_DAYS);
  const announcements = await announceDuePosts();
  return NextResponse.json({ ok: true, ...result, announcements });
}
