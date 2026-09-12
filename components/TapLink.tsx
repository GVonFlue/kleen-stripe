type TapLinkProps = {
  href: string;
  label: string;
  size?: "large" | "small";
  className?: string;
  onDark?: boolean;
};

/**
 * Tappable call/text links for the header and footer. Neutral ink styling, never
 * accent, so the one accent-colored action per screenful stays the nav CTA.
 * Doctrine check 1 and check 3, "Redundant paths" tappable tel: requirement.
 */
export default function TapLink({ href, label, size = "small", className = "", onDark = false }: TapLinkProps) {
  const sizing =
    size === "large"
      ? "min-h-11 px-3 py-2 text-base font-semibold"
      : "min-h-11 px-2 py-2 text-sm font-medium";
  const color = onDark ? "text-[var(--surface)]" : "text-[var(--ink)]";
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-none ${color} hover:underline ${sizing} ${className}`}
    >
      {label}
    </a>
  );
}
