import { content } from "@/lib/content";
import { hasAll } from "@/lib/render";
import PhotoSlot from "@/components/PhotoSlot";

/** DRAFT ONLY. Withholds until Devin's first work[] pair lands. */
export default function BeforeAfterFeature({ block }: { block: any }) {
  if (!hasAll(content, block.requires)) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
      <p className="mt-3 max-w-2xl text-[var(--ink)]/80">{block.body}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <PhotoSlot slot="before_after_before" />
        <PhotoSlot slot="before_after_after" />
      </div>
    </section>
  );
}
