import type { Metadata, Viewport } from "next";
import {
  Cinzel_Decorative,
  Cormorant_Garamond,
  Noto_Sans_Ogham,
  Spectral,
} from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { isLocale, locales, localeMeta, otherLocales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath, ogImage, SITE_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

const cinzel = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const ogham = Noto_Sans_Ogham({
  variable: "--font-ogham",
  weight: "400",
});

export const viewport: Viewport = {
  themeColor: "#14161d",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  const image = ogImage(lang, t.meta.ogAlt);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: `%s · ${SITE_NAME}` },
    description: t.meta.description,
    applicationName: SITE_NAME,
    authors: [{ name: "Juan Luis Villaseñor", url: SITE_URL }],
    creator: "Juan Luis Villaseñor",
    // Pages override these with their own language alternates.
    alternates: {
      canonical: "./",
      types: { "application/rss+xml": `${localePath(lang)}/feed.xml` },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: localeMeta[lang].ogLocale,
      alternateLocale: otherLocales(lang).map((l) => localeMeta[l].ogLocale),
      title: SITE_NAME,
      description: t.meta.description,
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html
      lang={lang}
      className={`${cinzel.variable} ${cormorant.variable} ${spectral.variable} ${ogham.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-5 focus:py-2 focus:text-ink"
        >
          {t.a11y.skip}
        </a>
        <div className="mx-auto max-w-[1200px] px-8">
          {children}
          <SiteFooter lang={lang} t={t} />
        </div>
      </body>
    </html>
  );
}

