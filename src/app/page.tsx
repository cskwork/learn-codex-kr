import Link from "next/link";
import AnswerCard from "@/components/AnswerCard";
import PresenceBadge from "@/components/PresenceBadge";
import ResumeLink from "@/components/ResumeLink";
import StreakBadge from "@/components/StreakBadge";
import { Icon, SheetBand, btnSecondary } from "@/components/omr";
import { allLessons } from "@/lib/lessons";
import { withBase } from "@/lib/paths";

const rubric = [
  {
    step: "1",
    title: "목표 문장 완성",
    desc: "AI가 흔들리지 않게 문제, 완료 조건, 금지선을 한 문장으로 고정합니다.",
  },
  {
    step: "2",
    title: "3단계 작업 계획",
    desc: "조사 → 수정 → 확인으로 이어지는 작은 실행 단위를 직접 만듭니다.",
  },
  {
    step: "3",
    title: "검증 체크리스트",
    desc: "build, lint, 모바일, 콘솔처럼 놓치기 쉬운 확인 항목을 남깁니다.",
  },
];

const periods = [
  {
    period: "1교시",
    href: "/lessons",
    kind: "기본기",
    title: "레슨 라이브러리",
    desc: "처음 쓰는 사람도 순서대로 따라가면 30분 안에 전체 흐름을 잡습니다.",
    cta: "커리큘럼 보기",
  },
  {
    period: "2교시",
    href: "/daily",
    kind: "습관",
    title: "오늘의 챌린지",
    desc: "하루 하나, 5분짜리 문제로 프롬프트 감각과 검증 습관을 유지합니다.",
    cta: "오늘 문제 풀기",
  },
  {
    period: "3교시",
    href: "/coop",
    kind: "협업",
    title: "코업 모드",
    desc: "5자리 방 코드로 친구와 같은 과제를 풀며 좋은 지시문을 비교합니다.",
    cta: "방 만들기",
  },
  {
    period: "4교시",
    href: "/race",
    kind: "경쟁",
    title: "레이스 모드",
    desc: "가장 빠르게 문제를 이해하고 정확한 Codex 지시를 만드는 사람이 이깁니다.",
    cta: "레이스 참가",
  },
];

const notes = [
  {
    title: "초보자 진입 장벽 제거",
    desc: "회원가입 없이 브라우저에서 바로 시작. 어려운 설치 설명보다 첫 성공 경험을 먼저 줍니다.",
  },
  {
    title: "한국어 맥락 최적화",
    desc: "영어 문서를 번역한 느낌이 아니라 한국 개발자가 실제로 말하는 작업 지시 패턴으로 구성했습니다.",
  },
  {
    title: "실전 검증 습관",
    desc: "/verify를 레슨 흐름에 녹여서 결과 확인 없이 AI에게 맡기는 위험한 습관을 막습니다.",
  },
  {
    title: "공유 가능한 성장 루프",
    desc: "오늘의 챌린지, 레이스 기록, 스트릭 결과를 공유하면서 재방문 동기가 생깁니다.",
  },
];

