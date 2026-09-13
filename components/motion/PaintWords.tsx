/**
 * Paints a headline on, word by word, left to right.
 *
 * A server component on purpose: the animation is pure CSS, so this renders the
 * finished text in the HTML and needs no script to become readable. Reduced
 * motion is handled by the sitewide kill switch in globals.css, which zeroes the
 * duration and lands every word on its final state.
 *
 * Children that are not plain strings (the yellow year, punctuation) pass through
 * untouched as their own animated unit, so the emphasis stays intact.
 */
export default function PaintWords({
  text,
  start = 0,
  step = 65,
  className = "",
}: {
  text: string;
  /** ms before the first word paints. Use to sequence after an eyebrow. */
  start?: number;
  /** ms between words. */
  step?: number;
  className?: string;
}) {
  const words = text.split(" ").filter(Boolean);
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="ks-word" style={{ animationDelay: `${start + i * step}ms` }}>
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
