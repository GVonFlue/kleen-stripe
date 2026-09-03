import type { Metadata } from "next";
import { content } from "@/lib/content";
import { publishableWork } from "@/content/schema";
import ClosingBar from "@/components/ClosingBar";

const page = content.pages["/work/"];

/**
 * Ships noindex until real photographs exist (page.indexable is false). Doctrine
 * hard stop 2: never a stock image standing in for real work.
 */
export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
  robots: page.indexable === false ? { index: false, follow: true } : undefined,
};

export default function WorkPage() {
  const work = publishableWork(content);

  return (
    <>
      <article className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        {page.lede && <p className="mt-4 max-w-2xl text-[length:var(--text-lede)] text-[var(--ink)]/80">{page.lede}</p>}

        {work.length === 0 && page.empty_state ? (
          <p className="mt-8 rounded-lg border border-[var(--line)] bg-[var(--subtle)] p-6 text-[var(--ink)]/80">
            {page.empty_state}
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {work.map((pair) => (
              <div key={pair.pair_id} className="grid grid-cols-2 gap-2">
                <img src={pair.before.src} alt={pair.before.alt} className="rounded-md" />
                <img src={pair.after.src} alt={pair.after.alt} className="rounded-md" />
              </div>
            ))}
          </div>
        )}
      </article>
      <ClosingBar />
    </>
  );
}
