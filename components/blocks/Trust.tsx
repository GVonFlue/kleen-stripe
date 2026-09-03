import { content } from "@/lib/content";
import { hasAll } from "@/lib/render";
import PhotoSlot from "@/components/PhotoSlot";
import PendingNote from "@/components/PendingNote";
import GalleryPhoto from "@/components/GalleryPhoto";

/**
 * The signature section: three generations since 1979, the fact no franchise can
 * buy. photo_assignments.trust is null on purpose: none of the 16 photos from the
 * photos-first pass clearly show Devin or the crew, only a partial POV shot of a
 * foot and a shadow. A lot photo does not substitute for a people photo here, so
 * this stays a PhotoSlot until a real one exists.
 */
export default function Trust({ block }: { block: any }) {
  const ok = hasAll(content, block.requires);
  const body = ok ? block.body : block.fallback;
  const trustPhotoId = content.photo_assignments.trust;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <PendingNote paths={block.requires ?? []} />
      <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
        <div>
          <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
          <p className="mt-3 max-w-xl text-[var(--ink)]/80">{body}</p>
        </div>
        {trustPhotoId ? (
          <GalleryPhoto id={trustPhotoId} fallbackSlot={block.image_slot} aspect="aspect-[4/3]" sizes="(min-width: 640px) 50vw, 100vw" />
        ) : (
          <PhotoSlot slot={block.image_slot} aspect="aspect-[4/3]" />
        )}
      </div>
    </section>
  );
}
