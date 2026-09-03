import Cta from "@/components/Cta";
import WordBlock from "@/components/WordBlock";

/**
 * Closing CTA before the footer, required on every route. Black band, full bleed,
 * the yellow button doing the one job the accent color is reserved for. Blue still
 * means ADA and nothing else here: this band uses ink and yellow, never blue, so it
 * cannot read as a decorative use of the ADA color. See checkpoint 1 self-critique
 * for why this used to be a plain subtle-background band; the tonal-range pass
 * changed that.
 */
export default function ClosingCta({ block }: { block: any }) {
  return (
    <section className="bg-[var(--ink)] py-14">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-[length:var(--text-display)] font-extrabold leading-[1.1] text-[var(--surface)]">
          {block.heading_prefix ? (
            <>
              {block.heading_prefix} <WordBlock>{block.heading_highlight}</WordBlock>
            </>
          ) : (
            block.heading
          )}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--surface)]/80">{block.body}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Cta label={block.cta_primary.label} href={block.cta_primary.href} variant="primary" />
          <Cta label={block.cta_secondary.label} href={block.cta_secondary.href} variant="secondary" onDark />
        </div>
      </div>
    </section>
  );
}
