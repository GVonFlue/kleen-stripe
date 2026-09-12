import type { Metadata } from "next";
import { content } from "@/lib/content";
import { publishableReviews } from "@/content/schema";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";
import PaintedLine from "@/components/PaintedLine";

const page = content.pages["/reviews/"];

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
};

export default function ReviewsPage() {
  const reviews = publishableReviews(content);

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        <PaintedLine className="mt-3 w-16" />
        {page.lede && <p className="mt-4 text-[length:var(--text-lede)] text-[var(--ink)]/80">{page.lede}</p>}

        {reviews.length === 0 && page.empty_state ? (
          <p className="mt-8 rounded-none border border-[var(--line)] bg-[var(--subtle)] p-6 text-[var(--ink)]/80">
            {page.empty_state}
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="rounded-none border border-[var(--line)] p-5">
                <p className="text-[var(--ink)]/90">{r.text}</p>
                <p className="mt-3 text-sm font-medium text-[var(--ink)]/70">{r.name}</p>
                <div className="mt-4">
                  <Cta label={content.nav.cta.label} href={content.nav.cta.href} variant="secondary" />
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
      <ClosingBar />
    </>
  );
}
