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
};

export default function GalleryPhoto({ id, fallbackSlot, aspect = "aspect-[4/3]", sizes = "100vw", eager = false, className = "" }: GalleryPhotoProps) {
  const photo = content.gallery.find((g) => g.id === id);
  if (!photo) return <PhotoSlot slot={fallbackSlot} aspect={aspect} className={className} />;

  return (
    <div className={`relative w-full overflow-hidden rounded-md bg-[var(--subtle)] ${aspect} ${className}`}>
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
        className="object-cover"
      />
    </div>
  );
}
