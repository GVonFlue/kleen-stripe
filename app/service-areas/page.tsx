import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";
import ClosingBar from "@/components/ClosingBar";
import PaintedLine from "@/components/PaintedLine";

const page = content.pages["/service-areas/"];

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
  alternates: { canonical: "/service-areas/" },
};

export default function ServiceAreasPage() {
  const cityPages = content.areas.filter((a) => a.page && a.slug);
  const travelMarkets = content.areas.filter((a) => a.travel_market);

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        <PaintedLine className="mt-3 w-16" />
        {page.lede && <p className="mt-4 text-[length:var(--text-lede)] text-[var(--ink)]/80">{page.lede}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          {cityPages.map((a) => (
            <Link
              key={a.slug}
              href={`/${a.slug}/`}
              className="flex min-h-11 items-center rounded-[2px] border border-[var(--line)] px-4 text-sm font-medium text-[var(--ink)] hover:border-[var(--ink)]"
            >
              {a.city}, {a.state}
            </Link>
          ))}
        </div>

        {travelMarkets.length > 0 && page.travel_note && (
          <div className="mt-8">
            <p className="text-sm font-medium text-[var(--ink)]">
              {travelMarkets.map((a) => `${a.city}, ${a.state}`).join(" · ")}
            </p>
            <p className="mt-2 text-sm text-[var(--ink)]/70">{page.travel_note}</p>
          </div>
        )}
      </article>
      <ClosingBar />
    </>
  );
}
