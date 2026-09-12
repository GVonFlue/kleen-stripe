import Link from "next/link";
import { content } from "@/lib/content";
import { hasAll, resolveTemplate, telHref } from "@/lib/render";
import { yearsInBusiness } from "@/content/schema";
import GalleryPhoto from "@/components/GalleryPhoto";
import PhotoSlot from "@/components/PhotoSlot";
import Cta from "@/components/Cta";

/**
 * A direct port of the homepage in docs/design/direction-v2.html.
 *
 * Seven bands, in the order the client recorded them: hero, doors, the job, the
 * ADA field, the work, the family, the ask. Nothing else. The service grid,
 * cost-of-inaction block, three-column differentiators, numbers strip, StallGrid
 * and reviews block are no longer on this page: the client reviewed the mock and
 * asked for the mock, and this is the mock.
 *
 * Two consequences worth knowing rather than discovering later. The homepage no
 * longer links directly to all nine money pages, so the nav and /services/ are
 * now the only internal path to them. And the loss-aversion statement doctrine
 * asks for on every homepage now lives only on the service pages. Both are
 * deliberate, both are reversible, and the blocks still exist in the content file
 * and in components/blocks.
 *
 * Copy still comes from content/kleen-stripe.json in every case. The structure
 * matches the mock; the strings are not retyped here.
 */

const page = content.pages["/"];
const block = (id: string) => page.blocks?.find((b: any) => b.id === id) as any;

const hero = block("hero");
const doors = block("doors");
const journey = block("journey");
const trust = block("trust");
const closing = block("closing");
const lm = content.lead_magnet;

const tel = telHref(content.business.phone_primary);

