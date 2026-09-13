"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "Think you could stripe it?"
 *
 * Drag from the left tick to the right one and try to lay a straight line. The
 * score is real: it is the average perpendicular deviation of every point you
 * drew from the straight line between where you started and where you finished,
 * expressed against the length of the run, so a wobble on a short line counts for
 * as much as the same wobble on a long one.
 *
 * The argument this section makes is the one the whole site makes, except the
 * visitor proves it to themselves instead of being told: freehand is hard, and
 * the reason his lots look like that is equipment and practice. It claims nothing
 * about Devin's tolerances, because we do not have that number.
 *
 * Pointer events throughout, so it works with a finger, a trackpad or a stylus.
 * With no JS the canvas simply never draws and the copy still reads.
 */

type Result = { straightness: number; covered: boolean } | null;

export default function StripeGame({
  eyebrow,
  heading,
  instruction,
  retryLabel,
}: {
  eyebrow: string;
  heading: string;
  instruction: string;
  retryLabel: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pts = useRef<{ x: number; y: number }[]>([]);
  const drawing = useRef(false);
  const [result, setResult] = useState<Result>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const style = getComputedStyle(document.documentElement);
    const accent = style.getPropertyValue("--accent").trim() || "#FFE500";
    const asphalt = style.getPropertyValue("--asphalt").trim() || "#0C0D0F";

    ctx.fillStyle = asphalt;
    ctx.fillRect(0, 0, w, h);

    // The two ticks: where a stall line would start and stop.
    const y = h / 2;
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 3;
    [0.08, 0.92].forEach((p) => {
      ctx.beginPath();
      ctx.moveTo(w * p, y - 26);
      ctx.lineTo(w * p, y + 26);
      ctx.stroke();
    });

    if (pts.current.length > 1) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pts.current[0].x, pts.current[0].y);
      for (const p of pts.current.slice(1)) ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, [paint]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const score = () => {
    const p = pts.current;
    const canvas = canvasRef.current;
    if (!canvas || p.length < 8) return;
    const w = canvas.clientWidth;
    const a = p[0];
    const b = p[p.length - 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < w * 0.3) {
      setResult({ straightness: 0, covered: false });
      return;
    }
    // Mean perpendicular distance from the line a->b, as a share of its length.
    let sum = 0;
    for (const q of p) sum += Math.abs(dy * q.x - dx * q.y + b.x * a.y - b.y * a.x) / len;
    const mean = sum / p.length;
    const straightness = Math.max(0, Math.min(100, 100 - (mean / len) * 900));
    setResult({ straightness: Math.round(straightness), covered: len >= w * 0.6 });
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    pts.current = [pos(e)];
    setResult(null);
    setHasDrawn(true);
    paint();
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    pts.current.push(pos(e));
    paint();
  };
  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    score();
  };

  const verdict = (r: NonNullable<Result>) => {
    if (!r.covered) return "Run the whole line, tick to tick.";
    if (r.straightness >= 97) return "That is machine straight. Suspiciously straight, actually.";
    if (r.straightness >= 90) return "Good. That would pass on a small lot.";
    if (r.straightness >= 75) return "Off by enough that you would see it from the street.";
    return "That is a repaint, not a stripe.";
  };

  return (
    <div>
      <p className="ks-label text-[var(--ink)]/55">{eyebrow}</p>
      <h2 className="mt-3 text-[length:var(--text-display)] font-black leading-[0.98] text-[var(--ink)]">
        {heading}
      </h2>
      <p className="mt-4 max-w-[54ch] text-[length:var(--text-lede)] text-[var(--ink)]/70">
        {instruction}
      </p>

      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        className="mt-8 block h-[220px] w-full cursor-crosshair touch-none border-2 border-[var(--accent)] sm:h-[280px]"
      />

      <div className="mt-5 flex min-h-11 flex-wrap items-center gap-5">
        {result && (
          <>
            <p className="ks-figure text-[length:var(--text-h1)] font-black leading-none text-[var(--accent)]">
              {result.straightness}
              <span className="ks-label ml-2 align-middle text-[var(--ink)]/55">
                {result.covered ? "% straight" : ""}
              </span>
            </p>
            <p className="max-w-[40ch] text-[var(--ink)]/80">{verdict(result)}</p>
          </>
        )}
        {hasDrawn && (
          <button
            type="button"
            onClick={() => {
              pts.current = [];
              setResult(null);
              paint();
            }}
            className="ks-label ml-auto min-h-11 border-2 border-[var(--ink)]/40 px-5 text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
