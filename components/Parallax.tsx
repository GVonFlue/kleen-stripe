"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A slow vertical drift on a photo as it passes through the viewport, so the
 * full-bleed images have depth instead of sitting flat on the page.
 *
 * Deliberately small: `range` is the total travel in pixels and defaults to 40.
 * Anything larger starts to look like the image is sliding rather than sitting
 * behind the page, and on a site whose whole subject is straight lines a wobbling
 * photo reads as a defect.
 *
 * Additive: offset starts at 0 and stays 0 with no JS or under reduced motion, and
 * the wrapper is overflow-hidden with the child scaled slightly so the drift never
 * exposes an edge. Passive scroll listener, rAF throttled, never scroll-jacking.
 */
export default function Parallax({
  range = 40,
  className = "",
  innerClassName = "",
  children,
}: {
  range?: number;
  className?: string;
  /** Needed when the drifting layer must fill its container, as the hero photo does. */
  innerClassName?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);

    let raf = 0;
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      // -0.5 at the moment the element's centre is at the bottom of the viewport,
      // +0.5 when it reaches the top. Zero when it is centred.
      const centred = (rect.top + rect.height / 2 - vh / 2) / (vh + rect.height);
      setOffset(-centred * range);
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
  }, [range]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
          // Only pay the overscan when the drift is actually running.
          scale: on ? `${1 + (range * 2) / 1000}` : undefined,
          willChange: on ? "transform" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
