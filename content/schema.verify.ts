import raw from "./kleen-stripe.json";
import { contentSchema, auditContent, parseContent, publishableReviews, publishableClients, yearsInBusiness } from "./schema";

const parsed = contentSchema.safeParse(raw);
if (!parsed.success) {
  console.log("SCHEMA PARSE FAILED");
  for (const i of parsed.error.issues) console.log("  -", i.path.join("."), ":", i.message);
  process.exit(1);
}
console.log("SCHEMA PARSE: ok");

const draftErrors = auditContent(parsed.data, "draft");
console.log("\nDRAFT audit:", draftErrors.length === 0 ? "clean" : draftErrors.length + " problems");
draftErrors.forEach(e => console.log("  -", e));

const launchErrors = auditContent(parsed.data, "launch");
console.log("\nLAUNCH audit:", launchErrors.length + " blockers (expected: it should refuse to ship)");
launchErrors.forEach((e,i) => console.log(`  ${i+1}. ${e}`));

console.log("\nRender gates:");
console.log("  publishable reviews:", publishableReviews(parsed.data).length, "of", parsed.data.reviews.length);
console.log("  publishable clients:", publishableClients(parsed.data).length, "of", parsed.data.clients.length);
console.log("  years in business (computed):", yearsInBusiness(parsed.data));
console.log("  routes:", 1 + Object.keys(parsed.data.pages).length - 1 + parsed.data.services.length + parsed.data.buyers.length + parsed.data.areas.filter(a=>a.page).length);

try { parseContent(raw, "launch"); console.log("\nPROBLEM: launch build passed. It should not."); }
catch { console.log("\nLaunch build correctly refuses to compile."); }
