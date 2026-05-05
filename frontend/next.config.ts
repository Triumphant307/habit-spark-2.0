import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["sia-reactor", "@t007/utils", "@t007/input", "@t007/toast"],
  // turbopack: {
  //   root: path.resolve(process.cwd(), ".."),
  // }, // dev-only
};

export default nextConfig;
