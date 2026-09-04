import Image from "next/image";
import { content } from "@/lib/content";
import PhotoSlot from "@/components/PhotoSlot";

type GalleryPhotoProps = {
  id: string;
  /** Rendered instead of a silent blank if `id` does not match a gallery item.
   *  A typo or a removed gallery entry must never ship as empty space. */
  fallbackSlot: string;
  aspect?: string;
  sizes?: string;
  /** The LCP candidate only (the hero photo). Next 16 deprecated `priority` in
   *  favor of naming the three things it used to bundle explicitly: preload the
   *  resource, load it eagerly, and mark the fetch high-priority. Passing only
   *  the old `priority` prop on this version silently drops the eager/fetchPriority
   *  half, which is exactly the bug Lighthouse's LCP-discovery check caught. */
  eager?: boolean;
  className?: string;
  /** Full-bleed images (the hero) run edge to edge with no rounded corners;
   *  contained ones (the /work/ grid, journey band) keep them. */
  rounded?: boolean;
  /** Grid tiles only. A slow push in on hover and a painted edge along the bottom,
   *  so the photographs read as things to look at rather than as decoration. Off
   *  for the hero, which is already moving under the parallax. */
  interactive?: boolean;
};

export default function GalleryPhoto({ id, fallbackSlot, aspect = "aspect-[4/3]", sizes = "100vw", eager = false, className = "", rounded = true, interactive = false }: GalleryPhotoProps) {
  const photo = content.gallery.find((g) => g.id === id);
  if (!photo) return <PhotoSlot slot={fallbackSlot} aspect={aspect} className={className} />;

  return (
    <div
      className={`group relative w-full overflow-hidden ${rounded ? "rounded-md" : ""} bg-[var(--subtle)] ${aspect} ${className}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        preload={eager}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        placeholder={photo.blur ? "blur" : "empty"}
        blurDataURL={photo.blur}
        className={`object-cover ${interactive ? "transition-transform duration-500 ease-out group-hover:scale-[1.04]" : ""}`}
      />
      {interactive && (
        // A stripe of fresh paint laid along the bottom edge on hover. Decorative,
        // hidden from assistive tech, and it is yellow on a photograph of asphalt,
        // which is the one place brand.color_rules lets yellow be decoration.
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[5px] origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
      )}
    </div>
  );
}
