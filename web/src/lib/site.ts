import { defaultLocale, type Locale } from "@/i18n/config";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gatomago.dev").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "Gato Mago";

export const AUTHOR = {
  name: "Juan Luis Villaseñor",
  alias: "Gato Mago",
  linkedin: "https://www.linkedin.com/in/juanluisvillase%C3%B1or/",
};

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Path to a page in a language, e.g. localePath("es", "/posts/x") -> "/es/posts/x". */
export const localePath = (lang: Locale, path = "") =>
  `/${lang}${path === "/" ? "" : path}`;

/** hreflang map for a set of translations, plus x-default pointing at the default locale. */
export function hreflangs(urls: Partial<Record<Locale, string>>) {
  const languages: Record<string, string> = { ...urls };
  const fallback = urls[defaultLocale] ?? Object.values(urls)[0];
  if (fallback) languages["x-default"] = fallback;
  return languages;
}

export const ogImage = (lang: Locale, alt: string) => ({
  url: `/og-${lang}.jpg`,
  width: 1200,
  height: 630,
  alt,
});
