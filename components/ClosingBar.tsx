import { content } from "@/lib/content";
import { telHref } from "@/lib/render";
import Cta from "@/components/Cta";

type ClosingBarProps = {
  cta?: { label: string; href: string; source_tag?: string } | null;
};

/**
 * Closing CTA before the footer, required on every route without exception
 * (doctrine section 3). Full yellow band, matching the homepage's own closing
 * band and the ADA/service page mockups in docs/design/direction-v2.html: this
 * is the one moment on every interior page that gets the loud treatment, so it
 * reads as a deliberate ending, not a plain bordered box.
 * Reuses whatever CTA the page already defines as the primary ask, or falls back
 * to the sitewide quote CTA, paired with a tel: link as the second distinct door.
 * No new copy: every label here already exists and has already passed the copy
 * rules elsewhere in the content file.
 *
 * Was a black band until direction-v2.html moved every closing moment on the
 * site to yellow. The secondary call button needs no onDark now: ink-on-yellow
 * is the same pair as ink-on-white, so the default outline already reads. The
 * primary button does need onAccent, for the same reason as ClosingCta.
 */
export default function ClosingBar({ cta }: ClosingBarProps) {
  const primary = cta ?? content.nav.cta;
  const showSecondaryCall = primary.href !== telHref(content.business.phone_primary);

  return (
    <section aria-label="Get in touch" className="bg-[var(--accent)]">
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3 px-4 py-10">
        <Cta label={primary.label} href={primary.href} variant="primary" onAccent />
        {showSecondaryCall && (
          <Cta
            label={`${content.nav.call_label} ${content.business.phone_display}`}
            href={telHref(content.business.phone_primary)}
            variant="secondary"
          />
        )}
      </div>
    </section>
  );
}
