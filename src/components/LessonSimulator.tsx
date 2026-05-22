"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Lesson, LessonStep } from "@/lib/lessons";
import { markLessonComplete } from "@/lib/storage";
import ShareButton from "./ShareButton";

type Props = { lesson: Lesson; onComplete?: (durationSec: number) => void };

export default function LessonSimulator({ lesson, onComplete }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<null | { ok: boolean; msg: string }>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const step: LessonStep | undefined = lesson.steps[stepIdx];
  const total = lesson.steps.length;
  const isLast = stepIdx === total - 1;
  const progressPct = useMemo(() => Math.round(((stepIdx + 1) / total) * 100), [stepIdx, total]);

  useEffect(() => {
    setInput("");
    setFeedback(null);
    setSelected(null);
    if (step?.kind === "prompt") {
      window.setTimeout(() => inputRef.current?.focus(), 50);
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
  }

  function handleSubmitPrompt(e: React.FormEvent) {
    e.preventDefault();
    if (step?.kind !== "prompt") return;
    const value = input.trim();
    const matched = step.expected.some((src) => new RegExp(src, "i").test(value));
    if (matched) {
      setFeedback({ ok: true, msg: step.success });
    } else {
      setFeedback({ ok: false, msg: step.hint });
    }
  }

  function handleChoiceClick(idx: number) {
    if (step?.kind !== "choice") return;
    setSelected(idx);
    const opt = step.options[idx];
    setFeedback({
      ok: opt.correct,
      msg: opt.explain,
    });
  }

  if (!step) return null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pb-24 pt-6 sm:px-6">
      <header className="flex flex-col gap-2">
        <Link href="/lessons" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← 레슨 라이브러리
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
          {lesson.title}
        </h1>
        <p className="text-sm text-zinc-400">{lesson.subtitle}</p>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-zinc-900">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-[11px] text-zinc-500">
          {stepIdx + 1} / {total} · 예상 {lesson.estMinutes}분
        </p>
      </header>

      {done ? (
        <CompletionScreen lesson={lesson} />
      ) : (
        <section className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          {step.kind === "intro" && (
            <>
              <h2 className="text-base font-semibold text-zinc-100">{step.title}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                {step.body}
              </p>
              <button
                onClick={nextStep}
                className="mt-2 self-end rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
              >
                시작하기 →
              </button>
            </>
          )}

          {step.kind === "prompt" && (
            <>
              <h2 className="text-base font-semibold text-zinc-100">{step.title}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                {step.narration}
              </p>
              <form onSubmit={handleSubmitPrompt} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/60 px-3 py-2 font-mono text-sm">
                  <span className="text-emerald-400">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="text"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={step.placeholder}
                    className="flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-600"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                  >
                    실행
                  </button>
                  {feedback?.ok && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
                    >
                      다음 →
                    </button>
                  )}
                </div>
              </form>
              {feedback && <FeedbackLine ok={feedback.ok} msg={feedback.msg} />}
            </>
          )}

          {step.kind === "choice" && (
            <>
              <h2 className="text-base font-semibold text-zinc-100">{step.title}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                {step.narration}
              </p>
              <ul className="flex flex-col gap-2">
                {step.options.map((opt, idx) => {
                  const picked = selected === idx;
                  const isCorrect = picked && opt.correct;
                  const isWrong = picked && !opt.correct;
                  return (
                    <li key={idx}>
                      <button
                        onClick={() => handleChoiceClick(idx)}
                        disabled={selected !== null && opt.correct}
                        className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                          isCorrect
                            ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-100"
                            : isWrong
                              ? "border-red-500/60 bg-red-500/10 text-red-100"
                              : "border-zinc-800 bg-zinc-950/60 text-zinc-200 hover:border-zinc-700"
                        }`}
                      >
                        {opt.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {feedback && <FeedbackLine ok={feedback.ok} msg={feedback.msg} />}
              {feedback?.ok && (
                <button
                  onClick={nextStep}
                  className="self-end rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                >
                  다음 →
                </button>
              )}
            </>
          )}

          {step.kind === "terminal" && (
            <>
              <h2 className="text-base font-semibold text-zinc-100">{step.title}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                {step.narration}
              </p>
              <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-black/70 p-4 font-mono text-xs leading-relaxed text-zinc-200">
                <span className="text-emerald-400">$ </span>
                <span className="text-zinc-50">{step.command}</span>
                {"\n"}
                {step.output.join("\n")}
              </pre>
              <button
                onClick={nextStep}
                className="self-end rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
              >
                다음 →
              </button>
            </>
          )}

          {step.kind === "summary" && (
            <>
              <h2 className="text-base font-semibold text-zinc-100">{step.title}</h2>
              <ul className="flex flex-col gap-2 text-sm text-zinc-300">
                {step.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={nextStep}
                className="mt-2 self-end rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
              >
                {isLast ? "완료!" : "다음 →"}
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}

function FeedbackLine({ ok, msg }: { ok: boolean; msg: string }) {
  return (
    <p
      className={`rounded-lg border px-3 py-2 text-xs ${
        ok
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
          : "border-amber-500/40 bg-amber-500/10 text-amber-200"
      }`}
    >
      {ok ? "✓ " : "힌트 · "}
      {msg}
    </p>
  );
}

function CompletionScreen({ lesson }: { lesson: Lesson }) {
  return (
    <section className="flex flex-col items-center gap-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/20 text-2xl">
        ✓
      </div>
      <div>
        <h2 className="text-xl font-bold text-emerald-100">레슨 완료!</h2>
        <p className="mt-1 text-sm text-zinc-300">
          {lesson.title} — 진행도가 저장되었습니다.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/lessons"
          className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          다른 레슨 보기
        </Link>
        <ShareButton
          text={`learn-codex-kr 에서 '${lesson.title}' 레슨을 끝냈어요!`}
          className="rounded-full border border-zinc-700 px-5 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
        />
      </div>
    </section>
  );
}
