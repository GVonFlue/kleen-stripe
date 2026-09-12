/**
 * Kleen Stripe content schema.
 *
 * Single source of truth. The site renders this and nothing else. No copy in JSX.
 * This file also enforces the ProyTech Website Build Doctrine at parse time, so a
 * doctrine violation is a build failure rather than something somebody notices on
 * launch day.
 *
 * Two modes:
 *   parseContent(raw, "draft")   dev and client review. Pending facts render with a badge.
 *   parseContent(raw, "launch")  production. Throws while any fact is unconfirmed.
 */

import { z } from "zod";

/* ------------------------------------------------------------------ *
 * Doctrine enforcement primitives
 * ------------------------------------------------------------------ */

/** Doctrine section 5. Prohibited in every string that reaches a page. */
const EM_DASH = /[—–]/;

/** Doctrine section 5. Superlatives without evidence, plus the client's never_say list. */
const BANNED_WORDS = [
  "cheap",
  "affordable",
  "best",
  "leading",
  "premier",
  "world-class",
  "passionate",
  "dedicated to excellence",
  "committed to your success",
  "proven system",
  "next level",
  "one stop shop",
  "one-stop shop",
  "cutting edge",
  "state of the art",
];

/** Doctrine section 8. Forbidden until endpoints.booking_url exists. */
const BOOKING_CLAIMS = ["booked", "confirmed", "scheduled", "held", "on the calendar"];

/** Doctrine hard stop 2. Placeholders that have shipped to real client sites in this market. */
const PLACEHOLDER_PATTERNS = [
  /555[-.\s]?555[-.\s]?5555/,
  /email@mymailservice\.com/i,
  /lorem ipsum/i,
  /your company name/i,
  /example\.com/i,
  /\bTBD\b/,
  /\bXXXX\b/,
];

/**
 * Doctrine section 3. Buttons state the outcome, never the mechanism.
 */
const BANNED_CTA_LABELS = ["submit", "send", "click here", "learn more", "read more", "go"];

export type BuildMode = "draft" | "launch";

/* ------------------------------------------------------------------ *
 * Field types
 * ------------------------------------------------------------------ */

/** Shared with the auditContent tree walk below, so a `copy()` field and a raw string
 *  inside a `blocks: z.any()` record are held to the exact same rule, not two copies
 *  of it that can drift apart. */
