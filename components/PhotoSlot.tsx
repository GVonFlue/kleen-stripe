import { slotLabel } from "@/lib/render";
import { showDraftBadges } from "@/lib/render";

type PhotoSlotProps = {
  slot: string;
  aspect?: string;
  className?: string;
};

/**
 * No stock photography, ever. Devin was explicit. Every image on the site is one
 * of these until a real photograph exists for that slot, and a launch build
 * throws rather than shipping the gap. Doctrine hard stop, "no stock photography."
 *
 * Two renderings, for the same reason PendingNote is gated the way it is:
 *
 *   DRAFT_BADGES=1   the loud labelled placeholder. This is the QA view, for
 *                    whoever is working the shot list.
 *   otherwise        a quiet toned panel with no text in it.
 *
 * The audit pass caught the loud version rendering on the deployed preview, so
 * "Photo needed, draft placeholder, not for launch" was the first thing a client
 * opening the link read. That is a note to us. .env.example already says a build
 * Devin or Logan actually looks at should render clean by default, and LAUNCH=1
 * still refuses to compile with a slot unfilled regardless of this flag, so
 * nothing about the guarantee changes. Only who has to read the QA annotation.
 *
 * It still occupies its slot rather than collapsing: a missing photo should read
 * as a composition waiting on an image, not silently restyle the page around a
 * hole nobody notices is there.
 */
export default function PhotoSlot({ slot, aspect = "aspect-[4/3]", className = "" }: PhotoSlotProps) {
  if (process.env.LAUNCH === "1") {
    throw new Error(
      `PhotoSlot "${slot}" has no real photograph behind it. No stock photography is allowed to ` +
        `stand in. A launch build refuses to ship this placeholder.`,
    );
  }

  if (!showDraftBadges) {
    return (
      <div
        aria-hidden="true"
        className={`w-full rounded-none bg-[var(--subtle)] ${aspect} ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`Photo placeholder: ${slotLabel(slot)}`}
      className={`flex w-full items-center justify-center rounded-none border-2 border-dashed border-[var(--line)] bg-[var(--subtle)] p-4 text-center ${aspect} ${className}`}
    >
      <div>
        <p className="text-sm font-medium text-[var(--ink)]/70">Photo needed</p>
        <p className="mt-1 text-xs text-[var(--ink)]/70">{slotLabel(slot)}</p>
        <p className="mt-2 text-[10px] uppercase tracking-wide text-[var(--ink)]/70">
          draft placeholder, not for launch
        </p>
      </div>
    </div>
  );
}
