import type { Content } from "@/content/schema";
import { interpolate } from "@/lib/render";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";

type Area = Content["areas"][number];

/**
 * Templated city page. See area_page_template.note in the content file: this fills
 * a real gap (areaSchema has no copy fields), reusing facts established elsewhere
 * rather than inventing local detail. Flagged pending in provenance.
 */
export default function AreaPage({ area, content }: { area: Area; content: Content }) {
  const t = content.area_page_template;
  const vars = { city: area.city, state: area.state };
  const h1 = interpolate(t.h1_template, vars);
  const lede = interpolate(t.lede_template, vars);

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{h1}</h1>
        <p className="mt-4 text-[length:var(--text-lede)] text-[var(--ink)]/80">{lede}</p>
        {t.body.map((p, i) => (
          <p key={i} className="mt-4 text-[var(--ink)]/80">
            {p}
          </p>
        ))}
        <div className="mt-8">
          <Cta label={t.cta.label} href={t.cta.href} variant="primary" />
        </div>
      </article>
      <ClosingBar cta={t.cta} />
    </>
  );
}
