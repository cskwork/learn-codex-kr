import Link from "next/link";
import PresenceBadge from "@/components/PresenceBadge";
import StreakBadge from "@/components/StreakBadge";
import { allLessons } from "@/lib/lessons";

export default function Home() {
  const firstLesson = allLessons[0];
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
      <section className="flex flex-col items-center gap-5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <PresenceBadge variant="card" />
          <StreakBadge />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
          Codex CLI를{" "}
          <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
            한국어로
          </span>{" "}
          5분에 배우기
        </h1>
        <p className="max-w-md text-sm text-zinc-400 sm:text-base">
          OpenAI Codex CLI 핵심 워크플로를 짧은 인터랙티브 레슨으로 익히고,
          친구와 코업/레이스 챌린지로 실전 연습. 회원가입 없음, 모바일 친화.
        </p>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row">
          <Link
            href={`/lessons/${firstLesson.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            지금 5분만 시작하기 →
          </Link>
          <Link
            href="/lessons"
            className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-3 text-sm text-zinc-200 transition hover:bg-zinc-900"
          >
            레슨 라이브러리
          </Link>
        </div>
        <p className="text-[11px] text-zinc-600">
          진행도는 브라우저에 자동 저장됩니다.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          step="1"
          title="짧은 레슨"
          desc="`codex`, `/goal`, `/plan`, `/verify` 같은 핵심 명령을 5–10분 단위로 익힙니다."
        />
        <FeatureCard
          step="2"
          title="코업 / 레이스"
          desc="친구와 같은 챌린지를 함께 풀거나, 더 빠른 프롬프트로 경쟁."
        />
        <FeatureCard
          step="3"
          title="일일 챌린지 + 랭킹"
          desc="매일 새 챌린지, 스트릭 카운터, 주간 리더보드로 꾸준히."
        />
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-zinc-100">
          이렇게 생긴 레슨이에요
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          첫 단계는 직접 명령을 입력합니다. 한 줄짜리지만 진짜 Codex 흐름과 같습니다.
        </p>
        <div className="mt-4 rounded-xl border border-zinc-800 bg-black/60 p-4 font-mono text-xs leading-relaxed text-zinc-200 sm:text-sm">
          <div className="text-zinc-500"># 질문</div>
          <div>Codex CLI 인터랙티브 세션을 시작하는 가장 기본 명령은?</div>
          <div className="mt-3 text-zinc-500"># 입력</div>
          <div className="text-emerald-400">
            $ <span className="animate-pulse">codex_</span>
          </div>
          <div className="mt-3 text-zinc-500"># 응답</div>
          <div className="text-emerald-300">
            ✓ 정답. `codex` 한 단어면 인터랙티브 세션이 시작됩니다.
          </div>
        </div>
        <div className="mt-5">
          <Link
            href={`/lessons/${firstLesson.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-300 hover:text-emerald-200"
          >
            첫 레슨 시작하기 →
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <RouteCard
          href="/coop"
          title="코업 모드"
          desc="친구 1명과 함께 같은 챌린지를 풀어요. 초대 링크 한 줄."
        />
        <RouteCard
          href="/race"
          title="레이스 모드"
          desc="공개 로비에서 가장 빠른 프롬프트로 챌린지 정답까지."
        />
        <RouteCard
          href="/daily"
          title="오늘의 챌린지"
          desc="매일 하나, 5분짜리. 스트릭으로 매일 돌아오게."
        />
        <RouteCard
          href="/leaderboard"
          title="주간 리더보드"
          desc="이번 주 가장 빠른 학습자."
        />
      </section>
    </div>
  );
}

function FeatureCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <span className="text-xs font-semibold text-emerald-400">STEP {step}</span>
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      <p className="text-xs leading-relaxed text-zinc-400">{desc}</p>
    </div>
  );
}

function RouteCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-emerald-500/40 hover:bg-zinc-900/70"
    >
      <span className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-200">
        {title} →
      </span>
      <span className="text-xs text-zinc-400">{desc}</span>
    </Link>
  );
}
