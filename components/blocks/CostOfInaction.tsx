import { content } from "@/lib/content";
import { hasAll, resolveTemplate } from "@/lib/render";
import WordBlock from "@/components/WordBlock";

/**
 * The first black band, a chapter break. Doctrine check 2, loss aversion stated as
 * arithmetic. The heading and body are general and need no figures. The arithmetic
 * sentence needs two pricing facts nobody has supplied yet (there is no `pricing`
 * object in content at all), so it withholds on its own rather than the whole band
 * disappearing. Full bleed background, contained inner column for the actual copy.
 *
 * Surface note: this block used to invert itself, painting bg-[var(--ink)] and
 * drawing its text from --surface. Band tone="asphalt" now owns that decision (see
 * the TONE table in app/page.tsx), and .on-asphalt already repoints --ink and
 * --surface for everything inside it. A block that also inverts inside an inverted
 * band inverts twice and comes out light, which is exactly what happened. So this
 * reads --ink for text like every other block and states no background at all.
 */
export default function CostOfInaction({ block }: { block: any }) {
  const arithmetic = block.arithmetic_block;
  const arithmeticOk = arithmetic && hasAll(content, arithmetic.requires);
  const sentence = arithmeticOk ? resolveTemplate(arithmetic.template, content) : null;

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="max-w-3xl text-[length:var(--text-display)] font-extrabold leading-[1.05] text-[var(--ink)]">
          {block.heading_prefix ? (
            <>
              {block.heading_prefix} <WordBlock>{block.heading_highlight}</WordBlock>
            </>
          ) : (
            block.heading
          )}
        </h2>
        <p className="mt-5 max-w-2xl text-[var(--ink)]/80">{block.body}</p>
        {sentence && <p className="mt-3 max-w-2xl font-medium text-[var(--ink)]">{sentence}</p>}
      </div>
    </section>
  );
}
