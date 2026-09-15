import { content, closingCopy } from "@/lib/content";
import { telHref } from "@/lib/render";
import Cta from "@/components/Cta";

/**
 * The sticky "get a number" panel on every interior detail page (service, buyer,
 * area). Pulled out of ServicePage so BuyerPage and AreaPage get the same shape
 * per docs/design/direction-v2.html rather than three copies drifting apart.
 *
 * Audit pass: the heading and the body line were typed straight into this file.
 * They are now ui.quote_aside_heading and ui.quote_aside_body. CLAUDE.md's "no
 * copy in JSX, none" rule exists for exactly this, and this site feeds the client
 * self-edit portal, so a hardcoded string here is a string Devin can never change.
 *
 * Every field here is sitewide and already exists: the photo-and-address ask is
 * closingCopy's own primary CTA (the same "text a photo" door the homepage
 * closes on, see lib/content.ts), the phone number is
 * business.phone_primary/display, and the service-area line is
 * business.service_area_statement. No new copy.
 */
export default function QuoteAside() {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="border-t-[5px] border-[var(--accent)] bg-[var(--subtle)] p-6">
        <h2 className="text-[length:var(--text-h3)] font-black text-[var(--ink)]">
          {content.ui.quote_aside_heading}
        </h2>
        <p className="mt-3 text-sm text-[var(--ink)]/70">{content.ui.quote_aside_body}</p>
        <div className="mt-5 flex flex-col gap-2.5">
          <Cta label={closingCopy.cta_primary.label} href={closingCopy.cta_primary.href} variant="primary" className="w-full" />
          <Cta
            label={`Call ${content.business.phone_display}`}
            href={telHref(content.business.phone_primary)}
            variant="secondary"
            className="w-full"
          />
        </div>
        <p className="mt-5 text-xs text-[var(--ink)]/60">{content.business.service_area_statement}</p>
      </div>
    </aside>
  );
}
