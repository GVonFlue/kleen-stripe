import type { MetadataRoute } from "next";
import { getAllRoutes } from "@/lib/routes";
import { IS_CANONICAL_HOST, absoluteUrl } from "@/lib/site";

/**
 * Built from the route registry, not hand-listed, so a new service or area in the
 * content file appears here without anyone editing this file. Non-indexable
 * routes are filtered rather than included with a low priority: /work/ comes off
 * noindex on its own once there are photos behind it (isWorkIndexable), and
 * /thank-you/ and /404.html never belong in a sitemap at all.
 *
 * Empty on a preview host, for the same reason robots.ts disallows everything
 * there.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!IS_CANONICAL_HOST) return [];

  return getAllRoutes()
    .filter((r) => r.indexable)
    .map((r) => ({
      url: absoluteUrl(r.path),
      changeFrequency: r.kind === "page" && r.path === "/" ? "weekly" : "monthly",
      priority: r.path === "/" ? 1 : r.kind === "service" ? 0.8 : 0.6,
    }));
}
