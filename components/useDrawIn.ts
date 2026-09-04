"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The shared rule for every scroll-drawn thing on this site, in one place so the
 * behaviour cannot drift between components.
 *
 * Additive by construction: the returned state starts "drawn". A component
 * renders its finished form and only ever hides itself once JS has run, motion is
 * allowed, AND the element is still below the fold. So no JS, a failed hydration,
 * prefers-reduced-motion, and anything already on screen at load all leave
 * finished content. Nothing on this site needs a script to become visible.
 *
 * Observes only. Never intercepts or alters scroll.
 */
export function useDrawIn<T extends Element>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<"drawn" | "hidden">("drawn");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("drawn");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, drawn: state === "drawn" } as const;
}
