import Link from "next/link";
import { Moon } from "@/components/glyphs";
import { locales, localeMeta } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/site";

// A not-found boundary has no route params, so it can't know the visitor's language.
// Show every language, each marked with its own lang attribute.
export default function NotFound() {
  return (
    <section className="mx-auto max-w-[560px] py-28 text-center">
      <Moon size={56} className="mx-auto text-gold" />
      {locales.map((l) => {
        const t = getDictionary(l);
        return (
          <div key={l} lang={l} className="mt-8">
            <h1 className="font-heading text-4xl font-semibold text-parch sm:text-5xl">
              {t.notFound.title}
            </h1>
            <p className="mt-3 text-muted">{t.notFound.text}</p>
            <Link
              href={localePath(l)}
              className="mt-5 inline-flex min-h-12 items-center rounded-full border-[1.5px] border-gold px-[30px] font-heading text-[21px] font-semibold"
            >
              {t.notFound.cta} · {localeMeta[l].short}
            </Link>
          </div>
        );
      })}
    </section>
  );
}
