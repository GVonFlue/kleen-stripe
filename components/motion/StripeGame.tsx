"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "Finish the lot."
 *
 * Five real lot layouts, each already striped except for its last line. Draw the
 * missing one. Retry deals a different lot, so it does not become a single muscle
 * memory you beat once.
 *
 * The score is two separate things, because a striper can fail at either:
 *
 *   STRAIGHTNESS  mean perpendicular deviation of every point drawn from the
 *                 straight line between where you started and stopped, measured
 *                 against the length of that run so a wobble counts the same on a
 *                 short line as on a long one.
 *   PLACEMENT     how far your two ends landed from where the line was supposed
 *                 to start and stop, measured against the stall pitch, so being
 *                 neat in the wrong place is not a pass.
 *
 * The scale is deliberately unkind. The point of the section is that this is hard
 * and that his lots look the way they do because of equipment and practice, so a
 * casual drag should land in the sixties, not the nineties. It asserts nothing
 * about Devin's own tolerances, because we do not have that number.
 *
 * Coordinates are normalised 0..1 and multiplied up at paint time, so a layout is
 * resolution independent and the same spec drives a phone and a desktop.
 */

type Seg = { x1: number; y1: number; x2: number; y2: number };
type Layout = { name: string; lines: Seg[]; hatch?: Seg[]; target: Seg };

const LAYOUTS: Layout[] = [
  {
    // Straight 90 degree stalls off an aisle line. The bread and butter.
    name: "Ninety degree, single row",
    lines: [
      { x1: 0.04, y1: 0.16, x2: 0.96, y2: 0.16 },
      ...[0.12, 0.27, 0.42, 0.57, 0.72].map((x) => ({ x1: x, y1: 0.16, x2: x, y2: 0.86 })),
    ],
    target: { x1: 0.87, y1: 0.16, x2: 0.87, y2: 0.86 },
  },
  {
    // Angled stalls, the layout you use when the aisle is too tight for ninety.
    name: "Sixty degree angle",
    lines: [
      { x1: 0.02, y1: 0.18, x2: 0.98, y2: 0.18 },
      ...[0.06, 0.20, 0.34, 0.48, 0.62].map((x) => ({ x1: x, y1: 0.18, x2: x + 0.15, y2: 0.88 })),
    ],
    target: { x1: 0.76, y1: 0.18, x2: 0.91, y2: 0.88 },
  },
  {
    // Two rows either side of a drive aisle.
    name: "Double row, drive aisle",
    lines: [
      ...[0.15, 0.30, 0.45, 0.60, 0.75].map((x) => ({ x1: x, y1: 0.06, x2: x, y2: 0.40 })),
      ...[0.15, 0.30, 0.45, 0.60, 0.75, 0.90].map((x) => ({ x1: x, y1: 0.62, x2: x, y2: 0.96 })),
      { x1: 0.02, y1: 0.40, x2: 0.98, y2: 0.40 },
      { x1: 0.02, y1: 0.62, x2: 0.98, y2: 0.62 },
    ],
    target: { x1: 0.90, y1: 0.06, x2: 0.90, y2: 0.40 },
  },
  {
    // Angled the other way, which is where people's hands betray them.
    name: "Reverse angle",
    lines: [
      { x1: 0.02, y1: 0.88, x2: 0.98, y2: 0.88 },
      ...[0.04, 0.18, 0.32, 0.46, 0.60].map((x) => ({ x1: x, y1: 0.88, x2: x + 0.15, y2: 0.16 })),
    ],
    target: { x1: 0.74, y1: 0.88, x2: 0.89, y2: 0.16 },
  },
  {
    // End cap with an accessible stall and its hatched access aisle.
    name: "Accessible end cap",
    lines: [
      { x1: 0.04, y1: 0.16, x2: 0.96, y2: 0.16 },
      ...[0.12, 0.28, 0.44].map((x) => ({ x1: x, y1: 0.16, x2: x, y2: 0.86 })),
      { x1: 0.60, y1: 0.16, x2: 0.60, y2: 0.86 },
      { x1: 0.74, y1: 0.16, x2: 0.74, y2: 0.86 },
    ],
    hatch: Array.from({ length: 5 }, (_, i) => ({
      x1: 0.605 + i * 0.027, y1: 0.86, x2: 0.66 + i * 0.027, y2: 0.16,
    })),
    target: { x1: 0.88, y1: 0.16, x2: 0.88, y2: 0.86 },
  },
];

type Result = { straightness: number; placement: number; total: number } | null;

