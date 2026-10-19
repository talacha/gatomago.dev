import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NoticePage, primaryButton } from "@/components/notice-page";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { confirmAction } from "@/newsletter/actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  referrer: "no-referrer", // the link carries a secret token
};

// Confirming needs a deliberate click (a POST), so mail scanners that pre-fetch links can't subscribe anyone.
async function Body({ lang, searchParams }: { lang: Locale; searchParams: Promise<{ token?: string }> }) {
  const t = getDictionary(lang);
  const { token } = await searchParams;
  return (
    <NoticePage lang={lang} t={t} title={t.newsletterPages.confirmTitle}>
      <p>{t.newsletterPages.confirmText}</p>
      <form action={confirmAction} className="mt-8">
        <input type="hidden" name="token" value={typeof token === "string" ? token : ""} />
        <input type="hidden" name="lang" value={lang} />
        <button type="submit" className={primaryButton}>
          {t.newsletterPages.confirmButton}
        </button>
      </form>
    </NoticePage>
  );
}

export default async function ConfirmPage({ params, searchParams }: PageProps<"/[lang]/newsletter/confirm">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <Suspense fallback={null}>
      <Body lang={lang} searchParams={searchParams} />
    </Suspense>
  );
}
