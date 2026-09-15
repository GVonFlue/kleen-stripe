import { content } from "@/lib/content";

/**
 * Where this deployment thinks it lives, and whether it is allowed to be indexed.
 *
 * The audit pass found the site running on a vercel.app preview with no canonical
 * tags, no sitemap and no robots rules, while kleenstripe.com is a real domain
 * with real rankings. That combination is how a preview deploy ends up competing
 * with the client's own site in search, and it is a much easier problem to avoid
 * than to unwind.
 *
 * So indexability is derived, not declared. The only host that gets indexed is
 * business.domains.primary, with or without a www. Everything else, every preview
 * URL, every branch deploy, localhost, gets a site-wide noindex and a robots file
 * that disallows the lot. Nobody has to remember to flip a flag before sharing a
 * link, and nobody has to remember to flip it back at cutover either: pointing the
 * real domain at the deployment is what turns indexing on.
 *
 * Order of resolution:
 *   NEXT_PUBLIC_SITE_ORIGIN   explicit, set this at cutover
 *   VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL   whatever Vercel says we are
 *   localhost                 dev
 */
const PRIMARY_DOMAIN = content.business.domains.primary;

function resolveOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_ORIGIN;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const SITE_ORIGIN = resolveOrigin();

export const SITE_HOST = (() => {
  try {
    return new URL(SITE_ORIGIN).host.toLowerCase();
  } catch {
    return "";
  }
})();

/** True only on the client's own domain. Every preview host is false. */
export const IS_CANONICAL_HOST =
  SITE_HOST === PRIMARY_DOMAIN || SITE_HOST === `www.${PRIMARY_DOMAIN}`;

/** Absolute URL for a site-relative path, for canonicals, sitemap and JSON-LD. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_ORIGIN}/`).toString();
}
