import type { NextConfig } from "next";
import path from "node:path";

const isProd = process.env.NODE_ENV === "production";
const repoBase = "/learn-codex-kr";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? repoBase : undefined,
  assetPrefix: isProd ? `${repoBase}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