export default function Home() {
  const lessons = allLessons.map((l) => ({
    slug: l.slug,
    order: l.order,
    title: l.title,
    estMinutes: l.estMinutes,
    stepCount: l.steps.length,
  }));

  return (
    <div>
      {/* First viewport: exam paper header + the visitor's own answer card */}
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-24">
        <div className="flex flex-col gap-7">
          <SheetBand left="Codex CLI 실전 연습 · 제1교시" right="한국어 · 회원가입 없음" />

          <h1 className="font-serif text-[2.6rem] font-extrabold leading-[1.12] tracking-[-0.03em] text-marker sm:text-6xl lg:text-[4.1rem]">
            내 Mac을
            <br />
            AI 코딩 <span className="text-ink">작업장</span>으로.
          </h1>

          <p className="max-w-[38rem] text-[1.02rem] leading-8 text-text">
            Codex CLI를 몰라도 됩니다. codex-tutorial은 브라우저에서 먼저 한국어 지시문을 연습하게
            해 주고, 5분 안에 목표·계획·검증 조건을 갖춘 첫 AI 코딩 루틴을 완성하게 만듭니다.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ResumeLink lessons={lessons} />
            <Link href="/daily" className={btnSecondary}>
              무료 데모 문제 보기
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StreakBadge />
            <PresenceBadge variant="card" />
          </div>

          <div className="max-w-[38rem] border-[1.5px] border-dashed border-ink-line px-4 py-3 text-[0.92rem] leading-7">
            <strong className="text-ink-strong">첫 레슨 결과물 · </strong>
            내 작업에 바로 복붙 가능한{" "}
            <strong className="text-marker">목표 문장 + 3단계 계획 + 검증 체크리스트</strong>를 만듭니다.
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.82rem] text-text-2">
            {["GitHub 오픈소스", "진행도 브라우저 저장", "Supabase 없어도 기본 학습 가능"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Icon name="check" size={15} className="text-ink" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:pt-2">
          <AnswerCard lessons={lessons} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase("/art/marker-pen.webp")}
            alt=""
            width={1100}
            height={567}
            className="pointer-events-none absolute -bottom-10 -right-2 w-[58%] max-w-[340px] rotate-[8deg] mix-blend-multiply sm:-right-8"
            fetchPriority="low"
          />
        </div>
      </section>

      {/* 채점 기준: what lesson one grades */}
      <section className="border-y-[1.5px] border-ink bg-ink-tint/60">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <h2 className="font-serif text-3xl font-extrabold leading-tight text-marker sm:text-[2.4rem]">
              첫 레슨에서 채점하는 세 가지
            </h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-7 text-text-2">
              문제 → 내 입력 → 피드백까지, 첫 화면에서 바로 맛봅니다. 답을 입력하면 즉시 판독합니다.
            </p>
          </div>
          <ol className="grid border-[1.5px] border-ink bg-paper sm:grid-cols-3">
            {rubric.map((item) => (
              <li
                key={item.step}
                className="border-b-[1.5px] border-ink p-5 last:border-b-0 sm:border-b-0 sm:border-r-[1.5px] sm:last:border-r-0"
              >
                <span className="oval h-9 w-7 text-sm font-bold">
                  <span>{item.step}</span>
                </span>
                <h3 className="mt-4 text-base font-bold text-marker">{item.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-6 text-text-2">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 시간표: the four ways to practise */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-serif text-3xl font-extrabold text-marker sm:text-[2.4rem]">
          네 가지 방식으로 연습합니다
        </h2>
        <div className="mt-8 border-[1.5px] border-ink">
          <div className="hidden grid-cols-[6rem_7rem_1fr_10rem] border-b-[1.5px] border-ink bg-ink-tint text-[0.75rem] font-bold text-ink-strong md:grid">
            <span className="border-r border-ink-line px-4 py-2">교시</span>
            <span className="border-r border-ink-line px-4 py-2">영역</span>
            <span className="border-r border-ink-line px-4 py-2">과목</span>
            <span className="px-4 py-2">시작</span>
          </div>
          <ul>
            {periods.map((p) => (
              <li key={p.href} className="border-b border-ink-line last:border-b-0">
                <Link
                  href={p.href}
                  className="group grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 px-4 py-5 transition-colors hover:bg-ink-tint md:grid-cols-[6rem_7rem_1fr_10rem] md:items-center md:gap-0 md:px-0 md:py-0"
                >
                  <span className="font-mono text-sm font-bold text-ink-strong md:self-stretch md:border-r md:border-ink-line md:px-4 md:py-6">
                    {p.period}
                  </span>
                  <span className="text-[0.8rem] font-bold text-ink md:self-stretch md:border-r md:border-ink-line md:px-4 md:py-6">
                    {p.kind}
                  </span>
                  <span className="col-span-2 md:col-span-1 md:self-stretch md:border-r md:border-ink-line md:px-4 md:py-5">
                    <span className="block font-serif text-xl font-extrabold text-marker">{p.title}</span>
                    <span className="mt-1 block max-w-[34rem] text-[0.9rem] leading-6 text-text-2">{p.desc}</span>
                  </span>
                  <span className="col-span-2 mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-marker group-hover:text-ink-strong md:col-span-1 md:mt-0 md:px-4">
                    {p.cta}
                    <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 수험생 유의사항 */}
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-8 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h2 className="font-serif text-3xl font-extrabold leading-tight text-marker sm:text-[2.4rem]">
            “배우기”가 아니라
            <br />
            “내일 바로 쓰는 루틴”.
          </h2>
          <p className="mt-5 max-w-md text-[0.95rem] leading-7 text-text-2">
            단순 문서가 아니라 매일 돌아올 이유가 있는 학습 제품입니다. 스트릭, 리더보드, 코업,
            레이스가 있어서 혼자 공부하다 멈추는 문제를 줄입니다.
          </p>
          <div className="mt-8">
            <ResumeLink lessons={lessons} />
          </div>
        </div>
        <div className="border-[1.5px] border-ink">
          <p className="border-b-[1.5px] border-ink bg-ink-tint px-4 py-2 text-[0.8rem] font-bold text-ink-strong">
            수험생 유의사항
          </p>
          <ol className="divide-y divide-ink-line">
            {notes.map((n, i) => (
              <li key={n.title} className="grid grid-cols-[2rem_1fr] gap-3 px-4 py-4">
                <span className="font-mono text-sm font-bold text-ink">{i + 1}.</span>
                <span>
                  <span className="block font-bold text-marker">{n.title}</span>
                  <span className="mt-1 block text-[0.9rem] leading-6 text-text-2">{n.desc}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
