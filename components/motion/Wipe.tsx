"use client";

import { useDrawIn } from "@/components/useDrawIn";

/**
 * Wipes its contents open from the left as they scroll into view, at the speed
 * the lot markings draw, so a band reads as being painted rather than as fading
 * in.
 *
 * Built on useDrawIn, which starts in the finished state and only ever hides
 * something that is both below the fold and allowed to move. No JS, a failed
 * hydration, reduced motion, and anything already on screen all render finished
 * content. Nothing here needs a script to become visible.
 */
export default function Wipe({
  children,
  delay = 0,
  duration = 620,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const { ref, drawn } = useDrawIn<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: drawn ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
        transition: `clip-path ${duration}ms cubic-bezier(0.65,0,0.35,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
