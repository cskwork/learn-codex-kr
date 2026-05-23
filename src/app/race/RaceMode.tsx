"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { RACE_CHALLENGES, matchesChallenge } from "@/lib/challenges";
import { getDeviceId, getDisplayName } from "@/lib/device-id";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { recordRaceScore } from "@/lib/storage";
import ShareButton from "@/components/ShareButton";

type Racer = { id: string; name: string; finishedMs?: number };

function todaysMatchSlot(): string {
  const d = new Date();
  const slot = Math.floor(d.getTime() / (60 * 1000));
  return `r-${slot}`;
}

function pickChallengeForMatch(matchId: string) {
  const idx = Math.abs(hashStr(matchId)) % RACE_CHALLENGES.length;
  return RACE_CHALLENGES[idx];
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

export default function RaceMode() {
  const search = useSearchParams();
  const router = useRouter();
  const matchId = search?.get("match");

  if (!matchId) return <Lobby onJoin={() => router.push(`/race?match=${todaysMatchSlot()}`)} />;
  if (!isSupabaseConfigured())
    return <SoloRace matchId={matchId} />;

  return <RealRace matchId={matchId} />;
}

function Lobby({ onJoin }: { onJoin: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← 홈
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">레이스 모드</h1>
        <p className="mt-1 text-sm text-zinc-400">
          1분마다 새 매치가 열립니다. 같은 매치에 들어온 다른 학습자보다 빠르게 정답을 맞춰 보세요.
        </p>
      </header>
      <section className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="text-sm text-zinc-300">
          매치 슬롯은 1분 단위로 자동 생성됩니다. 입장 즉시 챌린지가 시작됩니다.
        </p>
        <button
          onClick={onJoin}
          className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          지금 매치 참가 →
        </button>
      </section>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 text-xs text-zinc-400">
        <h2 className="text-sm font-semibold text-zinc-100">규칙</h2>
        <ul className="mt-2 list-disc pl-5">
          <li>같은 매치 ID 안의 모든 참가자가 같은 챌린지를 받음</li>
          <li>가장 먼저 정답을 맞춘 사람부터 1, 2, 3등</li>
          <li>점수는 weekly_leaderboard 에 기록 (Supabase 연결 시)</li>
        </ul>
      </section>
    </div>
  );
}

function SoloRace({ matchId }: { matchId: string }) {
  const challenge = useMemo(() => pickChallengeForMatch(matchId), [matchId]);
  const startRef = useRef<number>(Date.now());
  const [answer, setAnswer] = useState("");
  const [done, setDone] = useState<number | null>(null);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!matchesChallenge(challenge, answer)) {
      setHint(true);
      return;
    }
    const ms = Date.now() - startRef.current;
    setDone(ms);
    recordRaceScore({
      matchId,
      lessonSlug: challenge.id,
      timeMs: ms,
      finishedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <Link href="/race" className="text-xs text-zinc-500 hover:text-zinc-300">
            ← 로비
          </Link>
          <h1 className="mt-1 text-xl font-bold tracking-tight">
            매치 <span className="font-mono text-emerald-300">{matchId}</span>
          </h1>
          <p className="text-xs text-amber-300">실시간 서버 미연결 — 개인 기록으로만 저장됩니다.</p>
        </div>
      </header>
      <RaceQuestion
        challenge={challenge}
        answer={answer}
        setAnswer={setAnswer}
        hint={hint}
        onSubmit={submit}
        done={done}
      />
      {done !== null && <RaceResult timeMs={done} text="혼자 모드 기록" />}
    </div>
  );
}

function RealRace({ matchId }: { matchId: string }) {
  const challenge = useMemo(() => pickChallengeForMatch(matchId), [matchId]);
  const [racers, setRacers] = useState<Racer[]>([]);
  const [answer, setAnswer] = useState("");
  const [done, setDone] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const chanRef = useRef<RealtimeChannel | null>(null);
  const startRef = useRef<number>(Date.now());
  const me = useMemo(() => getDeviceId(), []);

  useEffect(() => {
    startRef.current = Date.now();
    const sb = getSupabase();
    if (!sb) return;
    const ch = sb.channel(`race:${matchId}`, {
      config: { presence: { key: me } },
    });
    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState() as Record<
        string,
        { name: string; finishedMs?: number }[]
      >;
      const next: Racer[] = Object.entries(state).map(([id, metas]) => ({
        id,
        name: metas[0]?.name ?? "익명",
        finishedMs: metas[0]?.finishedMs,
      }));
      next.sort((a, b) => {
        const af = a.finishedMs ?? Infinity;
        const bf = b.finishedMs ?? Infinity;
        return af - bf;
      });
      setRacers(next);
    });
    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ name: getDisplayName(), joined_at: Date.now() });
      }
    });
    chanRef.current = ch;
    return () => {
      ch.unsubscribe();
    };
  }, [matchId, me]);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (done !== null) return;
      if (!matchesChallenge(challenge, answer)) {
        setHint(true);
        return;
      }
      const ms = Date.now() - startRef.current;
      setDone(ms);
      recordRaceScore({
        matchId,
        lessonSlug: challenge.id,
        timeMs: ms,
        finishedAt: new Date().toISOString(),
      });
      const ch = chanRef.current;
      if (ch) {
        await ch.track({ name: getDisplayName(), finishedMs: ms });
      }
    },
    [challenge, answer, done, matchId]
  );

  const rank =
    done === null
      ? null
      : racers.filter((r) => (r.finishedMs ?? Infinity) <= done).length;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <Link href="/race" className="text-xs text-zinc-500 hover:text-zinc-300">
            ← 로비
          </Link>
          <h1 className="mt-1 text-xl font-bold tracking-tight">
            매치 <span className="font-mono text-emerald-300">{matchId}</span>
          </h1>
          <p className="text-xs text-zinc-500">{racers.length}명 참가 중</p>
        </div>
      </header>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">참가자</h3>
        <ol className="mt-2 flex flex-col gap-1 text-sm">
          {racers.map((r, i) => (
            <li
              key={r.id}
              className={`flex items-center justify-between rounded px-2 py-1 ${
                r.id === me ? "bg-emerald-500/10 text-emerald-100" : "text-zinc-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-5 text-right text-xs text-zinc-500">{i + 1}.</span>
                {r.name}
              </span>
              <span className="font-mono text-xs">
                {r.finishedMs !== undefined ? `${(r.finishedMs / 1000).toFixed(2)}s` : "..."}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <RaceQuestion
        challenge={challenge}
        answer={answer}
        setAnswer={setAnswer}
        hint={hint}
        onSubmit={submit}
        done={done}
      />

      {done !== null && (
        <RaceResult
          timeMs={done}
          text={rank ? `이번 매치 ${rank}등!` : "결과 집계 중..."}
        />
      )}
    </div>
  );
}

function RaceQuestion({
  challenge,
  answer,
  setAnswer,
  hint,
  onSubmit,
  done,
}: {
  challenge: { prompt: string; hint: string };
  answer: string;
  setAnswer: (v: string) => void;
  hint: boolean;
  onSubmit: (e: React.FormEvent) => void;
  done: number | null;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h2 className="text-sm font-semibold text-emerald-400">챌린지</h2>
      <p className="text-sm leading-relaxed text-zinc-100">{challenge.prompt}</p>
      {hint && done === null && (
        <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-200">
          힌트: {challenge.hint}
        </p>
      )}
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/60 px-3 py-2 font-mono text-sm">
          <span className="text-emerald-400">$</span>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="명령 입력..."
            disabled={done !== null}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-600 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={done !== null}
          className="self-end rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-40"
        >
          실행
        </button>
      </form>
    </section>
  );
}

function RaceResult({ timeMs, text }: { timeMs: number; text: string }) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
      <h3 className="text-lg font-bold text-emerald-200">{text}</h3>
      <p className="font-mono text-3xl text-emerald-100">{(timeMs / 1000).toFixed(2)}s</p>
      <ShareButton text={`codex-tutorial 레이스에서 ${(timeMs / 1000).toFixed(2)}초!`} />
    </section>
  );
}
