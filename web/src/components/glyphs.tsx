import type { SVGProps } from "react";

type GlyphProps = SVGProps<SVGSVGElement> & { size?: number };

const spiral =
  "M0.0 0.0 L-1.17 -0.17 L-2.3 -0.45 L-3.4 -0.83 L-4.45 -1.3 L-5.44 -1.85 L-6.36 -2.5 L-7.22 -3.21 L-7.99 -4.0 L-8.69 -4.84 L-9.3 -5.74 L-9.82 -6.67 L-10.24 -7.64 L-10.58 -8.64 L-10.81 -9.65 L-10.96 -10.67 L-11.0 -11.69 L-10.96 -12.69 L-10.82 -13.68 L-10.59 -14.64 L-10.29 -15.56 L-9.9 -16.45 L-9.43 -17.28 L-8.9 -18.06 L-8.31 -18.78 L-7.66 -19.43 L-6.96 -20.01 L-6.22 -20.52 L-5.45 -20.95 L-4.64 -21.31 L-3.82 -21.59 L-2.99 -21.78 L-2.15 -21.9 L-1.32 -21.94 L-0.5 -21.91 L0.31 -21.79 L1.09 -21.61 L1.84 -21.36 L2.55 -21.04 L3.22 -20.67 L3.85 -20.24 L4.42 -19.76 L4.94 -19.24 L5.41 -18.68 L5.81 -18.09 L6.15 -17.47 L6.43 -16.83 L6.64 -16.18 L6.79 -15.52 L6.87 -14.87 L6.89 -14.22 L6.86 -13.58 L6.76 -12.95 L6.61 -12.35 L6.4 -11.78 L6.15 -11.24 L5.85 -10.73 L5.52 -10.26 L5.14 -9.84 L4.74 -9.45 L4.31 -9.12 L3.86 -8.83 L3.39 -8.59 L2.91 -8.41 L2.43 -8.27 L1.95 -8.18 L1.47 -8.14 L1.0 -8.14 L0.54 -8.19 L0.1 -8.28 L-0.32 -8.41 L-0.72 -8.58 L-1.08 -8.78 L-1.42 -9.01 L-1.73 -9.26 L-2.0 -9.54 L-2.24 -9.83 L-2.44 -10.14 L-2.6 -10.45 L-2.73 -10.78 L-2.82 -11.1 L-2.87 -11.42 L-2.9 -11.73 L-2.88 -12.04 L-2.84 -12.33 L-2.77 -12.61 L-2.68 -12.87 L-2.56 -13.11 L-2.42 -13.32 L-2.26 -13.51 L-2.09 -13.68";

export function Triskele({ size = 40, ...props }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="-30 -30 60 60" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={spiral} />
        <path d={spiral} transform="rotate(120)" />
        <path d={spiral} transform="rotate(240)" />
      </g>
      <circle r="3.2" fill="currentColor" />
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
