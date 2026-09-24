"use client";

import Link from "next/link";
import { nextLessonSlug } from "@/lib/streak";
import { useProgress } from "@/lib/useProgress";
import { Icon, btnPrimary } from "./omr";

type L = { slug: string; order: number; title: string };

/**
 * Primary action that always points at the learner's next unfinished lesson.
 * First-time visitors see the original "start" copy.
 */
export default function ResumeLink({ lessons, className = "" }: { lessons: L[]; className?: string }) {
  const { ready, done } = useProgress();
  const nextSlug = ready ? nextLessonSlug(lessons, done) : lessons[0].slug;
  const started = ready && done.size > 0;
  const next = lessons.find((l) => l.slug === nextSlug);

  if (!next) {
    return (
      <Link href="/daily" className={`${btnPrimary} ${className}`}>
        모든 레슨 완료 · 오늘의 챌린지 풀기
        <Icon name="arrow" />
      </Link>
    );
  }
  return (
    <Link href={`/lessons/${next.slug}`} className={`${btnPrimary} ${className}`}>
      {started ? `이어서 학습: ${next.title}` : "5분 만에 첫 작업 성공하기"}
      <Icon name="arrow" />
    </Link>
  );
}
