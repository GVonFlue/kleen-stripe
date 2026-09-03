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
  priority?: boolean;
  className?: string;
};

/**
 * Renders one real photo from content.gallery[] by id. next/image handles the
 * AVIF/WebP negotiation and, unless `priority` is set, lazy-loads below the fold
 * per the work order. `priority` is for the hero image only: it must be in the DOM
 * and painted first for LCP, with any reveal animation layered on as enhancement.
 */
export default function GalleryPhoto({ id, fallbackSlot, aspect = "aspect-[4/3]", sizes = "100vw", priority = false, className = "" }: GalleryPhotoProps) {
  const photo = content.gallery.find((g) => g.id === id);
  if (!photo) return <PhotoSlot slot={fallbackSlot} aspect={aspect} className={className} />;

  return (
    <div className={`relative w-full overflow-hidden rounded-md ${aspect} ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="object-cover"
      />
    </div>
  );
}
