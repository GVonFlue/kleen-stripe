import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";
import ClosingBar from "@/components/ClosingBar";
import PaintedLine from "@/components/PaintedLine";

const page = content.pages["/services/"];

export const metadata: Metadata = {
  title: page.title,
  description: page.meta_description ?? undefined,
};

export default function ServicesHubPage() {
  return (
    <>
      <article className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="text-[length:var(--text-h1)] font-extrabold text-[var(--ink)]">{page.h1}</h1>
        <PaintedLine className="mt-3 w-16" />
        {page.lede && <p className="mt-4 max-w-2xl text-[length:var(--text-lede)] text-[var(--ink)]/80">{page.lede}</p>}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.services.map((service) => (
            <Link
              key={service.slug}
              href={`/${service.slug}/`}
              className="rounded-lg border border-[var(--line)] p-5 transition-colors hover:border-[var(--ink)]"
            >
              <p className="font-semibold text-[var(--ink)]">{service.name}</p>
              <p className="mt-2 text-sm text-[var(--ink)]/70">{service.lede}</p>
            </Link>
          ))}
        </div>
      </article>
      <ClosingBar />
    </>
  );
}
