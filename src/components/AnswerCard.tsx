"use client";

import Link from "next/link";
import type { Lesson } from "@/lib/lessons";
import { nextLessonSlug } from "@/lib/streak";
import { useProgress } from "@/lib/useProgress";
import { Oval, TimingTrack } from "./omr";

type LessonSummary = Pick<Lesson, "slug" | "order" | "title" | "estMinutes"> & { stepCount: number };

/** Home hero: the visitor's own answer card. Lessons are 문항, filled ovals are finished lessons. */
export default function AnswerCard({ lessons }: { lessons: LessonSummary[] }) {
  const { ready, done } = useProgress();
  const next = ready ? nextLessonSlug(lessons, done) : lessons[0]?.slug;
  const doneCount = lessons.filter((l) => done.has(l.slug)).length;

  return (
    <div className="relative border-[1.5px] border-ink bg-paper shadow-[0_18px_40px_-24px_rgba(163,22,63,0.45)]">
      <div className="grid grid-cols-[auto_1fr]">
        <TimingTrack
          vertical
          total={lessons.length + 4}
          done={lessons.length + 4}
          className="justify-between border-r-[1.5px] border-ink px-1.5 py-3"
        />
        <div>
          <div className="flex items-baseline justify-between gap-3 border-b-[1.5px] border-ink bg-ink-tint px-4 py-2.5">
            <span className="font-serif text-[1.05rem] font-extrabold text-ink-strong">답안지 · Codex CLI</span>
            <span className="font-mono text-[0.72rem] text-ink-strong">컴퓨터용 사인펜만 사용</span>
          </div>

          <dl className="grid grid-cols-4 border-b-[1.5px] border-ink text-center">
            {[
              ["레슨", "5"],
              ["모드", "4"],
              ["회원가입", "0"],
              ["첫 성공", "5분"],
            ].map(([k, v]) => (
              <div key={k} className="border-r-[1.5px] border-ink-line last:border-r-0">
                <dt className="border-b border-ink-line py-1 text-[0.68rem] font-bold text-ink-strong">{k}</dt>
                <dd className="py-1.5 font-mono text-lg font-bold text-marker">{v}</dd>
              </div>
            ))}
          </dl>

          <ol aria-label="레슨 진행 현황">
            {lessons.map((l) => {
              const isDone = done.has(l.slug);
              const isNext = l.slug === next;
              return (
                <li key={l.slug} className="border-b border-ink-line last:border-b-0">
                  <Link
                    href={`/lessons/${l.slug}`}
                    className={`group grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 px-3 py-2.5 transition-colors hover:bg-ink-tint ${
                      isNext ? "bg-paper-2" : ""
                    }`}
                  >
                    <span className="font-mono text-sm font-bold text-ink-strong">{String(l.order).padStart(2, "0")}</span>
                    <span className="min-w-0">
                      <span className="block text-[0.9rem] leading-snug font-bold text-marker group-hover:text-ink-strong">
                        {l.title}
                      </span>
                      <span className="block text-[0.72rem] text-text-2">
                        {isDone ? "완료" : isNext ? "다음 문항" : `${l.estMinutes}분`}
                      </span>
                    </span>
                    <span className="flex gap-1" aria-label={isDone ? "완료" : "미완료"}>
                      {Array.from({ length: Math.min(l.stepCount, 5) }, (_, i) => (
                        <Oval key={i} size={12} filled={isDone} />
                      ))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="border-t-[1.5px] border-ink">
            <div className="flex items-center justify-between border-b border-ink-line bg-ink-tint px-4 py-1.5 text-[0.72rem] font-bold text-ink-strong">
              <span>주관식 답란 · 예시</span>
              <span className="font-mono font-normal">
                {ready ? `${doneCount} / ${lessons.length} 완료` : " "}
              </span>
            </div>
            <div className="space-y-2 px-4 py-3 font-mono text-[0.82rem] leading-6">
              <p className="text-text-2">GitHub Pages 배포가 실패했다. Codex에게 어떻게 맡길까?</p>
              <p className="text-marker">
                <span className="text-ink">$ </span>/goal 배포 실패 원인을 찾고 재발 방지 체크를 남겨줘
              </p>
              <p className="text-marker">
                <span className="text-ink">$ </span>/verify pnpm build && GitHub Actions 로그 확인
              </p>
              <p className="flex items-start gap-2 pt-1 font-sans text-[0.8rem] text-marker">
                <span className="mt-0.5 inline-flex flex-none bg-marker px-1.5 py-0.5 font-mono text-[0.68rem] font-bold text-paper">
                  판독
                </span>
                좋은 지시입니다. 목표와 검증 기준이 함께 들어갔어요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
