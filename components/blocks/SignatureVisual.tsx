import StallGrid from "@/components/StallGrid";

/** Wraps the StallGrid signature element with the content-driven eyebrow and heading. */
export default function SignatureVisual({ block }: { block: any }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--ink)]/60">{block.eyebrow}</p>
      <h2 className="mt-2 text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
      <div className="mt-8">
        <StallGrid />
      </div>
    </section>
  );
}
