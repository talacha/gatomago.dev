import type { Metadata } from "next";
import {
  Cinzel_Decorative,
  Cormorant_Garamond,
  Noto_Sans_Ogham,
  Spectral,
} from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

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

export const metadata: Metadata = {
  title: { default: "Gato Mago", template: "%s · Gato Mago" },
  description:
    "Essays, charms and field notes by Juan Luis Villaseñor, known as Gato Mago.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${spectral.variable} ${ogham.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden">
        <div className="mx-auto max-w-[1200px] px-8">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
