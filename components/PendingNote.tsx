import { content } from "@/lib/content";
import { isPending, showDraftBadges } from "@/lib/render";

type PendingNoteProps = { paths: string[] };

/**
 * A visible flag on any fact still sitting in provenance.pending_confirmation.
 * Gated on DRAFT_BADGES, not on draft mode itself: a client-review build should
 * render clean by default, and LAUNCH=1 already refuses to compile while one of
 * these exists regardless of this flag. This is a review aid for Devin and Logan
 * to opt into, not visitor copy, which is why its text is authored here rather
 * than pulled from the content file.
 */
export default function PendingNote({ paths }: PendingNoteProps) {
  if (!showDraftBadges) return null;
  const pending = paths.filter((p) => isPending(content, p));
  if (pending.length === 0) return null;

  return (
    <p className="mb-3 inline-block rounded border border-[var(--line)] bg-[var(--subtle)] px-2 py-1 text-xs text-[var(--ink)]/60">
      Draft only, pending Devin&apos;s confirmation: {pending.join(", ")}
    </p>
  );
}
