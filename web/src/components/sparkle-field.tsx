import { Spark } from "./glyphs";

// [left %, top %, size px, delay s, duration s, colour]
const sparks: [number, number, number, number, number, "gold" | "teal"][] = [
  [4, 12, 10, 0.2, 3.8, "gold"],
  [18, 6, 7, 1.4, 4.6, "teal"],
  [42, 14, 12, 2.1, 3.4, "gold"],
  [52, 3, 8, 0.7, 5.0, "gold"],
  [9, 46, 8, 2.6, 4.2, "teal"],
  [47, 52, 10, 1.0, 3.9, "gold"],
  [30, 78, 7, 3.1, 4.8, "gold"],
  [6, 88, 11, 0.5, 4.0, "teal"],
  [55, 90, 8, 2.0, 3.6, "gold"],
  [96, 8, 9, 1.8, 4.4, "gold"],
  [92, 58, 12, 0.9, 3.7, "teal"],
  [88, 94, 7, 2.9, 5.2, "gold"],
];

/** Decorative ambient sparkles. Static (but visible) when reduced motion is requested. */
export function SparkleField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
      {sparks.map(([left, top, size, delay, duration, tone], i) => (
        <Spark
          key={i}
          size={size}
          className={`absolute opacity-50 motion-safe:animate-twinkle ${tone === "teal" ? "text-teal" : "text-gold"}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      ))}
    </div>
  );
}
