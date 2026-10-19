import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    // Keep previews that cached the old file-convention URLs working.
    return [
      { source: "/opengraph-image.jpg", destination: "/og-en.jpg", permanent: true },
      { source: "/twitter-image.jpg", destination: "/og-en.jpg", permanent: true },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
