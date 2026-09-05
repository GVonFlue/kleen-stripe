import { content } from "@/lib/content";
import { hasAll, resolveTemplate } from "@/lib/render";
import Cta from "@/components/Cta";
import PhotoSlot from "@/components/PhotoSlot";
import PendingNote from "@/components/PendingNote";
import GalleryPhoto from "@/components/GalleryPhoto";
import HeroReveal from "@/components/HeroReveal";
import Band from "@/components/Band";
import Parallax from "@/components/Parallax";
import LotStripe from "@/components/LotStripe";

/**
 * Checkpoint 1 decision 1 stands: the confirmed fact (1979) is merged into the
 * headline rather than left as a soft claim, and the year is its own gated field,
 * so an unconfirmed business.founded_year drops the whole headline to the fallback
 * instead of printing a broken sentence.
 *
 * What changed here is the surface. The hero is black: the photo runs full bleed
 * behind the type under a gradient scrim rather than sitting in a box below it.
 * Contrast is not left to the photo. The scrim is opaque enough on the left that
 * the headline clears AA against the darkest and the lightest frame of the image
 * alike, which is why it is a hard gradient and not a soft one.
 *
 * No wordmark lockup here: the header already carries the brand on every route,
 * and a second, much larger one on top of the best remaining space on the page
 * only pushed the actual claim (the headline) down. One wordmark, in the header,
 * doing its one job.
 *
 * The horizontal scrim is a real linear-gradient with named stops, not a
 * Tailwind three-point from/via/to: the old via stop sat at 85% opacity, so by
 * the point the text column actually ends the fade had barely started, and the
 * photo read as a dark texture rather than a parking lot. Heavy through the text
 * column, then it drops fast, because we chose real photography on purpose and
 * it should still look like a lot, not a mood.
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
              specifically, so the right two thirds of the photo stay legible as
              a photograph instead of being dimmed into a texture. Named stops
              rather than Tailwind's from/via/to: the text column ends by
              roughly 45% of the frame, so the fade has to be most of the way
              done by there, not just starting. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--asphalt)] via-transparent to-[var(--asphalt)]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--asphalt) 0%, color-mix(in srgb, var(--asphalt) 78%, transparent) 30%, color-mix(in srgb, var(--asphalt) 30%, transparent) 48%, color-mix(in srgb, var(--asphalt) 8%, transparent) 68%, transparent 100%)",
            }}
          />
          <HeroReveal />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-12 sm:pb-24 sm:pt-20">
        <PendingNote paths={block.requires ?? []} />

        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
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
