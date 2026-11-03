import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every route in content/kleen-stripe.json ends with a slash.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // Next's default is WebP only. AVIF first, WebP as the fallback negotiation
  // still picks whichever the requesting browser actually supports.
  images: { formats: ["image/avif", "image/webp"] },
  // Pins the workspace root to this repo. Without it Turbopack looks for the
  // nearest lockfile above the repo and warns that it found one outside git.
  turbopack: { root: __dirname },
  // The previous kleenstripe.com was a flat .html site, and Google still has
  // those addresses indexed (confirmed in search results, Nov 2026). Without
  // these, anyone clicking an old result lands on a 404 and the rankings those
  // pages earned are thrown away. Permanent, so search engines move the credit
  // to the new page instead of dropping it. Add any other old path that shows
  // up in Search Console's "Not found" report here.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about/", permanent: true },
      { source: "/contact.html", destination: "/contact/", permanent: true },
      { source: "/services.html", destination: "/services/", permanent: true },
    ];
  },
};

export default nextConfig;
