import { content } from "@/lib/content";
import Cta from "@/components/Cta";

/**
 * The mid-page conversion block, and per docs/design/direction-v2.html the ADA
 * signature moment: drawn as an actual accessible stall rather than another
 * bordered card. On a real lot, diagonal hatching marks the access aisle beside
 * the accessible stall, the zone you do not park in, so the block that sells ADA
 * compliance is the one place on the site literally painted like one.
 *
 * ADA blue is the field, not a border, which is why this does not go through
 * Band tone="asphalt" like its neighbors on the homepage (app/page.tsx's TONE
 * table gives it tone: "surface" for exactly this reason): --ada gets repointed
 * to the lighter ada_on_dark inside an asphalt band, which is right for blue text
 * or an icon on black but wrong for a full blue field, so this paints --ada
 * directly and stays outside that context. The badge names the real service
 * (services[priority 1].name), not invented label copy, and yellow stays out of
 * the field on purpose: the reference never mixes the two accent colors on one
 * surface, so the button is surface-filled with ADA-blue text (Cta's onAda)
 * instead of the usual yellow.
 *
 * lead_magnet.cta.href in content is "#": a placeholder, since the real form and
 * PDF do not exist until checkpoint 3. Doctrine forbids a button with no
 * destination ("withheld, not dead"), so this routes to the dedicated landing
 * page instead, the same pattern the hero's own secondary CTA already uses for
 * this exact give. See checkpoint 1 report.
 */
export default function LeadMagnetBlock() {
  const { lead_magnet } = content;
  const adaService = content.services.find((s) => s.priority === 1);

  return (
    <section className="relative overflow-hidden bg-[var(--ada)]">
      <div className="stall-hatch" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:py-20">
        <div>
          {adaService && (
            <span className="inline-flex bg-[var(--surface)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--ada)]">
              {adaService.name}
            </span>
          )}
          <h2 className="mt-4 text-[length:var(--text-h2)] font-bold text-[var(--surface)]">{lead_magnet.title}</h2>
          <p className="mt-2 text-[var(--surface)]/85">{lead_magnet.subtitle}</p>
          <div className="mt-6">
            <Cta label={lead_magnet.cta.label} href="/ada-striping-checklist/" variant="primary" onAda />
            <p className="mt-3 text-xs text-[var(--surface)]/70">{lead_magnet.consent_line}</p>
          </div>
        </div>
        <ul className="flex flex-col gap-3">
          {lead_magnet.value_stack.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--surface)]/95">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              >
                <path d="M2 9.5l4.5 4.5L16 4" stroke="var(--surface)" strokeWidth="2.4" strokeLinecap="square" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
