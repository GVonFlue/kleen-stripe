import { content } from "@/lib/content";
import { hasAll, resolveTemplate } from "@/lib/render";
import PendingNote from "@/components/PendingNote";

/**
 * Withholds itself below block.render_if_min_items. Doctrine check 6: omit a weak
 * number rather than inflate it. Right now content only supplies one confirmed
 * figure, so this strip does not render at all until Devin gives a second one.
 */
export default function NumbersStrip({ block }: { block: any }) {
  const items = block.items.filter((item: any) => hasAll(content, item.requires));
  if (items.length < (block.render_if_min_items ?? 1)) return null;

  return (
    <section className="border-y border-[var(--line)] bg-[var(--subtle)]">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
        {items.map((item: any, i: number) => {
          const requiresPaths = item.requires as string[] | undefined;
          const figure = resolveTemplate(item.figure, content);
          return (
            <div key={i}>
              <PendingNote paths={requiresPaths ?? []} />
              <p className="text-3xl font-extrabold text-[var(--ink)]">{figure}</p>
              <p className="text-sm text-[var(--ink)]/70">{item.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
