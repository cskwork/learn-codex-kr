"use client";

import { useEffect, useState } from "react";
import { getStreak, type StreakState } from "@/lib/storage";

export default function StreakBadge() {
  const [streak, setStreak] = useState<StreakState | null>(null);
  useEffect(() => {
    setStreak(getStreak());
  }, []);
  if (!streak || streak.current === 0) return null;
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
      <span aria-hidden>🔥</span>
      <span className="tabular-nums">{streak.current}일 연속</span>
      {streak.best > streak.current && (
        <span className="text-[10px] text-amber-400/70">최고 {streak.best}일</span>
      )}
    </div>
  );
}