export default function StripeGame({
  eyebrow, heading, instruction, hint, retryLabel,
}: {
  eyebrow: string; heading: string; instruction: string; hint: string; retryLabel: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pts = useRef<{ x: number; y: number }[]>([]);
  const drawing = useRef(false);
  const [lot, setLot] = useState(0);
  const [result, setResult] = useState<Result>(null);
  const [touched, setTouched] = useState(false);

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

    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue("--accent").trim() || "#FFE500";
    const asphalt = css.getPropertyValue("--asphalt").trim() || "#0C0D0F";
    const ada = css.getPropertyValue("--ada").trim() || "#1B54C8";
    const L = LAYOUTS[lot];
    const X = (v: number) => v * w;
    const Y = (v: number) => v * h;

    ctx.fillStyle = asphalt;
    ctx.fillRect(0, 0, w, h);

    ctx.lineCap = "butt";
    ctx.lineWidth = 5;
    ctx.strokeStyle = accent;
    for (const s of L.lines) {
      ctx.beginPath(); ctx.moveTo(X(s.x1), Y(s.y1)); ctx.lineTo(X(s.x2), Y(s.y2)); ctx.stroke();
    }
    if (L.hatch) {
      ctx.strokeStyle = ada; ctx.lineWidth = 4;
      for (const s of L.hatch) {
        ctx.beginPath(); ctx.moveTo(X(s.x1), Y(s.y1)); ctx.lineTo(X(s.x2), Y(s.y2)); ctx.stroke();
      }
    }

    // Where the missing line belongs: two faint ticks, not a ghost of the answer.
    ctx.strokeStyle = "rgba(255,255,255,0.30)";
    ctx.lineWidth = 3;
    ([[L.target.x1, L.target.y1], [L.target.x2, L.target.y2]] as const).forEach(([x, y]) => {
      ctx.beginPath(); ctx.arc(X(x), Y(y), 7, 0, Math.PI * 2); ctx.stroke();
    });

    if (pts.current.length > 1) {
      ctx.strokeStyle = accent; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pts.current[0].x, pts.current[0].y);
      for (const p of pts.current.slice(1)) ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }, [lot]);

  useEffect(() => { paint(); window.addEventListener("resize", paint); return () => window.removeEventListener("resize", paint); }, [paint]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const score = () => {
    const canvas = canvasRef.current;
    const p = pts.current;
    if (!canvas || p.length < 6) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const T = LAYOUTS[lot].target;
    const t1 = { x: T.x1 * w, y: T.y1 * h }, t2 = { x: T.x2 * w, y: T.y2 * h };
    const a = p[0], b = p[p.length - 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len < 30) return;

    let sum = 0;
    for (const q of p) sum += Math.abs((b.y - a.y) * q.x - (b.x - a.x) * q.y + b.x * a.y - b.y * a.x) / len;
    const straightness = Math.max(0, 100 - (sum / p.length / len) * 2600);

    // Ends measured against the stall pitch, and scored either way round so
    // drawing bottom to top is not punished.
    const pitch = Math.hypot(t2.x - t1.x, t2.y - t1.y);
    const fwd = Math.hypot(a.x - t1.x, a.y - t1.y) + Math.hypot(b.x - t2.x, b.y - t2.y);
    const rev = Math.hypot(a.x - t2.x, a.y - t2.y) + Math.hypot(b.x - t1.x, b.y - t1.y);
    const placement = Math.max(0, 100 - (Math.min(fwd, rev) / pitch) * 175);

    const total = Math.round(straightness * 0.6 + placement * 0.4);
    setResult({ straightness: Math.round(straightness), placement: Math.round(placement), total });
  };

  const reset = (next: boolean) => {
    pts.current = [];
    setResult(null);
    setTouched(false);
    if (next) setLot((i) => (i + 1) % LAYOUTS.length);
    else paint();
  };

  const verdict = (t: number) => {
    if (t >= 92) return "Machine straight. You have done this before.";
    if (t >= 80) return "That would pass on a small lot. Not on a Walmart.";
    if (t >= 65) return "Off by enough that you would see it from the street.";
    if (t >= 45) return "The property manager is calling somebody about that.";
    return "That is a repaint, not a stripe.";
  };

  return (
    <div>
      <p className="ks-label text-[var(--ink)]/55">{eyebrow}</p>
      <h2 className="mt-3 text-[length:var(--text-display)] font-black leading-[0.98] text-[var(--ink)]">{heading}</h2>
      <p className="mt-4 max-w-[54ch] text-[length:var(--text-lede)] text-[var(--ink)]/70">{instruction}</p>

      <div className="relative mt-8">
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drawing.current = true; pts.current = [pos(e)]; setResult(null); setTouched(true); paint(); }}
          onPointerMove={(e) => { if (!drawing.current) return; pts.current.push(pos(e)); paint(); }}
          onPointerUp={() => { if (!drawing.current) return; drawing.current = false; score(); }}
          onPointerCancel={() => { if (!drawing.current) return; drawing.current = false; score(); }}
          className="block h-[240px] w-full cursor-crosshair touch-none border-2 border-[var(--accent)] sm:h-[320px]"
        />
        {!touched && (
          <p className="ks-label pointer-events-none absolute inset-x-0 bottom-4 text-center text-[var(--ink)]/70">
            {hint}
          </p>
        )}
        <p className="ks-label pointer-events-none absolute left-3 top-3 text-[var(--ink)]/45">
          {LAYOUTS[lot].name}
        </p>
      </div>

      <div className="mt-5 flex min-h-11 flex-wrap items-center gap-x-8 gap-y-4">
        {result && (
          <>
            <p className="ks-figure text-[length:var(--text-h1)] font-black leading-none text-[var(--accent)]">
              {result.total}
              <span className="ks-label ml-2 align-middle text-[var(--ink)]/55">out of 100</span>
            </p>
            <p className="ks-label text-[var(--ink)]/55">
              {`Straight ${result.straightness} · Placed ${result.placement}`}
            </p>
            <p className="max-w-[38ch] text-[var(--ink)]/80">{verdict(result.total)}</p>
          </>
        )}
        <button
          type="button"
          onClick={() => reset(true)}
          className="ks-label min-h-11 border-2 border-[var(--ink)]/40 px-5 text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:ml-auto"
        >
          {retryLabel}
        </button>
      </div>
    </div>
  );
}
