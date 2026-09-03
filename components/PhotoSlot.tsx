import { slotLabel } from "@/lib/render";

type PhotoSlotProps = {
  slot: string;
  aspect?: string;
  className?: string;
};

/**
 * No stock photography, ever. Devin was explicit. Every image on the site is one
 * of these until a real photograph exists for that slot. It renders a visible,
 * labelled placeholder in draft and throws during a launch build, which hard-fails
 * `npm run build:launch` the way a stock photo slipping onto a live page never
 * should. Doctrine hard stop, "no stock photography."
 */
export default function PhotoSlot({ slot, aspect = "aspect-[4/3]", className = "" }: PhotoSlotProps) {
  if (process.env.LAUNCH === "1") {
    throw new Error(
      `PhotoSlot "${slot}" has no real photograph behind it. No stock photography is allowed to ` +
        `stand in. A launch build refuses to ship this placeholder.`,
    );
  }

  return (
    <div
      role="img"
      aria-label={`Photo placeholder: ${slotLabel(slot)}`}
      className={`flex w-full items-center justify-center rounded-md border-2 border-dashed border-[var(--line)] bg-[var(--subtle)] p-4 text-center ${aspect} ${className}`}
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
