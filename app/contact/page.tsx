import type { Metadata } from "next";
import { content } from "@/lib/content";
import { telHref, smsHref } from "@/lib/render";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";

const page = content.pages["/contact/"];

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
};

/**
 * The real <form> ships at checkpoint 3 with LeadForm and /api/lead. Until then this
 * route's two conversion paths are the two Devin himself asked for: call and text,
 * both real and both live today, so the page is not staged on the form existing.
 */
export default function ContactPage() {
  const { business, nav } = content;

  return (
    <>
      <article className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        {page.lede && <p className="mt-4 text-[length:var(--text-lede)] text-[var(--ink)]/80">{page.lede}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          <Cta label={`${nav.call_label} ${business.phone_display}`} href={telHref(business.phone_primary)} variant="primary" />
          {business.sms_enabled && (
            <Cta label={`${nav.text_label} ${business.phone_display}`} href={smsHref(business.phone_primary)} variant="secondary" />
          )}
        </div>

        {page.consent_line && <p className="mt-6 text-sm text-[var(--ink)]/60">{page.consent_line}</p>}
      </article>
      <ClosingBar />
    </>
  );
}
