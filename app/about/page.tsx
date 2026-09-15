import type { Metadata } from "next";
import { content } from "@/lib/content";
import { hasAll } from "@/lib/render";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";
import PhotoSlot from "@/components/PhotoSlot";
import PendingNote from "@/components/PendingNote";
import PaintedLine from "@/components/PaintedLine";
import LeadForm from "@/components/LeadForm";

const page = content.pages["/about/"];

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
  alternates: { canonical: "/about/" },
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

        {/* The audit pass found this page offering one door twice: "Call Devin"
            here and "Call Devin" again in the closing band. That is one
            conversion path, not the two the doctrine requires on every interior
            route. The story page is where somebody decides they trust him, which
            makes it the wrong page to have nowhere to act except a phone call
            they may not want to make at 9pm. */}
        {page.form_source_tag && (
          <div className="mt-12 border-t border-[var(--line)] pt-10">
            {page.form_heading && (
              <h2 className="text-[length:var(--text-h2)] font-black text-[var(--ink)]">{page.form_heading}</h2>
            )}
            <LeadForm
              className="mt-6"
              sourceTag={page.form_source_tag as string}
              consentLine={(page.consent_line as string | undefined) ?? null}
            />
          </div>
        )}
      </article>
      <ClosingBar cta={page.cta} />
    </>
  );
}
