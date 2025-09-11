import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during prod build to avoid blocking build by style issues
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Keep TS type-checking in build (fail fast on real type issues)
  typescript: {
    ignoreBuildErrors: false,
  },

  reactStrictMode: true,

  // Images from Django media (served through your domain)
  images: {
    remotePatterns: [
      // production via domain (http during self-signed, later https with real cert)
      {
        protocol: "http",
        hostname: "wircino.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "wircino.com",
        port: "",
        pathname: "/media/**",
      },
      // local/dev fallbacks (optional)
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
    ],
    // If you hit image optimization issues in Docker, temporarily:
    // unoptimized: true,
  },
};

export default nextConfig;
