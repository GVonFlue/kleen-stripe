import type { Content } from "@/content/schema";
import { interpolate } from "@/lib/render";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";
import Band from "@/components/Band";
import PageHeader from "@/components/PageHeader";
import QuoteAside from "@/components/QuoteAside";

type Area = Content["areas"][number];

/**
 * Templated city page. See area_page_template.note in the content file: this fills
 * a real gap (areaSchema has no copy fields), reusing facts established elsewhere
 * rather than inventing local detail. Flagged pending in provenance.
 *
 * Same shape as ServicePage and BuyerPage now (docs/design/direction-v2.html:
 * "apply the interior template to buyer and area pages too"): dark asphalt band,
 * breadcrumb header (through the real /service-areas/ hub, matching nav's own
 * "Service Area" label), sticky quote rail, yellow ClosingBar.
 */
export default function AreaPage({ area, content }: { area: Area; content: Content }) {
  const t = content.area_page_template;
  const vars = { city: area.city, state: area.state };
  const h1 = interpolate(t.h1_template, vars);
  const lede = interpolate(t.lede_template, vars);

  return (
    <>
      <Band tone="asphalt" seam={false}>
        <PageHeader
          crumbs={[{ label: "Home", href: "/" }, { label: "Service Area", href: "/service-areas/" }, { label: area.city }]}
          h1={h1}
          lede={lede}
        />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          <article>
            {t.body.map((p, i) => (
              <p key={i} className="mt-0 mb-5 text-[length:var(--text-lede)] text-[var(--ink)]/80 last:mb-0">
                {p}
              </p>
            ))}
            <div className="mt-2">
              <Cta label={t.cta.label} href={t.cta.href} variant="primary" />
            </div>
          </article>

          <QuoteAside />
        </div>
      </Band>

      <ClosingBar cta={t.cta} />
    </>
  );
}
