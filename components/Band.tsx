type Tone = "surface" | "subtle" | "asphalt";

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

  return (
    <div className={`relative ${tone === "subtle" ? "bg-[var(--subtle)]" : "bg-[var(--surface)]"} ${className}`}>
      {children}
    </div>
  );
}
