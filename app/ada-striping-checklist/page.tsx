import type { Metadata } from "next";
import { content } from "@/lib/content";
import { telHref, smsHref } from "@/lib/render";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";
import PaintedLine from "@/components/PaintedLine";

const page = content.pages["/ada-striping-checklist/"];
const { lead_magnet } = content;

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
};

/**
 * The real form and the PDF both ship at checkpoint 3 (lead_magnet.file is null,
 * lead_magnet.content_gate). This route renders the give's full case today: title,
 * subtitle and the six-item value stack, with the CTA pointed at a live door (call
 * or text) rather than a "#" button with nothing behind it.
 */
export default function AdaChecklistPage() {
  const { business, nav } = content;

  return (
    <>
      <article className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        <PaintedLine className="mt-3 w-16" />
        <p className="mt-4 text-[length:var(--text-lede)] text-[var(--ink)]/80">{lead_magnet.subtitle}</p>

        <ul className="mt-8 flex flex-col gap-3">
          {lead_magnet.value_stack.map((item, i) => (
            <li key={i} className="flex gap-2 text-[var(--ink)]/80">
              <span aria-hidden="true" className="text-[var(--ink)]/40">
                {"✓"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Cta label={`${nav.text_label} ${business.phone_display}`} href={smsHref(business.phone_primary)} variant="primary" />
          <Cta label={`${nav.call_label} ${business.phone_display}`} href={telHref(business.phone_primary)} variant="secondary" />
        </div>
      </article>
      <ClosingBar />
    </>
  );
}
