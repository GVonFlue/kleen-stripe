import Link from "next/link";
import { content } from "@/lib/content";

export default function ServiceGrid({ block }: { block: any }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
      <p className="mt-3 max-w-2xl text-[var(--ink)]/80">{block.body}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}
