"use client";

import { useEffect, useState } from "react";
import { getDeviceId } from "@/lib/device-id";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

type Variant = "compact" | "card";
type Props = { variant?: Variant; channel?: string };

/**
 * Live learner count from Supabase presence. Without a realtime server we show
 * nothing rather than an invented number.
 */
export default function PresenceBadge({ variant = "compact", channel = "lck:global" }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const sb = getSupabase();
    if (!sb) return;
    const ch = sb.channel(channel, {
      config: { presence: { key: getDeviceId() } },
    });
    ch.on("presence", { event: "sync" }, () => {
      setCount(Object.keys(ch.presenceState()).length);
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

  if (count === null) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono tabular-nums text-text-2 ${
        variant === "card" ? "border-[1.5px] border-ink-line px-2.5 py-1 text-[0.8rem]" : "text-[0.72rem]"
      }`}
    >
      <span aria-hidden className="inline-block h-2 w-2 bg-ink motion-safe:animate-pulse" />
      {variant === "card" ? `지금 ${count}명 학습 중` : `${count}명`}
    </span>
  );
}
