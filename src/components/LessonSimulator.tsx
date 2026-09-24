"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Lesson, LessonStep } from "@/lib/lessons";
import { markLessonComplete } from "@/lib/storage";
import ShareButton from "./ShareButton";
import {
  AnswerField,
  Icon,
  Oval,
  RichText,
  SheetBand,
  TimingTrack,
  Verdict,
  backLink,
  btnPrimary,
  btnSecondary,
} from "./omr";

type NextLesson = { slug: string; title: string } | null;
type Props = { lesson: Lesson; nextLesson?: NextLesson; onComplete?: (durationSec: number) => void };

export default function LessonSimulator({ lesson, nextLesson = null, onComplete }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<null | { ok: boolean; msg: string }>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const step: LessonStep | undefined = lesson.steps[stepIdx];
  const total = lesson.steps.length;
  const isLast = stepIdx === total - 1;

  useEffect(() => {
    setInput("");
    setFeedback(null);
    setSelected(null);
    setWrongPicks([]);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Move focus with the step so keyboard and screen-reader users land on the new question.
    if (step?.kind === "prompt") {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      headingRef.current?.focus();
    }
  }, [stepIdx, step?.kind]);

  function nextStep() {
    if (isLast) {
      handleComplete();
      return;
    }
    setStepIdx((i) => i + 1);
  }

  function handleComplete() {
    if (done) return;
    setDone(true);
    const durationSec = Math.round((Date.now() - startedAt.current) / 1000);
    markLessonComplete(lesson.slug, durationSec);
    onComplete?.(durationSec);
    window.scrollTo({ top: 0 });
  }

  function handleSubmitPrompt(e: React.FormEvent) {
    e.preventDefault();
    if (step?.kind !== "prompt") return;
    const value = input.trim();
    if (!value) {
      setFeedback({ ok: false, msg: "먼저 답란에 명령을 입력하세요." });
      return;
    }
    const matched = step.expected.some((src) => new RegExp(src, "i").test(value));
    setFeedback(matched ? { ok: true, msg: step.success } : { ok: false, msg: step.hint });
  }

  function handleChoiceClick(idx: number) {
    if (step?.kind !== "choice") return;
    setSelected(idx);
    const opt = step.options[idx];
    if (!opt.correct) setWrongPicks((w) => (w.includes(idx) ? w : [...w, idx]));
    setFeedback({ ok: opt.correct, msg: opt.explain });
  }

  if (!step) return null;

  const solved = feedback?.ok === true;
  const headingCls = "font-serif text-[1.45rem] font-extrabold leading-snug text-marker outline-none sm:text-[1.7rem]";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-24 pt-6 sm:px-6">
      <header className="flex flex-col gap-3">
        <Link href="/lessons" className={backLink}>
          <Icon name="back" size={15} />
          레슨 라이브러리
        </Link>
        <SheetBand left={`문항 ${String(lesson.order).padStart(2, "0")}`} right={`예상 ${lesson.estMinutes}분`} />
        <h1 className="font-serif text-[1.9rem] font-extrabold leading-tight tracking-[-0.02em] text-marker sm:text-[2.4rem]">
          {lesson.title}
        </h1>
        <p className="text-[0.95rem] text-text-2">{lesson.subtitle}</p>
        <div
          role="progressbar"
          aria-label="레슨 진행"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={done ? total : stepIdx + 1}
          aria-valuetext={done ? "완료" : `${total}단계 중 ${stepIdx + 1}단계`}
          className="flex items-center gap-3"
        >
          <TimingTrack total={total} done={done ? total : stepIdx} current={done ? undefined : stepIdx} className="flex-1" />
          <span className="font-mono text-[0.8rem] tabular-nums text-text-2">
            {done ? total : stepIdx + 1} / {total}
          </span>
        </div>
      </header>

      {done ? (
        <CompletionScreen lesson={lesson} nextLesson={nextLesson} />
      ) : (
        <section
          key={stepIdx}
          className="flex flex-col gap-5 border-[1.5px] border-ink bg-paper p-5 sm:p-7"
          aria-labelledby="step-title"
        >
          <p className="font-mono text-[0.78rem] font-bold text-ink-strong">
            {step.kind === "intro" && "안내"}
            {step.kind === "prompt" && "주관식"}
            {step.kind === "choice" && "객관식"}
            {step.kind === "terminal" && "보기"}
            {step.kind === "summary" && "정리"}
          </p>

          {step.kind === "intro" && (
            <>
              <h2 id="step-title" ref={headingRef} tabIndex={-1} className={headingCls}>
                {step.title}
              </h2>
              <p className="max-w-[40rem] whitespace-pre-line text-[1rem] leading-8 text-text">
                <RichText text={step.body} />
              </p>
              <button onClick={nextStep} className={`${btnPrimary} self-end`}>
                시작하기
                <Icon name="arrow" />
              </button>
            </>
          )}

          {step.kind === "prompt" && (
            <>
              <h2 id="step-title" ref={headingRef} tabIndex={-1} className={headingCls}>
                {step.title}
              </h2>
              <p className="max-w-[40rem] whitespace-pre-line text-[1rem] leading-8 text-text">
                <RichText text={step.narration} />
              </p>
              <form onSubmit={handleSubmitPrompt} className="flex flex-col gap-3">
                <AnswerField
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={step.placeholder}
                  aria-label="명령 입력"
                  readOnly={solved}
                />
                {feedback && <Verdict ok={feedback.ok}><RichText text={feedback.msg} /></Verdict>}
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {solved ? (
                    <button type="button" onClick={nextStep} className={btnPrimary}>
                      {isLast ? "완료!" : "다음 문항"}
                      <Icon name="arrow" />
                    </button>
                  ) : (
                    <button type="submit" className={btnPrimary}>
                      실행
                    </button>
                  )}
                </div>
              </form>
            </>
          )}

          {step.kind === "choice" && (
            <>
              <h2 id="step-title" ref={headingRef} tabIndex={-1} className={headingCls}>
                {step.title}
              </h2>
              <p className="max-w-[40rem] whitespace-pre-line text-[1rem] leading-8 text-text">
                <RichText text={step.narration} />
              </p>
              <ul className="flex flex-col border-[1.5px] border-ink">
                {step.options.map((opt, idx) => {
                  const picked = selected === idx;
                  const isCorrect = picked && opt.correct;
                  const isWrong = wrongPicks.includes(idx);
                  return (
                    <li key={idx} className="border-b border-ink-line last:border-b-0">
                      <button
                        onClick={() => handleChoiceClick(idx)}
                        disabled={solved}
                        aria-pressed={picked}
                        className={`flex w-full items-center gap-4 px-4 py-3.5 text-left text-[0.95rem] leading-6 transition-colors disabled:cursor-default ${
                          isCorrect
                            ? "bg-paper font-bold text-marker"
                            : isWrong
                              ? "bg-ink-tint/60 text-text-2"
                              : "text-text enabled:hover:bg-ink-tint"
                        }`}
                      >
                        <Oval size={24} filled={isCorrect} wrong={isWrong}>
                          {idx + 1}
                        </Oval>
                        <span className="flex-1">{opt.label}</span>
                        {isCorrect && <span className="sr-only">(정답)</span>}
                        {isWrong && <span className="sr-only">(오답)</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {feedback && <Verdict ok={feedback.ok}>{feedback.msg}</Verdict>}
              {solved && (
                <button onClick={nextStep} className={`${btnPrimary} self-end`}>
                  {isLast ? "완료!" : "다음 문항"}
                  <Icon name="arrow" />
                </button>
              )}
            </>
          )}

          {step.kind === "terminal" && (
            <>
              <h2 id="step-title" ref={headingRef} tabIndex={-1} className={headingCls}>
                {step.title}
              </h2>
              <p className="max-w-[40rem] whitespace-pre-line text-[1rem] leading-8 text-text">
                <RichText text={step.narration} />
              </p>
              <figure className="border-[1.5px] border-ink">
                <figcaption className="border-b border-ink-line bg-ink-tint px-3 py-1 font-mono text-[0.72rem] font-bold text-ink-strong">
                  &lt;보기&gt; 터미널 출력
                </figcaption>
                <pre className="overflow-x-auto bg-paper-2 p-4 font-mono text-[0.85rem] leading-relaxed text-marker">
                  <span className="text-ink">$ </span>
                  <span className="font-bold">{step.command}</span>
                  {"\n"}
                  {step.output.join("\n")}
                </pre>
              </figure>
              <button onClick={nextStep} className={`${btnPrimary} self-end`}>
                다음 문항
                <Icon name="arrow" />
              </button>
            </>
          )}

          {step.kind === "summary" && (
            <>
              <h2 id="step-title" ref={headingRef} tabIndex={-1} className={headingCls}>
                {step.title}
              </h2>
              <ul className="flex flex-col divide-y divide-ink-line border-y border-ink-line">
                {step.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 py-3 text-[0.98rem] leading-7 text-text">
                    <Icon name="check" size={18} className="mt-1 text-ink" />
                    <span>
                      <RichText text={b} />
                    </span>
                  </li>
                ))}
              </ul>
              <button onClick={nextStep} className={`${btnPrimary} self-end`}>
                {isLast ? "완료!" : "다음 문항"}
                <Icon name="arrow" />
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}

function CompletionScreen({ lesson, nextLesson }: { lesson: Lesson; nextLesson: NextLesson }) {
  return (
    <section
      className="flex flex-col gap-6 border-[1.5px] border-marker bg-paper p-6 sm:p-8"
      aria-labelledby="done-title"
      role="status"
    >
      <div className="flex items-center gap-4">
        <span className="stamp-in inline-flex border-[2.5px] border-ink px-3 py-1 font-serif text-xl font-extrabold text-ink">
          완료
        </span>
        <div>
          <h2 id="done-title" className="font-serif text-2xl font-extrabold text-marker">
            레슨 완료!
          </h2>
          <p className="mt-1 text-[0.92rem] text-text-2">
            {lesson.title} — 진행도가 저장되었습니다.
          </p>
        </div>
      </div>
      <div className="flex gap-1.5" aria-hidden>
        {lesson.steps.map((_, i) => (
          <Oval key={i} size={20} filled />
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {nextLesson ? (
          <Link href={`/lessons/${nextLesson.slug}`} className={btnPrimary}>
            다음 레슨: {nextLesson.title}
            <Icon name="arrow" />
          </Link>
        ) : (
          <Link href="/daily" className={btnPrimary}>
            마지막 레슨 완료 · 오늘의 챌린지 풀기
            <Icon name="arrow" />
          </Link>
        )}
        <Link href="/lessons" className={btnSecondary}>
          다른 레슨 보기
        </Link>
        <ShareButton text={`codex-tutorial 에서 '${lesson.title}' 레슨을 끝냈어요!`} className={btnSecondary} />
      </div>
    </section>
  );
}
