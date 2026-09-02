import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every route in content/kleen-stripe.json ends with a slash.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
