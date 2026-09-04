import { content } from "@/lib/content";
import { hasAll, resolveTemplate } from "@/lib/render";
import Cta from "@/components/Cta";
import PhotoSlot from "@/components/PhotoSlot";
import PendingNote from "@/components/PendingNote";
import GalleryPhoto from "@/components/GalleryPhoto";
import HeroReveal from "@/components/HeroReveal";
import Band from "@/components/Band";
import Logo from "@/components/Logo";
import Parallax from "@/components/Parallax";
import LotStripe from "@/components/LotStripe";

/**
 * Checkpoint 1 decision 1 stands: the confirmed fact (1979) is merged into the
 * headline rather than left as a soft claim, and the year is its own gated field,
 * so an unconfirmed business.founded_year drops the whole headline to the fallback
 * instead of printing a broken sentence.
 *
 * What changed here is the surface. The wordmark is yellow on black, so the hero is
 * black: the photo runs full bleed behind the type under a gradient scrim rather
 * than sitting in a box below it, and the logo itself is the first thing on the
 * page, painting on. Contrast is not left to the photo. The scrim is opaque enough
 * on the left that the headline clears AA against the darkest and the lightest
 * frame of the image alike, which is why it is a hard gradient and not a soft one.
 *
 * Text colours are var(--ink) exactly as before. Inside Band tone="asphalt" that
 * variable points at the light end of the palette, so nothing here branches on
 * light or dark. Same reason Cta needs no onDark: its secondary variant is drawn
 * from --ink and --surface and flips with the band.
 */
export default function Hero({ block }: { block: any }) {
  const yearOk = hasAll(content, block.requires);
  const year = yearOk ? resolveTemplate(block.headline_year, content) : null;
  const heroPhoto = content.photo_assignments.hero;

  return (
    <Band tone="asphalt" seam={false} className="relative">
      {heroPhoto ? (
        <div aria-hidden="true" className="absolute inset-0 z-0">
          <Parallax range={56} className="h-full" innerClassName="h-full">
            <GalleryPhoto
              id={heroPhoto}
              fallbackSlot={block.image_slot}
              aspect="h-full min-h-[560px]"
              sizes="100vw"
              eager
              rounded={false}
            />
          </Parallax>
          {/* Two scrims, not one. The vertical pass seats the header and the
              bottom marking strip; the horizontal pass protects the text column
              specifically, so the right half of the photo stays legible as a
              photograph instead of being dimmed into a texture. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--asphalt)] via-transparent to-[var(--asphalt)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--asphalt)] via-[var(--asphalt)]/85 to-[var(--asphalt)]/25" />
          <HeroReveal />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-12 sm:pb-24 sm:pt-20">
        <PendingNote paths={block.requires ?? []} />

        <Logo
          variant="lockup"
          paint
          className="w-[240px] text-[var(--accent)] drop-shadow-[0_2px_18px_rgb(0_0_0/60%)] sm:w-[340px]"
        />

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          {block.eyebrow}
        </p>

        <h1 className="mt-4 max-w-3xl text-[length:var(--text-hero)] font-extrabold leading-[1.03] tracking-tight text-[var(--ink)]">
          {yearOk ? (
            <>
              {block.headline_prefix} <em className="not-italic text-[var(--accent)]">{year}</em>
              {block.headline_suffix}
            </>
          ) : (
            block.fallback_headline
          )}
        </h1>

        <p className="mt-6 max-w-2xl text-[length:var(--text-lede)] text-[var(--ink)]/85">{block.sub}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Cta label={block.cta_primary.label} href={block.cta_primary.href} variant="primary" />
          <Cta label={block.cta_secondary.label} href={block.cta_secondary.href} variant="secondary" />
        </div>

        {!heroPhoto && (
          <div className="mt-10">
            <PhotoSlot slot={block.image_slot} aspect="aspect-[16/9]" />
          </div>
        )}
      </div>

      {/* The first marking of the page, laying down along the bottom edge of the
          hero: stall lines at the angle they are actually painted. */}
      <div className="relative z-10 -mb-px">
        <LotStripe variant="stall" />
      </div>
    </Band>
  );
}
