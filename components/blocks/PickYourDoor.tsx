import Link from "next/link";

/** Doctrine's "single highest-value structural element we borrow." Sorts every visitor in one tap. */
export default function PickYourDoor({ block }: { block: any }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {block.lanes.map((lane: any) => (
          <Link
            key={lane.href}
            href={lane.href}
            className="flex flex-col gap-2 rounded-lg border border-[var(--line)] p-5 transition-colors hover:border-[var(--ink)]"
          >
            <span className="font-semibold text-[var(--ink)]">{lane.label}</span>
            <span className="text-sm text-[var(--ink)]/70">{lane.line}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
