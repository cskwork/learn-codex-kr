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
import { AnswerField, Icon, SheetBand, Verdict, backLink, btnPrimary, btnSecondary } from "@/components/omr";

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
      <header className="flex flex-col gap-3">
        <Link href="/" className={backLink}>
          <Icon name="back" size={15} />홈
        </Link>
        <SheetBand left="4교시 · 경쟁" right="1분 단위 매치" />
        <h1 className="font-serif text-[2.2rem] font-extrabold tracking-[-0.02em] text-marker sm:text-[2.7rem]">
          레이스 모드
        </h1>
        <p className="text-[0.95rem] text-text-2">
          1분마다 새 매치가 열립니다. 같은 매치에 들어온 다른 학습자보다 빠르게 정답을 맞춰 보세요.
        </p>
      </header>
      <section className="flex flex-col gap-4 border-[1.5px] border-ink bg-paper p-5 sm:p-7">
        <p className="text-[0.95rem] leading-7 text-text">
          매치 슬롯은 1분 단위로 자동 생성됩니다. 입장 즉시 챌린지가 시작됩니다.
        </p>
        {!isSupabaseConfigured() && (
          <Notice>실시간 서버 미연결 — 지금은 혼자 기록을 재는 모드로 진행되고, 기록은 이 기기에 저장됩니다.</Notice>
        )}
        <button onClick={onJoin} className={`${btnPrimary} self-start`}>
          지금 매치 참가
          <Icon name="arrow" />
        </button>
      </section>
      <section className="border-[1.5px] border-ink">
        <h2 className="border-b-[1.5px] border-ink bg-ink-tint px-4 py-2 text-[0.8rem] font-bold text-ink-strong">규칙</h2>
        <ol className="divide-y divide-ink-line text-[0.92rem] text-text">
          {[
            "같은 매치 ID 안의 모든 참가자가 같은 챌린지를 받음",
            "가장 먼저 정답을 맞춘 사람부터 1, 2, 3등",
            "점수는 weekly_leaderboard 에 기록 (Supabase 연결 시)",
          ].map((r, i) => (
            <li key={r} className="grid grid-cols-[2rem_1fr] px-4 py-3">
              <span className="font-mono font-bold text-ink">{i + 1}.</span>
              {r}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 border-[1.5px] border-pen bg-pen-tint px-3 py-2 text-[0.85rem] leading-6 text-pen">
      <Icon name="info" size={16} className="mt-1" />
      <span>{children}</span>
    </p>
  );
}

function MatchHeader({ matchId, sub }: { matchId: string; sub: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-3">
      <Link href="/race" className={backLink}>
        <Icon name="back" size={15} />로비
      </Link>
      <SheetBand left="레이스 매치" right={matchId} />
      <h1 className="font-serif text-[1.9rem] font-extrabold text-marker">
        매치 <span className="font-mono text-ink">{matchId}</span>
      </h1>
      {sub}
    </header>
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
    <div className="flex flex-col gap-6">
      <MatchHeader
        matchId={matchId}
        sub={<Notice>실시간 서버 미연결 — 개인 기록으로만 저장됩니다.</Notice>}
      />
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
    <div className="flex flex-col gap-6">
      <MatchHeader
        matchId={matchId}
        sub={<p className="font-mono text-[0.85rem] text-text-2">{racers.length}명 참가 중</p>}
      />

      <section className="border-[1.5px] border-ink">
        <h2 className="border-b-[1.5px] border-ink bg-ink-tint px-4 py-2 text-[0.8rem] font-bold text-ink-strong">참가자</h2>
        <ol className="divide-y divide-ink-line text-[0.92rem]">
          {racers.length === 0 && <li className="px-4 py-3 text-text-2">접속 중...</li>}
          {racers.map((r, i) => (
            <li
              key={r.id}
              className={`flex items-center justify-between px-4 py-2 ${
                r.id === me ? "bg-paper-2 font-bold text-marker" : "text-text"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="w-6 text-right font-mono text-[0.8rem] text-ink">{i + 1}.</span>
                {r.name}
                {r.id === me && <span className="text-[0.72rem] text-ink">(나)</span>}
              </span>
              <span className="font-mono text-[0.85rem] tabular-nums">
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
    <section className="flex flex-col gap-4 border-[1.5px] border-ink bg-paper p-5 sm:p-7" aria-labelledby="race-q">
      <p className="font-mono text-[0.78rem] font-bold text-ink-strong">챌린지</p>
      <h2 id="race-q" className="font-serif text-[1.3rem] font-extrabold leading-snug text-marker sm:text-[1.5rem]">
        {challenge.prompt}
      </h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <AnswerField
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="명령 입력..."
          aria-label="명령 입력"
          disabled={done !== null}
        />
        {hint && done === null && <Verdict ok={false}>{challenge.hint}</Verdict>}
        <button type="submit" disabled={done !== null} className={`${btnPrimary} self-end`}>
          실행
        </button>
      </form>
    </section>
  );
}

function RaceResult({ timeMs, text }: { timeMs: number; text: string }) {
  return (
    <section role="status" className="flex flex-col items-start gap-3 border-[1.5px] border-marker bg-paper p-6">
      <span className="stamp-in inline-flex border-[2.5px] border-ink px-3 py-1 font-serif text-lg font-extrabold text-ink">
        {text}
      </span>
      <p className="font-mono text-6xl font-bold tabular-nums tracking-tight text-marker sm:text-7xl">
        {(timeMs / 1000).toFixed(2)}
        <span className="ml-1 text-2xl text-ink">s</span>
      </p>
      <div className="flex flex-wrap gap-2">
        <ShareButton text={`codex-tutorial 레이스에서 ${(timeMs / 1000).toFixed(2)}초!`} />
        <Link href="/leaderboard" className={btnSecondary}>
          랭킹 보기
        </Link>
      </div>
    </section>
  );
}