export default function HomePage() {
  const yearOk = hasAll(content, hero.requires);
  const year = yearOk ? resolveTemplate(hero.headline_year, content) : null;
  const heroPhoto = content.photo_assignments.hero;
  const trustOk = hasAll(content, trust.requires);
  const years = trustOk ? yearsInBusiness(content) : null;
  const trustPhoto = content.photo_assignments.trust;

  const tiles: { id: string; tag: string }[] = [
    { id: "double-yellow-apartments-day", tag: "Apartments" },
    { id: "ada-stalls-wide-lot", tag: "ADA" },
    { id: "custom-lane-stencils-night", tag: "Stencils" },
    { id: "warehouse-floor-stencil-1", tag: "Warehouse" },
    { id: "crew-operating-striper-pov", tag: "On the job" },
  ];

  return (
    <>
      {/* ── 1. HERO ───────────────────────────────────────────────────── */}
      <section className="on-asphalt relative flex min-h-[min(660px,86vh)] items-end overflow-hidden">
        {heroPhoto && (
          <div aria-hidden="true" className="absolute inset-0">
            <GalleryPhoto
              id={heroPhoto}
              fallbackSlot={hero.image_slot}
              aspect="h-full"
              sizes="100vw"
              eager
              rounded={false}
              className="h-full opacity-[0.62]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--asphalt) 0%, color-mix(in srgb, var(--asphalt) 70%, transparent) 48%, color-mix(in srgb, var(--asphalt) 25%, transparent) 100%), linear-gradient(0deg, var(--asphalt) 2%, transparent 58%)",
              }}
            />
          </div>
        )}

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-[clamp(88px,13vw,150px)] sm:pb-16">
          <p className="ks-label text-[var(--accent)]">{hero.eyebrow}</p>
          <h1 className="mt-3.5 max-w-[15ch] text-[length:var(--text-mega)] font-black leading-[0.92] tracking-[-0.03em] text-[var(--ink)]">
            {yearOk ? (
              <>
                {hero.headline_prefix}{" "}
                <em className="italic text-[var(--accent)]">{year}</em>
                {hero.headline_suffix}
              </>
            ) : (
              hero.fallback_headline
            )}
          </h1>
          <p className="mt-4.5 max-w-[36ch] text-[length:var(--text-lede)] text-[var(--ink)]">{hero.sub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Cta label={hero.cta_primary.label} href={hero.cta_primary.href} variant="primary" />
            <Cta label={hero.cta_secondary.label} href={hero.cta_secondary.href} variant="secondary" />
          </div>
        </div>

        {/* The paint sweep along the bottom edge of the fold. */}
        <div className="ks-paint-on absolute inset-x-0 bottom-0 h-[9px] bg-[var(--accent)]" />
      </section>

      {/* ── 2. DOORS ──────────────────────────────────────────────────── */}
      <section className="ks-railed mx-auto max-w-7xl px-4 py-[clamp(56px,8vw,104px)]">
        <span className="ks-rail" aria-hidden="true" />
        <div className="ks-railed-body">
          <p className="ks-label text-[var(--ink)]/55">Start here</p>
          <h2 className="mt-3 text-[length:var(--text-display)] font-black leading-[0.98] text-[var(--ink)]">
            {doors.heading}
          </h2>

          <div className="mt-11 grid border-t-[3px] border-[var(--accent)] sm:grid-cols-2 lg:grid-cols-4">
            {doors.lanes.map((lane: any, i: number) => (
              <Link
                key={lane.href}
                href={lane.href}
                className="group flex flex-col border-b-[3px] border-l-[3px] border-[var(--accent)] p-6 pb-7 transition-colors last:border-r-[3px] hover:bg-[var(--subtle)]"
              >
                <span className="ks-label text-[var(--ink)]/55">{`Bay 0${i + 1}`}</span>
                <h3 className="mt-2.5 text-[length:var(--text-h3)] font-black leading-tight text-[var(--ink)]">
                  {lane.label}
                </h3>
                <p className="mt-2.5 text-sm text-[var(--ink)]/70">{lane.line}</p>
                <span
                  aria-hidden="true"
                  className="ks-label mt-4 text-[var(--accent)] transition-transform group-hover:translate-x-1"
                >
                  {"Open ›"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. THE JOB, on concrete ───────────────────────────────────── */}
      <section className="bg-[var(--subtle)]">
        <div className="ks-railed mx-auto max-w-7xl px-4 py-[clamp(56px,8vw,104px)]">
          <span className="ks-rail is-dashed" aria-hidden="true" />
          <div className="ks-railed-body">
            <p className="ks-label text-[var(--ink)]/55">The job, start to finish</p>
            <h2 className="mt-3 text-[length:var(--text-display)] font-black leading-[0.98] text-[var(--ink)]">
              {journey.heading}
            </h2>

            <div className="mt-12 grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {journey.steps.map((s: any, i: number) => (
                <div key={s.step}>
                  <div className="h-[6px] bg-[var(--ink)]" />
                  <span className="ks-label mt-5 block text-[var(--ink)]/55">{`Step 0${i + 1}`}</span>
                  <h3 className="mt-2 text-[length:var(--text-h3)] font-black text-[var(--ink)]">{s.step}</h3>
                  <p className="mt-2.5 text-sm text-[var(--ink)]/70">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. THE ADA FIELD ──────────────────────────────────────────── */}
      <section className="ada-field relative overflow-hidden">
        <div className="stall-hatch" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-start gap-[clamp(28px,5vw,64px)] px-4 py-[clamp(56px,8vw,104px)] lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="ks-label inline-flex bg-white px-3.5 py-2 text-[#1B54C8]">ADA Compliance</span>
            <h2 className="mt-5 text-[length:var(--text-display)] font-black leading-[0.98] text-[var(--ink)]">
              The lot is the part that gets cited.
            </h2>
            <p className="mt-4.5 max-w-[46ch] text-[length:var(--text-lede)] text-[var(--ink)]/90">
              If you are on this page you are either coming off an inspection or you have a feeling
              about one. The lot is the cheapest part of an ADA complaint to fix and the easiest to
              see from the parking area, which is why it is the part that gets cited.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/ada-striping-checklist/"
                className="inline-flex min-h-11 items-center justify-center rounded-[2px] bg-white px-6 py-3 text-base font-semibold text-[#1B54C8]"
              >
                {lm.cta.label}
              </Link>
              <Link
                href="/ada-parking-compliance-kansas/"
                className="inline-flex min-h-11 items-center justify-center rounded-[2px] border-2 border-white/55 px-6 py-3 text-base font-semibold text-[var(--ink)] transition-colors hover:bg-white/10"
              >
                Walk my lot
              </Link>
            </div>
            <p className="mt-3.5 text-[13px] text-[var(--ink)]/75">{lm.consent_line}</p>
          </div>

          <div>
            <p className="ks-label text-[var(--ink)]/75">What the walk-around covers</p>
            <ul className="mt-6 grid list-none gap-3 p-0">
              {lm.value_stack.slice(0, 5).map((v: string) => (
                <li key={v} className="flex gap-3 text-[15.5px] leading-snug text-[var(--ink)]/95">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-[3px] shrink-0">
                    <path d="M2 9.5l4.5 4.5L16 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
                  </svg>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 5. THE WORK ───────────────────────────────────────────────── */}
      <section className="ks-railed mx-auto max-w-7xl px-4 py-[clamp(56px,8vw,104px)]">
        <span className="ks-rail" aria-hidden="true" />
        <div className="ks-railed-body">
          <p className="ks-label text-[var(--ink)]/55">Real lots, real crew</p>
          <h2 className="mt-3 text-[length:var(--text-display)] font-black leading-[0.98] text-[var(--ink)]">
            Nothing on this page came from a stock library.
          </h2>
          <p className="mt-4 max-w-[58ch] text-[length:var(--text-lede)] text-[var(--ink)]/70">
            Which is worth saying, because most of the sites you are comparing did buy theirs.
          </p>

          <div className="mt-10 grid gap-[3px] bg-[var(--accent)] sm:grid-cols-2 lg:grid-cols-3">
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
                <figcaption className="ks-label absolute bottom-0 left-0 bg-[var(--accent)] px-3 py-[7px] text-[var(--accent-ink)]">
                  {t.tag}
                </figcaption>
              </figure>
            ))}
            <div className="flex aspect-[4/3] items-center justify-center border-2 border-dashed border-[var(--ink)]/25 bg-[var(--subtle)] p-4">
              <p className="ks-label text-center leading-[1.9] text-[var(--ink)]/55">
                Before / after pair
                <br />
                waiting on Devin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. THE FAMILY ─────────────────────────────────────────────── */}
      <section className="ks-railed mx-auto max-w-7xl px-4 py-[clamp(56px,8vw,104px)]">
        <span className="ks-rail is-dashed" aria-hidden="true" />
        <div className="ks-railed-body grid items-center gap-[clamp(28px,5vw,68px)] lg:grid-cols-2">
          <div>
            <p className="ks-label text-[var(--ink)]/55">Since {content.business.founded_year ?? ""}</p>
            <h2 className="mt-3 text-[length:var(--text-display)] font-black leading-[0.98] text-[var(--ink)]">
              {trust.heading}.
            </h2>
            <p className="mt-4 max-w-[60ch] text-[length:var(--text-lede)] text-[var(--ink)]/70">
              {trustOk ? trust.body : trust.fallback}
            </p>
            {years !== null && (
              <p className="mt-8">
                <span className="ks-display block text-[length:var(--text-mega)] font-black leading-[0.86] tracking-[-0.04em] text-[var(--accent)]">
                  {years}
                </span>
                <span className="ks-label mt-3.5 block text-[var(--ink)]/55">{trust.stat_label}</span>
              </p>
            )}
          </div>
          <div className="relative">
            {trustPhoto ? (
              <GalleryPhoto id={trustPhoto} fallbackSlot={trust.image_slot} aspect="aspect-[4/3]" sizes="(min-width:1024px) 50vw, 100vw" rounded={false} />
            ) : (
              <PhotoSlot slot={trust.image_slot} aspect="aspect-[4/3]" />
            )}
            <span aria-hidden="true" className="absolute -bottom-3.5 -left-3.5 h-[9px] w-[110px] bg-[var(--accent)]" />
          </div>
        </div>
      </section>

      {/* ── 7. THE ASK ────────────────────────────────────────────────── */}
      <section className="bg-[var(--accent)]">
        <div className="mx-auto max-w-7xl px-4 py-[clamp(56px,8vw,104px)] text-center">
          <h2 className="mx-auto max-w-[20ch] text-[length:var(--text-display)] font-black leading-[1.02] text-[var(--accent-ink)]">
            {closing.heading}
          </h2>
          <p className="mx-auto mt-4.5 max-w-[52ch] text-[length:var(--text-lede)] text-[var(--accent-ink)]/80">
            {closing.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Cta label={closing.cta_primary.label} href={closing.cta_primary.href} variant="primary" onAccent />
            <Cta label={closing.cta_secondary.label} href={tel} variant="secondary" />
          </div>
        </div>
      </section>
    </>
  );
}
