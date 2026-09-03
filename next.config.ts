import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every route in content/kleen-stripe.json ends with a slash.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // Pins the workspace root to this repo. Without it Turbopack looks for the
  // nearest lockfile above the repo and warns that it found one outside git.
  turbopack: { root: __dirname },
};

export default nextConfig;
