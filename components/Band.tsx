type Tone = "surface" | "subtle" | "asphalt" | "accent";

/**
 * The one place a section decides which surface it sits on.
 *
 * `asphalt` does not just paint a dark background: it re-points --surface, --ink,
 * --line and --ada at the dark half of brand.colors for everything inside it (the
 * .on-asphalt rule in app/layout.tsx). So a block written once against those
 * variables renders correctly on white and on black with no per-block branching,
 * and there is still exactly one palette in the content file.
 *
 * The grain and the seam are what stop a black band reading as an empty div: real
 * asphalt has aggregate in it and catches light along a fresh edge.
 *
 * `accent` is the yellow closing band (direction-v2.html: full yellow, ink text).
 * It needs no repointing: --ink is already ink on a yellow ground, the same as on
 * white. Only the primary button has to flip, since the accent-filled button is
 * the one thing that vanishes into an accent background - see Cta's onAccent.
 */
export default function Band({
  tone = "surface",
  className = "",
  seam = true,
  children,
}: {
  tone?: Tone;
  className?: string;
  seam?: boolean;
  children: React.ReactNode;
}) {
  if (tone === "asphalt") {
    return (
      <div className={`on-asphalt asphalt-grain relative overflow-hidden ${seam ? "asphalt-seam" : ""} ${className}`}>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  const bg = tone === "subtle" ? "bg-[var(--subtle)]" : tone === "accent" ? "bg-[var(--accent)]" : "bg-[var(--surface)]";

  return <div className={`relative ${bg} ${className}`}>{children}</div>;
}
