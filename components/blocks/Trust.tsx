import { content } from "@/lib/content";
import { hasAll } from "@/lib/render";
import PhotoSlot from "@/components/PhotoSlot";
import PendingNote from "@/components/PendingNote";

/** The signature section: three generations since 1979, the fact no franchise can buy. */
export default function Trust({ block }: { block: any }) {
  const ok = hasAll(content, block.requires);
  const body = ok ? block.body : block.fallback;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <PendingNote paths={block.requires ?? []} />
      <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
        <div>
          <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
          <p className="mt-3 max-w-xl text-[var(--ink)]/80">{body}</p>
        </div>
        <PhotoSlot slot={block.image_slot} aspect="aspect-[4/3]" />
      </div>
    </section>
  );
}