export function bannedWordHit(s: string): string | null {
  return (
    BANNED_WORDS.find((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(s)) ?? null
  );
}
export function placeholderHit(s: string): RegExp | null {
  return PLACEHOLDER_PATTERNS.find((p) => p.test(s)) ?? null;
}

/**
 * Any string that can reach rendered HTML. Rejects em-dashes and unevidenced
 * superlatives. Use this instead of z.string() for every piece of copy.
 */
export const copy = (max = 2000) =>
  z
    .string()
    .max(max)
    .refine((s) => !EM_DASH.test(s), {
      message: "Em-dash or en-dash found. Doctrine section 5 prohibits both. Use a comma, a period, or restructure.",
    })
    .refine((s) => bannedWordHit(s) === null, {
      message: "Banned word. Doctrine section 5, superlatives without evidence and the client never_say list.",
    })
    .refine((s) => placeholderHit(s) === null, {
      message: "Placeholder text. Doctrine hard stop 2. A placeholder never reaches a live page.",
    });

/** A fact we either have or do not. Never a plausible guess. Doctrine hard stop 1. */
const fact = <T extends z.ZodTypeAny>(inner: T) => inner.nullable();

const ctaSchema = z.object({
  label: copy(60).refine((s) => !BANNED_CTA_LABELS.includes(s.trim().toLowerCase()), {
    message: "Button states the mechanism, not the outcome. Doctrine section 3. Nothing we build says Submit.",
  }),
  href: z.string().min(1),
  source_tag: z.string().min(1).optional(),
  principle: z.string().optional(),
});

const phone = z.string().regex(/^\d{10}$/, "Store the raw 10 digits. Formatting is a render concern.");

/* ------------------------------------------------------------------ *
 * Sections
 * ------------------------------------------------------------------ */

export const businessSchema = z.object({
  name: z.string().min(1),
  legal_name: fact(z.string()),
  owner_name: z.string().min(1),
  founder_name: fact(z.string()),
  founded_year: fact(z.number().int().min(1900).max(2026)),
  owner_since: fact(z.number().int().min(1900).max(2026)),
  generation: fact(z.number().int().min(1).max(6)),
  phone_primary: phone,
  phone_display: z.string().min(1),
  sms_enabled: z.boolean(),
  email: z.string().email(),
  street_address: fact(z.string()),
  city: z.string().min(1),
  state: z.string().length(2),
  postal_code: fact(z.string()),
  address_display: z.enum(["full", "service_area_only"]),
  hours: fact(z.record(z.string(), z.string())),
  after_hours_work: fact(z.boolean()),
  license_number: fact(z.string()),
  insured: fact(z.boolean()),
  quote_turnaround: fact(z.string()),
  schedule_turnaround: fact(z.string()),
  warranty: fact(z.string()),
  minimum_job: fact(z.string()),
  crew_size: fact(z.number().int()),
  residential_work: fact(z.boolean()),
  contact_preference: z.array(z.enum(["call", "text", "email", "form"])).min(1),
  service_area_statement: copy(400),
  domains: z.object({
    primary: z.string(),
    secondary: z.string().nullable(),
    secondary_disposition: z.string(),
  }),
  social: z.object({
    facebook: fact(z.string().url()),
    google_business_profile: fact(z.string().url()),
  }),
});

export const brandSchema = z.object({
  colors: z.object({
    ink: z.string(),
    surface: z.string(),
    subtle: z.string(),
    line: z.string(),
    accent: z.string(),
    accent_ink: z.string(),
    ada: z.string(),
    /* The dark half of the palette. Added when the logo arrived: the wordmark is
       yellow on black, so black is a brand surface here and not just a text colour.
       Light sections keep ink/surface, dark bands use these. Every one of them is
       still a content fact, injected by app/layout.tsx, never hardcoded in CSS. */
    asphalt: z.string(),
    asphalt_raised: z.string(),
    asphalt_line: z.string(),
    asphalt_ink: z.string(),
    asphalt_muted: z.string(),
    /* ADA blue fails contrast against asphalt at the value that passes against
       white, so the dark bands carry their own. Same meaning, different surface. */
    ada_on_dark: z.string(),
  }),
  color_rules: z.array(z.string()),
  voice: z.array(z.string()),
  reference_sites: z.array(z.string()),
  reference_axis: z.string(),
  signature_element: z.string(),
  never_say: z.array(z.string()),
  ai_tells_checked: z.array(z.string()).length(6),
});

export const serviceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: copy(80),
  money_page: z.boolean().optional(),
  priority: z.number().int().optional(),
  title: copy(70),
  meta_description: copy(165),
  h1: copy(120),
  lede: copy(600),
  body: z.array(copy(1200)).optional(),
  scope: z.array(copy(200)).min(1),
  faqs: z
    .array(
      z.object({
        q: copy(200),
        /** null means the honest answer needs a fact we do not have. The FAQ withholds itself. */
        a: fact(copy(1200)),
        needs: z.string().optional(),
      }),
    )
    .default([]),
  faqs_pending: z.array(z.string()).optional(),
  /** Opt a service page into a non-default header treatment. "ada" paints the
   *  access-aisle field. Content decides; no component special-cases a slug. */
  header_tone: z.enum(["ada"]).optional(),
  header_note: z.string().optional(),
  compliance_note: z.string().optional(),
  why_own_page: z.string().optional(),
  source_tag: z.string().min(1),
  schema_type: z.literal("Service"),
  buyers: z.array(z.string()),
});

