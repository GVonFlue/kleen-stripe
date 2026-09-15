import type { Metadata } from "next";
import { content } from "@/lib/content";
import { telHref, smsHref } from "@/lib/render";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";
import PaintedLine from "@/components/PaintedLine";
import LeadForm from "@/components/LeadForm";

const page = content.pages["/contact/"];

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
  alternates: { canonical: "/contact/" },
};

/**
 * Three doors, in the order Devin ranked them: call, text, then the form.
 *
 * Call and text come first and stay first, because business.contact_preference is
 * his own answer and because a visitor standing in the lot with a phone in their
 * hand is one tap from the outcome. The form is for the buyer who is at a desk, or
 * out of hours, or wants to leave a paragraph, and it exists because the page's own
 * lede promises it. Doctrine, redundant lead paths: no single path is the only way
 * through, and the page does not depend on JavaScript for any of them.
 */
export default function ContactPage() {
  const { business, nav } = content;

  return (
    <>
      <article className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        <PaintedLine className="mt-3 w-16" />
        {page.lede && <p className="mt-4 text-[length:var(--text-lede)] text-[var(--ink)]/80">{page.lede}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          <Cta label={`${nav.call_label} ${business.phone_display}`} href={telHref(business.phone_primary)} variant="primary" />
          {business.sms_enabled && (
            <Cta label={`${nav.text_label} ${business.phone_display}`} href={smsHref(business.phone_primary)} variant="secondary" />
          )}
        </div>

        <div aria-hidden="true" className="mt-10 h-[3px] w-full bg-[var(--accent)]" />

        <LeadForm
          className="mt-8"
          sourceTag={page.form_source_tag as string}
          consentLine={(page.consent_line as string | undefined) ?? null}
        />
      </article>
      <ClosingBar />
    </>
  );
}
