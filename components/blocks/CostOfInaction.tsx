import { content } from "@/lib/content";
import { hasAll, resolveTemplate } from "@/lib/render";

/**
 * Doctrine check 2, loss aversion stated as arithmetic. The heading and body are
 * general and need no figures. The arithmetic sentence needs two pricing facts
 * nobody has supplied yet (there is no `pricing` object in content at all), so it
 * withholds on its own rather than the whole band disappearing.
 */
export default function CostOfInaction({ block }: { block: any }) {
  const arithmetic = block.arithmetic_block;
  const arithmeticOk = arithmetic && hasAll(content, arithmetic.requires);
  const sentence = arithmeticOk ? resolveTemplate(arithmetic.template, content) : null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-[length:var(--text-h2)] font-bold text-[var(--ink)]">{block.heading}</h2>
      <p className="mt-3 max-w-2xl text-[var(--ink)]/80">{block.body}</p>
      {sentence && <p className="mt-3 max-w-2xl font-medium text-[var(--ink)]">{sentence}</p>}
    </section>
  );
}
