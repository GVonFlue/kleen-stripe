import Cta from "@/components/Cta";

/**
 * Closing CTA before the footer, required on every route. Ink-on-subtle background
 * rather than a full-bleed blue panel: blue is reserved for ADA on this site, the
 * way the reference build's accent blue is not, so it cannot double as a decorative
 * band here. See checkpoint 1 self-critique.
 */
export default function ClosingCta({ block }: { block: any }) {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--subtle)]">
      <div className="mx-auto max-w-4xl px-4 py-14 text-center">
        <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-[var(--ink)]/80">{block.body}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Cta label={block.cta_primary.label} href={block.cta_primary.href} variant="primary" />
          <Cta label={block.cta_secondary.label} href={block.cta_secondary.href} variant="secondary" />
        </div>
      </div>
    </section>
  );
}
