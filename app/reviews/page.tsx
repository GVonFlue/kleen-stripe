import type { Metadata } from "next";
import { content } from "@/lib/content";
import { publishableReviews } from "@/content/schema";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";
import PhotoBackdrop from "@/components/PhotoBackdrop";
import PaintedLine from "@/components/PaintedLine";

const page = content.pages["/reviews/"];

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
  alternates: { canonical: "/reviews/" },
};

export default function ReviewsPage() {
  const reviews = publishableReviews(content);

  return (
    <>
      <PhotoBackdrop path="/reviews/">
        <header className="mx-auto max-w-3xl px-4 pt-10 sm:pt-14">
          <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
          <PaintedLine className="mt-3 w-16" />
          {page.lede && <p className="mt-4 text-[length:var(--text-lede)] text-[var(--ink)]/80">{page.lede}</p>}
        </header>
      </PhotoBackdrop>
      <article className="mx-auto max-w-3xl px-4 pb-10 pt-2 sm:pb-14">

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