export const buyerSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  label: copy(80),
  title: copy(70),
  meta_description: copy(165),
  h1: copy(120),
  pain: copy(600),
  body: z.array(copy(1200)),
  proof_needed: z.array(z.string()).optional(),
  price_position_note: z.string().optional(),
  cta: ctaSchema,
  principle: z.string(),
});

/**
 * Reusable section-chrome labels that would otherwise get typed straight into a
 * page template as if they were not copy. They are: a visitor reads them, so they
 * come from here rather than from a component. Checkpoint 2.
 */
export const uiSchema = z.object({
  service_scope_heading: copy(40),
  service_faqs_heading: copy(40),
  service_buyers_heading: copy(40),
  form_name_label: copy(20),
  form_phone_label: copy(20),
  form_email_label: copy(20),
  form_message_label: copy(60),
  form_optional_note: copy(20),
  form_success_heading: copy(60),
  /** The two chips on the before/after wiper. Copy, so it lives here, not in JSX. */
  before_after: z.object({
    before: copy(16),
    after: copy(16),
  }),
});

export const areaSchema = z.object({
  city: z.string(),
  state: z.string().length(2),
  slug: z.string().nullable(),
  page: z.boolean(),
  primary: z.boolean().optional(),
  travel_market: z.boolean().optional(),
  note: z.string().optional(),
});

/**
 * areaSchema carries no title, meta, h1 or body of its own. Checkpoint 2 found this
 * gap: four routes (Derby, Andover, Haysville, Newton) are marked page:true with
 * nothing to render. This is a template rather than per-city prose: {{city}} and
 * {{state}} are the only variables, everything else is shared and reuses facts
 * already established elsewhere in this file. Flagged in the checkpoint 2 report.
 */
export const areaPageTemplateSchema = z.object({
  title_template: copy(70),
  meta_description_template: copy(165),
  h1_template: copy(120),
  lede_template: copy(400),
  body: z.array(copy(800)),
  cta: ctaSchema,
});

/** Doctrine hard stop 3 and section 9. Nothing publishes without permission. */
export const reviewSchema = z.object({
  name: z.string().min(1),
  date: z.string(),
  rating: z.number().min(1).max(5),
  /** Never edited. Not spellchecked, not tidied, not shortened. */
  text: z.string().min(1),
  source: z.string(),
  consent: z.boolean(),
  note: z.string().optional(),
});

export const workPairSchema = z.object({
  pair_id: z.string(),
  lot_type: z.enum(["Retail", "Apartments", "Warehouse", "Industrial", "Small business", "ADA"]),
  before: z.object({ src: z.string(), alt: copy(200) }),
  after: z.object({ src: z.string(), alt: copy(200) }),
  caption: fact(copy(300)),
  city: fact(z.string()),
  consent: z.boolean(),
});

/**
 * Work order, "photos first": single real job photos, not before/after pairs.
 * Devin owns these and gave permission, so consent is true by construction here
 * rather than something the audit gates on per item the way reviews and work[]
 * pairs are gated. work[] stays reserved for real before/after pairs; a gallery
 * item existing does not satisfy that stricter bar.
 */
export const gallerySchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: copy(200),
  lot_type: z.enum(["Retail", "Apartments", "Warehouse", "Industrial", "Small business", "ADA"]),
  caption: fact(copy(300)),
  consent: z.boolean(),
  /** A ~24px data URI, so a scroll or a slow connection never lands on blank
   *  white while the real photo loads. Optional so a hand-added gallery entry
   *  without one still renders (a solid tone, not a void, is the fallback). */
  blur: z.string().optional(),
});

/** Which gallery photo, if any, fills the hero and trust image slots. Null leaves
 *  the slot a PhotoSlot placeholder rather than substituting a photo that does not
 *  actually show what that slot promises (the trust slot promises a person). */
export const photoAssignmentsSchema = z.object({
  hero: z.string().nullable(),
  trust: z.string().nullable(),
});

