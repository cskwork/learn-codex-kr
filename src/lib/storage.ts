"use client";

import { getDeviceId, getDisplayName } from "./device-id";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import { EMPTY_STREAK, advanceStreak, kstDay, liveStreak, type StreakState } from "./streak";

export type { StreakState };

/** Fired on window whenever local progress or streak changes, so badges can refresh. */
export const PROGRESS_EVENT = "lck:progress";

const PROGRESS_KEY = "lck.progress";
const STREAK_KEY = "lck.streak";
const SCORES_KEY = "lck.scores";

export type LessonProgress = {
  slug: string;
  completedAt: string;
  durationSec: number;
};

export type RaceScore = {
  matchId: string;
  lessonSlug: string;
  timeMs: number;
  finishedAt: string;
};

export function getProgress(): LessonProgress[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function markLessonComplete(slug: string, durationSec: number): void {
  if (typeof window === "undefined") return;
  const all = getProgress().filter((p) => p.slug !== slug);
  all.push({ slug, completedAt: new Date().toISOString(), durationSec });
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  recordLearningDay();
  window.dispatchEvent(new Event(PROGRESS_EVENT));
  // Best-effort cloud sync — never block UI on this.
  syncLessonToCloud(slug, durationSec).catch(() => {});
}

async function syncLessonToCloud(slug: string, durationSec: number): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("lesson_progress").upsert(
    {
      device_id: getDeviceId(),
      display_name: getDisplayName(),
      lesson_slug: slug,
      duration_sec: durationSec,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "device_id,lesson_slug" }
  );
}

export function getStreak(): StreakState {
  if (typeof window === "undefined") return EMPTY_STREAK;
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    return raw ? { ...EMPTY_STREAK, ...JSON.parse(raw) } : EMPTY_STREAK;
  } catch {
    return EMPTY_STREAK;
  }
}

/** Current streak as of today (KST); 0 once a day has been skipped. */
export function getLiveStreak(): { current: number; best: number } {
  const s = getStreak();
  return { current: liveStreak(s, kstDay()), best: s.best };
}

/**
 * Count today (KST) as a learning day. Called for finished lessons and for the
 * daily challenge, so "스트릭" means what the daily page says it means.
 */
export function recordLearningDay(): void {
  if (typeof window === "undefined") return;
  const next = advanceStreak(getStreak(), kstDay());
  window.localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function getRaceScores(): RaceScore[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SCORES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function recordRaceScore(score: RaceScore): void {
  if (typeof window === "undefined") return;
  const all = getRaceScores();
  all.push(score);
  window.localStorage.setItem(SCORES_KEY, JSON.stringify(all.slice(-100)));
  syncRaceToCloud(score).catch(() => {});
}

async function syncRaceToCloud(score: RaceScore): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("race_scores").insert({
    device_id: getDeviceId(),
    display_name: getDisplayName(),
    match_id: score.matchId,
    lesson_slug: score.lessonSlug,
    time_ms: score.timeMs,
    finished_at: score.finishedAt,
  });
}
