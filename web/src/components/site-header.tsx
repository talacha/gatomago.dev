import Link from "next/link";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/site";
import { KnotDivider, Triskele } from "./glyphs";

type Props = {
  lang: Locale;
  t: Dictionary;
  /** Where each other language's switcher link goes. Defaults to that language's home page. */
  switchTo?: Partial<Record<Locale, string>>;
};

export function SiteHeader({ lang, t, switchTo = {} }: Props) {
  const nav = [
    { href: `${localePath(lang)}#grimoire`, label: t.nav.grimoire },
    { href: `${localePath(lang)}#about`, label: t.nav.about },
  ];

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-1 py-4 sm:py-6">
        <Link
          href={localePath(lang)}
          aria-label={t.a11y.home}
          className="group flex min-h-11 items-center gap-3.5 text-parch hover:text-parch"
        >
          <Triskele
            size={40}
            className="text-gold transition-transform duration-700 ease-out group-hover:rotate-120"
          />
          <span className="font-display text-[26px] font-bold tracking-wide">Gato Mago</span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-8">
          <nav
            aria-label={t.a11y.mainNav}
            className="flex flex-wrap items-center gap-x-4 font-heading text-lg font-semibold tracking-wide sm:gap-x-8 sm:text-xl"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center text-[#d9cfb8] hover:text-gold-light"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`${localePath(lang)}#circle`}
              className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-gold px-4 text-gold transition-colors hover:bg-gold hover:text-ink sm:px-5"
            >
              {t.nav.circle}
            </Link>
          </nav>
          <nav
            aria-label={t.a11y.language}
            className="flex items-center font-heading text-base font-semibold tracking-wider"
          >
            {locales.map((l, i) => (
              <span key={l} className="flex items-center">
                {i > 0 && (
                  <span aria-hidden="true" className="text-gold/50">
                    /
                  </span>
                )}
                {l === lang ? (
                  <span
                    aria-current="true"
                    lang={l}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center text-parch"
                  >
                    {localeMeta[l].short}
                  </span>
                ) : (
                  <Link
                    href={switchTo[l] ?? localePath(l)}
                    lang={l}
                    hrefLang={l}
                    aria-label={localeMeta[l].name}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center text-gold hover:text-gold-light"
                  >
                    {localeMeta[l].short}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      </header>
      <KnotDivider />
    </>
  );
}