export const clientSchema = z.object({
  name: z.string(),
  /** False means the name never reaches rendered HTML, in text or as a logo. */
  publishable: z.boolean(),
});

export const leadMagnetSchema = z.object({
  title: copy(120),
  subtitle: copy(200),
  file: fact(z.string()),
  /** Doctrine section 3. Six items beats one sentence. */
  value_stack: z.array(copy(220)).length(6),
  cta: ctaSchema,
  consent_line: copy(300),
  content_gate: z.string().optional(),
});

const blockSchema = z.record(z.string(), z.any());

export const pageSchema = z.object({
  type: z.string(),
  title: copy(70),
  meta_description: fact(copy(165)),
  h1: copy(160),
  lede: fact(copy(800)).optional(),
  body: z.union([z.array(copy(1500)), copy(1500)]).optional(),
  blocks: z.array(blockSchema).optional(),
  indexable: z.boolean().optional(),
  filters: z.array(z.string()).optional(),
  empty_state: copy(400).optional(),
  cta: ctaSchema.optional(),
  form_source_tag: z.string().optional(),
  consent_line: copy(300).optional(),
  note: z.string().optional(),
  travel_note: z.string().optional(),
  requires: z.array(z.string()).optional(),
  pricing_note: z.any().optional(),
  response_expectation: z.any().optional(),
  source_tag: z.string().optional(),
});

export const provenanceSchema = z.object({
  confirmed_by_client: z.array(z.string()),
  pending_confirmation: z.array(
    z.object({
      path: z.string(),
      value: z.any(),
      source: z.string(),
      note: z.string(),
    }),
  ),
  conflicts_to_resolve: z.array(
    z.object({
      field: z.string(),
      values: z.array(z.string()),
      resolution: z.string(),
    }),
  ),
});

export const contentSchema = z.object({
  _meta: z.object({
    client: z.string(),
    version: z.string(),
    generated: z.string(),
    doctrine: z.string(),
    rule: z.string(),
  }),
  provenance: provenanceSchema,
  business: businessSchema,
  brand: brandSchema,
  positioning: z.any(),
  endpoints: z.object({
    form_endpoint: z.string(),
    booking_url: fact(z.string()),
    sheet_id: fact(z.string()),
    crm_webhook: fact(z.string()),
  }),
  nav: z.object({
    primary: z.array(z.object({ label: copy(40), href: z.string() })),
    cta: ctaSchema,
    /** The two words next to the tappable tel:/sms: links in the header and footer.
     *  Content, not JSX: checkpoint 2 caught "Call" and "Text" typed straight into
     *  components, which is exactly the shortcut CLAUDE.md's "no copy in JSX, none"
     *  rule exists to catch. */
    call_label: copy(20),
    text_label: copy(20),
    note: z.string().optional(),
  }),
  pages: z.record(z.string(), pageSchema),
  services: z.array(serviceSchema).min(1),
  buyers: z.array(buyerSchema).min(1),
  areas: z.array(areaSchema).min(1),
  area_page_template: areaPageTemplateSchema,
  ui: uiSchema,
  clients: z.array(clientSchema),
  clients_note: z.string().optional(),
  reviews: z.array(reviewSchema),
  work: z.array(workPairSchema),
  work_shot_list: z.array(z.string()).optional(),
  gallery: z.array(gallerySchema).default([]),
  gallery_source_note: z.string().optional(),
  photo_assignments: photoAssignmentsSchema,
  lead_magnet: leadMagnetSchema,
  source_tags: z.array(z.string()),
});

export type Content = z.infer<typeof contentSchema>;

/* ------------------------------------------------------------------ *
 * Cross-cutting doctrine checks
 * ------------------------------------------------------------------ */

