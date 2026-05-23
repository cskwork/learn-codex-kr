import Link from "next/link";
import PresenceBadge from "@/components/PresenceBadge";
import StreakBadge from "@/components/StreakBadge";
import { allLessons } from "@/lib/lessons";

const productStats = [
  { value: "5", label: "핵심 레슨" },
  { value: "4", label: "실전 모드" },
  { value: "0", label: "회원가입" },
  { value: "5분", label: "첫 성공까지" },
];

const journey = [
  {
    step: "01",
    title: "목표 문장 완성",
    desc: "AI가 흔들리지 않게 문제, 완료 조건, 금지선을 한 문장으로 고정합니다.",
  },
  {
    step: "02",
    title: "3단계 작업 계획",
    desc: "조사 → 수정 → 확인으로 이어지는 작은 실행 단위를 직접 만듭니다.",
  },
  {
    step: "03",
    title: "검증 체크리스트",
    desc: "build, lint, 모바일, 콘솔처럼 놓치기 쉬운 확인 항목을 남깁니다.",
  },
];

const routes = [
  {
    href: "/lessons",
    eyebrow: "기본기",
    title: "레슨 라이브러리",
    desc: "처음 쓰는 사람도 순서대로 따라가면 30분 안에 전체 흐름을 잡습니다.",
    cta: "커리큘럼 보기",
  },
  {
    href: "/daily",
    eyebrow: "습관",
    title: "오늘의 챌린지",
    desc: "하루 하나, 5분짜리 문제로 프롬프트 감각과 검증 습관을 유지합니다.",
    cta: "오늘 문제 풀기",
  },
  {
    href: "/coop",
    eyebrow: "협업",
    title: "코업 모드",
    desc: "5자리 방 코드로 친구와 같은 과제를 풀며 좋은 지시문을 비교합니다.",
    cta: "방 만들기",
  },
  {
    href: "/race",
    eyebrow: "경쟁",
    title: "레이스 모드",
    desc: "가장 빠르게 문제를 이해하고 정확한 Codex 지시를 만드는 사람이 이깁니다.",
    cta: "레이스 참가",
  },
];

export default function Home() {
  const firstLesson = allLessons[0];
  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.20),transparent_32%),radial-gradient(circle_at_80%_12%,rgba(45,212,191,0.14),transparent_30%),linear-gradient(180deg,#050607_0%,#08090a_42%,#030404_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
        <div className="flex flex-col items-start gap-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              codex-tutorial · 한국어 Codex 훈련장
            </span>
            <PresenceBadge variant="card" />
            <StreakBadge />
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-zinc-50 sm:text-6xl lg:text-7xl">
              내 Mac을
              <span className="block bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                AI 코딩 작업장으로.
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              Codex CLI를 몰라도 됩니다. codex-tutorial은 브라우저에서 먼저 한국어 지시문을
              연습하게 해 주고, 5분 안에 목표·계획·검증 조건을 갖춘 첫 AI 코딩 루틴을
              완성하게 만듭니다.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={`/lessons/${firstLesson.slug}`}
              className="group inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_18px_45px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5 hover:bg-emerald-300"
            >
              5분 만에 첫 작업 성공하기
              <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
            </Link>
            <Link
              href="/daily"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-zinc-100 transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:bg-white/[0.06]"
            >
              무료 데모 문제 보기
            </Link>
          </div>

          <div className="w-full rounded-3xl border border-emerald-300/15 bg-emerald-300/[0.06] p-4 text-sm leading-6 text-emerald-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:max-w-2xl">
            <strong className="text-emerald-200">첫 레슨 결과물:</strong> 내 작업에 바로 복붙 가능한 <span className="text-white">목표 문장 + 3단계 계획 + 검증 체크리스트</span>를 만듭니다.
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {productStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <div className="text-2xl font-semibold tracking-tight text-zinc-50">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1">GitHub 오픈소스</span>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1">진행도 브라우저 저장</span>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1">Supabase 없어도 기본 학습 가능</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-400/20 via-teal-300/10 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/60 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.035] px-5 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-300/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-300/80" />
              </div>
              <span className="font-mono text-[11px] text-zinc-500">codex-tutorial/session</span>
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
                  5분 미니 데모
                </div>
                <p className="mt-2 text-lg font-medium leading-7 text-zinc-50">
                  문제 → 내 입력 → 피드백까지, 첫 화면에서 바로 맛봅니다.
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/60 p-4 font-mono text-sm leading-7 text-zinc-200">
                <div className="text-zinc-500"># 문제</div>
                <div>GitHub Pages 배포가 실패했다. Codex에게 어떻게 맡길까?</div>
                <div className="mt-3 text-zinc-500"># 내 입력</div>
                <div className="text-emerald-300">/goal 배포 실패 원인을 찾고 재발 방지 체크를 남겨줘</div>
                <div className="text-cyan-200">/verify pnpm build && GitHub Actions 로그 확인</div>
                <div className="mt-3 text-zinc-500"># 피드백</div>
                <div className="text-emerald-200">✓ 좋은 지시입니다. 목표와 검증 기준이 함께 들어갔어요.</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {journey.map((item) => (
                  <div key={item.step} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <div className="font-mono text-xs text-emerald-300">{item.step}</div>
                    <h3 className="mt-3 text-sm font-semibold text-zinc-100">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="group flex min-h-56 flex-col justify-between rounded-3xl border border-white/[0.08] bg-zinc-950/70 p-5 transition hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-white/[0.045]"
              >
                <div>
                  <span className="text-xs font-semibold text-emerald-300">{route.eyebrow}</span>
                  <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-50">
                    {route.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{route.desc}</p>
                </div>
                <span className="mt-8 inline-flex items-center text-sm font-medium text-zinc-200 group-hover:text-emerald-200">
                  {route.cta} <span className="ml-1 transition group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.035] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            왜 상품처럼 느껴지나
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            “배우기”가 아니라 “내일 바로 쓰는 루틴”을 팝니다.
          </h2>
          <p className="mt-5 text-sm leading-7 text-zinc-400">
            단순 문서가 아니라 매일 돌아올 이유가 있는 학습 제품입니다. 스트릭, 리더보드,
            코업, 레이스가 있어서 혼자 공부하다 멈추는 문제를 줄입니다.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ValueCard title="초보자 진입 장벽 제거" desc="회원가입 없이 브라우저에서 바로 시작. 어려운 설치 설명보다 첫 성공 경험을 먼저 줍니다." />
          <ValueCard title="한국어 맥락 최적화" desc="영어 문서를 번역한 느낌이 아니라 한국 개발자가 실제로 말하는 작업 지시 패턴으로 구성했습니다." />
          <ValueCard title="실전 검증 습관" desc="/verify를 레슨 흐름에 녹여서 결과 확인 없이 AI에게 맡기는 위험한 습관을 막습니다." />
          <ValueCard title="공유 가능한 성장 루프" desc="오늘의 챌린지, 레이스 기록, 스트릭 결과를 공유하면서 재방문 동기가 생깁니다." />
        </div>
      </section>
    </div>
  );
}

function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-zinc-950/70 p-6 transition hover:border-emerald-300/25 hover:bg-white/[0.04]">
      <div className="mb-4 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.9)]" />
      <h3 className="text-base font-semibold text-zinc-50">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{desc}</p>
    </div>
  );
}
