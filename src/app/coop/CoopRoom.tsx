"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { COOP_CHALLENGES, matchesChallenge, type Challenge } from "@/lib/challenges";
import { getDeviceId, getDisplayName, setDisplayName } from "@/lib/device-id";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { AnswerField, Icon, SheetBand, Verdict, backLink, btnPrimary, btnSecondary } from "@/components/omr";

type Member = { id: string; name: string };
type ChatLine = { from: string; name: string; text: string; at: number };
type Solved = { by: string; name: string; at: number; challengeId: string };

function makeRoomId(): string {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

export default function CoopRoom() {
  const router = useRouter();
  const search = useSearchParams();
  const roomId = (search?.get("room") ?? "").toUpperCase();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(getDisplayName());
  }, []);

  if (!roomId) return <Lobby onCreate={(id) => router.push(`/coop?room=${id}`)} />;
  if (!isSupabaseConfigured()) return <SoloCoop roomId={roomId} />;

  return <Room roomId={roomId} initialName={name} />;
}

function Lobby({ onCreate }: { onCreate: (id: string) => void }) {
  const [joinId, setJoinId] = useState("");
  const live = isSupabaseConfigured();
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Link href="/" className={backLink}>
          <Icon name="back" size={15} />홈
        </Link>
        <SheetBand left="3교시 · 협업" right="2인 1조" />
        <h1 className="font-serif text-[2.2rem] font-extrabold tracking-[-0.02em] text-marker sm:text-[2.7rem]">
          코업 모드
        </h1>
        <p className="text-[0.95rem] text-text-2">
          친구 1명과 함께 같은 Codex 챌린지를 해결합니다. 방을 만들고 링크를 공유하세요.
        </p>
        {!live && <OfflineNotice />}
      </header>

      <section className="flex flex-col gap-3 border-[1.5px] border-ink bg-paper p-5 sm:p-6">
        <h2 className="font-serif text-xl font-extrabold text-marker">방 만들기</h2>
        <p className="text-[0.9rem] text-text-2">5자리 랜덤 방 코드가 생성됩니다. URL을 친구에게 공유하세요.</p>
        <button onClick={() => onCreate(makeRoomId())} className={`${btnPrimary} self-start`}>
          {live ? "새 방 만들기" : "코업 문제 혼자 풀기"}
          <Icon name="arrow" />
        </button>
      </section>

      <section className="flex flex-col gap-3 border-[1.5px] border-ink bg-paper p-5 sm:p-6">
        <h2 className="font-serif text-xl font-extrabold text-marker">친구가 만든 방에 들어가기</h2>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (joinId.length >= 4) onCreate(joinId);
          }}
        >
          <label className="sr-only" htmlFor="room-code">방 코드</label>
          <input
            id="room-code"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
            placeholder="방 코드 (예: A4F2X)"
            autoCapitalize="characters"
            autoComplete="off"
            className="min-h-11 min-w-0 flex-1 border-[1.5px] border-ink bg-paper px-3 font-mono uppercase tracking-[0.2em] text-marker outline-none focus:border-marker"
          />
          <button type="submit" disabled={joinId.length < 4} className={btnSecondary}>
            입장
          </button>
        </form>
      </section>
    </div>
  );
}

function OfflineNotice() {
  return (
    <div className="flex items-start gap-2 border-[1.5px] border-pen bg-pen-tint px-3 py-2 text-[0.85rem] leading-6 text-pen">
      <Icon name="info" size={16} className="mt-1" />
      <span>
        지금은 실시간 코업 서버가 연결되어 있지 않아요. 같은 코업 문제를 혼자 풀어 볼 수 있고, 진행은 이
        기기에만 남습니다.
      </span>
    </div>
  );
}

