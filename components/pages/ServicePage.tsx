import Link from "next/link";
import type { Content } from "@/content/schema";
import { answeredFaqs } from "@/content/schema";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";

type Service = Content["services"][number];

/**
 * Service detail page. Doctrine's principle for this page type is "quote / consult,
 * cognitive fluency": one CTA, reusing the nav's own "Get a quote" label so nothing
 * new is typed here, tagged with this service's own source_tag.
 */
export default function ServicePage({ service, content }: { service: Service; content: Content }) {
  const faqs = answeredFaqs(service.faqs);
  const relatedBuyers = content.buyers.filter((b) => service.buyers.includes(b.slug));
  const cta = { label: content.nav.cta.label, href: "/contact/", source_tag: service.source_tag };

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{service.h1}</h1>
        <p className="mt-4 text-[length:var(--text-lede)] text-[var(--ink)]/80">{service.lede}</p>

        {service.body?.map((p, i) => (
          <p key={i} className="mt-4 text-[var(--ink)]/80">
            {p}
          </p>
        ))}

        <div className="mt-8">
          <Cta label={cta.label} href={cta.href} variant="primary" />
        </div>

        <h2 className="mt-10 text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{content.ui.service_scope_heading}</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {service.scope.map((item, i) => (
            <li key={i} className="flex gap-2 text-[var(--ink)]/80">
              <span aria-hidden="true" className="text-[var(--ink)]/40">
                {"•"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {faqs.length > 0 && (
          <>
            <h2 className="mt-10 text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{content.ui.service_faqs_heading}</h2>
            <dl className="mt-4 flex flex-col gap-6">
              {faqs.map((f, i) => (
                <div key={i}>
                  <dt className="font-semibold text-[var(--ink)]">{f.q}</dt>
                  <dd className="mt-1 text-[var(--ink)]/80">{f.a}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        {relatedBuyers.length > 0 && (
          <>
            <h2 className="mt-10 text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{content.ui.service_buyers_heading}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedBuyers.map((b) => (
                <Link
                  key={b.slug}
                  href={`/${b.slug}/`}
                  className="flex min-h-11 items-center rounded-full border border-[var(--line)] px-4 text-sm font-medium text-[var(--ink)] hover:border-[var(--ink)]"
                >
                  {b.label}
                </Link>
              ))}
            </div>
          </>
        )}
      </article>
      <ClosingBar cta={cta} />
    </>
  );
}
