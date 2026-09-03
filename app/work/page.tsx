import type { Metadata } from "next";
import Image from "next/image";
import { content } from "@/lib/content";
import { publishableWork, publishableGallery, isWorkIndexable } from "@/content/schema";
import ClosingBar from "@/components/ClosingBar";

const page = content.pages["/work/"];

/**
 * Comes off noindex once there is a real photo to show, gallery singles or work[]
 * pairs either one. See isWorkIndexable() in content/schema.ts. This is computed,
 * not a static content flag, so it tracks the data instead of a value someone has
 * to remember to flip.
 */
export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
  robots: isWorkIndexable(content) ? undefined : { index: false, follow: true },
};

export default function WorkPage() {
  const work = publishableWork(content);
  const gallery = publishableGallery(content);
  const isEmpty = work.length === 0 && gallery.length === 0;

  return (
    <>
      <article className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        {page.lede && <p className="mt-4 max-w-2xl text-[length:var(--text-lede)] text-[var(--ink)]/80">{page.lede}</p>}

        {isEmpty && page.empty_state ? (
          <p className="mt-8 rounded-lg border border-[var(--line)] bg-[var(--subtle)] p-6 text-[var(--ink)]/80">
            {page.empty_state}
          </p>
        ) : (
          <>
            {work.length > 0 && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {work.map((pair) => (
                  <div key={pair.pair_id} className="grid grid-cols-2 gap-2">
                    <img src={pair.before.src} alt={pair.before.alt} className="rounded-md" />
                    <img src={pair.after.src} alt={pair.after.alt} className="rounded-md" />
                  </div>
                ))}
              </div>
            )}
            {gallery.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((photo, i) => (
                  <div key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-md">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      // The first tile is above the fold on every viewport this site
                      // supports, so it gets eager/priority loading instead of lazy,
                      // the same LCP reasoning as the homepage hero.
                      priority={i === 0}
                      loading={i === 0 ? undefined : "lazy"}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </article>
      <ClosingBar />
    </>
  );
}
