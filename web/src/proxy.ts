import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, negotiateLocale } from "@/i18n/config";

// Every page lives under /en or /es. Bare paths redirect to a locale:
//  - "/"        -> by Accept-Language (temporary: it depends on the visitor)
//  - legacy URLs such as /posts/x -> the default locale (permanent, keeps old links and SEO)
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const isRoot = pathname === "/";
  const locale = isRoot ? negotiateLocale(request.headers.get("accept-language")) : defaultLocale;
  const target = new URL(`/${locale}${isRoot ? "" : pathname}${search}`, request.url);
  const response = NextResponse.redirect(target, isRoot ? 307 : 308);
  if (isRoot) response.headers.set("Vary", "Accept-Language");
  return response;
}

export const config = {
  // Skip Next internals and anything with a file extension (icons, sitemap.xml, og-en.jpg, ...).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
