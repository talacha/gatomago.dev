import Link from "next/link";
import { Moon } from "@/components/glyphs";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[560px] py-28 text-center">
      <Moon size={56} className="mx-auto text-gold" />
      <h1 className="mt-6 font-heading text-5xl font-semibold text-parch">
        This page has vanished
      </h1>
      <p className="mt-4 text-muted">The spell fizzled, or the entry was never inscribed.</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center rounded-full border-[1.5px] border-gold px-[30px] font-heading text-[21px] font-semibold"
      >
        Return to the study
      </Link>
    </section>
  );
}
