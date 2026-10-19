import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NoticePage } from "@/components/notice-page";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const metadata: Metadata = { robots: { index: false, follow: false } };

async function Body({ lang, searchParams }: { lang: Locale; searchParams: Promise<{ r?: string }> }) {
  const t = getDictionary(lang);
  const p = t.newsletterPages;
  const { r } = await searchParams;
  const copy =
    r === "confirmed"
      ? { title: p.confirmedTitle, text: p.confirmedText }
      : r === "unsubscribed"
        ? { title: p.unsubscribedTitle, text: p.unsubscribedText }
        : r === "deleted"
          ? { title: p.deletedTitle, text: p.deletedText }
          : { title: p.invalidTitle, text: p.invalidText };
  return (
    <NoticePage lang={lang} t={t} title={copy.title}>
      <p role="status">{copy.text}</p>
    </NoticePage>
  );
}

export default async function StatusPage({ params, searchParams }: PageProps<"/[lang]/newsletter/status">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <Suspense fallback={null}>
      <Body lang={lang} searchParams={searchParams} />
    </Suspense>
  );
}
