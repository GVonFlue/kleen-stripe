import Link from "next/link";
import { content } from "@/lib/content";
import GalleryPhoto from "@/components/GalleryPhoto";

/**
 * The photo band from docs/design/direction-v2.html: six tiles, a yellow lot-type
 * tag on each, and one deliberately empty tile where the before/after pair will
 * go.
 *
 * The empty tile is the point. work[] holds before-and-after pairs and Devin has
 * not sent any, so rather than quietly dropping the strongest asset in this trade
 * the gap stays visible and labelled. Same reasoning as PhotoSlot: a missing fact
 * should read as missing.
 *
 * Tiles come from gallery[] by id, chosen for spread across lot types, so a
 * visitor sees an apartment lot, a warehouse floor and an ADA aisle rather than
 * six photographs of the same kind of job.
 */
export default function WorkStrip({ block }: { block: any }) {
  const tiles: { id: string; tag: string }[] = block.tiles ?? [];

  return (
    <section className="ks-railed mx-auto max-w-7xl px-4 py-14 sm:py-20">
      <span className="ks-rail is-dashed" aria-hidden="true" />
      <div className="ks-railed-body">
        <p className="ks-label text-[var(--ink)]/55">{block.eyebrow}</p>
        <h2 className="mt-3 text-[length:var(--text-display)] font-black leading-[0.98] text-[var(--ink)]">
          {block.heading}
        </h2>
        <p className="mt-4 max-w-[58ch] text-[length:var(--text-lede)] text-[var(--ink)]/70">
          {block.lede}
        </p>

        <div className="mt-10 grid gap-0.5 bg-[var(--accent)] sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => (
            <figure key={t.id} className="group relative m-0 overflow-hidden bg-[var(--asphalt)]">
              <GalleryPhoto
                id={t.id}
                fallbackSlot={`work_${t.id}`}
                aspect="aspect-[4/3]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                rounded={false}
                className="transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <figcaption className="ks-label absolute bottom-0 left-0 bg-[var(--accent)] px-3 py-2 text-[var(--accent-ink)]">
                {t.tag}
              </figcaption>
            </figure>
          ))}

          <div className="flex aspect-[4/3] items-center justify-center border-2 border-dashed border-[var(--ink)]/25 bg-[var(--subtle)] p-6">
            <p className="ks-label text-center leading-[2] text-[var(--ink)]/55">
              {block.pending_tile}
            </p>
          </div>
        </div>

        {block.cta && (
          <Link
            href={block.cta.href}
            className="ks-label mt-8 inline-flex min-h-11 items-center border-2 border-[var(--ink)] px-5 text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]"
          >
            {block.cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
