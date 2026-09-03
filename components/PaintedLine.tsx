"use client";

import { useEffect, useRef, useState } from "react";

type PaintedLineProps = {
  className?: string;
  /** Stroke thickness in the line's own 0-3 viewBox units. */
  thickness?: number;
};

/**
 * The motion backbone (docs/BUILD_PROMPT.md step 2): an SVG line that paints
 * itself left to right via stroke-dashoffset, at the speed a striping machine
 * moves, in the accent yellow so the line drawing itself is the same colour as
 * the paint in the photographs beside it.
 *
 * Default state is fully drawn. That is not a lazy fallback, it is the correct
 * behavior with no JS, with prefers-reduced-motion, and for anything already
 * on screen at load: a painted line is real content (a section divider, a
 * heading underline), never something a script must run to reveal. Only when
 * JS is present, motion is allowed, AND the element starts below the fold does
 * this hide itself and draw in as it is scrolled to, so nothing already visible
 * ever pops from hidden to drawn.
 *
 * Reduced motion is honored twice: this component's own matchMedia check
 * (never hides in the first place), and the sitewide CSS kill switch in
 * globals.css (zeroes transition-duration regardless, belt and suspenders).
 * No scroll-jacking: this only observes, it never intercepts scroll.
 */
export default function PaintedLine({ className = "", thickness = 3 }: PaintedLineProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [state, setState] = useState<"drawn" | "hidden">("drawn");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return; // never pop already-visible content

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("drawn");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      className={className}
      width="100%"
      height={thickness + 1}
      viewBox={`0 0 100 ${thickness + 1}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <line
        x1="0"
        y1={(thickness + 1) / 2}
        x2="100"
        y2={(thickness + 1) / 2}
        stroke="var(--accent)"
        strokeWidth={thickness}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={state === "drawn" ? 0 : 100}
        style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.65,0,0.35,1)" }}
      />
    </svg>
  );
}
