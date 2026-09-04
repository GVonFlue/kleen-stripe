import { LOGO_LOCKUP, LOGO_STACKED } from "@/lib/logo";
import { content } from "@/lib/content";

/**
 * Devin's actual wordmark, traced off the logo file that was already sitting in
 * public/photos/source and never used. Two paths, one per word.
 *
 * fill is currentColor throughout, so the mark takes the colour of whatever it
 * sits in: accent yellow on asphalt, ink on white. No hex here.
 *
 * `paint` runs the reveal. It is pure CSS with a per-word delay, no client
 * component and no hydration: the words are in the HTML fully drawn, and the
 * keyframe only clips them back and sweeps them open on load. No JS, a failed
 * hydration, or prefers-reduced-motion all leave a finished logo on screen,
 * because the global reduced-motion rule zeroes the duration and `both` lands it
 * on the end state.
 */
export default function Logo({
  variant = "lockup",
  paint = false,
  className = "",
}: {
  variant?: "lockup" | "stacked";
  paint?: boolean;
  className?: string;
}) {
  const mark = variant === "lockup" ? LOGO_LOCKUP : LOGO_STACKED;
  const label = content.business.name;

  return (
    <svg
      viewBox={`0 0 1000 ${mark.height}`}
      className={className}
      role="img"
      aria-label={label}
      focusable="false"
    >
      <path
        d={mark.kleen}
        fill="currentColor"
        fillRule="evenodd"
        className={paint ? "ks-paint-on" : undefined}
      />
      <path
        d={mark.stripe}
        fill="currentColor"
        fillRule="evenodd"
        className={paint ? "ks-paint-on" : undefined}
        style={paint ? { animationDelay: "260ms" } : undefined}
      />
    </svg>
  );
}
