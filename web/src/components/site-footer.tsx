import { Triskele } from "./glyphs";

export function SiteFooter() {
  return (
    <footer className="mt-24 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-gold/25 pb-14 pt-8 text-[15px] text-muted">
      <div className="flex items-center gap-3">
        <Triskele size={28} className="text-gold" />
        <span className="font-display text-lg text-parch">Gato Mago</span>
      </div>
      <div>© 2026 Juan Luis Villaseñor. All spells reserved.</div>
    </footer>
  );
}
