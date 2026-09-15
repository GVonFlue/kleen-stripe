import type { MetadataRoute } from "next";
import { IS_CANONICAL_HOST, absoluteUrl } from "@/lib/site";

/**
 * A preview deploy that a search engine can crawl is a competitor to the client's
 * own domain, built by us, for free. Every host that is not kleenstripe.com
 * refuses everything. See lib/site.ts for how that is decided.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_CANONICAL_HOST) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
