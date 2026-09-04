import Link from "next/link";
import LotStripe from "@/components/LotStripe";

type Crumb = { label: string; href?: string };

/**
 * The breadcrumb-and-headline band that opens every service, buyer and area
 * page, per docs/design/direction-v2.html: real navigation (it matches the
 * BreadcrumbList JSON-LD each page already emits), not decoration. Assumes it
 * is already inside a Band tone="asphalt" - it does not paint its own
 * background, because per direction-v2.html the dark tone now runs the whole
 * page, not just this header, and a second background here would double it.
 */
export default function PageHeader({ crumbs, h1, lede }: { crumbs: Crumb[]; h1: string; lede: string }) {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:pb-16 sm:pt-14">
        <nav aria-label="Breadcrumb" className="ks-label text-[var(--ink)]/55">
          {crumbs.map((c, i) => (
            <span key={i}>
              {c.href ? (
                <Link href={c.href} className="hover:text-[var(--accent)]">
                  {c.label}
                </Link>
              ) : (
                <span className="text-[var(--ink)]/80">{c.label}</span>
              )}
              {i < crumbs.length - 1 && (
                <span aria-hidden="true" className="px-2 text-[var(--accent)]">
                  {"›"}
                </span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="mt-6 max-w-3xl text-[length:var(--text-h1)] font-black leading-[1.02] text-[var(--ink)]">{h1}</h1>
        <p className="mt-5 max-w-2xl text-[length:var(--text-lede)] text-[var(--ink)]/80">{lede}</p>
      </div>
      <div className="-mb-px">
        <LotStripe variant="crosswalk" />
      </div>
    </>
  );
}
