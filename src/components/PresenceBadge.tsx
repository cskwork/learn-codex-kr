"use client";

import { useEffect, useState } from "react";
import { getDeviceId } from "@/lib/device-id";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

type Variant = "compact" | "card";
type Props = { variant?: Variant; channel?: string };

export default function PresenceBadge({ variant = "compact", channel = "lck:global" }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const [mode, setMode] = useState<"realtime" | "estimate">("estimate");

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const estimate = 3 + Math.floor(Math.sin(Date.now() / 60000) * 2 + Math.random() * 4);
      setCount(Math.max(1, estimate));
      const t = window.setInterval(() => {
        setCount(Math.max(1, 3 + Math.floor(Math.sin(Date.now() / 60000) * 2 + Math.random() * 4)));
      }, 12000);
      return () => window.clearInterval(t);
    }
    const sb = getSupabase();
    if (!sb) return;
    const ch = sb.channel(channel, {
      config: { presence: { key: getDeviceId() } },
    });
    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState();
      const total = Object.keys(state).length;
      setMode("realtime");
      setCount(total);
    });
    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ joined_at: Date.now() });
      }
    });
    return () => {
      ch.unsubscribe();
    };
  }, [channel]);

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            mode === "realtime" ? "animate-pulse bg-emerald-400" : "bg-zinc-500"
          }`}
        />
        <span className="tabular-nums">
          {count ?? "—"}명
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          mode === "realtime" ? "animate-pulse bg-emerald-400" : "bg-zinc-500"
        }`}
      />
      <span className="tabular-nums">지금 {count ?? "—"}명 학습 중</span>
      {mode !== "realtime" && (
        <span className="text-[10px] text-zinc-500">(추정)</span>
      )}
    </div>
  );
}
