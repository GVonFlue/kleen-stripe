import Cta from "@/components/Cta";

/**
 * Closing CTA before the footer, required on every route. Full yellow band per
 * direction-v2.html: the one loud moment on the page, everything around it stays
 * quiet. Ink text throughout, since ink-on-yellow is the same contrast pair as
 * everywhere else on the site. Blue still means ADA and nothing else here: this
 * band uses ink and yellow, never blue.
 *
 * This used to be a black band (see checkpoint 1 self-critique and the tonal-range
 * pass that made it one). direction-v2.html moved it to yellow instead: Band
 * tone="accent" owns the background (see the TONE table in app/page.tsx), needs no
 * repointing since ink already reads correctly on yellow, and the heading no
 * longer runs through WordBlock, since a yellow highlight on an already-yellow
 * band does nothing. The primary button is the one thing that does have to
 * change: accent-filled would vanish into the band, so it takes onAccent instead.
 */
export default function ClosingCta({ block }: { block: any }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-[length:var(--text-display)] font-extrabold leading-[1.1] text-[var(--ink)]">
          {block.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--ink)]/80">{block.body}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Cta label={block.cta_primary.label} href={block.cta_primary.href} variant="primary" onAccent />
          <Cta label={block.cta_secondary.label} href={block.cta_secondary.href} variant="secondary" />
        </div>
      </div>
    </section>
  );
}
