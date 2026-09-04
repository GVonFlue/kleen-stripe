import { content } from "@/lib/content";
import { hasAll } from "@/lib/render";
import PhotoSlot from "@/components/PhotoSlot";
import BeforeAfter from "@/components/BeforeAfter";
import { publishableWork } from "@/content/schema";

/**
 * The strongest thing a striper can show is the same lot twice, so this is a drag
 * handle rather than two photos side by side: the visitor wipes the fresh paint
 * across the faded lot themselves.
 *
 * Still gated exactly as before. The real pair renders only when work[] carries a
 * publishable one and block.requires is satisfied. Until then a draft build shows
 * the working slider over two labelled PhotoSlots, so the interaction is
 * reviewable now and the missing photographs stay visible as missing. PhotoSlot
 * throws under LAUNCH=1, so this cannot ship with placeholders in it: the launch
 * build fails on the photos, which is the correct blocker, rather than the section
 * quietly vanishing and nobody remembering it was owed.
 */
export default function BeforeAfterFeature({ block }: { block: any }) {
  const pair = publishableWork(content)[0] ?? null;
  const gated = !hasAll(content, block.requires);

  // Nothing to show and nothing to flag: withhold, same as before.
  if (gated && !pair && process.env.LAUNCH === "1") return null;

  const labels = content.ui.before_after;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
      <p className="mt-3 max-w-2xl text-[var(--ink)]/80">{block.body}</p>

      <BeforeAfter
        className="mt-8 aspect-[16/10] sm:aspect-[2/1]"
        beforeLabel={labels.before}
        afterLabel={labels.after}
        before={
          pair ? (
            <img src={pair.before.src} alt={pair.before.alt} className="h-full w-full object-cover" />
          ) : (
            <PhotoSlot slot="before_after_before" aspect="h-full" className="h-full rounded-none" />
          )
        }
        after={
          pair ? (
            <img src={pair.after.src} alt={pair.after.alt} className="h-full w-full object-cover" />
          ) : (
            <PhotoSlot slot="before_after_after" aspect="h-full" className="h-full rounded-none" />
          )
        }
      />

      {block.fallback_note && !pair && (
        <p className="mt-3 text-sm text-[var(--ink)]/70">{block.fallback_note}</p>
      )}
    </section>
  );
}
