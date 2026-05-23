"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDailyChallenge, matchesChallenge } from "@/lib/challenges";
import { getDeviceId, getDisplayName } from "@/lib/device-id";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { getStreak } from "@/lib/storage";
import StreakBadge from "@/components/StreakBadge";
import ShareButton from "@/components/ShareButton";

function todayKstISO(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

const STORAGE_KEY = "lck.daily";

type DailyState = { day: string; timeMs: number };

function readLocal(): DailyState | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
  } catch {
    return null;
  }
}

function writeLocal(s: DailyState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export default function DailyChallenge() {
  const challenge = useMemo(() => getDailyChallenge(), []);
  const day = todayKstISO();
  const [answer, setAnswer] = useState("");
  const [done, setDone] = useState<DailyState | null>(null);
  const [hint, setHint] = useState(false);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    const prev = readLocal();
    if (prev?.day === day) setDone(prev);
  }, [day]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!matchesChallenge(challenge, answer)) {
      setHint(true);
      return;
    }
    const ms = Date.now() - startRef.current;
    const state: DailyState = { day, timeMs: ms };
    writeLocal(state);
    setDone(state);
    if (isSupabaseConfigured()) {
      const sb = getSupabase();
      if (sb) {
        await sb
          .from("daily_challenge_completions")
          .upsert(
            {
              device_id: getDeviceId(),
              display_name: getDisplayName(),
              challenge_day: day,
              time_ms: ms,
            },
            { onConflict: "device_id,challenge_day" }
          )
          .then(() => {}, () => {});
      }
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <header>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← 홈
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">오늘의 챌린지</h1>
          <StreakBadge />
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          KST {day} · 매일 자정에 새 챌린지가 열립니다.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="text-sm leading-relaxed text-zinc-100">{challenge.prompt}</p>
        {done ? (
          <DoneScreen state={done} note={challenge.successNote} />
        ) : (
          <>
            {hint && (
              <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-200">
                힌트: {challenge.hint}
              </p>
            )}
            <form onSubmit={submit} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/60 px-3 py-2 font-mono text-sm">
                <span className="text-emerald-400">$</span>
                <input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="명령 입력..."
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-600"
                />
              </div>
              <button className="self-end rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950">
                실행
              </button>
            </form>
          </>
        )}
      </section>

      <p className="text-center text-[11px] text-zinc-600">
        스트릭은 자정 KST 기준으로 갱신됩니다.
      </p>
    </div>
  );
}

function DoneScreen({ state, note }: { state: DailyState; note: string }) {
  const streak = getStreak();
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
      <span className="text-3xl">🔥</span>
      <h2 className="text-lg font-bold text-emerald-100">오늘 완료!</h2>
      <p className="font-mono text-2xl text-emerald-200">
        {(state.timeMs / 1000).toFixed(2)}s
      </p>
      <p className="text-xs text-emerald-200/80">{note}</p>
      <p className="text-xs text-zinc-300">
        스트릭 <strong>{streak.current}</strong>일 · 내일 다시 오세요
      </p>
      <ShareButton text={`codex-tutorial 오늘의 챌린지를 ${(state.timeMs / 1000).toFixed(2)}초에 완료! 스트릭 ${streak.current}일째.`} />
    </div>
  );
}
