import { content, closingCopy } from "@/lib/content";
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
 *
 * Headline and body are closingCopy, the homepage's own closing block (see
 * lib/content.ts): the same "send a photo, get a number back" ask reads the
 * same everywhere rather than a new line being written per route. Without it
 * this was two buttons on a loud yellow field saying nothing, which is worse
 * than the black band it replaced ever was.
 *
 * The CTA underneath the headline still reuses whatever the page defines as
 * its own primary ask (buyer/area/service each have one, closingCopy does
 * not have to be it), or falls back to the sitewide quote CTA, paired with a
 * tel: link as the second distinct door. Exactly one of the two is styled
 * primary: doctrine check 1, Hick's Law, applies to the loudest band on the
 * site as much as it does to the header. No new copy beyond closingCopy:
 * every label here already exists and has already passed the copy rules
 * elsewhere in the content file.
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
    <section aria-label="Get in touch" className="bg-[var(--accent)] py-14 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-[length:var(--text-display)] font-extrabold leading-[1.1] text-[var(--ink)]">
          {closingCopy.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--ink)]/80">{closingCopy.body}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Cta label={primary.label} href={primary.href} variant="primary" onAccent />
          {showSecondaryCall && (
            <Cta
              label={`${content.nav.call_label} ${content.business.phone_display}`}
              href={telHref(content.business.phone_primary)}
              variant="secondary"
            />
          )}
        </div>
      </div>
    </section>
  );
}
