import { content } from "@/lib/content";
import { publishableReviews } from "@/content/schema";
import Cta from "@/components/Cta";

/**
 * Consent gated. render_if_min_items: 1 in content, and today there are zero
 * publishable reviews, so this returns null. Doctrine hard stop 3: no testimonial
 * publishes without permission, and nobody edits the words of one.
 */
export default function ReviewsBlock({ block }: { block: any }) {
  const reviews = publishableReviews(content);
  if (reviews.length < (block.render_if_min_items ?? 1)) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-lg border border-[var(--line)] p-5">
            <p className="text-[var(--ink)]/90">{r.text}</p>
            <p className="mt-3 text-sm font-medium text-[var(--ink)]/70">{r.name}</p>
            <div className="mt-4">
              <Cta label={block.cta_beside_each.label} href={block.cta_beside_each.href} variant="secondary" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
