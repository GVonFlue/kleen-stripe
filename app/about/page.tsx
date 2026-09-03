import type { Metadata } from "next";
import { content } from "@/lib/content";
import { hasAll } from "@/lib/render";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";
import PhotoSlot from "@/components/PhotoSlot";
import PendingNote from "@/components/PendingNote";
import PaintedLine from "@/components/PaintedLine";

const page = content.pages["/about/"];

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
};

export default function AboutPage() {
  const ok = hasAll(content, page.requires);
  const body = Array.isArray(page.body) ? page.body : page.body ? [page.body] : [];

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <PendingNote paths={page.requires ?? []} />
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        <PaintedLine className="mt-3 w-16" />
        <div className="mt-8">
          <PhotoSlot slot="devin_and_crew_about" aspect="aspect-[16/9]" />
        </div>
        {ok
          ? body.map((p, i) => (
              <p key={i} className="mt-4 text-[var(--ink)]/80">
                {p}
              </p>
            ))
          : null}
        {page.cta && (
          <div className="mt-8">
            <Cta label={page.cta.label} href={page.cta.href} variant="primary" />
          </div>
        )}
      </article>
      <ClosingBar cta={page.cta} />
    </>
  );
}
