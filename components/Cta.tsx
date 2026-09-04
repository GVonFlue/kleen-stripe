import Link from "next/link";

type CtaProps = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "submit" | "button";
  disabled?: boolean;
  /** Set on a black band: the secondary outline flips from ink-on-light to
   *  surface-on-dark. The primary button never changes, it already reads
   *  cleanly on black, which is the point of the black-and-yellow pairing. */
  onDark?: boolean;
  /** Set on a yellow band (the closing CTA, direction-v2.html): the primary
   *  button is the one place the accent color is not available, since the
   *  band underneath it already is. It flips to ink-filled with accent text,
   *  the same inversion the band itself did. The secondary outline is
   *  untouched: ink-on-light already reads fine on yellow. */
  onAccent?: boolean;
  /** Set on the ADA field (the accessible-stall signature block,
   *  direction-v2.html): yellow stays out of blue on purpose, the reference
   *  never mixes the two accent colors on one surface, so the primary button
   *  flips to surface-filled with ADA-blue text instead of accent-filled. */
  onAda?: boolean;
};

/**
 * The one component every button on the site goes through, links and real form
 * submit buttons alike. `variant="primary"` is the only place the accent color is
 * allowed to appear, per brand.color_rules: it never appears on decoration, and
 * every yellow surface carries ink text so it clears WCAG AA. Doctrine check 1 and
 * check 3.
 */
export default function Cta({
  label,
  href,
  variant = "secondary",
  className = "",
  type,
  disabled,
  onDark = false,
  onAccent = false,
  onAda = false,
}: CtaProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors disabled:opacity-50";
  const styles =
    variant === "primary"
      ? onAccent
        ? "bg-[var(--ink)] text-[var(--accent)] hover:brightness-110"
        : onAda
          ? "bg-[var(--surface)] text-[var(--ada)] hover:brightness-95"
          : "bg-[var(--accent)] text-[var(--accent-ink)] hover:brightness-95"
      : onDark
        ? "border-2 border-[var(--surface)] text-[var(--surface)] hover:bg-[var(--surface)]/10"
        : "border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--subtle)]";

  if (type === "submit" || type === "button") {
    return (
      <button type={type} disabled={disabled} className={`${base} ${styles} ${className}`}>
        {label}
      </button>
    );
  }

  const isInternal = (href ?? "").startsWith("/");
  const Tag = isInternal ? Link : "a";

  return (
    <Tag href={href ?? "#"} className={`${base} ${styles} ${className}`}>
      {label}
    </Tag>
  );
}
