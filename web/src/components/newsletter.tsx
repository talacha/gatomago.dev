"use client";

import Link from "next/link";
import { useState } from "react";
import { Triskele } from "./glyphs";

export function Newsletter() {
  const [message, setMessage] = useState("");

  // No mailing-list provider is connected yet: say so instead of silently reloading the page.
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Letters aren't flying just yet. Follow along by RSS in the meantime.");
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
        Join the Circle
      </h2>
      <p className="mx-auto mt-4 max-w-[480px] text-muted">
        One letter when a new entry lands. No spam, no spells cast on your inbox.
      </p>
      <form
        onSubmit={onSubmit}
        className="mx-auto mt-8 flex max-w-[560px] flex-wrap justify-center gap-3.5"
      >
        <label htmlFor="circle-email" className="sr-only">
          Email address
        </label>
        <input
          id="circle-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          className="min-h-[52px] flex-[1_1_260px] rounded-full border-[1.5px] border-gold/60 bg-void px-5 text-[17px] text-parch placeholder:text-muted"
        />
        <button
          type="submit"
          className="min-h-[52px] cursor-pointer rounded-full bg-gold px-8 font-heading text-[21px] font-semibold tracking-wide text-ink transition-colors hover:bg-gold-light"
        >
          Subscribe
        </button>
      </form>
      <p role="status" aria-live="polite" className="mt-5 min-h-7 text-[16px] text-parch">
        {message}
      </p>
      <Link href="/feed.xml" className="mt-1 inline-flex min-h-11 items-center underline underline-offset-4">
        Subscribe via RSS
      </Link>
    </section>
  );
}
