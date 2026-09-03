"use client";

import { useEffect, useRef, useState } from "react";

const STALL_COUNT = 6;

/**
 * brand.signature_element: a hand-authored SVG of a real lot layout. Stalls fill
 * as the page scrolls, the ADA stall and its access aisle land last and land in
 * the blue, and the whole thing doubles as this section's own progress indicator.
 * Meaningless for a competitor who is not leading on ADA, which is the test it
 * has to pass.
 *
 * Scroll-linked, not scroll-jacking: this only reads scroll position via a
 * passive listener and never calls preventDefault or alters scroll behavior.
 * prefers-reduced-motion honored twice: this component's own matchMedia check
 * (skips straight to fully filled, no listener attached at all), and the
 * sitewide CSS kill switch in globals.css under it regardless.
 */
export default function StallGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduce);
    if (reduce) {
      setProgress(1);
      return;
    }

    let raf = 0;
    const compute = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh; // fully empty when the top just enters the viewport
      const end = vh * 0.4; // fully filled once it has been scrolled well into view
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const filled = progress * STALL_COUNT;
  const transition = reduced ? "none" : "stroke-dashoffset 120ms linear, opacity 200ms linear";

  return (
    <div ref={containerRef} className="mx-auto max-w-2xl">
      <svg
        viewBox="0 0 600 180"
        className="w-full"
        role="img"
        aria-label="A row of six parking stalls filling in as the page scrolls, with the accessible stall and its access aisle marked in blue"
      >
        <rect x="2" y="20" width="596" height="140" fill="var(--surface)" stroke="var(--line)" strokeWidth="2" />
        {Array.from({ length: STALL_COUNT }).map((_, i) => {
          const x = i * 100;
          const isAda = i === STALL_COUNT - 1;
          const stallProgress = Math.min(1, Math.max(0, filled - i));
          const lineColor = isAda ? "var(--ada)" : "var(--ink)";

          return (
            <g key={i}>
              {i > 0 && (
                <line
                  x1={x}
                  y1={20}
                  x2={x}
                  y2={160}
                  stroke={lineColor}
                  strokeWidth={4}
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={100 - stallProgress * 100}
                  style={{ transition }}
                />
              )}
              {isAda && (
                <g opacity={stallProgress > 0.5 ? Math.min(1, (stallProgress - 0.5) / 0.5) : 0} style={{ transition }}>
                  {/* hatched access aisle */}
                  {Array.from({ length: 6 }).map((_, h) => (
                    <line
                      key={h}
                      x1={x + 15 + h * 14}
                      y1={158}
                      x2={x + 15 + h * 14 - 28}
                      y2={22}
                      stroke="var(--ada)"
                      strokeWidth={2}
                    />
                  ))}
                  {/* simplified accessible symbol */}
                  <circle cx={x + 50} cy={60} r={9} fill="var(--ada)" />
                  <path
                    d={`M ${x + 50} 74 v 20 m -14 0 h 28 m -28 0 l 10 26 m 8 -26 l 10 26`}
                    stroke="var(--ada)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
