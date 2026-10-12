import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @baa/core ships TypeScript source; Next compiles it.
  transpilePackages: ["@baa/core"],
  // Self-contained server bundle for the Cloud Run container (M1).
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  turbopack: { root: path.join(__dirname, "../..") },
};

export default nextConfig;
