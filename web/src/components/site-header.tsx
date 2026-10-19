import Link from "next/link";
import { KnotDivider, Triskele } from "./glyphs";

const nav = [
  { href: "/#grimoire", label: "Grimoire" },
  { href: "/#about", label: "About" },
];

export function SiteHeader() {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-1 py-4 sm:py-6">
        <Link
          href="/"
          aria-label="Gato Mago, home"
          className="group flex min-h-11 items-center gap-3.5 text-parch hover:text-parch"
        >
          <Triskele
            size={40}
            className="text-gold transition-transform duration-700 ease-out group-hover:rotate-120"
          />
          <span className="font-display text-[26px] font-bold tracking-wide">Gato Mago</span>
        </Link>
        <nav
          aria-label="Main"
          className="flex flex-wrap items-center gap-x-4 font-heading text-lg font-semibold tracking-wide sm:gap-x-8 sm:text-xl"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center text-[#d9cfb8] hover:text-gold-light"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#circle"
            className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-gold px-4 text-gold sm:px-5 transition-colors hover:bg-gold hover:text-ink"
          >
            Join the Circle
          </Link>
        </nav>
      </header>
      <KnotDivider />
    </>
  );
}
