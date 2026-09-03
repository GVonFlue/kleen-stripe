import { content } from "@/lib/content";

/**
 * The route registry. Every indexable and non-indexable route the site serves,
 * built from content rather than hand-listed, so a new service or area in the
 * content file shows up here without a code change. Used by [slug]/page.tsx,
 * and later by the sitemap and the scripts.
 */
export type RouteEntry =
  | { kind: "page"; path: string; indexable: boolean }
  | { kind: "service"; slug: string; path: string; indexable: boolean }
  | { kind: "buyer"; slug: string; path: string; indexable: boolean }
  | { kind: "area"; slug: string; path: string; indexable: boolean };

export function getAllRoutes(): RouteEntry[] {
  const routes: RouteEntry[] = [];

  for (const [path, page] of Object.entries(content.pages)) {
    if (path === "/404.html") continue; // not-found.tsx owns this, it is not a real route
    routes.push({ kind: "page", path, indexable: page.indexable !== false });
  }
  for (const s of content.services) {
    routes.push({ kind: "service", slug: s.slug, path: `/${s.slug}/`, indexable: true });
  }
  for (const b of content.buyers) {
    routes.push({ kind: "buyer", slug: b.slug, path: `/${b.slug}/`, indexable: true });
  }
  for (const a of content.areas) {
    if (a.page && a.slug) routes.push({ kind: "area", slug: a.slug, path: `/${a.slug}/`, indexable: true });
  }

  return routes;
}
