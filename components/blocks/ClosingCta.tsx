import Cta from "@/components/Cta";
import WordBlock from "@/components/WordBlock";

/**
 * Closing CTA before the footer, required on every route. Black band, full bleed,
 * the yellow button doing the one job the accent color is reserved for. Blue still
 * means ADA and nothing else here: this band uses ink and yellow, never blue, so it
 * cannot read as a decorative use of the ADA color. See checkpoint 1 self-critique
 * for why this used to be a plain subtle-background band; the tonal-range pass
 * changed that.
 *
 * Surface note: this block used to invert itself, painting bg-[var(--ink)] and
 * drawing its text from --surface. Band tone="asphalt" now owns that decision (see
 * the TONE table in app/page.tsx), and .on-asphalt already repoints --ink and
 * --surface for everything inside it. A block that also inverts inside an inverted
 * band inverts twice and comes out light, which is exactly what happened. So this
 * reads --ink for text like every other block and states no background at all.
 */
export default function ClosingCta({ block }: { block: any }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-[length:var(--text-display)] font-extrabold leading-[1.1] text-[var(--ink)]">
          {block.heading_prefix ? (
            <>
              {block.heading_prefix} <WordBlock>{block.heading_highlight}</WordBlock>
            </>
          ) : (
            block.heading
          )}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--ink)]/80">{block.body}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Cta label={block.cta_primary.label} href={block.cta_primary.href} variant="primary" />
          <Cta label={block.cta_secondary.label} href={block.cta_secondary.href} variant="secondary" />
        </div>
      </div>
    </section>
  );
}
