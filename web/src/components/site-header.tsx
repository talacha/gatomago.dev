import Link from "next/link";
import { KnotDivider, Triskele } from "./glyphs";

const nav = [
  { href: "/#grimoire", label: "Grimoire" },
  { href: "/#about", label: "About" },
];

export function SiteHeader() {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-7">
        <Link href="/" className="flex items-center gap-3.5 text-parch hover:text-parch">
          <Triskele size={40} className="text-gold" />
          <span className="font-display text-[26px] font-bold tracking-wide">Gato Mago</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 font-heading text-xl font-semibold tracking-wide">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-2.5 text-[#d9cfb8] hover:text-gold-light"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#circle"
            className="rounded-full border-[1.5px] border-gold px-5 py-2.5 text-gold hover:text-gold-light"
          >
            Join the Circle
          </Link>
        </nav>
      </header>
      <KnotDivider />
    </>
  );
}
