"use client";

import { useDrawIn } from "@/components/useDrawIn";

/**
 * The access-aisle hatching paints itself across the ADA field as the band comes
 * into view, in the direction the stripes actually run.
 *
 * The field itself is never hidden, only the hatching over it, so the section is
 * always readable. Same useDrawIn contract as everything else: finished state at
 * rest, no JS and reduced motion both leave the hatching drawn.
 */
export default function HatchDraw() {
  const { ref, drawn } = useDrawIn<HTMLDivElement>();
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="stall-hatch"
      style={{
        clipPath: drawn ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
        transition: "clip-path 2400ms cubic-bezier(0.45,0,0.2,1)",
      }}
    />
  );
}
