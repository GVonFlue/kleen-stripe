import Link from "next/link";
import GalleryPhoto from "@/components/GalleryPhoto";
import Cta from "@/components/Cta";

/**
 * Doctrine's "single highest-value structural element we borrow." Sorts every
 * visitor in one tap.
 *
 * Rebuilt to the density of the reference build: each lane is a full-bleed panel
 * with a real lot photograph behind it rather than a bordered box with one line
 * of text in it. A visitor scanning this band should be able to see their own
 * kind of lot before they read a word, which is what a small text card can never
 * do.
 *
 * Per panel: a chip naming the buyer, the headline, one sentence, three proof
 * bullets and its own button. Every bullet is traceable to copy already in the
 * content file. The whole panel is the link; the button inside it is visual, so
 * there is one tap target per lane rather than a link inside a link.
 *
 * The photograph sits under a heavy scrim because the type has to clear AA
 * against every frame of it, not against the average of it.
 */
export default function PickYourDoor({ block }: { block: any }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
      <h2 className="text-[length:var(--text-display)] font-black leading-[0.98] text-[var(--ink)]">
        {block.heading}
      </h2>
      {block.lede && (
        <p className="mt-4 max-w-[52ch] text-[length:var(--text-lede)] text-[var(--ink)]/70">
          {block.lede}
        </p>
      )}

      <div className="mt-10 grid gap-px bg-[var(--accent)] sm:grid-cols-2 lg:grid-cols-4">
        {block.lanes.map((lane: any) => (
          <Link
            key={lane.href}
            href={lane.href}
            className="group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden bg-[var(--asphalt)] p-6 focus-visible:outline-offset-[-3px]"
          >
            {lane.photo && (
              <div aria-hidden="true" className="absolute inset-0 -z-10">
                <GalleryPhoto
                  id={lane.photo}
                  fallbackSlot={`door_${lane.chip ?? "lane"}`}
                  aspect="h-full"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  rounded={false}
                  className="h-full transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* Two passes: a flat wash so no frame of the photo is bright, and
                    a bottom ramp so the type sits on near-solid asphalt. */}
                <div className="absolute inset-0 bg-[var(--asphalt)]/72" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--asphalt)] via-[var(--asphalt)]/85 to-transparent" />
              </div>
            )}

            {lane.chip && (
              <span className="ks-label absolute left-6 top-6 border border-[var(--accent)] px-2.5 py-1.5 text-[var(--accent)]">
                {lane.chip}
              </span>
            )}

            <h3 className="text-[length:var(--text-h3)] font-black leading-tight text-[var(--asphalt-ink)]">
              {lane.label}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--asphalt-ink)]/75">{lane.line}</p>

            {lane.bullets?.length > 0 && (
              <ul className="mt-4 flex flex-col gap-2">
                {lane.bullets.map((b: string, i: number) => (
                  <li key={i} className="flex gap-2.5 text-[13.5px] leading-snug text-[var(--asphalt-ink)]/85">
                    <span aria-hidden="true" className="mt-[7px] h-px w-3 shrink-0 bg-[var(--accent)]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {lane.cta && (
              <span
                aria-hidden="true"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] border-2 border-[var(--asphalt-ink)]/45 px-5 text-sm font-semibold text-[var(--asphalt-ink)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
              >
                {lane.cta.label}
                <span className="transition-transform group-hover:translate-x-0.5">{"→"}</span>
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
