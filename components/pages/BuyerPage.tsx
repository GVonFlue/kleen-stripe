import type { Content } from "@/content/schema";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";

type Buyer = Content["buyers"][number];

/** Buyer-segment landing page. One CTA, the buyer's own, chosen for its principle. */
export default function BuyerPage({ buyer }: { buyer: Buyer }) {
  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{buyer.h1}</h1>
        <p className="mt-4 text-[length:var(--text-lede)] text-[var(--ink)]/80">{buyer.pain}</p>

        {buyer.body.map((p, i) => (
          <p key={i} className="mt-4 text-[var(--ink)]/80">
            {p}
          </p>
        ))}

        <div className="mt-8">
          <Cta label={buyer.cta.label} href={buyer.cta.href} variant="primary" />
        </div>
      </article>
      <ClosingBar cta={buyer.cta} />
    </>
  );
}
