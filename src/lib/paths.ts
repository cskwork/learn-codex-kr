const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/learn-codex-kr" : "";

export function withBase(p: string): string {
  if (!p.startsWith("/")) return p;
  return `${basePath}${p}`;
}