/**
 * Keys whose string content never reaches a visitor, so copy rules do not apply to
 * them: internal annotations, provenance and strategy text, and structural/routing
 * identifiers (hrefs, slugs, ids) that are not prose and are validated by their own
 * schema types instead. Extended at checkpoint 1 decision 4 when auditContent's copy
 * rules were widened from copy()-typed fields to every string in the tree, which is
 * also why "text" (a review's verbatim words, doctrine hard stop 3) has to be here:
 * a customer's own quote is not our copy to hold to our own house style.
 */
const COPY_EXEMPT_KEYS = [
  "note", "needs", "resolution", "source", "content_gate", "compliance_note", "why_own_page",
  "scope_flag", "fallback_note", "price_position_note", "rule", "doctrine",
  "reference_axis", "signature_element", "positioning", "provenance", "_meta", "domains",
  "href", "src", "slug", "schema_type", "kind", "id", "type", "image_slot", "pair_id",
  "lot_type", "text", "value", "principle", "requires", "travel_note", "work_shot_list",
  "clients_note", "faqs_pending", "proof_needed", "never_say", "gallery_source_note",
];

function walkStrings(node: unknown, path: string, visit: (s: string, p: string) => void) {
  if (typeof node === "string") return visit(node, path);
  if (Array.isArray(node)) return node.forEach((v, i) => walkStrings(v, `${path}[${i}]`, visit));
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (COPY_EXEMPT_KEYS.includes(k)) continue;
      walkStrings(v, `${path}.${k}`, visit);
    }
  }
}

function resolvePath(content: any, path: string): unknown {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .reduce((acc: any, key) => (acc == null ? acc : acc[key]), content);
}

export function auditContent(content: Content, mode: BuildMode): string[] {
  const errors: string[] = [];

  // Doctrine section 5, checkpoint 1 decision 4. `pages[].blocks` is
  // z.record(z.string(), z.any()) at the schema level, so a `copy()` field type never
  // sees most block content. This walk is what actually enforces em-dash, banned-word
  // and placeholder rules there, and everywhere else in the tree that copy() does not
  // already type. Doctrine section 8's booking-language check rides the same pass.
  const requireBookingUrl = !content.endpoints.booking_url;
  walkStrings(content, "content", (s, p) => {
    if (EM_DASH.test(s)) {
      errors.push(`${p}: em-dash or en-dash found. Doctrine section 5 prohibits both. Use a comma, a period, or restructure.`);
    }
    const banned = bannedWordHit(s);
    if (banned) {
      errors.push(`${p}: banned word "${banned}". Doctrine section 5, superlatives without evidence and the client never_say list.`);
    }
    if (placeholderHit(s)) {
      errors.push(`${p}: placeholder text. Doctrine hard stop 2. A placeholder never reaches a live page.`);
    }
    if (requireBookingUrl) {
      const bookingHit = BOOKING_CLAIMS.find((c) => new RegExp(`\\b${c}\\b`, "i").test(s));
      if (bookingHit) errors.push(`${p}: says "${bookingHit}" with no endpoints.booking_url. Doctrine section 8.`);
    }
  });

  // Doctrine hard stop 3. Consent gate.
  content.reviews.forEach((r, i) => {
    if (!r.consent && mode === "launch") {
      errors.push(`reviews[${i}] (${r.name}): consent is false. It must not render. Filter it, or get permission.`);
    }
  });
  content.gallery.forEach((g, i) => {
    if (!g.consent && mode === "launch") {
      errors.push(`gallery[${i}] (${g.id}): consent is false. It must not render. Filter it, or get permission.`);
    }
  });

  // Every source tag used must be declared, so nothing lands in the CRM unattributed.
  const declared = new Set(content.source_tags);
  const used: string[] = [];
  content.services.forEach((s) => used.push(s.source_tag));
  content.buyers.forEach((b) => b.cta.source_tag && used.push(b.cta.source_tag));
  used.forEach((t) => {
    if (!declared.has(t)) errors.push(`source_tag "${t}" is used but not declared in source_tags.`);
  });

  // Doctrine section 10. Unique title and meta description per route.
  const titles = new Map<string, string>();
  const metas = new Map<string, string>();
  const register = (route: string, title: string, meta: string | null) => {
    if (titles.has(title)) errors.push(`Duplicate title on ${route} and ${titles.get(title)}.`);
    titles.set(title, route);
    if (meta) {
      if (metas.has(meta)) errors.push(`Duplicate meta description on ${route} and ${metas.get(meta)}.`);
      metas.set(meta, route);
    }
  };
  Object.entries(content.pages).forEach(([route, p]) => register(route, p.title, p.meta_description));
  content.services.forEach((s) => register(`/${s.slug}/`, s.title, s.meta_description));
  content.buyers.forEach((b) => register(`/${b.slug}/`, b.title, b.meta_description));

  // Doctrine section 11. A pending fact renders in draft and blocks a launch.
  if (mode === "launch") {
    content.provenance.pending_confirmation.forEach((p) => {
      errors.push(
        `LAUNCH BLOCKED. ${p.path} is unconfirmed. Source: ${p.source}. ${p.note} ` +
          `Get Devin's answer, then remove it from provenance.pending_confirmation.`,
      );
    });
    content.provenance.conflicts_to_resolve.forEach((c) => {
      errors.push(`LAUNCH BLOCKED. Unresolved conflict on "${c.field}": ${c.values.join(" vs ")}. ${c.resolution}`);
    });
    if (publishableWork(content).length === 0) {
      errors.push(
        "LAUNCH BLOCKED. work[] has no consented before/after pair. gallery[] singles are not a substitute for this " +
          "bar: they satisfy isWorkIndexable() so /work/ can leave noindex, but the doctrine proof this checks for is " +
          "a real before/after pair specifically.",
      );
    }
    if (!content.lead_magnet.file) {
      errors.push("LAUNCH BLOCKED. lead_magnet.file is null. The give is the homepage's primary reciprocity path.");
    }
  }

  // A pending fact must actually have a value, otherwise it should just be null.
  content.provenance.pending_confirmation.forEach((p) => {
    if (p.path.includes("[") === false && resolvePath(content, p.path) == null) {
      errors.push(`provenance lists ${p.path} as pending but the value is null. Remove it from provenance or supply the value.`);
    }
  });

  return errors;
}

