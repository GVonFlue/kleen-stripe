import { content } from "@/lib/content";
import { telHref } from "@/lib/render";
import Cta from "@/components/Cta";

type ClosingBarProps = {
  cta?: { label: string; href: string; source_tag?: string } | null;
};

/**
 * Closing CTA before the footer, required on every route without exception
 * (doctrine section 3). Reuses whatever CTA the page already defines as the
 * primary ask, or falls back to the sitewide quote CTA, paired with a tel: link
 * as the second distinct door. No new copy: every label here already exists and
 * has already passed the copy rules elsewhere in the content file.
 */
export default function ClosingBar({ cta }: ClosingBarProps) {
  const primary = cta ?? content.nav.cta;
  const showSecondaryCall = primary.href !== telHref(content.business.phone_primary);

  return (
    <section aria-label="Get in touch" className="border-t border-[var(--line)] bg-[var(--subtle)]">
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3 px-4 py-10">
        <Cta label={primary.label} href={primary.href} variant="primary" />
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
