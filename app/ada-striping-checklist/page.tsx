import type { Metadata } from "next";
import { content } from "@/lib/content";
import { telHref, smsHref } from "@/lib/render";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";
import PaintedLine from "@/components/PaintedLine";
import LeadForm from "@/components/LeadForm";

const page = content.pages["/ada-striping-checklist/"];
const { lead_magnet } = content;

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
  alternates: { canonical: "/ada-striping-checklist/" },
};

/**
 * The give. This is the only page on the site whose whole job is reciprocity, and
 * until the audit pass it captured nothing: the hero's second CTA and the
 * homepage's ADA block both pointed here, and here offered a call button and a
 * text button, which is the same ask every other page makes. A visitor who wanted
 * the checklist could not get the checklist.
 *
 * Now the form is the page. It sits above the value stack rather than under it,
 * because somebody who arrived from a button labelled "send me the checklist" has
 * already been sold and should not have to scroll past six bullets to act on it.
 * The stack stays underneath for the visitor who arrived cold.
 *
 * Name and email, phone optional. Email is the trade. Call and text stay on the
 * page as the third and fourth doors for the person who would rather just talk to
 * him, because the doctrine's redundant-paths rule does not stop applying on the
 * page where a form finally exists.
 */
export default function AdaChecklistPage() {
  const { business, nav } = content;

  return (
    <>
      <article className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        <PaintedLine className="mt-3 w-16" />
        <p className="mt-4 text-[length:var(--text-lede)] text-[var(--ink)]/80">{lead_magnet.subtitle}</p>

        <LeadForm
          className="mt-8"
          variant="checklist"
          sourceTag={page.form_source_tag as string}
          consentLine={(page.consent_line as string | undefined) ?? null}
        />

        <div aria-hidden="true" className="mt-10 h-[3px] w-full bg-[var(--accent)]" />

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
          <Cta label={`${nav.text_label} ${business.phone_display}`} href={smsHref(business.phone_primary)} variant="secondary" />
          <Cta label={`${nav.call_label} ${business.phone_display}`} href={telHref(business.phone_primary)} variant="secondary" />
        </div>
      </article>
      <ClosingBar />
    </>
  );
}
