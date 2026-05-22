"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { COOP_CHALLENGES, matchesChallenge, type Challenge } from "@/lib/challenges";
import { getDeviceId, getDisplayName, setDisplayName } from "@/lib/device-id";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

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
  if (!isSupabaseConfigured())
    return <NotConfigured kind="코업" roomId={roomId} />;

  return <Room roomId={roomId} initialName={name} />;
}

function Lobby({ onCreate }: { onCreate: (id: string) => void }) {
  const [joinId, setJoinId] = useState("");
  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← 홈
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">코업 모드</h1>
        <p className="mt-1 text-sm text-zinc-400">
          친구 1명과 함께 같은 Codex 챌린지를 해결합니다. 방을 만들고 링크를 공유하세요.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-semibold text-zinc-100">방 만들기</h2>
        <p className="text-xs text-zinc-400">
          5자리 랜덤 방 코드가 생성됩니다. URL을 친구에게 공유하세요.
        </p>
        <button
          onClick={() => onCreate(makeRoomId())}
          className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          새 방 만들기 →
        </button>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-semibold text-zinc-100">친구가 만든 방에 들어가기</h2>
        <div className="flex gap-2">
          <input
            value={joinId}
            onChange={(e) => setJoinId(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="방 코드 (예: A4F2X)"
            className="flex-1 rounded-lg border border-zinc-800 bg-black/50 px-3 py-2 text-sm uppercase tracking-wider text-zinc-100 outline-none focus:border-emerald-500/50"
          />
          <button
            disabled={joinId.length < 4}
            onClick={() => onCreate(joinId)}
            className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-white disabled:opacity-40"
          >
            입장
          </button>
        </div>
      </section>
    </div>
  );
}

function NotConfigured({ kind, roomId }: { kind: string; roomId: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm text-amber-100">
      <h2 className="text-base font-semibold">{kind} 서버가 아직 연결되지 않았어요</h2>
      <p>
        방 코드 <span className="font-mono">{roomId}</span> 는 만들 수 있지만,
        실시간 동기화는 Supabase 설정이 필요합니다.
      </p>
      <ol className="ml-4 list-decimal text-xs text-amber-200/90">
        <li>
          <a className="underline" href="https://supabase.com" target="_blank" rel="noreferrer">
            supabase.com
          </a>{" "}
          프로젝트 만들기 (무료)
        </li>
        <li>SQL Editor에서 <code>supabase/migrations/0001_init.sql</code> 실행</li>
        <li>
          <code>.env.local</code> 에 <code>NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> 채우기
        </li>
        <li>GitHub Actions secrets 에 동일 변수 추가 후 재배포</li>
      </ol>
      <Link href="/" className="mt-2 self-start rounded-full bg-amber-200 px-4 py-1.5 text-xs font-semibold text-amber-900">
        홈으로 돌아가기
      </Link>
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
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <Link href="/coop" className="text-xs text-zinc-500 hover:text-zinc-300">
            ← 코업 로비
          </Link>
          <h1 className="mt-1 text-xl font-bold tracking-tight">
            방 <span className="font-mono text-emerald-300">{roomId}</span>
          </h1>
          <p className="text-xs text-zinc-500">{members.length} / 2명</p>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(inviteUrl)}
          className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
        >
          초대 링크 복사
        </button>
      </header>

      <section className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-sm">
        <span className="text-zinc-500">이름:</span>
        <input
          value={name}
          onChange={(e) => {
            setNameLocal(e.target.value);
            setDisplayName(e.target.value);
          }}
          className="flex-1 rounded bg-transparent px-2 py-1 text-zinc-100 outline-none"
          maxLength={24}
        />
        <div className="flex -space-x-2">
          {members.map((m) => (
            <span
              key={m.id}
              title={m.name}
              className={`grid h-7 w-7 place-items-center rounded-full border-2 border-zinc-900 text-[10px] font-bold ${
                m.id === me ? "bg-emerald-500/30 text-emerald-100" : "bg-zinc-700 text-zinc-100"
              }`}
            >
              {m.name.slice(0, 1)}
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-400">챌린지 {challengeIdx + 1}</span>
          <span className="text-[11px] text-zinc-500">{challenge.id}</span>
        </div>
        <p className="text-sm leading-relaxed text-zinc-200">{challenge.prompt}</p>
        {hintShown && !solved && (
          <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-200">
            힌트: {challenge.hint}
          </p>
        )}
        {solved ? (
          <div className="flex flex-col gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            <span>
              <strong>{solved.name}</strong> 님이 정답을 맞췄어요! · {challenge.successNote}
            </span>
            <button
              onClick={next}
              className="self-start rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-zinc-950"
            >
              다음 챌린지 →
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              attempt();
            }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/60 px-3 py-2 font-mono text-sm">
              <span className="text-emerald-400">$</span>
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="명령을 입력..."
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-600"
              />
            </div>
            <button
              type="submit"
              className="self-end rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950"
            >
              실행
            </button>
          </form>
        )}
      </section>

      <section className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          방 채팅
        </h3>
        <ol className="flex max-h-48 flex-col gap-1 overflow-y-auto text-xs">
          {chat.length === 0 && (
            <li className="text-zinc-600">아직 메시지가 없어요.</li>
          )}
          {chat.map((c, i) => (
            <li key={i} className={c.from === me ? "text-emerald-200" : "text-zinc-300"}>
              <strong>{c.name}:</strong> {c.text}
            </li>
          ))}
        </ol>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(msg);
            setMsg("");
          }}
          className="flex gap-2"
        >
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="메시지..."
            maxLength={200}
            className="flex-1 rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/40"
          />
          <button className="rounded-full bg-zinc-700 px-3 py-2 text-xs text-zinc-100">전송</button>
        </form>
      </section>
    </div>
  );
}
