import type { NextConfig } from "next";
import path from "node:path";

const isProd = process.env.NODE_ENV === "production";
const onVercel = Boolean(process.env.VERCEL);

// GitHub Pages serves the export under /learn-codex-kr; Vercel serves it at the root.
const basePath =
  process.env.LCK_BASE_PATH ?? (isProd && !onVercel ? "/learn-codex-kr" : "");

const siteUrl =
  process.env.LCK_SITE_URL ??
  (onVercel && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://cskwork.github.io/learn-codex-kr");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    LCK_BASE_PATH: basePath,
    LCK_SITE_URL: siteUrl,
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
