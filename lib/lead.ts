import { content } from "@/lib/content";

/**
 * The one capture function. Every form and Chalk both call this, never a form
 * action and a chatbot handler that duplicate the same rules two different ways.
 * Doctrine section 7, "one code path."
 *
 * The doctrine's full lead path is validate -> Google Sheet -> CRM -> GHL. This is
 * the first step only. The Sheet write, the CRM write and the GHL handoff are not
 * built. Say so plainly rather than letting a payload look like it went further
 * than it did. When those exist, this function is where they get added, still
 * behind the same three outcomes below so every caller keeps working unchanged.
 */

const KNOWN_KEYS = new Set([
  "source_tag",
  "name",
  "phone",
  "email",
  "message",
  "company_website",
  "rendered_at",
  // Qualifying fields on the quote form. All optional to the visitor, all
  // allow-listed here, because an unknown key is a hard rejection by design
  // (doctrine section 7) and a form field added without a matching entry would
  // silently 400 every real submission.
  "property_address",
  "stall_count",
  "timing",
]);
const MIN_SECONDS_ON_FORM = 3;

/**
 * The source tag that asks for the lead magnet rather than for a quote. An
 * accepted submission on this tag hands the file back in the response, so the
 * visitor gets what they asked for in the same breath rather than being told to
 * go check an inbox. The email still goes out separately once a mailer exists.
 */
const CHECKLIST_SOURCE_TAG = "Kleen Stripe - ADA Checklist Download";

export type LeadOutcome =
  | { kind: "rejected"; reason: string }
  | { kind: "dropped"; reason: string; download?: string }
  | { kind: "accepted"; download?: string };

/**
 * What this lead is owed back, if anything. A dropped submission gets the same
 * answer as an accepted one on purpose: spam filtering is invisible to the
 * visitor, and a bot getting a link to a public PDF costs nothing, while a real
 * person tripped by the timing check losing the thing they asked for costs a
 * lead. The file is a static asset at a guessable path either way.
 */
function fulfillment(sourceTag: string): string | undefined {
  if (sourceTag !== CHECKLIST_SOURCE_TAG) return undefined;
  return content.lead_magnet.file ?? undefined;
}

export function processLead(payload: Record<string, string>): LeadOutcome {
  for (const key of Object.keys(payload)) {
    if (!KNOWN_KEYS.has(key)) return { kind: "rejected", reason: `unknown field: ${key}` };
  }

  if (!payload.source_tag) {
    return { kind: "rejected", reason: "missing source_tag" };
  }
  if (!content.source_tags.includes(payload.source_tag)) {
    return { kind: "rejected", reason: `source_tag not declared: ${payload.source_tag}` };
  }

  // Honeypot. A real visitor never fills a field this labeled and hidden. Told it
  // succeeded, nothing stored, and the reason never reaches the response.
  if (payload.company_website) {
    return { kind: "dropped", reason: "honeypot filled", download: fulfillment(payload.source_tag) };
  }

  // Minimum time on form. A submission this fast is a script, not a person.
  const renderedAt = Number(payload.rendered_at);
  if (!renderedAt || Number.isNaN(renderedAt) || (Date.now() - renderedAt) / 1000 < MIN_SECONDS_ON_FORM) {
    return { kind: "dropped", reason: "under minimum time on form", download: fulfillment(payload.source_tag) };
  }

  // The only sink that exists today. The full payload, in one recoverable line, so
  // a lead is never lost even though the Sheet and CRM are not wired yet.
  console.log(
    "LEAD_CAPTURED",
    JSON.stringify({
      source_tag: payload.source_tag,
      name: payload.name ?? null,
      phone: payload.phone ?? null,
      email: payload.email ?? null,
      property_address: payload.property_address || null,
      stall_count: payload.stall_count || null,
      timing: payload.timing || null,
      message: payload.message ?? null,
      received_at: new Date().toISOString(),
    }),
  );

  return { kind: "accepted", download: fulfillment(payload.source_tag) };
}
