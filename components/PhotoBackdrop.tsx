import { content } from "@/lib/content";
import GalleryPhoto from "@/components/GalleryPhoto";

/**
 * A job photo painted behind a page's opening header, the same treatment the
 * homepage hero uses: the photo sits under an asphalt gradient that is solid
 * where the text is (left, and along the bottom where the header meets the page
 * body) and lets the lot show through on the right. The text never sits on
 * bare photo, so contrast holds whatever the photo is.
 *
 * Which photo, if any, comes from content.photo_assignments.pages keyed by the
 * route path. A route that is not listed renders its children unchanged, so a
 * page with no honest photo keeps a plain header rather than an unrelated one.
 *
 * Carries .on-asphalt itself so the header text flips to the light ink tokens on
 * pages whose body is the light theme (the services hub, service areas, reviews).
 */
export default function PhotoBackdrop({ path, children }: { path: string; children: React.ReactNode }) {
  const id = content.photo_assignments.pages?.[path];
  if (!id) return <>{children}</>;

  return (
    <div className="on-asphalt relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <GalleryPhoto
          id={id}
          fallbackSlot={`page_header_${path}`}
          aspect="h-full"
          sizes="100vw"
          eager
          rounded={false}
          className="h-full opacity-[0.75]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--asphalt) 0%, color-mix(in srgb, var(--asphalt) 62%, transparent) 42%, color-mix(in srgb, var(--asphalt) 8%, transparent) 100%), linear-gradient(0deg, var(--asphalt) 0%, transparent 45%)",
          }}
        />
      </div>
      <div className="relative py-[clamp(24px,5vw,64px)]">{children}</div>
    </div>
  );
}
