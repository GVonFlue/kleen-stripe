"use client";

import { useEffect, useState } from "react";

/**
 * A stripe-shaped mask sweeps across the hero photo on load, the way a lot gets
 * painted. Under 700ms. This never delays LCP: it is a client-only overlay that
 * mounts on top of an image already in the DOM and already painted (see
 * GalleryPhoto's `eager` prop on the hero), so a slow or absent script never
 * hides the photo, it only ever adds a sweep in front of one already showing.
 *
 * The sweep travels toward the upper right, along this photo's own vanishing
 * point (the stall lines recede toward the garage on the right of frame), not
 * straight across, per the work order.
 *
 * prefers-reduced-motion honored twice: this component's own matchMedia check
 * (renders nothing at all, so the photo is simply visible, no sweep, no flash),
 * and the sitewide CSS kill switch in globals.css underneath it regardless.
 */
export default function HeroReveal() {
  const [play, setPlay] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setSkip(true);
      return;
    }
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (skip) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute h-[300%] w-[60%]"
        style={{
          background: "var(--ink)",
          transform: play ? "translate(160%, -110%) skewX(-18deg)" : "translate(-40%, 40%) skewX(-18deg)",
          transition: "transform 650ms cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      />
    </div>
  );
}
