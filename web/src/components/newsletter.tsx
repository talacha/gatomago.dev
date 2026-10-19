"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/site";
import { subscribeAction, type SubscribeState } from "@/newsletter/actions";
import { Triskele } from "./glyphs";

const initial: SubscribeState = { code: "idle" };

export function Newsletter({ lang, t }: { lang: Locale; t: Dictionary }) {
  const [state, formAction, pending] = useActionState(subscribeAction, initial);
  const n = t.newsletter;

  const messages: Record<Exclude<SubscribeState["code"], "idle" | "ok">, string> = {
    invalid_email: n.invalidEmail,
    consent_required: n.consentRequired,
    rate_limited: n.rateLimited,
    error: n.error,
  };
  const failure = state.code !== "idle" && state.code !== "ok" ? messages[state.code] : null;

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
        {n.title}
      </h2>
      <p className="mx-auto mt-4 max-w-[520px] text-muted">{n.text}</p>

      {state.code === "ok" ? (
        <p
          role="status"
          className="mx-auto mt-8 max-w-[520px] rounded-xl border border-teal/60 bg-void px-5 py-4 text-parch"
        >
          {n.ok}
        </p>
      ) : (
        <form action={formAction} className="mx-auto mt-8 flex max-w-[560px] flex-col gap-4 text-left">
          <input type="hidden" name="lang" value={lang} />
          {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="flex flex-wrap justify-center gap-3.5">
            <label htmlFor="circle-email" className="sr-only">
              {n.label}
            </label>
            <input
              id="circle-email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              defaultValue={state.email ?? ""}
              placeholder={n.placeholder}
              aria-describedby={failure ? "circle-error" : undefined}
              aria-invalid={failure ? true : undefined}
              className="min-h-[52px] flex-[1_1_260px] rounded-full border-[1.5px] border-gold/60 bg-void px-5 text-[17px] text-parch placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={pending}
              className="min-h-[52px] cursor-pointer rounded-full bg-gold px-8 font-heading text-[21px] font-semibold tracking-wide text-ink transition-colors hover:bg-gold-light disabled:cursor-wait disabled:opacity-70"
            >
              {pending ? n.sending : n.submit}
            </button>
          </div>

          {/* Consent is an unticked box the visitor must tick themselves (GDPR Art. 7, Recital 32). */}
          <div className="flex items-start gap-3 text-[15px] leading-snug text-muted">
            <input
              id="circle-consent"
              name="consent"
              type="checkbox"
              required
              defaultChecked={state.consent ?? false}
              className="mt-0 size-6 shrink-0 cursor-pointer accent-gold"
            />
            <label htmlFor="circle-consent" className="cursor-pointer">
              {n.consentBefore}
              <Link href={`${localePath(lang)}/privacy`} className="underline underline-offset-4">
                {n.consentLink}
              </Link>
              {n.consentAfter}
            </label>
          </div>

          <p id="circle-error" role="alert" className="min-h-6 text-center text-[16px] text-parch">
            {failure}
          </p>
        </form>
      )}

      <Link
        href={`${localePath(lang)}/feed.xml`}
        className="mt-1 inline-flex min-h-11 items-center underline underline-offset-4"
      >
        {n.rss}
      </Link>
    </section>
  );
}
