import { content } from "@/lib/content";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";
import PaintedLine from "@/components/PaintedLine";

const page = content.pages["/404.html"];

/**
 * The content file has carried a /404.html entry since the first build and
 * nothing rendered it, so a mistyped URL got Next's default page: no header, no
 * footer, no phone number, and the wrong typeface. On a site whose argument is
 * that a person answers the phone, the 404 is a bad place to stop looking like
 * the rest of the site.
 *
 * Not exported with metadata.robots: Next serves this with a real 404 status,
 * which is the correct signal on its own.
 */
export default function NotFound() {
  return (
    <>
      <article className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        <PaintedLine className="mx-auto mt-3 w-16" />
        <p className="mt-4 text-[var(--ink)]/80">{page.body as string}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Cta label={content.nav.cta.label} href={content.nav.cta.href} variant="primary" />
          {content.nav.primary.map((item) => (
            <Cta key={item.href} label={item.label} href={item.href} variant="secondary" />
          ))}
        </div>
      </article>
      <ClosingBar />
    </>
  );
}
