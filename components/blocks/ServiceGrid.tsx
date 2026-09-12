import Link from "next/link";
import { content } from "@/lib/content";

/**
 * Nine identical bordered boxes is the most generic pattern in web design. ADA
 * compliance is the money page (service.priority: 1, already in content, not a
 * hardcoded slug check) so it gets double width and its own weight: a blue border,
 * since blue means ADA and nothing else on this site, and larger type. The other
 * eight stay smaller. A 3-column grid with one 2-wide card leaves an uneven last
 * row on purpose; a perfectly even grid is exactly the pattern being broken.
 *
 * Third rail on the page, solid, alternating back from JourneyBand's dashed one:
 * this band is a fixed catalogue, not a sequence, so it gets the same treatment
 * as PickYourDoor's sorting decision rather than the journey's dashed line.
 */
export default function ServiceGrid({ block }: { block: any }) {
  const services = [...content.services].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

  return (
    <section className="ks-railed mx-auto max-w-6xl px-4 py-10">
      <span className="ks-rail" aria-hidden="true" />
      <div className="ks-railed-body">
        <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
        <p className="mt-3 max-w-2xl text-[var(--ink)]/80">{block.body}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const isMoneyPage = service.priority === 1;
            return (
              <Link
                key={service.slug}
                href={`/${service.slug}/`}
                className={
                  isMoneyPage
                    ? "rounded-none border-2 border-[var(--ada)] p-6 transition-colors hover:bg-[var(--subtle)] sm:col-span-2"
                    : "rounded-none border border-[var(--line)] p-5 transition-colors hover:border-[var(--ink)]"
                }
              >
                <p className={isMoneyPage ? "text-[length:var(--text-h3)] font-bold text-[var(--ink)]" : "font-semibold text-[var(--ink)]"}>
                  {service.name}
                </p>
                <p className={isMoneyPage ? "mt-2 max-w-xl text-[var(--ink)]/80" : "mt-2 text-sm text-[var(--ink)]/70"}>
                  {service.lede}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
