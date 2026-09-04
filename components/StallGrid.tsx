"use client";

import { useEffect, useRef, useState } from "react";

// Five standard stalls, then the accessible stall, then its access aisle. Seven
// columns, because an accessible stall without the aisle beside it is the single
// most common thing that fails an inspection, and drawing it any other way would
// teach the visitor the wrong shape.
const STALL_COUNT = 5;
const COLS = STALL_COUNT + 2;

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
  // Starts filled, not empty. With no JS, a failed hydration, or reduced motion,
  // this is a finished drawing of a lot rather than an empty rectangle, which is
  // the same additive rule every other drawn element on the site follows (see
  // components/useDrawIn.ts). Only once a script has confirmed motion is allowed
  // AND the drawing is still below the fold does it reset to empty and fill on
  // scroll, so nothing already on screen ever pops from blank to drawn.
  const [progress, setProgress] = useState(1);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduce);
    if (reduce) return; // already filled

    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (alreadyVisible) return; // never pop already-visible content back to empty
    }
    setProgress(0);

    let raf = 0;
    const compute = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh; // fully empty when the top just enters the viewport
      const end = vh * 0.4; // fully filled once it has been scrolled well into view
      const raw = (start - rect.top) / (start - end);
      // Monotonic: paint goes down, it does not come back up. Without this the
      // lot empties again when the visitor scrolls back past it, which is both a
      // lie about how striping works and a blank rectangle sitting in a black
      // band for anyone who scrolls up.
      setProgress((prev) => Math.max(prev, Math.min(1, Math.max(0, raw))));
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

  const filled = progress * COLS;
  const transition = reduced ? "none" : "stroke-dashoffset 140ms linear, opacity 260ms linear";

  const W = 700;
  const COL = 92;
  const TOP = 18;
  const BOT = 172;
  const x0 = (i: number) => 20 + i * COL;

  return (
    <div ref={containerRef} className="mx-auto max-w-4xl">
      <svg
        viewBox={`0 0 ${W} 190`}
        className="w-full"
        role="img"
        aria-label="A row of parking stalls filling in as the page scrolls, ending with the accessible stall and the hatched access aisle beside it, both marked in blue"
      >
        {/* The pavement. Slightly lighter than the band behind it so the drawing
            reads as a lot rather than as lines floating on the page. */}
        <defs>
          <clipPath id="ks-aisle">
            <rect x={x0(COLS - 1) + 3} y={TOP} width={COL - 6} height={BOT - TOP} />
          </clipPath>
        </defs>
        <rect x="2" y={TOP - 4} width={W - 4} height={BOT - TOP + 8} fill="var(--subtle)" stroke="var(--line)" strokeWidth="2" />

        {Array.from({ length: COLS }).map((_, i) => {
          const isAda = i === COLS - 2;
          const isAisle = i === COLS - 1;
          const p = Math.min(1, Math.max(0, filled - i));
          const stroke = isAda || isAisle ? "var(--ada)" : "var(--accent)";

          return (
            <g key={i}>
              {/* The divider on the left of this stall. Stall one has none: the
                  first line on a real lot is shared with the kerb. */}
              {i > 0 && (
                <line
                  x1={x0(i)}
                  y1={TOP}
                  x2={x0(i)}
                  y2={BOT}
                  stroke={stroke}
                  strokeWidth={5}
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={100 - p * 100}
                  style={{ transition }}
                />
              )}

              {/* Closing line on the far side of the aisle, so the last column is
                  a bounded zone and not an open edge. */}
              {isAisle && (
                <line
                  x1={x0(i + 1)}
                  y1={TOP}
                  x2={x0(i + 1)}
                  y2={BOT}
                  stroke="var(--ada)"
                  strokeWidth={5}
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={100 - p * 100}
                  style={{ transition }}
                />
              )}

              {/* The accessible symbol, centred in its own stall. */}
              {isAda && (
                <g opacity={p} style={{ transition }} fill="var(--ada)">
                  <circle cx={x0(i) + COL / 2} cy={TOP + 34} r={8} />
                  <path
                    d={`M ${x0(i) + COL / 2} ${TOP + 48} v 22 m -15 0 h 30 m -30 0 l 9 26 m 12 -26 l 9 26`}
                    stroke="var(--ada)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              )}

              {/* The access aisle: 45 degree hatching, inside its own column and
                  nowhere near the stall, which is the whole point of it. */}
              {isAisle && (
                <g opacity={p} style={{ transition }} clipPath="url(#ks-aisle)">
                  {/* Parallel, and clipped to the aisle rather than shortened to
                      fit it. Shortening each line to the column edge fans them
                      into a wedge, which is not what hatching is. */}
                  {Array.from({ length: 7 }).map((_, h) => {
                    const sx = x0(i) - 40 + h * 26;
                    return (
                      <line
                        key={h}
                        x1={sx}
                        y1={BOT}
                        x2={sx + (BOT - TOP)}
                        y2={TOP}
                        stroke="var(--ada)"
                        strokeWidth={3}
                      />
                    );
                  })}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
