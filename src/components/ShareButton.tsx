"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/paths";
import { Icon, btnSecondary } from "./omr";

type Props = {
  text: string;
  url?: string;
  className?: string;
};

export default function ShareButton({ text, url, className }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function onClick() {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : `${SITE_URL}/`);
    const payload = `${text}\n${shareUrl}`;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ text, url: shareUrl, title: "codex-tutorial" });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // unsupported payload: fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(payload);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2500);
  }

  return (
    <button type="button" onClick={onClick} className={className ?? btnSecondary} aria-live="polite">
      <Icon name={state === "copied" ? "check" : "share"} size={16} />
      {state === "copied" ? "복사됨!" : state === "failed" ? "복사 실패 · 주소를 직접 복사하세요" : "공유하기"}
    </button>
  );
}
