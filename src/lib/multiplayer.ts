// Pure helpers for the realtime co-op and race modes. No browser, React or
// Supabase imports so they can be unit-tested with `node --test`
// (see multiplayer.test.ts). The components in src/app/coop and src/app/race
// own the Supabase channel; this module owns the rules applied to its events.

/** Chat lines kept in memory per room (older lines are dropped). */
export const CHAT_HISTORY_LIMIT = 50;
/** Max characters of one chat message. */
export const CHAT_MAX_CHARS = 200;

export type Member = { id: string; name: string };
export type Racer = { id: string; name: string; finishedMs?: number };
export type SolvedEvent = { by: string; name: string; at: number; challengeId: string };

/** Supabase `channel.presenceState()` shape: presence key -> metas (one per open tab). */
export type PresenceState<Meta> = Record<string, Meta[]>;

/** Five-character room code from a random source (A-Z, 0-9). */
export function makeRoomId(random: () => number = Math.random): string {
  return random().toString(36).slice(2, 7).toUpperCase();
}

/** What the join form accepts: upper-case letters and digits, at most 6 characters. */
export function normalizeRoomCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

/** Race match id for the one-minute slot containing `nowMs`; everyone joining in that minute meets in one channel. */
export function matchSlotId(nowMs: number = Date.now()): string {
  return `r-${Math.floor(nowMs / (60 * 1000))}`;
}

/** 32-bit string hash (Java-style), stable across browsers. */
export function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** Every client derives the same challenge from the match id, so no server has to assign it. */
export function pickForMatch<T>(matchId: string, pool: readonly T[]): T {
  return pool[Math.abs(hashStr(matchId)) % pool.length];
}

/**
 * Room members from presence state. The presence key is the device id, so two
 * tabs on one device collapse into one member (first meta wins).
 */
export function membersFromPresence(state: PresenceState<{ name?: string }>): Member[] {
  return Object.entries(state).map(([id, metas]) => ({ id, name: metas[0]?.name ?? "익명" }));
}

/** Racers from presence state, finished racers first by time, unfinished last. */
export function racersFromPresence(state: PresenceState<{ name?: string; finishedMs?: number }>): Racer[] {
  const racers: Racer[] = Object.entries(state).map(([id, metas]) => ({
    id,
    name: metas[0]?.name ?? "익명",
    finishedMs: metas[0]?.finishedMs,
  }));
  return racers.sort((a, b) => (a.finishedMs ?? Infinity) - (b.finishedMs ?? Infinity));
}

/**
 * 1-based rank of a finish time among racers (ties share the rank), or 0 while
 * presence has not yet echoed any finish at or below `doneMs`.
 */
export function raceRank(racers: readonly Racer[], doneMs: number): number {
  return racers.filter((r) => (r.finishedMs ?? Infinity) <= doneMs).length;
}

/** Trimmed chat text clipped to CHAT_MAX_CHARS, or "" when there is nothing to send. */
export function clipChatText(text: string): string {
  return text.trim().slice(0, CHAT_MAX_CHARS);
}

/** Append a chat line, keeping only the newest CHAT_HISTORY_LIMIT lines. */
export function appendChat<T>(lines: readonly T[], line: T): T[] {
  return [...lines, line].slice(-CHAT_HISTORY_LIMIT);
}

