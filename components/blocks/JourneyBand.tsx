import GalleryPhoto from "@/components/GalleryPhoto";

/**
 * Checkpoint 1 decision 2. The four steps of the job, in order, which is why this is
 * the one band on the site allowed a numbered marker (doctrine's "avoid 01/02/03
 * unless genuinely sequential" only rules out numbering things that are not).
 * Step 3 carries the striping-machine-at-sunset photo: it shows lines going down,
 * literally, the moment the job actually happens rather than the result of it.
 */
export default function JourneyBand({ block }: { block: any }) {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--subtle)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {block.steps.map((s: any, i: number) => (
            <li key={i} className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--ink)]/50">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-semibold text-[var(--ink)]">{s.step}</span>
              <span className="text-sm text-[var(--ink)]/70">{s.body}</span>
              {s.gallery_id && (
                <div className="mt-1">
                  <GalleryPhoto id={s.gallery_id} fallbackSlot={`journey_${i}`} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 25vw, 50vw" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
