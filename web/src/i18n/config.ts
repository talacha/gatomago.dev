// Keep in sync with the `locale` documents in the Studio: each tag here needs a dictionary below.
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const localeMeta: Record<
  Locale,
  { name: string; short: string; ogLocale: string; dateLocale: string }
> = {
  en: { name: "English", short: "EN", ogLocale: "en_US", dateLocale: "en-GB" },
  es: { name: "Español", short: "ES", ogLocale: "es_ES", dateLocale: "es-ES" },
};

export const otherLocales = (lang: Locale) => locales.filter((l) => l !== lang);

/** Picks a supported locale from an Accept-Language header. */
export function negotiateLocale(header: string | null): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = Number(params.find((p) => p.trim().startsWith("q="))?.split("=")[1] ?? 1);
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 0 : q };
    })
    .filter((x) => x.tag && x.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

/** Picks a language's value from a field-level translated array, falling back to the default language. */
export function pickLocalized<T>(
  values: { _key: string; value: T | null }[] | null | undefined,
  lang: Locale,
): T | null {
  return (
    values?.find((v) => v._key === lang)?.value ??
    values?.find((v) => v._key === defaultLocale)?.value ??
    null
  );
}
