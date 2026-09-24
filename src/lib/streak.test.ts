import { test } from "node:test";
import assert from "node:assert/strict";
import {
  EMPTY_STREAK,
  advanceStreak,
  kstDay,
  lessonAfter,
  liveStreak,
  nextLessonSlug,
  previousDay,
} from "./streak.ts";

test("kstDay rolls over at KST midnight, not UTC midnight", () => {
  // 2026-09-23 15:30 UTC == 2026-09-24 00:30 KST
  assert.equal(kstDay(Date.UTC(2026, 8, 23, 15, 30)), "2026-09-24");
  // 2026-09-23 14:30 UTC == 2026-09-23 23:30 KST
  assert.equal(kstDay(Date.UTC(2026, 8, 23, 14, 30)), "2026-09-23");
});

test("previousDay crosses month and year boundaries", () => {
  assert.equal(previousDay("2026-10-01"), "2026-09-30");
  assert.equal(previousDay("2027-01-01"), "2026-12-31");
});

test("advanceStreak starts, continues, ignores same day, and resets after a gap", () => {
  const d1 = advanceStreak(EMPTY_STREAK, "2026-09-22");
  assert.deepEqual(d1, { current: 1, lastDay: "2026-09-22", best: 1 });
  const d2 = advanceStreak(d1, "2026-09-23");
  assert.deepEqual(d2, { current: 2, lastDay: "2026-09-23", best: 2 });
  assert.equal(advanceStreak(d2, "2026-09-23"), d2);
  const reset = advanceStreak(d2, "2026-09-26");
  assert.deepEqual(reset, { current: 1, lastDay: "2026-09-26", best: 2 });
});

test("liveStreak shows 0 once a day was missed", () => {
  const s = { current: 4, lastDay: "2026-09-22", best: 4 };
  assert.equal(liveStreak(s, "2026-09-22"), 4);
  assert.equal(liveStreak(s, "2026-09-23"), 4);
  assert.equal(liveStreak(s, "2026-09-24"), 0);
});

const lessons = [
  { slug: "goal", order: 2 },
  { slug: "intro", order: 1 },
  { slug: "plan", order: 3 },
];

test("nextLessonSlug returns the first unfinished lesson by order", () => {
  assert.equal(nextLessonSlug(lessons, new Set()), "intro");
  assert.equal(nextLessonSlug(lessons, new Set(["intro"])), "goal");
  assert.equal(nextLessonSlug(lessons, new Set(["intro", "plan"])), "goal");
  assert.equal(nextLessonSlug(lessons, new Set(["intro", "goal", "plan"])), null);
});

test("lessonAfter follows lesson order and ends at the last lesson", () => {
  assert.equal(lessonAfter(lessons, "intro"), "goal");
  assert.equal(lessonAfter(lessons, "goal"), "plan");
  assert.equal(lessonAfter(lessons, "plan"), null);
  assert.equal(lessonAfter(lessons, "missing"), null);
});
