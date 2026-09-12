"use client";

import { useCallback, useRef, useState } from "react";

/**
 * A draggable wipe between the same lot before and after. The handle is a painted
 * yellow line with a grip on it, because the thing the visitor is dragging is
 * literally the edge of fresh paint.
 *
 * Accessibility is the reason this is not a bare div with a pointer listener:
 * - the handle is a real slider (role, aria-valuenow, aria-valuetext) and moves on
 *   arrow keys, Home and End, so it works without a pointer,
 * - both images are always in the DOM and both keep their alt text, so a screen
 *   reader gets the before and the after regardless of handle position,
 * - the wipe is clip-path on a wrapper, never display:none, so nothing is hidden
 *   from assistive tech at any position.
 *
 * No animation to disable: the only movement is the one the visitor is making with
 * their own finger, which prefers-reduced-motion does not cover.
 */
export default function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  className = "",
}: {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel: string;
  afterLabel: string;
  className?: string;
}) {
  const [pct, setPct] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.min(100, Math.max(0, next)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const moves: Record<string, number> = {
      ArrowLeft: -step,
      ArrowRight: step,
      ArrowDown: -step,
      ArrowUp: step,
    };
    if (e.key in moves) {
      e.preventDefault();
      setPct((p) => Math.min(100, Math.max(0, p + moves[e.key])));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPct(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPct(100);
    }
  };

  return (
    <div
      ref={frame}
      className={`relative select-none overflow-hidden rounded-none bg-[var(--subtle)] ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="[&_img]:pointer-events-none">{after}</div>

      <div
        className="absolute inset-0 [&_img]:pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        {before}
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded bg-[var(--accent)] px-2 py-1 text-xs font-bold uppercase tracking-wide text-[var(--accent-ink)]">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded bg-[var(--accent)] px-2 py-1 text-xs font-bold uppercase tracking-wide text-[var(--accent-ink)]">
        {afterLabel}
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-[4px] bg-[var(--accent)]"
        style={{ left: `calc(${pct}% - 2px)` }}
      />

      <button
        type="button"
        role="slider"
        aria-label={`${beforeLabel} and ${afterLabel}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`${Math.round(pct)} percent ${beforeLabel}`}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-[var(--accent-ink)] bg-[var(--accent)] shadow-lg"
        style={{ left: `${pct}%` }}
      >
        {/* Two chevrons, drawn rather than typed, so the grip is the same weight
            at every zoom and does not depend on a font having the glyph. */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="var(--accent-ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 7 L5 12 L10 17" />
          <path d="M14 7 L19 12 L14 17" />
        </svg>
      </button>
    </div>
  );
}
