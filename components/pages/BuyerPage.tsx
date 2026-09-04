import type { Content } from "@/content/schema";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";
import Band from "@/components/Band";
import PageHeader from "@/components/PageHeader";
import QuoteAside from "@/components/QuoteAside";

type Buyer = Content["buyers"][number];

/**
 * Buyer-segment landing page. One CTA, the buyer's own, chosen for its principle.
 * Same shape as ServicePage now (docs/design/direction-v2.html: "apply the
 * interior template to buyer and area pages too"): dark asphalt band, breadcrumb
 * header, sticky quote rail, yellow ClosingBar. No scope list or FAQs here since
 * buyer content has neither field, so the article column is just the pain
 * statement and body copy against the same dark tone.
 */
export default function BuyerPage({ buyer }: { buyer: Buyer }) {
  return (
    <>
      <Band tone="asphalt" seam={false}>
        <PageHeader crumbs={[{ label: "Home", href: "/" }, { label: buyer.label }]} h1={buyer.h1} lede={buyer.pain} />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          <article>
            {buyer.body.map((p, i) => (
              <p key={i} className="mt-0 mb-5 text-[length:var(--text-lede)] text-[var(--ink)]/80 last:mb-0">
                {p}
              </p>
            ))}
            <div className="mt-2">
              <Cta label={buyer.cta.label} href={buyer.cta.href} variant="primary" />
            </div>
          </article>

          <QuoteAside />
        </div>
      </Band>

      <ClosingBar cta={buyer.cta} />
    </>
  );
}
