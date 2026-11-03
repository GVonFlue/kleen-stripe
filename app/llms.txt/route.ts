import { content } from "@/lib/content";
import { IS_CANONICAL_HOST, absoluteUrl } from "@/lib/site";

/**
 * /llms.txt, a plain-language description of the business for any machine that
 * reads the site. A young convention, not a standard, and cheap to publish.
 *
 * Built from content/kleen-stripe.json and nothing else, same rule as the
 * JSON-LD: every line here is something an assistant may repeat to a customer,
 * so only facts Devin has confirmed (provenance.confirmed_by_client) go in.
 * founded_year, owner_since and generation are still pending confirmation and
 * are left out on purpose; add them back once they leave
 * provenance.pending_confirmation. Nothing in this file addresses or instructs
 * an AI system. It states facts and nothing else.
 *
 * Empty on preview hosts, like the sitemap.
 */
export const dynamic = "force-static";

export function GET() {
  if (!IS_CANONICAL_HOST) {
    return new Response("", { status: 404 });
  }

  const b = content.business;
  const home = content.pages["/"];
  const local = content.areas.filter((a) => !a.travel_market);
  const travel = content.areas.filter((a) => a.travel_market);
  // First sentence only: the rest of the home description carries the founding
  // year, which is still pending Devin's confirmation.
  const summary = (home.meta_description ?? "").split(". ")[0].replace(/\.?$/, ".");

  const lines: string[] = [
    `# ${b.name}`,
    "",
    `> ${summary}`,
    "",
    "## What we do",
    ...content.services.map((s) => `- [${s.name}](${absoluteUrl(`/${s.slug}/`)}): ${s.lede}`),
    "",
    "## Who we work for",
    ...content.buyers.map((x) => `- [${x.label}](${absoluteUrl(`/${x.slug}/`)})`),
    "",
    "## Where we work",
    b.service_area_statement,
    "",
    ...local.map((a) =>
      a.page && a.slug ? `- [${a.city}, ${a.state}](${absoluteUrl(`/${a.slug}/`)})` : `- ${a.city}, ${a.state}`,
    ),
    ...travel.map((a) => `- ${a.city}, ${a.state} (travel)`),
    "",
    "## Contact",
    `- Phone: ${b.phone_display}${b.sms_enabled ? " (call or text)" : ""}`,
    `- Email: ${b.email}`,
    `- Quote requests: ${absoluteUrl("/contact/")}`,
    "",
    "## Key pages",
    `- Services: ${absoluteUrl("/services/")}`,
    `- Service area: ${absoluteUrl("/service-areas/")}`,
    `- Work photos: ${absoluteUrl("/work/")}`,
    `- About: ${absoluteUrl("/about/")}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
