"use client";

import Link from "next/link";
import type { Lesson } from "@/lib/lessons";
import { nextLessonSlug } from "@/lib/streak";
import { useProgress } from "@/lib/useProgress";
import { Icon, Oval, TimingTrack, btnPrimary } from "@/components/omr";

type Props = { lessons: Lesson[] };

export default function LessonsLibrary({ lessons }: Props) {
  const { ready, done } = useProgress();
  const nextSlug = ready ? nextLessonSlug(lessons, done) : lessons[0]?.slug;
  const next = lessons.find((l) => l.slug === nextSlug);
  const doneCount = lessons.filter((l) => done.has(l.slug)).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-[1.5px] border-ink bg-paper-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-[0.9rem] font-bold text-marker" aria-live="polite">
            {ready ? `${lessons.length}개 중 ${doneCount}개 완료` : " "}
          </p>
          <TimingTrack total={lessons.length} done={doneCount} className="max-w-xs" />
        </div>
        {next ? (
          <Link href={`/lessons/${next.slug}`} className={btnPrimary}>
            {doneCount > 0 ? `이어서: ${next.title}` : "첫 레슨 시작"}
            <Icon name="arrow" />
          </Link>
        ) : (
          <Link href="/daily" className={btnPrimary}>
            전부 완료 · 오늘의 챌린지
            <Icon name="arrow" />
          </Link>
        )}
      </div>

      <ol className="border-[1.5px] border-ink">
        {lessons.map((l) => {
          const isDone = done.has(l.slug);
          const isNext = l.slug === nextSlug;
          return (
            <li key={l.slug} className="border-b border-ink-line last:border-b-0">
              <Link
                href={`/lessons/${l.slug}`}
                className={`group grid grid-cols-[auto_1fr_auto] items-start gap-4 p-4 transition-colors hover:bg-ink-tint sm:p-5 ${
                  isNext ? "bg-paper-2" : ""
                }`}
              >
                <Oval size={30} filled={isDone} label={isDone ? `${l.order}번 완료` : `${l.order}번`}>
                  {l.order}
                </Oval>
                <span className="min-w-0">
                  <span className="block font-serif text-lg font-extrabold text-marker group-hover:text-ink-strong">
                    {l.title}
                  </span>
                  <span className="mt-1 block text-[0.9rem] leading-6 text-text-2">{l.subtitle}</span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {l.tags.map((tag) => (
                      <span key={tag} className="border border-ink-line px-1.5 py-px text-[0.7rem] font-bold text-ink-strong">
                        {tag}
                      </span>
                    ))}
                    {isNext && (
                      <span className="bg-marker px-1.5 py-px text-[0.7rem] font-bold text-paper">다음 문항</span>
                    )}
                  </span>
                </span>
                <span className="font-mono text-[0.8rem] text-text-2">{isDone ? "완료" : `${l.estMinutes}분`}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
