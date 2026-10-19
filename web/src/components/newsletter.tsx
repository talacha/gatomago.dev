"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/site";
import { Triskele } from "./glyphs";

export function Newsletter({ lang, t }: { lang: Locale; t: Dictionary }) {
  const [message, setMessage] = useState("");

  // No mailing-list provider is connected yet: say so instead of silently reloading the page.
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(t.newsletter.pending);
  }

  return (
    <section
      id="circle"
      aria-labelledby="circle-heading"
      className="scroll-mt-8 rounded-[20px] border-[1.5px] border-gold bg-panel px-6 py-14 text-center sm:px-12 sm:py-16"
    >
      <Triskele size={44} className="mx-auto text-gold motion-safe:animate-drift" />
      <h2
        id="circle-heading"
        className="mt-4 font-display text-[28px] font-normal tracking-wider text-parch sm:text-[34px]"
      >
        {t.newsletter.title}
      </h2>
      <p className="mx-auto mt-4 max-w-[480px] text-muted">
        {t.newsletter.text}
      </p>
      <form
        onSubmit={onSubmit}
        className="mx-auto mt-8 flex max-w-[560px] flex-wrap justify-center gap-3.5"
      >
        <label htmlFor="circle-email" className="sr-only">
          {t.newsletter.label}
        </label>
        <input
          id="circle-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.newsletter.placeholder}
          className="min-h-[52px] flex-[1_1_260px] rounded-full border-[1.5px] border-gold/60 bg-void px-5 text-[17px] text-parch placeholder:text-muted"
        />
        <button
          type="submit"
          className="min-h-[52px] cursor-pointer rounded-full bg-gold px-8 font-heading text-[21px] font-semibold tracking-wide text-ink transition-colors hover:bg-gold-light"
        >
          {t.newsletter.submit}
        </button>
      </form>
      <p role="status" aria-live="polite" className="mt-5 min-h-7 text-[16px] text-parch">
        {message}
      </p>
      <Link
        href={`${localePath(lang)}/feed.xml`}
        className="mt-1 inline-flex min-h-11 items-center underline underline-offset-4"
      >
        {t.newsletter.rss}
      </Link>
    </section>
  );
}
