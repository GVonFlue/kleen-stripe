import Link from "next/link";
import type { Content } from "@/content/schema";
import { answeredFaqs } from "@/content/schema";
import ClosingBar from "@/components/ClosingBar";
import Band from "@/components/Band";
import PageHeader from "@/components/PageHeader";
import QuoteAside from "@/components/QuoteAside";

type Service = Content["services"][number];

/**
 * Service detail page. Doctrine's principle for this page type is "quote / consult,
 * cognitive fluency": one primary CTA, reusing the nav's own label so nothing new
 * is typed here, tagged with this service's own source_tag.
 *
 * Twenty one of the twenty six routes are this shape or its buyer/area siblings,
 * so this template carries most of the site's weight and it is worth more than a
 * narrow column of bullets. Rebuilt against docs/design/direction-v2.html:
 *
 *   1. The dark tone runs the whole page now, not just the header. The mockup's
 *      "railed" body section is dark by default (only Home's job-steps band
 *      opts into ".light"), so this is one continuous Band tone="asphalt" from
 *      the breadcrumb to the related-services pills, closed out by the yellow
 *      ClosingBar. PageHeader and QuoteAside are shared with BuyerPage and
 *      AreaPage so the three templates cannot drift out of shape.
 *   2. A sticky quote rail (QuoteAside). On a service page the visitor's
 *      question is "what does this cost on my lot," and the answer should not
 *      scroll away while they read the scope. It collapses under the content
 *      on narrow viewports.
 *   3. Scope as a numbered, ruled list rather than bullets. These are the line
 *      items of a quote, so they are set like line items, with the mono face
 *      and tabular figures.
 *
 * A withheld FAQ answer renders as a visible, labelled gap rather than vanishing
 * silently, so a missing fact reads as a missing fact and not as a short page.
 *
 * Not carried over from the mockup: a per-service photo behind the header (no
 * photo_assignments field exists per service, and inventing one generic image
 * for every service risks reading as stock), and the ADA-specific blue hero the
 * ADA money page view shows in place of this dark header (no badge/heading copy
 * exists for it yet). The ADA signature moment this build does carry is the
 * accessible-stall treatment in LeadMagnetBlock on the homepage.
 */
export default function ServicePage({ service, content }: { service: Service; content: Content }) {
  const faqs = answeredFaqs(service.faqs);
  const withheld = service.faqs.filter((f) => f.a === null);
  const relatedBuyers = content.buyers.filter((b) => service.buyers.includes(b.slug));
  const cta = { label: content.nav.cta.label, href: "/contact/", source_tag: service.source_tag };

  return (
    <>
      <Band tone="asphalt" seam={false}>
        {/* The ADA page opens as an access aisle rather than as another dark
            header: a full-bleed blue field under white diagonal hatching, which
            is what that marking means on real pavement. It is the site's
            signature moment and it belongs on the page it was designed for.
            Driven by service.header_tone in the content file, not by a slug
            check here, so a second compliance page would inherit it by saying
            so rather than by being special-cased in a component. */}
        {service.header_tone === "ada" ? (
          <div className="ada-field relative overflow-hidden">
            <div className="stall-hatch" aria-hidden="true" />
            <div className="relative">
              <PageHeader
                crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: service.name }]}
                h1={service.h1}
                lede={service.lede}
              />
            </div>
          </div>
        ) : (
          <PageHeader
            crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: service.name }]}
            h1={service.h1}
            lede={service.lede}
          />
        )}

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          <article>
            {service.body?.map((p, i) => (
              <p key={i} className="mt-0 mb-5 text-[length:var(--text-lede)] text-[var(--ink)]/80 last:mb-0">
                {p}
              </p>
            ))}

            <h2 className="mt-10 text-[length:var(--text-h2)] font-black text-[var(--ink)]">
              {content.ui.service_scope_heading}
            </h2>
            <ol className="mt-6 border-t border-[var(--line)]">
              {service.scope.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-4 border-b border-[var(--line)] py-3.5 text-[var(--ink)]/85"
                >
                  <span aria-hidden="true" className="ks-figure pt-0.5 text-xs text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>

            {(faqs.length > 0 || withheld.length > 0) && (
              <>
                <h2 className="mt-12 text-[length:var(--text-h2)] font-black text-[var(--ink)]">
                  {content.ui.service_faqs_heading}
                </h2>
                <dl className="mt-6 border-t border-[var(--line)]">
                  {faqs.map((f, i) => (
                    <div key={`a-${i}`} className="border-b border-[var(--line)] py-5">
                      <dt className="text-[length:var(--text-h3)] font-black text-[var(--ink)]">{f.q}</dt>
                      <dd className="mt-2 max-w-[70ch] text-[var(--ink)]/80">{f.a}</dd>
                    </div>
                  ))}
                  {withheld.map((f, i) => (
                    <div key={`w-${i}`} className="border-b border-[var(--line)] py-5">
                      <dt className="text-[length:var(--text-h3)] font-black text-[var(--ink)]/50">{f.q}</dt>
                      <dd className="ks-label mt-2 text-[var(--ink)]/45">
                        Answer withheld until the fact is confirmed
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {relatedBuyers.length > 0 && (
              <>
                <h2 className="mt-12 text-[length:var(--text-h2)] font-black text-[var(--ink)]">
                  {content.ui.service_buyers_heading}
                </h2>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {relatedBuyers.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/${b.slug}/`}
                      className="ks-label flex min-h-11 items-center border border-[var(--line)] px-4 text-[var(--ink)]/70 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {b.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </article>

          <QuoteAside />
        </div>
      </Band>

      <ClosingBar cta={cta} />
    </>
  );
}
