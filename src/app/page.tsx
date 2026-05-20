export const metadata = {
  title: "learn-codex-kr · Codex CLI 한국어 인터랙티브 학습",
  description:
    "OpenAI Codex CLI를 한국어로 인터랙티브하게 배우는 멀티플레이어 학습 사이트. 모바일 친화.",
};

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-300">
          공사 중 · Story 1 Bootstrap
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          learn-codex-kr
        </h1>
        <p className="max-w-md text-base text-zinc-400 sm:text-lg">
          OpenAI Codex CLI를 한국어로 함께 배우는 멀티플레이어 인터랙티브
          학습 사이트.
        </p>
      </div>

      <ol className="grid w-full max-w-sm gap-3 text-sm text-zinc-300">
        <li className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <span className="text-emerald-400">1.</span> 짧은 인터랙티브 레슨으로 핵심 워크플로 익히기
        </li>
        <li className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <span className="text-emerald-400">2.</span> 친구와 코업/레이스로 챌린지 풀기
        </li>
        <li className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <span className="text-emerald-400">3.</span> 리더보드 + 일일 챌린지로 꾸준히
        </li>
      </ol>

      <p className="text-xs text-zinc-500">
        곧 첫 레슨이 공개됩니다. 모바일에서 열어 보세요.
      </p>
    </main>
  );
}
