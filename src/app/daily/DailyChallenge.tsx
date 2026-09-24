"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDailyChallenge, matchesChallenge } from "@/lib/challenges";
import { getDeviceId, getDisplayName } from "@/lib/device-id";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { recordLearningDay } from "@/lib/storage";
import { kstDay } from "@/lib/streak";
import { useProgress } from "@/lib/useProgress";
import StreakBadge from "@/components/StreakBadge";
import ShareButton from "@/components/ShareButton";
import { AnswerField, Icon, SheetBand, Verdict, backLink, btnPrimary } from "@/components/omr";

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
  const day = useMemo(() => kstDay(), []);
  const [answer, setAnswer] = useState("");
  const [done, setDone] = useState<DailyState | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    const prev = readLocal();
    if (prev?.day === day) setDone(prev);
  }, [day]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) {
      setHint("먼저 답란에 명령을 입력하세요.");
      return;
    }
    if (!matchesChallenge(challenge, answer)) {
      setHint(challenge.hint);
      return;
    }
    const ms = Date.now() - startRef.current;
    const state: DailyState = { day, timeMs: ms };
    writeLocal(state);
    recordLearningDay();
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
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Link href="/" className={backLink}>
          <Icon name="back" size={15} />홈
        </Link>
        <SheetBand left="2교시 · 습관" right={`KST ${day}`} />
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-[2.2rem] font-extrabold tracking-[-0.02em] text-marker sm:text-[2.7rem]">
            오늘의 챌린지
          </h1>
          <StreakBadge />
        </div>
        <p className="text-[0.95rem] text-text-2">KST {day} · 매일 자정에 새 챌린지가 열립니다.</p>
      </header>

      <section className="flex flex-col gap-5 border-[1.5px] border-ink bg-paper p-5 sm:p-7" aria-labelledby="daily-q">
        <p className="font-mono text-[0.78rem] font-bold text-ink-strong">주관식 · 1문항</p>
        <h2 id="daily-q" className="font-serif text-[1.35rem] font-extrabold leading-snug text-marker sm:text-[1.6rem]">
          {challenge.prompt}
        </h2>
        {done ? (
          <DoneScreen state={done} note={challenge.successNote} />
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <AnswerField
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="명령 입력..."
              aria-label="명령 입력"
            />
            {hint && <Verdict ok={false}>{hint}</Verdict>}
            <button className={`${btnPrimary} self-end`}>실행</button>
          </form>
        )}
      </section>

      <p className="text-center text-[0.78rem] text-text-2">
        스트릭은 자정 KST 기준으로 갱신됩니다. 레슨을 끝내거나 오늘의 챌린지를 풀면 하루가 채워집니다.
      </p>
    </div>
  );
}

function DoneScreen({ state, note }: { state: DailyState; note: string }) {
  const { streak } = useProgress();
  const seconds = (state.timeMs / 1000).toFixed(2);
  return (
    <div role="status" className="flex flex-col items-start gap-4 border-t-[1.5px] border-ink pt-5">
      <span className="stamp-in inline-flex border-[2.5px] border-ink px-3 py-1 font-serif text-xl font-extrabold text-ink">
        오늘 완료!
      </span>
      <p className="font-mono text-6xl font-bold tabular-nums tracking-tight text-marker sm:text-7xl">
        {seconds}
        <span className="ml-1 text-2xl text-ink">s</span>
      </p>
      <p className="text-[0.92rem] leading-7 text-text">{note}</p>
      <p className="text-[0.92rem] text-text-2">
        스트릭 <strong className="font-mono text-marker">{streak}</strong>일 · 내일 다시 오세요
      </p>
      <ShareButton
        text={`codex-tutorial 오늘의 챌린지를 ${seconds}초에 완료! 스트릭 ${streak}일째.`}
      />
    </div>
  );
}
