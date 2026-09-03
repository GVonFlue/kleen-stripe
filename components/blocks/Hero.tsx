import { content } from "@/lib/content";
import { hasAll, resolveTemplate } from "@/lib/render";
import Cta from "@/components/Cta";
import PhotoSlot from "@/components/PhotoSlot";
import PendingNote from "@/components/PendingNote";
import GalleryPhoto from "@/components/GalleryPhoto";

/**
 * Checkpoint 1 decision 1. The confirmed fact (1979) is merged into the headline
 * itself rather than left as a soft claim, because there is no proof number on this
 * site to let a category headline survive on its own (doctrine section 5). The year
 * is its own gated field: if business.founded_year is ever unconfirmed, the whole
 * headline falls back to fallback_headline rather than printing a broken sentence.
 */
export default function Hero({ block }: { block: any }) {
  const yearOk = hasAll(content, block.requires);
  const year = yearOk ? resolveTemplate(block.headline_year, content) : null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:pt-14">
      <PendingNote paths={block.requires ?? []} />
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--ink)]/60">{block.eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-[length:var(--text-hero)] font-extrabold leading-[1.05] text-[var(--ink)]">
        {yearOk ? (
          <>
            {block.headline_prefix} <em className="italic">{year}</em>
            {block.headline_suffix}
          </>
        ) : (
          block.fallback_headline
        )}
      </h1>
      <p className="mt-5 max-w-2xl text-[length:var(--text-lede)] text-[var(--ink)]/80">{block.sub}</p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Cta label={block.cta_primary.label} href={block.cta_primary.href} variant="primary" />
        <Cta label={block.cta_secondary.label} href={block.cta_secondary.href} variant="secondary" />
      </div>

      <div className="mt-10">
        {content.photo_assignments.hero ? (
          <GalleryPhoto id={content.photo_assignments.hero} aspect="aspect-[16/9]" sizes="(min-width: 1152px) 1152px, 100vw" priority />
        ) : (
          <PhotoSlot slot={block.image_slot} aspect="aspect-[16/9]" />
        )}
      </div>
    </section>
  );
}
