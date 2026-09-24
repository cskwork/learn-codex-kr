"use client";

import { useProgress } from "@/lib/useProgress";
import { Icon } from "./omr";

/** Consecutive learning days (KST). Hidden until there is a live streak. */
export default function StreakBadge({ compact = false }: { compact?: boolean }) {
  const { ready, streak, best } = useProgress();
  if (!ready || streak === 0) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 border-[1.5px] border-marker bg-paper font-bold text-marker ${
        compact ? "px-2 py-0.5 text-[0.72rem]" : "px-2.5 py-1 text-[0.8rem]"
      }`}
      aria-label={`연속 학습 ${streak}일${best > streak ? `, 최고 ${best}일` : ""}`}
    >
      <Icon name="flame" size={compact ? 13 : 15} className="text-ink" />
      <span className="font-mono tabular-nums">{streak}일 연속</span>
      {!compact && best > streak && (
        <span className="font-mono text-[0.7rem] font-normal text-text-2">최고 {best}일</span>
      )}
    </span>
  );
}
