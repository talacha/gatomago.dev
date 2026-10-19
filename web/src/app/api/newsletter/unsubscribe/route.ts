import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";
import { localePath } from "@/lib/site";
import { unsubscribe } from "@/newsletter/subscribers";
import { looksLikeToken, verifyUnsubscribeToken } from "@/newsletter/tokens";

/** RFC 8058 one-click unsubscribe: mail clients POST here from the List-Unsubscribe header. */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const id = looksLikeToken(token) ? verifyUnsubscribeToken(token) : null;
  if (!id) return new NextResponse("Invalid link", { status: 400 });
  try {
    await unsubscribe(id);
  } catch (error) {
    console.error("[newsletter] one-click unsubscribe failed", error instanceof Error ? error.message : error);
    return new NextResponse("Try again later", { status: 500 });
  }
  return new NextResponse("Unsubscribed", { status: 200 });
}

/** A plain visit (not a mail-client POST) goes to the confirmation page; GET never changes state. */
export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const lang = request.nextUrl.searchParams.get("lang") ?? "";
  const url = new URL(
    `${localePath(isLocale(lang) ? lang : defaultLocale)}/newsletter/unsubscribe`,
    request.url,
  );
  url.searchParams.set("token", token);
  return NextResponse.redirect(url, 303);
}
