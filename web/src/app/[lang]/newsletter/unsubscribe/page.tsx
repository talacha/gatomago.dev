import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ghostButton, NoticePage, primaryButton } from "@/components/notice-page";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { eraseAction, unsubscribeAction } from "@/newsletter/actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

async function Body({ lang, searchParams }: { lang: Locale; searchParams: Promise<{ token?: string }> }) {
  const t = getDictionary(lang);
  const p = t.newsletterPages;
  const { token } = await searchParams;
  const value = typeof token === "string" ? token : "";
  return (
    <NoticePage lang={lang} t={t} title={p.unsubscribeTitle}>
      <p>{p.unsubscribeText}</p>
      <form action={unsubscribeAction} className="mt-8">
        <input type="hidden" name="token" value={value} />
        <input type="hidden" name="lang" value={lang} />
        <button type="submit" className={primaryButton}>
          {p.unsubscribeButton}
        </button>
      </form>
      <p className="mt-10 text-[16px]">{p.eraseText}</p>
      <form action={eraseAction} className="mt-5">
        <input type="hidden" name="token" value={value} />
        <input type="hidden" name="lang" value={lang} />
        <button type="submit" className={ghostButton}>
          {p.eraseButton}
        </button>
      </form>
    </NoticePage>
  );
}

export default async function UnsubscribePage({ params, searchParams }: PageProps<"/[lang]/newsletter/unsubscribe">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <Suspense fallback={null}>
      <Body lang={lang} searchParams={searchParams} />
    </Suspense>
  );
}
