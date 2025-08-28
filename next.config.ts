import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // اجازهٔ لود تصاویر از بک‌اند جنگو در لوکال
    remotePatterns: [
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
    // اگر موقتاً می‌خواهی راحت تست کنی، می‌تونی این خط رو به‌جای remotePatterns بذاری:
    // unoptimized: true,
  },
};

export default nextConfig;
