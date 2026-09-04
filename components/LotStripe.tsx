"use client";

import { useDrawIn } from "@/components/useDrawIn";

type Variant = "crosswalk" | "arrow" | "hatch" | "stall";

/**
 * The dividers between homepage bands are not rules, they are lot markings, and
 * they paint themselves as you scroll at roughly the speed a walk-behind striper
 * moves. Four of them, in the order a lot actually gets laid out: stalls, then the
 * crosswalk, then the directional arrows, then the hatched access aisle.
 *
 * Every path is hand-authored against a 1200 x 90 viewBox rather than generated,
 * so the geometry matches real markings: a crosswalk ladder is bars across the
 * direction of travel, an access aisle is hatched at 45 degrees, an arrow is a
 * shaft and a chevron head.
 *
 * Drawing behaviour, including the no-JS and reduced-motion cases, is
 * components/useDrawIn.ts. Read that before changing anything here.
 */

const SPEED = 900; // ms for one mark to lay down, tuned to look like a machine, not a wipe

function paths(variant: Variant): { d: string; ada?: boolean }[] {
  switch (variant) {
    case "crosswalk":
      // Ten bars across the lane. Real ladder crosswalk spacing: bar as wide as the gap.
      return Array.from({ length: 10 }, (_, i) => ({ d: `M ${70 + i * 112} 14 L ${70 + i * 112} 76` }));
    case "arrow":
      // Two straight-ahead arrows, shaft then head, the way they sit in a drive aisle.
      return [0, 620].flatMap((x) => [
        { d: `M ${x + 120} 78 L ${x + 120} 26` },
        { d: `M ${x + 96} 44 L ${x + 120} 18 L ${x + 144} 44` },
        { d: `M ${x + 330} 78 L ${x + 330} 26` },
        { d: `M ${x + 306} 44 L ${x + 330} 18 L ${x + 354} 44` },
      ]);
    case "hatch":
      // An access aisle. Blue, because on a real lot the hatching beside the
      // accessible stall is blue and this site uses blue for nothing else.
      return Array.from({ length: 10 }, (_, i) => ({ d: `M ${50 + i * 120} 78 L ${98 + i * 120} 12`, ada: true }));
    case "stall":
    default:
      // Spacing widened from 180 to 260. With preserveAspectRatio="none" the X axis
      // compresses hard on a phone, and at 180 these diagonals ran into each other.
      return Array.from({ length: 5 }, (_, i) => ({ d: `M ${80 + i * 260} 82 L ${124 + i * 260} 8` }));
  }
}

export default function LotStripe({
  variant = "stall",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const { ref, drawn } = useDrawIn<SVGSVGElement>();
  const marks = paths(variant);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 90"
      preserveAspectRatio="none"
      className={`h-[42px] w-full sm:h-[54px] ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {marks.map((m, i) => (
        <path
          key={i}
          d={m.d}
          fill="none"
          stroke={m.ada ? "var(--ada)" : "var(--accent)"}
          strokeWidth={m.ada ? 5 : 6}
          strokeLinecap="square"
          // preserveAspectRatio="none" scales the stroke with the squashed X axis,
          // which is what fattened these marks into each other at narrow widths.
          // Pinning the stroke to screen pixels keeps every mark the same weight at
          // every viewport, which is also how real paint behaves.
          vectorEffect="non-scaling-stroke"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={drawn ? 0 : 100}
          style={{
            transition: `stroke-dashoffset ${SPEED}ms cubic-bezier(0.65,0,0.35,1)`,
            // Staggered so the marks lay down in sequence along the lot rather
            // than all at once, which is the tell of a generic fade-in.
            transitionDelay: `${i * 55}ms`,
          }}
        />
      ))}
    </svg>
  );
}