export function parseContent(raw: unknown, mode: BuildMode = "draft"): Content {
  const parsed = contentSchema.parse(raw);
  const errors = auditContent(parsed, mode);
  if (errors.length) {
    throw new Error(
      `Content audit failed (${mode} mode), ${errors.length} problem(s):\n\n` + errors.map((e) => `  - ${e}`).join("\n"),
    );
  }
  return parsed;
}

/** Render helpers that enforce the withholding rules rather than leaving them to a component. */
export const publishableClients = (c: Content) => c.clients.filter((x) => x.publishable);
export const publishableReviews = (c: Content) => c.reviews.filter((x) => x.consent);
export const publishableWork = (c: Content) => c.work.filter((x) => x.consent);
export const publishableGallery = (c: Content) => c.gallery.filter((x) => x.consent);
/**
 * Work order, "photos first": /work/ comes off noindex once there is something
 * real to show, gallery singles or work[] pairs either one. This does not affect
 * the separate LAUNCH block on work[] being empty, which is a stricter bar
 * (before/after pairs specifically) that gallery singles do not satisfy.
 */
export const isWorkIndexable = (c: Content) => publishableGallery(c).length > 0 || publishableWork(c).length > 0;
export const answeredFaqs = <T extends { a: string | null }>(faqs: T[]) => faqs.filter((f) => f.a !== null);
export const yearsInBusiness = (c: Content) =>
  c.business.founded_year === null ? null : new Date().getFullYear() - c.business.founded_year;
export const isPending = (c: Content, path: string) =>
  c.provenance.pending_confirmation.some((p) => p.path === path);
