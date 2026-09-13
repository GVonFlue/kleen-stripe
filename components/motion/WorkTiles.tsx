"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { content } from "@/lib/content";

type Tile = { id: string; tag: string };

/**
 * The work grid, with the photographs openable.
 *
 * The grey placeholder tile is gone. The LAUNCH audit still blocks on an empty
 * work[], so the before and after pairs are still owed; they are simply no longer
 * advertised to visitors as missing.
 *
 * They were hover-scale and nothing else, which is the one thing a visitor
 * actually wants to do on this band: look closer at the work. Clicking a tile
 * opens it full size; Escape closes; left and right move between them.
 *
 * The grid itself is plain markup and plain links to nothing, so with no JS every
 * photograph still renders at tile size with its caption. The lightbox is
 * enhancement, never the only way to see the image.
 */
export default function WorkTiles({ tiles }: { tiles: Tile[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const photos = tiles
    .map((t) => ({ tile: t, photo: content.gallery.find((g) => g.id === t.id) }))
    .filter((x) => x.photo);

  const move = useCallback(
    (delta: number) => setOpen((i) => (i === null ? null : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, move]);

  const active = open === null ? null : photos[open];

  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-[3px] bg-[var(--accent)] lg:grid-cols-3">
        {photos.map(({ tile, photo }, i) => (
          <button
            key={tile.id}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open photograph: ${photo!.alt}`}
            className="group relative m-0 block aspect-[4/3] overflow-hidden bg-[var(--asphalt)] p-0 text-left"
          >
            <Image
              src={photo!.src}
              alt={photo!.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <span className="ks-tile-tag ks-label absolute bottom-0 left-0 bg-[var(--accent)] px-3 py-[7px] text-[var(--accent-ink)]">
              {tile.tag}
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.photo!.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(null)}
        >
          <div className="relative h-full max-h-[82vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={active.photo!.src}
              alt={active.photo!.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <p className="ks-label absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70">
            {`${open! + 1} / ${photos.length}`}
          </p>

          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Close"
            className="ks-label absolute right-3 top-3 min-h-11 border-2 border-white/50 bg-black/55 px-3 py-2 text-white sm:right-4 sm:top-4"
          >
            Close
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); move(-1); }}
            aria-label="Previous photograph"
            className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-black/55 text-3xl leading-none text-white hover:text-[var(--accent)] sm:left-3"
          >
            {"‹"}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); move(1); }}
            aria-label="Next photograph"
            className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-black/55 text-3xl leading-none text-white hover:text-[var(--accent)] sm:right-3"
          >
            {"›"}
          </button>
        </div>
      )}
    </>
  );
}
