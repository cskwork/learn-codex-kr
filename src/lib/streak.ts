// Pure streak + learning-path helpers. No browser or framework imports so they
// can be unit-tested with `node --test` (see streak.test.ts).

export type StreakState = {
  current: number;
  lastDay: string;
  best: number;
};

export const EMPTY_STREAK: StreakState = { current: 0, lastDay: "", best: 0 };

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** Calendar day (YYYY-MM-DD) in Korea Standard Time. The site promises KST midnight rollover. */
export function kstDay(ms: number = Date.now()): string {
  return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
}

export function previousDay(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Streak after one learning activity on `today`. Same-day activity never double counts. */
export function advanceStreak(prev: StreakState, today: string): StreakState {
  if (prev.lastDay === today) return prev;
  const current = prev.lastDay === previousDay(today) ? prev.current + 1 : 1;
  return { current, lastDay: today, best: Math.max(prev.best, current) };
}

/** Streak as it should be displayed on `today`: a streak whose last day is older than yesterday is broken. */
export function liveStreak(state: StreakState, today: string): number {
  if (state.lastDay === today || state.lastDay === previousDay(today)) return state.current;
  return 0;
}

/** First lesson (in order) the learner has not completed, or null when all are done. */
export function nextLessonSlug(
  lessons: readonly { slug: string; order: number }[],
  done: ReadonlySet<string>
): string | null {
  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  return sorted.find((l) => !done.has(l.slug))?.slug ?? null;
}

/** Lesson that follows `slug` in order, or null for the last lesson. */
export function lessonAfter(
  lessons: readonly { slug: string; order: number }[],
  slug: string
): string | null {
  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((l) => l.slug === slug);
  return idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1].slug : null;
}
