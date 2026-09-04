import Link from "next/link";

/**
 * Doctrine's "single highest-value structural element we borrow." Sorts every
 * visitor in one tap.
 *
 * These are not cards. A bordered box with a radius says "generic content module"
 * and every competitor site in this market has a grid of them. These are stall
 * bays: hard yellow rules on all four sides, no radius, no gap between them, so
 * the band reads as a row of marked-out spaces on pavement. The label above each
 * one uses the mono face and the word BAY, which is what the divisions on a lot
 * plan are actually called.
 *
 * The whole bay is the link, not a word inside it, so the tap target is the
 * entire space rather than a line of text.
 *
 * Border-bottom stays on at every breakpoint, including lg where all four bays
 * sit in one row: it is both the divider between wrapped rows on mobile/tablet
 * and the box's own bottom edge at desktop, and nothing else supplies a bottom
 * rule if this one is switched off, which a `lg:border-b-0` here once did,
 * leaving the row open on its underside.
 *
 * Border-right only belongs on the last bay in each row, and which bay that is
 * changes with the column count (1 mobile, 2 sm, 4 lg). block.lanes is four
 * items today, evenly divisible by every one of those column counts, so
 * `nth-child(2n)`/`nth-child(4n)` name the right-column bay exactly at each
 * breakpoint. A `last:` selector alone only ever matches the fourth bay, which
 * is why the sm (2-col) row used to lose its right edge on the top row.
 *
 * "Bay 0X" was text-[var(--ink)]/55, and "Open ›" was text-[var(--accent)]:
 * a full Lighthouse pass caught both as color-contrast failures, and the
 * second is also a color_rules violation on its own (yellow as decorative link
 * text on white, not the one primary-action use it is reserved for). Bumped
 * the label to /70 and the chevron to ink, matching the fix already applied
 * everywhere else on the site with this exact issue.
 */
export default function PickYourDoor({ block }: { block: any }) {
  return (
    <section className="ks-railed mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <span className="ks-rail" aria-hidden="true" />
      <div className="ks-railed-body">
        <h2 className="text-[length:var(--text-h2)] font-black text-[var(--ink)]">{block.heading}</h2>

        <div className="mt-8 grid border-t-[3px] border-[var(--accent)] sm:grid-cols-2 lg:grid-cols-4">
          {block.lanes.map((lane: any, i: number) => (
            <Link
              key={lane.href}
              href={lane.href}
              className="group flex flex-col border-b-[3px] border-l-[3px] border-r-[3px] border-[var(--accent)] p-6 transition-colors hover:bg-[var(--subtle)] sm:[&:nth-child(odd)]:border-r-0 lg:[&:not(:nth-child(4n))]:border-r-0"
            >
              <span className="ks-label text-[var(--ink)]/70">
                {`Bay 0${i + 1}`}
              </span>
              <span className="mt-3 font-display text-[length:var(--text-h3)] font-black leading-tight text-[var(--ink)]">
                {lane.label}
              </span>
              <span className="mt-2 text-sm text-[var(--ink)]/70">{lane.line}</span>
              <span
                aria-hidden="true"
                className="ks-label mt-5 text-[var(--ink)] transition-transform group-hover:translate-x-1"
              >
                {"Open ›"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
