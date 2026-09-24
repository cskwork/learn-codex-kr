// Inlined at build time from next.config.ts (`env`).
const basePath = process.env.LCK_BASE_PATH ?? "";

/** Public site origin (+ base path) used for canonical, OG and share URLs. */
export const SITE_URL = (process.env.LCK_SITE_URL ?? "https://cskwork.github.io/learn-codex-kr").replace(/\/$/, "");

/** Prefix a root-relative asset path with the deploy base path (for plain <img>/<a> tags). */
export function withBase(p: string): string {
  if (!p.startsWith("/")) return p;
  return `${basePath}${p}`;
}
