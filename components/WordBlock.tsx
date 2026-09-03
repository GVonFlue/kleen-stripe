/**
 * "Catch colors and word blocks," Devin's own words. A yellow block behind a short
 * phrase, ink text on it, never the reverse (brand.color_rules). Used sparingly: the
 * one claim in a section, not every heading. This is a second use of the accent
 * color beyond the single-primary-action rule (doctrine check 1/3), a deliberate,
 * explicit exception for this client's stated visual language, not a drift from it.
 */
export default function WordBlock({ children }: { children: React.ReactNode }) {
  return <span className="inline-block bg-[var(--accent)] px-2 py-0.5 text-[var(--accent-ink)]">{children}</span>;
}
