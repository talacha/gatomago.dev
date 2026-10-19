import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { privacy } from "@/i18n/privacy";
import { newsletterEnabled } from "@/lib/features";
import { AUTHOR, hreflangs, localePath } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || !newsletterEnabled()) return {};
  return {
    title: privacy[lang].title,
    alternates: {
      canonical: `${localePath(lang)}/privacy`,
      languages: hreflangs(Object.fromEntries(locales.map((l) => [l, `${localePath(l)}/privacy`]))),
    },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang) || !newsletterEnabled()) notFound();
  const t = getDictionary(lang);
  const policy = privacy[lang];
  const email = process.env.PRIVACY_CONTACT_EMAIL?.trim();
  const address = process.env.NEWSLETTER_POSTAL_ADDRESS?.trim();

  return (
    <>
      <SiteHeader
        lang={lang}
        t={t}
        switchTo={Object.fromEntries(locales.map((l) => [l, `${localePath(l)}/privacy`]))}
      />
      <main id="main" tabIndex={-1} className="mx-auto max-w-[720px] pb-10 pt-16">
        <h1 className="font-heading text-[clamp(38px,6vw,56px)] font-semibold leading-tight text-parch">
          {policy.title}
        </h1>
        <p className="mt-3 text-[15px] text-muted">{policy.updated}</p>
        <p className="mt-8 text-[19px]">{policy.intro}</p>

        {policy.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="font-heading text-[30px] font-semibold text-parch">{section.heading}</h2>
            <div className="mt-3 flex flex-col gap-4 text-muted">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-10">
          <h2 className="font-heading text-[30px] font-semibold text-parch">{policy.contactLabel}</h2>
          <p className="mt-3 text-muted">
            {AUTHOR.name} ({AUTHOR.alias})
            {address ? <> · {address}</> : null}
            <br />
            {email ? (
              <a href={`mailto:${email}`} className="underline underline-offset-4">
                {email}
              </a>
            ) : (
              <a href={AUTHOR.linkedin} rel="me noopener" className="underline underline-offset-4">
                LinkedIn
              </a>
            )}
          </p>
        </section>
      </main>
    </>
  );
}