/** Offline fallback: work through the co-op challenges alone instead of hitting a dead end. */
function SoloCoop({ roomId }: { roomId: string }) {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<null | { ok: boolean; msg: string }>(null);
  const challenge = COOP_CHALLENGES[idx];
  const isLast = idx === COOP_CHALLENGES.length - 1;
  const [finished, setFinished] = useState(false);

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) {
      setResult({ ok: false, msg: "먼저 답란에 명령을 입력하세요." });
      return;
    }
    setResult(
      matchesChallenge(challenge, answer)
        ? { ok: true, msg: challenge.successNote }
        : { ok: false, msg: challenge.hint }
    );
  }

  function next() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIdx((i) => i + 1);
    setAnswer("");
    setResult(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Link href="/coop" className={backLink}>
          <Icon name="back" size={15} />코업 로비
        </Link>
        <SheetBand left="코업 · 혼자 연습" right={`방 ${roomId}`} />
        <h1 className="font-serif text-[1.9rem] font-extrabold text-marker">코업 문제 혼자 풀기</h1>
        <OfflineNotice />
      </header>

      {finished ? (
        <section role="status" className="flex flex-col items-start gap-4 border-[1.5px] border-marker bg-paper p-6">
          <span className="stamp-in inline-flex border-[2.5px] border-ink px-3 py-1 font-serif text-xl font-extrabold text-ink">
            완료
          </span>
          <p className="text-[0.95rem] text-text">코업 문제 {COOP_CHALLENGES.length}개를 모두 풀었어요.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/race" className={btnPrimary}>
              레이스로 기록 재기
              <Icon name="arrow" />
            </Link>
            <Link href="/lessons" className={btnSecondary}>
              레슨 보기
            </Link>
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-4 border-[1.5px] border-ink bg-paper p-5 sm:p-7" aria-labelledby="coop-q">
          <p className="font-mono text-[0.78rem] font-bold text-ink-strong">
            챌린지 {idx + 1} / {COOP_CHALLENGES.length}
          </p>
          <h2 id="coop-q" className="font-serif text-[1.3rem] font-extrabold leading-snug text-marker sm:text-[1.5rem]">
            {challenge.prompt}
          </h2>
          <form onSubmit={check} className="flex flex-col gap-3">
            <AnswerField
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="명령을 입력..."
              aria-label="명령 입력"
              readOnly={result?.ok === true}
            />
            {result && <Verdict ok={result.ok}>{result.msg}</Verdict>}
            {result?.ok ? (
              <button type="button" onClick={next} className={`${btnPrimary} self-end`}>
                {isLast ? "완료" : "다음 챌린지"}
                <Icon name="arrow" />
              </button>
            ) : (
              <button type="submit" className={`${btnPrimary} self-end`}>
                실행
              </button>
            )}
          </form>
        </section>
      )}

      <details className="border-[1.5px] border-ink-line px-4 py-3 text-[0.85rem] text-text-2">
        <summary className="cursor-pointer font-bold text-ink-strong">운영자용: 실시간 코업 켜는 방법</summary>
        <ol className="ml-5 mt-3 list-decimal space-y-1">
          <li>
            <a className="underline" href="https://supabase.com" target="_blank" rel="noreferrer">
              supabase.com
            </a>{" "}
            프로젝트 만들기 (무료)
          </li>
          <li>SQL Editor에서 <code className="font-mono">supabase/migrations/0001_init.sql</code> 실행</li>
          <li>
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> 를 배포 환경 변수에 추가
          </li>
          <li>재배포</li>
        </ol>
      </details>
    </div>
  );
}

