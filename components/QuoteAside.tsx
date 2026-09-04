import { content } from "@/lib/content";
import { telHref } from "@/lib/render";
import Cta from "@/components/Cta";

/**
 * The sticky "get a number" panel on every interior detail page (service, buyer,
 * area). Pulled out of ServicePage so BuyerPage and AreaPage get the same shape
 * per docs/design/direction-v2.html rather than three copies drifting apart.
 *
 * Every field here is sitewide and already exists: the photo-and-address ask is
 * the homepage's own closing block's primary CTA (the same "text a photo" door
 * the homepage closes on), the phone number is business.phone_primary/display,
 * and the service-area line is business.service_area_statement. No new copy.
 * Pulled from pages["/"].blocks rather than a typed content field: blocks are
 * z.any() at the schema level (see content/schema.ts), so this reads like every
 * other block component does.
 */
export default function QuoteAside() {
  const closing = (content.pages["/"]?.blocks ?? []).find((b: any) => b.id === "closing") as any;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="border-t-[5px] border-[var(--accent)] bg-[var(--subtle)] p-6">
        <h2 className="text-[length:var(--text-h3)] font-black text-[var(--ink)]">
          Get a number on this lot
        </h2>
        <p className="mt-3 text-sm text-[var(--ink)]/70">
          Text a photo and the address. You will get a real number instead of a range.
        </p>
        <div className="mt-5 flex flex-col gap-2.5">
          <Cta label={closing.cta_primary.label} href={closing.cta_primary.href} variant="primary" className="w-full" />
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
