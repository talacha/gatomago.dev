import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 · Gato Mago",
  robots: { index: false },
};

// Shown for URLs that match no route at all. Next skips the [lang] layout for these,
// so this page brings its own <html> and stays bilingual.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center px-8 text-center">
        <main>
          <h1 className="font-serif text-5xl font-semibold text-parch">
            <span lang="en">This page has vanished</span>
            <br />
            <span lang="es" className="mt-3 inline-block text-4xl text-muted">
              Esta página se ha desvanecido
            </span>
          </h1>
          <p className="mt-8 flex flex-wrap justify-center gap-4 font-serif text-xl">
            <Link href="/en" lang="en" className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-gold px-7">
              Return to the study
            </Link>
            <Link href="/es" lang="es" className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-gold px-7">
              Volver al estudio
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
