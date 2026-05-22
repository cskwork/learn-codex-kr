"use client";

import { useState } from "react";

type Props = {
  text: string;
  url?: string;
  className?: string;
};

export default function ShareButton({ text, url, className }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    url ??
    (typeof window !== "undefined"
      ? window.location.href
      : "https://cskwork.github.io/learn-codex-kr/");

  async function onClick() {
    const payload = `${text}\n${shareUrl}`;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ text, url: shareUrl, title: "learn-codex-kr" });
        return;
      } catch {
        // user cancelled or unsupported, fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ??
        "rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
      }
    >
      {copied ? "복사됨!" : "공유하기"}
    </button>
  );
}
