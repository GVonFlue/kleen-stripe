import type { Metadata } from "next";
import { content } from "@/lib/content";
import ClosingBar from "@/components/ClosingBar";

const page = content.pages["/thank-you/"];

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
  robots: page.indexable === false ? { index: false, follow: true } : undefined,
};

export default function ThankYouPage() {
  return (
    <>
      <article className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        {page.body && <p className="mt-4 text-[var(--ink)]/80">{page.body as string}</p>}
      </article>
      <ClosingBar />
    </>
  );
}
