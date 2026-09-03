import { content } from "@/lib/content";
import Cta from "@/components/Cta";

/**
 * The mid-page conversion block. lead_magnet.cta.href in content is "#": a
 * placeholder, since the real form and PDF do not exist until checkpoint 3.
 * Doctrine forbids a button with no destination ("withheld, not dead"), so this
 * routes to the dedicated landing page instead, the same pattern the hero's own
 * secondary CTA already uses for this exact give. See checkpoint 1 report.
 */
export default function LeadMagnetBlock() {
  const { lead_magnet } = content;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-xl border border-[var(--line)] bg-[var(--subtle)] p-6 sm:p-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{lead_magnet.title}</h2>
            <p className="mt-2 text-[var(--ink)]/80">{lead_magnet.subtitle}</p>
            <div className="mt-6">
              <Cta label={lead_magnet.cta.label} href="/ada-striping-checklist/" variant="primary" />
              <p className="mt-3 text-xs text-[var(--ink)]/60">{lead_magnet.consent_line}</p>
            </div>
          </div>
          <ul className="flex flex-col gap-3">
            {lead_magnet.value_stack.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--ink)]/80">
                <span aria-hidden="true" className="text-[var(--ink)]/40">
                  {"✓"}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
