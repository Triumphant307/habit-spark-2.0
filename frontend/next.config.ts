import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["sia-reactor", "@t007/input", "@t007/toast", "@t007/utils"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/:path*", // Proxy to Backend
      },
    ];
  },
  turbopack: {
    root: path.resolve(process.cwd(), ".."),
  }, // dev-only
};

export default nextConfig;
