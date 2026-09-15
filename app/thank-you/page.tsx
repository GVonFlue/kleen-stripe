import type { Metadata } from "next";
import { content } from "@/lib/content";
import Cta from "@/components/Cta";
import ClosingBar from "@/components/ClosingBar";
import PaintedLine from "@/components/PaintedLine";

const page = content.pages["/thank-you/"];

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
  alternates: { canonical: "/thank-you/" },
  robots: page.indexable === false ? { index: false, follow: true } : undefined,
};

/**
 * The no-JS landing for every accepted submission, and the fulfillment page for
 * the one submission that is owed a file back.
 *
 * `?get=ada-checklist` is the only value this page acts on, and it is matched
 * against a literal rather than used as a path: the href always comes from
 * content.lead_magnet.file, never from the query string, so a crafted URL cannot
 * turn this into a link to somewhere else. The worst a stranger can do by typing
 * the parameter themselves is reach a PDF that is already a public static asset.
 */
export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ get?: string }>;
}) {
  const { get } = await searchParams;
  const file = get === "ada-checklist" ? content.lead_magnet.file : null;
  const ui = content.ui;

  return (
    <>
      <article className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">
          {file ? ui.form_download_heading : page.h1}
        </h1>
        <PaintedLine className="mx-auto mt-3 w-16" />
        <p className="mt-4 text-[var(--ink)]/80">
          {file ? ui.form_download_body : (page.body as string)}
        </p>
        {file && (
          <div className="mt-7">
            <Cta label={ui.form_download_label} href={file} variant="primary" />
          </div>
        )}
      </article>
      <ClosingBar />
    </>
  );
}
