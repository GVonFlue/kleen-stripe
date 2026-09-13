"use client";

import { useEffect, useRef } from "react";

/**
 * The cursor lays a short stripe of wet paint behind it.
 *
 * Deliberately restrained: a single pass, one weight, fading out in under a
 * second, so it reads as a machine having just gone by rather than as a toy. It
 * respects the page's one line rule, which is that yellow marks where something
 * goes, by being temporary and never settling anywhere.
 *
 * Off entirely on coarse pointers, where there is no cursor to follow and the
 * canvas would only cost battery, and off under prefers-reduced-motion. Both
 * checks run before any listener is attached, so on a phone this component
 * mounts, decides it has nothing to do, and renders nothing.
 *
 * Sits under everything interactive and never takes pointer events.
 */
const LIFE = 620; // ms a segment stays on the road
const MAX = 90; // points retained, hard cap so a long drag cannot grow unbounded

export default function PaintCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    size();

    const pts: { x: number; y: number; t: number }[] = [];
    const onMove = (e: PointerEvent) => {
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (pts.length > MAX) pts.shift();
    };

    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#FFE500";

    let raf = 0;
    const frame = () => {
      const now = performance.now();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      while (pts.length && now - pts[0].t > LIFE) pts.shift();

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const age = (now - b.t) / LIFE;
        if (age >= 1) continue;
        // Fades and thins as it dries, so the tail of the pass is lighter than
        // the head, the way a real line does when the gun lifts. Kept thin on
        // purpose: a heavier trail reads as a toy and fights the page.
        ctx.globalAlpha = (1 - age) * 0.85;
        ctx.lineWidth = 7 * (1 - age * 0.55);
        ctx.strokeStyle = accent;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", size);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] hidden lg:block"
    />
  );
}
