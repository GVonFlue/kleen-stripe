import { content } from "@/lib/content";
import { buildMode, isPending } from "@/lib/render";

type PendingNoteProps = { paths: string[] };

/**
 * A visible flag on any fact still sitting in provenance.pending_confirmation.
 * Draft mode only, since a launch build already refuses to compile while one of
 * these exists. This is a review aid for Devin and Logan, not visitor copy, which
 * is why its text is authored here rather than pulled from the content file.
 * README, "those render in draft with a badge."
 */
export default function PendingNote({ paths }: PendingNoteProps) {
  if (buildMode !== "draft") return null;
  const pending = paths.filter((p) => isPending(content, p));
  if (pending.length === 0) return null;

  return (
    <p className="mb-3 inline-block rounded border border-[var(--line)] bg-[var(--subtle)] px-2 py-1 text-xs text-[var(--ink)]/60">
      Draft only, pending Devin&apos;s confirmation: {pending.join(", ")}
    </p>
  );
}
