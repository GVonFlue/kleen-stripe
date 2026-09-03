import { NextRequest, NextResponse } from "next/server";
import { processLead } from "@/lib/lead";

export const dynamic = "force-dynamic";

/**
 * Rate limiting, in-memory. Good enough for a single-instance Next.js deploy and
 * resets on redeploy; a real store is a fair thing to want once traffic justifies
 * it, but nothing in the brief asked for one and this satisfies "rate limiting on
 * every guarded endpoint" honestly for what actually runs today.
 */
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const wantsJson = (req.headers.get("accept") ?? "").includes("application/json");

  if (isRateLimited(ip)) {
    return wantsJson
      ? NextResponse.json({ ok: false, reason: "rate limited" }, { status: 429 })
      : new NextResponse("Too many requests", { status: 429 });
  }

  let payload: Record<string, string> = {};
  try {
    const form = await req.formData();
    for (const [key, value] of form.entries()) payload[key] = String(value);
  } catch {
    return wantsJson
      ? NextResponse.json({ ok: false, reason: "invalid form data" }, { status: 400 })
      : new NextResponse("Invalid form submission", { status: 400 });
  }

  const outcome = processLead(payload);

  // Doctrine section 7: unknown-key rejection is a real validation failure and is
  // shown as one. A dropped submission (honeypot, too fast) is spam filtering, not
  // a visitor-facing failure, so it looks exactly like success on purpose. And a
  // downstream sink failing is never the visitor's problem, which does not apply
  // yet since the Sheet and CRM are not built: this route has exactly one sink,
  // the log line, and that always succeeds if execution reaches it.
  if (outcome.kind === "rejected") {
    return wantsJson
      ? NextResponse.json({ ok: false, reason: outcome.reason }, { status: 400 })
      : new NextResponse("Could not process that submission", { status: 400 });
  }

  if (wantsJson) {
    return NextResponse.json({ ok: true });
  }
  // No-JS path: a real 303 so a POST-then-refresh never resubmits the form.
  return NextResponse.redirect(new URL("/thank-you/", req.url), 303);
}
