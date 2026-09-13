"use client";

import { useEffect, useState } from "react";
import { useDrawIn } from "@/components/useDrawIn";

/**
 * Counts a figure up as it scrolls into view.
 *
 * The final value is what renders at rest, so the number is correct in the HTML,
 * correct with no JS, and correct under reduced motion. The count only ever runs
 * when useDrawIn has decided the element was below the fold and motion is
 * allowed, which means the figure is never briefly wrong on screen.
 *
 * tabular-nums via ks-figure on the caller, so the digits do not jitter the
 * layout as they change width.
 */
export default function CountUp({ value, duration = 2200 }: { value: number; duration?: number }) {
  const { ref, drawn } = useDrawIn<HTMLSpanElement>();
  const [shown, setShown] = useState(value);
  const [armed, setArmed] = useState(false);

  // useDrawIn hid this element, so it is off screen and safe to start from zero.
  useEffect(() => {
    if (!drawn && !armed) {
      setArmed(true);
      setShown(0);
    }
  }, [drawn, armed]);

  useEffect(() => {
    if (!armed || !drawn) return;
    let raf = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      // Ease out, so it decelerates into the real figure instead of stopping dead.
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, drawn, value, duration]);

  return <span ref={ref}>{shown}</span>;
}
