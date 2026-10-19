import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { AUTHOR, localePath } from "@/lib/site";
import { Triskele } from "./glyphs";

export function SiteFooter({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <footer className="mt-24 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-gold/25 pb-14 pt-8 text-[15px] text-muted">
      <div className="flex items-center gap-3">
        <Triskele size={28} className="text-gold" />
        <span className="font-display text-lg text-parch">Gato Mago</span>
      </div>
      <nav aria-label={t.a11y.footerNav} className="flex flex-wrap gap-x-6 text-base">
        <Link
          href={`${localePath(lang)}/feed.xml`}
          className="inline-flex min-h-11 min-w-11 items-center justify-center"
        >
          RSS
        </Link>
        <a
          href={AUTHOR.linkedin}
          rel="me noopener"
          className="inline-flex min-h-11 min-w-11 items-center justify-center"
        >
          LinkedIn
        </a>
      </nav>
      <div>{t.footer.rights}</div>
    </footer>
  );
}
