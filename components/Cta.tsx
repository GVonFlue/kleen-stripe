import Link from "next/link";

type CtaProps = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "submit" | "button";
  disabled?: boolean;
};

/**
 * The one component every button on the site goes through, links and real form
 * submit buttons alike. `variant="primary"` is the only place the accent color is
 * allowed to appear, per brand.color_rules: it never appears on decoration, and
 * every yellow surface carries ink text so it clears WCAG AA. Doctrine check 1 and
 * check 3.
 */
export default function Cta({ label, href, variant = "secondary", className = "", type, disabled }: CtaProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-[var(--accent-ink)] hover:brightness-95"
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
