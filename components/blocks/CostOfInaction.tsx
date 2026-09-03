import { content } from "@/lib/content";
import { hasAll, resolveTemplate } from "@/lib/render";
import WordBlock from "@/components/WordBlock";

/**
 * The first black band, a chapter break. Doctrine check 2, loss aversion stated as
 * arithmetic. The heading and body are general and need no figures. The arithmetic
 * sentence needs two pricing facts nobody has supplied yet (there is no `pricing`
 * object in content at all), so it withholds on its own rather than the whole band
 * disappearing. Full bleed background, contained inner column for the actual copy.
 */
export default function CostOfInaction({ block }: { block: any }) {
  const arithmetic = block.arithmetic_block;
  const arithmeticOk = arithmetic && hasAll(content, arithmetic.requires);
  const sentence = arithmeticOk ? resolveTemplate(arithmetic.template, content) : null;

  return (
    <section className="bg-[var(--ink)] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="max-w-3xl text-[length:var(--text-display)] font-extrabold leading-[1.05] text-[var(--surface)]">
          {block.heading_prefix ? (
            <>
              {block.heading_prefix} <WordBlock>{block.heading_highlight}</WordBlock>
            </>
          ) : (
            block.heading
          )}
        </h2>
        <p className="mt-5 max-w-2xl text-[var(--surface)]/80">{block.body}</p>
        {sentence && <p className="mt-3 max-w-2xl font-medium text-[var(--surface)]">{sentence}</p>}
      </div>
    </section>
  );
}
