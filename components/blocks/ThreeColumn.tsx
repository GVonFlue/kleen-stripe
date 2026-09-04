import { content } from "@/lib/content";
import { hasAll } from "@/lib/render";
import PendingNote from "@/components/PendingNote";
import WordBlock from "@/components/WordBlock";

/**
 * The reference build's three side-by-side blocks. Garrett's third column sells
 * ProyTech; Kleen Stripe's does not, so it is replaced with an operating promise.
 * See checkpoint 1 report for what was chosen and why.
 *
 * Fourth rail, dashed, alternating back from ServiceGrid's solid one.
 */
export default function ThreeColumn({ block }: { block: any }) {
  const columns = block.columns.filter((col: any) => hasAll(content, col.requires));
  if (columns.length === 0) return null;

  return (
    <section className="ks-railed mx-auto max-w-6xl px-4 py-10">
      <span className="ks-rail is-dashed" aria-hidden="true" />
      <div className="ks-railed-body">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--ink)]/60">{block.eyebrow}</p>
        <h2 className="mt-2 text-[length:var(--text-h2)] font-bold text-[var(--ink)]">
          {block.heading_prefix ? (
            <>
              {block.heading_prefix} <WordBlock>{block.heading_highlight}</WordBlock>
            </>
          ) : (
            block.heading
          )}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {columns.map((col: any, i: number) => (
            <div key={i}>
              <PendingNote paths={col.requires ?? []} />
              <h3 className="text-[length:var(--text-h3)] font-semibold text-[var(--ink)]">{col.heading}</h3>
              <p className="mt-2 text-sm text-[var(--ink)]/70">{col.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