function Room({ roomId, initialName }: { roomId: string; initialName: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [chat, setChat] = useState<ChatLine[]>([]);
  const [msg, setMsg] = useState("");
  const [name, setNameLocal] = useState(initialName);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [solved, setSolved] = useState<Solved | null>(null);
  const [answer, setAnswer] = useState("");
  const [hintShown, setHintShown] = useState(false);
  const [copied, setCopied] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const me = useMemo(() => getDeviceId(), []);

  const challenge: Challenge = COOP_CHALLENGES[challengeIdx];

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    const ch = sb.channel(`coop:${roomId}`, {
      config: { presence: { key: me } },
    });

    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState() as Record<
        string,
        { name: string; joined_at: number }[]
      >;
      const list: Member[] = Object.entries(state).map(([id, metas]) => ({
        id,
        name: metas[0]?.name ?? "익명",
      }));
      setMembers(list);
    });

    ch.on("broadcast", { event: "chat" }, ({ payload }) => {
      setChat((c) => [...c, payload as ChatLine].slice(-50));
    });

    ch.on("broadcast", { event: "solved" }, ({ payload }) => {
      setSolved(payload as Solved);
    });

    ch.on("broadcast", { event: "next" }, ({ payload }) => {
      setChallengeIdx((payload as { idx: number }).idx);
      setSolved(null);
      setAnswer("");
      setHintShown(false);
    });

    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ name: getDisplayName(), joined_at: Date.now() });
      }
    });

    channelRef.current = ch;
    return () => {
      ch.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId, me]);

  const send = useCallback(
    (text: string) => {
      const ch = channelRef.current;
      if (!ch || !text.trim()) return;
      const line: ChatLine = {
        from: me,
        name: name || "익명",
        text: text.trim().slice(0, 200),
        at: Date.now(),
      };
      ch.send({ type: "broadcast", event: "chat", payload: line });
      setChat((c) => [...c, line].slice(-50));
    },
    [me, name]
  );

  function attempt() {
    if (!matchesChallenge(challenge, answer)) {
      setHintShown(true);
      return;
    }
    const ch = channelRef.current;
    const payload: Solved = {
      by: me,
      name: name || "익명",
      at: Date.now(),
      challengeId: challenge.id,
    };
    setSolved(payload);
    ch?.send({ type: "broadcast", event: "solved", payload });
  }

  function next() {
    const ch = channelRef.current;
    const nextIdx = (challengeIdx + 1) % COOP_CHALLENGES.length;
    setChallengeIdx(nextIdx);
    setSolved(null);
    setAnswer("");
    setHintShown(false);
    ch?.send({ type: "broadcast", event: "next", payload: { idx: nextIdx } });
  }

  const inviteUrl =
    typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?room=${roomId}` : "";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Link href="/coop" className={backLink}>
          <Icon name="back" size={15} />코업 로비
        </Link>
        <SheetBand left="코업 방" right={`${members.length} / 2명`} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-[1.9rem] font-extrabold text-marker">
            방 <span className="font-mono tracking-[0.15em] text-ink">{roomId}</span>
          </h1>
          <button
            onClick={() => {
              navigator.clipboard.writeText(inviteUrl).then(
                () => setCopied(true),
                () => setCopied(false)
              );
            }}
            className={btnSecondary}
          >
            <Icon name={copied ? "check" : "copy"} size={16} />
            {copied ? "복사됨!" : "초대 링크 복사"}
          </button>
        </div>
      </header>

      <section className="flex items-center gap-3 border-[1.5px] border-ink bg-paper px-4 py-2 text-[0.92rem]">
        <label htmlFor="coop-name" className="font-bold text-ink-strong">이름</label>
        <input
          id="coop-name"
          value={name}
          onChange={(e) => {
            setNameLocal(e.target.value);
            setDisplayName(e.target.value);
          }}
          className="min-h-10 min-w-0 flex-1 bg-transparent px-2 text-marker outline-none"
          maxLength={24}
        />
        <div className="flex -space-x-1.5">
          {members.map((m) => (
            <span
              key={m.id}
              title={m.name}
              className={`grid h-8 w-7 place-items-center rounded-full border-[1.5px] text-[0.7rem] font-bold ${
                m.id === me ? "border-marker bg-marker text-paper" : "border-ink bg-paper text-ink"
              }`}
            >
              {m.name.slice(0, 1)}
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 border-[1.5px] border-ink bg-paper p-5 sm:p-7" aria-labelledby="coop-live-q">
        <div className="flex items-center justify-between font-mono text-[0.78rem] font-bold text-ink-strong">
          <span>챌린지 {challengeIdx + 1}</span>
          <span className="font-normal text-text-2">{challenge.id}</span>
        </div>
        <h2 id="coop-live-q" className="font-serif text-[1.3rem] font-extrabold leading-snug text-marker">
          {challenge.prompt}
        </h2>
        {hintShown && !solved && <Verdict ok={false}>{challenge.hint}</Verdict>}
        {solved ? (
          <div className="flex flex-col gap-3">
            <Verdict ok>
              <strong>{solved.name}</strong> 님이 정답을 맞췄어요! · {challenge.successNote}
            </Verdict>
            <button onClick={next} className={`${btnPrimary} self-start`}>
              다음 챌린지
              <Icon name="arrow" />
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              attempt();
            }}
            className="flex flex-col gap-3"
          >
            <AnswerField
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="명령을 입력..."
              aria-label="명령 입력"
            />
            <button type="submit" className={`${btnPrimary} self-end`}>
              실행
            </button>
          </form>
        )}
      </section>

      <section className="flex flex-col border-[1.5px] border-ink">
        <h3 className="border-b-[1.5px] border-ink bg-ink-tint px-4 py-2 text-[0.8rem] font-bold text-ink-strong">방 채팅</h3>
        <ol className="flex max-h-56 flex-col gap-1 overflow-y-auto px-4 py-3 text-[0.9rem]" aria-live="polite">
          {chat.length === 0 && <li className="text-text-2">아직 메시지가 없어요.</li>}
          {chat.map((c, i) => (
            <li key={i} className={c.from === me ? "text-marker" : "text-text"}>
              <strong className={c.from === me ? "text-ink" : ""}>{c.name}:</strong> {c.text}
            </li>
          ))}
        </ol>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(msg);
            setMsg("");
          }}
          className="flex border-t-[1.5px] border-ink"
        >
          <label htmlFor="coop-msg" className="sr-only">메시지</label>
          <input
            id="coop-msg"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="메시지..."
            maxLength={200}
            className="min-h-11 min-w-0 flex-1 bg-paper px-4 text-marker outline-none"
          />
          <button className="border-l-[1.5px] border-ink bg-marker px-4 text-sm font-bold text-paper hover:bg-ink-strong">전송</button>
        </form>
      </section>
    </div>
  );
}
