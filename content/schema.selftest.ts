/** Negative-test the auditor. A passing test that cannot fail is not a test. Doctrine section 7. */
import raw from "./kleen-stripe.json";
import { contentSchema, auditContent, copy, isWorkIndexable } from "./schema";

const base = contentSchema.parse(raw);
let failures = 0;
const check = (name: string, fn: () => boolean) => {
  const ok = fn();
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
};

console.log("Baseline draft audit is clean:", auditContent(base, "draft").length === 0);
console.log("\nInjecting violations:");

check("em-dash rejected", () => !copy().safeParse("A clean line, then a break, and more").success === false && !copy().safeParse("A clean line — then a break").success);
check("banned word 'cheap' rejected", () => !copy().safeParse("The cheap option").success);
check("banned word 'best' rejected", () => !copy().safeParse("The best crew in Kansas").success);
check("placeholder phone rejected", () => !copy().safeParse("Call 555-555-5555").success);
check("clean copy accepted", () => copy().safeParse("Straight lines, square corners, on your schedule.").success);

check("booking claim caught", () => {
  const c = structuredClone(base); (c.services[0] as any).lede = "Your slot is booked as soon as you call.";
  return auditContent(c, "draft").some(e => e.includes("booking_url"));
});
check("booking claim allowed once booking_url exists", () => {
  const c = structuredClone(base); (c.services[0] as any).lede = "Your slot is booked as soon as you call.";
  (c.endpoints as any).booking_url = "https://example-booking";
  return !auditContent(c, "draft").some(e => e.includes("booking_url"));
});
check("undeclared source tag caught", () => {
  const c = structuredClone(base); (c.services[0] as any).source_tag = "Kleen Stripe - Not Declared";
  return auditContent(c, "draft").some(e => e.includes("not declared"));
});
check("duplicate title caught", () => {
  const c = structuredClone(base); (c.services[1] as any).title = c.services[0].title;
  return auditContent(c, "draft").some(e => e.includes("Duplicate title"));
});
check("duplicate meta caught", () => {
  const c = structuredClone(base); (c.services[1] as any).meta_description = c.services[0].meta_description;
  return auditContent(c, "draft").some(e => e.includes("Duplicate meta"));
});
check("em-dash inside a homepage block is caught (blocks are z.any() at the schema level, so copy() alone never sees them)", () => {
  const c = structuredClone(base);
  (c.pages["/"].blocks as any)[0].sub = "No call center — you get Devin.";
  return auditContent(c, "draft").some(e => e.includes("blocks[0].sub") && e.includes("em-dash"));
});
check("banned word inside a homepage block is caught", () => {
  const c = structuredClone(base);
  (c.pages["/"].blocks as any)[0].sub = "The cheap way to stripe a lot.";
  return auditContent(c, "draft").some(e => e.includes("blocks[0].sub") && e.includes('banned word "cheap"'));
});
check("placeholder text inside a homepage block is caught", () => {
  const c = structuredClone(base);
  (c.pages["/"].blocks as any)[0].sub = "Call 555-555-5555 today.";
  return auditContent(c, "draft").some(e => e.includes("blocks[0].sub") && e.includes("placeholder text"));
});
check("a block-level annotation field (note) stays exempt from copy rules", () => {
  const c = structuredClone(base);
  (c.pages["/"].blocks as any)[0].note = "Internal only — never rendered.";
  return auditContent(c, "draft").length === 0;
});

check("isWorkIndexable is true today (gallery[] has consented singles)", () => isWorkIndexable(base));
check("isWorkIndexable is false with no consented gallery or work items", () => {
  const c: any = structuredClone(base);
  c.gallery = []; c.work = [];
  return !isWorkIndexable(c);
});
check("isWorkIndexable is false when gallery items exist but none are consented", () => {
  const c: any = structuredClone(base);
  c.gallery = c.gallery.map((g: any) => ({ ...g, consent: false }));
  c.work = [];
  return !isWorkIndexable(c);
});
check("isWorkIndexable is true from a work[] pair alone, with no gallery", () => {
  const c: any = structuredClone(base);
  c.gallery = [];
  c.work = [{ pair_id: "p1", lot_type: "Retail", before: { src: "/b.jpg", alt: "Faded retail lot" },
    after: { src: "/a.jpg", alt: "Freshly striped retail lot" }, caption: null, city: "Wichita", consent: true }];
  return isWorkIndexable(c);
});
check("non-consented gallery item blocks launch", () => {
  const c: any = structuredClone(base);
  c.gallery[0].consent = false;
  return auditContent(c, "launch").some(e => e.includes(`gallery[0] (${base.gallery[0].id})`) && e.includes("consent is false"));
});
check("consented gallery items do not block launch", () => !auditContent(base, "launch").some(e => e.startsWith("gallery[")));

check("non-consented review blocks launch", () => auditContent(base, "launch").some(e => e.includes("consent is false")));
check("consented review does not block launch", () => {
  const c = structuredClone(base); (c.reviews[0] as any).consent = true;
  return !auditContent(c, "launch").some(e => e.startsWith("reviews[0]"));
});
check("pending fact with null value caught", () => {
  const c = structuredClone(base); (c.business as any).founded_year = null;
  return auditContent(c, "draft").some(e => e.includes("provenance lists") && e.includes("the value is null"));
});
check("resolving everything lets launch through", () => {
  const c: any = structuredClone(base);
  c.provenance.pending_confirmation = []; c.provenance.conflicts_to_resolve = [];
  c.reviews[0].consent = true; c.lead_magnet.file = "/ada-checklist.pdf";
  c.work = [{ pair_id: "p1", lot_type: "Retail", before: { src: "/b.jpg", alt: "Faded retail lot" },
    after: { src: "/a.jpg", alt: "Freshly striped retail lot" }, caption: null, city: "Wichita", consent: true }];
  return auditContent(c, "launch").length === 0;
});

console.log(`\n${failures === 0 ? "All checks negative-tested and behaving." : failures + " AUDITOR BUG(S)."}`);
process.exit(failures === 0 ? 0 : 1);
