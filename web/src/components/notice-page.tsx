import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/site";
import { Moon } from "./glyphs";
import { SiteHeader } from "./site-header";

/** Shared frame for small single-purpose pages (confirm, unsubscribe, result). */
export function NoticePage({
  lang,
  t,
  title,
  children,
  home = true,
}: {
  lang: Locale;
  t: Dictionary;
  title: string;
  children: ReactNode;
  home?: boolean;
}) {
  return (
    <>
      <SiteHeader lang={lang} t={t} />
      <main id="main" tabIndex={-1} className="mx-auto max-w-[560px] py-20 text-center">
        <Moon size={48} className="mx-auto text-gold" />
        <h1 className="mt-6 font-heading text-[clamp(34px,6vw,48px)] font-semibold leading-tight text-parch">
          {title}
        </h1>
        <div className="mt-5 text-muted">{children}</div>
        {home && (
          <Link
            href={localePath(lang)}
            className="mt-10 inline-flex min-h-11 items-center underline underline-offset-4"
          >
            {t.newsletterPages.home}
          </Link>
        )}
      </main>
    </>
  );
}

export const primaryButton =
  "inline-flex min-h-12 cursor-pointer items-center rounded-full bg-gold px-[30px] font-heading text-[21px] font-semibold tracking-wide text-ink transition duration-300 hover:bg-gold-light";
export const ghostButton =
  "inline-flex min-h-12 cursor-pointer items-center rounded-full border-[1.5px] border-gold px-[30px] font-heading text-[21px] font-semibold tracking-wide text-gold transition duration-300 hover:bg-gold/10";
