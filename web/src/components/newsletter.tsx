import { Triskele } from "./glyphs";

export function Newsletter() {
  return (
    <section
      id="circle"
      className="rounded-[20px] border-[1.5px] border-gold bg-panel px-12 py-16 text-center"
    >
      <Triskele size={44} className="mx-auto text-gold" />
      <h2 className="mt-4 font-display text-[34px] font-normal tracking-wider text-parch">
        Join the Circle
      </h2>
      <p className="mx-auto mt-4 max-w-[480px] text-muted">
        One letter when a new entry lands. No spam, no spells cast on your inbox.
      </p>
      <form className="mx-auto mt-8 flex max-w-[560px] flex-wrap justify-center gap-3.5">
        <label htmlFor="circle-email" className="sr-only">
          Email address
        </label>
        <input
          id="circle-email"
          type="email"
          required
          placeholder="your@email.com"
          className="min-h-[52px] flex-[1_1_260px] rounded-full border-[1.5px] border-gold/50 bg-void px-5 text-[17px] text-parch placeholder:text-muted/70"
        />
        <button
          type="submit"
          className="min-h-[52px] cursor-pointer rounded-full bg-gold px-8 font-heading text-[21px] font-semibold tracking-wide text-ink"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
