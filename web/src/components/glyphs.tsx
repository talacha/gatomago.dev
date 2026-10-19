import type { SVGProps } from "react";

type GlyphProps = SVGProps<SVGSVGElement> & { size?: number };

const spiral = "M0 0 C0 -9 8 -14 15 -10 C23 -5 22 8 12 12 C6 14 -1 11 -2 5";

export function Triskele({ size = 40, ...props }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="-30 -30 60 60" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d={spiral} />
        <path d={spiral} transform="rotate(120)" />
        <path d={spiral} transform="rotate(240)" />
      </g>
      <circle r="2.6" fill="currentColor" />
    </svg>
  );
}

export function Moon({ size = 40, ...props }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48" aria-hidden="true" {...props}>
      <path d="M10 -21 A21 21 0 1 0 10 21 A16 16 0 1 1 10 -21 Z" fill="currentColor" />
    </svg>
  );
}

export function Spark({ size = 24, ...props }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="-12 -12 24 24" aria-hidden="true" {...props}>
      <path
        d="M0 -11 L2.2 -2.2 L11 0 L2.2 2.2 L0 11 L-2.2 2.2 L-11 0 L-2.2 -2.2 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function KnotDivider({ className }: { className?: string }) {
  return (
    <svg width="100%" height="24" aria-hidden="true" className={className}>
      <defs>
        <pattern id="gm-knot" width="48" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 12 Q12 -4 24 12 T48 12" fill="none" stroke="#14161d" strokeWidth="7" />
          <path d="M0 12 Q12 -4 24 12 T48 12" fill="none" stroke="#e2b25c" strokeWidth="2.2" />
          <path d="M0 12 Q12 28 24 12 T48 12" fill="none" stroke="#14161d" strokeWidth="7" />
          <path d="M0 12 Q12 28 24 12 T48 12" fill="none" stroke="#e2b25c" strokeWidth="2.2" />
        </pattern>
      </defs>
      <rect width="100%" height="24" fill="url(#gm-knot)" />
    </svg>
  );
}
