"use client";

import { getDeviceId, getDisplayName } from "./device-id";
import { getSupabase, isSupabaseConfigured } from "./supabase";

const PROGRESS_KEY = "lck.progress";
const STREAK_KEY = "lck.streak";
const SCORES_KEY = "lck.scores";

export type LessonProgress = {
  slug: string;
  completedAt: string;
  durationSec: number;
};

export type StreakState = {
  current: number;
  lastDay: string;
  best: number;
};

export type RaceScore = {
  matchId: string;
  lessonSlug: string;
  timeMs: number;
  finishedAt: string;
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

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
  bumpStreak();
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
  if (typeof window === "undefined") {
    return { current: 0, lastDay: "", best: 0 };
  }
  try {
    return JSON.parse(
      window.localStorage.getItem(STREAK_KEY) ??
        '{"current":0,"lastDay":"","best":0}'
    );
  } catch {
    return { current: 0, lastDay: "", best: 0 };
  }
}

function bumpStreak(): void {
  const today = todayISO();
  const prev = getStreak();
  if (prev.lastDay === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const isContinuation = prev.lastDay === yesterday;
  const current = isContinuation ? prev.current + 1 : 1;
  const next: StreakState = {
    current,
    lastDay: today,
    best: Math.max(prev.best, current),
  };
  window.localStorage.setItem(STREAK_KEY, JSON.stringify(next));
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
