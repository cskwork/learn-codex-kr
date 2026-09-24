import type { ReactNode } from "react";

/* Shared OMR answer-card primitives. Server-safe (no hooks). */

export const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 bg-marker px-5 py-2.5 text-sm font-bold text-paper transition-[transform,background-color,box-shadow] duration-200 ease-out hover:-translate-y-px hover:bg-ink-strong hover:shadow-[0_6px_14px_-6px_rgba(163,22,63,0.55)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-40";

export const btnSecondary =
  "inline-flex min-h-11 items-center justify-center gap-2 border-[1.5px] border-ink bg-paper px-5 py-2.5 text-sm font-bold text-ink-strong transition-colors duration-200 hover:bg-ink-tint disabled:pointer-events-none disabled:opacity-40";

export const backLink =
  "inline-flex items-center gap-1.5 text-sm text-text-2 underline-offset-4 hover:text-ink-strong hover:underline";

export function Oval({
  filled = false,
  wrong = false,
  size = 28,
  children,
  label,
}: {
  filled?: boolean;
  wrong?: boolean;
  size?: number;
  children?: ReactNode;
  label?: string;
}) {
  return (
    <span
      className="oval text-[0.72rem] font-bold"
      data-filled={filled}
      data-wrong={wrong}
      style={{ width: size, height: Math.round(size * 1.25) }}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      {children !== undefined && <span>{children}</span>}
    </span>
  );
}

/** Row of printed timing marks; `done` filled, `current` in ink. */
export function TimingTrack({
  total,
  done,
  current,
  vertical = false,
  className = "",
}: {
  total: number;
  done: number;
  current?: number;
  vertical?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`flex ${vertical ? "flex-col" : "flex-row"} gap-1.5 ${className}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`timing-mark ${vertical ? "h-2.5 w-5" : "h-4 flex-1"}`}
          data-on={i < done}
          data-current={i === current}
        />
      ))}
    </span>
  );
}

type IconName = "arrow" | "check" | "cross" | "back" | "flame" | "copy" | "share" | "info";

const PATHS: Record<IconName, ReactNode> = {
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  back: <path d="M20 12H5m6-6-6 6 6 6" />,
  check: <path d="m4.5 12.5 5 5L19.5 7" />,
  cross: <path d="M6 6l12 12M18 6 6 18" />,
  flame: (
    <path d="M12 21c3.6 0 6-2.4 6-5.6 0-3.1-2-5.2-3.4-7C13.4 6.8 13 5 13 3c-2.7 1.4-4.4 4-4.4 6.6-.9-.6-1.5-1.6-1.6-2.8C5.6 8.4 6 10.6 6 12.4 6 17 8.4 21 12 21Z" />
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" />
      <path d="M16 8V4H4v12h4" />
    </>
  ),
  share: <path d="M12 3v12m-5-7 5-5 5 5M5 14v6h14v-6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-9.5v.5" />
    </>
  ),
};

export function Icon({ name, size = 18, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={`flex-none ${className}`}
    >
      {PATHS[name]}
    </svg>
  );
}

/** Render `code` spans from lesson copy as real inline code. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") && p.endsWith("`") && p.length > 2 ? (
          <code
            key={i}
            className="mx-0.5 border border-ink-hair bg-ink-tint px-1 py-px font-mono text-[0.92em] text-ink-strong"
          >
            {p.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

/** 판독 결과: machine-read verdict. Announced to assistive tech. */
export function Verdict({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 border-[1.5px] px-4 py-3 text-sm leading-relaxed ${
        ok ? "border-marker bg-paper text-text" : "border-pen bg-pen-tint text-pen"
      }`}
    >
      <span
        className={`mt-0.5 inline-flex h-6 min-w-12 flex-none items-center justify-center px-1.5 font-mono text-[0.7rem] font-bold ${
          ok ? "bg-marker text-paper" : "border border-pen text-pen"
        }`}
      >
        {ok ? "정답" : "힌트"}
      </span>
      <span className="pt-0.5">{children}</span>
    </div>
  );
}

/** 주관식 답란: the command input, set in the coding face. */
export function AnswerField({
  label = "답란",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; ref?: React.Ref<HTMLInputElement> }) {
  return (
    <label className="group flex items-stretch border-[1.5px] border-ink bg-paper focus-within:border-marker focus-within:shadow-[0_4px_12px_-6px_rgba(20,18,20,0.35)]">
      <span className="flex w-14 flex-none items-center justify-center border-r-[1.5px] border-ink bg-ink-tint font-mono text-[0.72rem] font-bold text-ink-strong group-focus-within:border-marker">
        {label}
      </span>
      <span className="flex flex-1 items-center gap-2 px-3">
        <span aria-hidden className="font-mono text-ink">$</span>
        <input
          type="text"
          inputMode="text"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          {...props}
          className="min-h-12 w-full min-w-0 bg-transparent font-mono text-base text-marker outline-none"
        />
      </span>
    </label>
  );
}

/** Pink printed band used as the header strip of every sheet. */
export function SheetBand({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-y-[1.5px] border-ink bg-ink-tint px-3 py-1.5 text-[0.78rem] font-bold text-ink-strong">
      <span>{left}</span>
      {right && <span className="font-mono font-normal">{right}</span>}
    </div>
  );
}
