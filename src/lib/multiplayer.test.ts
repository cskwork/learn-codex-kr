import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CHAT_HISTORY_LIMIT,
  acceptSolved,
  appendChat,
  clipChatText,
  hashStr,
  makeRoomId,
  matchSlotId,
  membersFromPresence,
  normalizeRoomCode,
  pickForMatch,
  raceRank,
  racersFromPresence,
} from "./multiplayer.ts";

test("makeRoomId yields a five-character upper-case code from the random source", () => {
  assert.equal(makeRoomId(() => 0.123456789), (0.123456789).toString(36).slice(2, 7).toUpperCase());
  assert.match(makeRoomId(), /^[A-Z0-9]{5}$/);
});

test("normalizeRoomCode upper-cases, strips symbols and caps at 6 characters", () => {
  assert.equal(normalizeRoomCode("a4f-2x"), "A4F2X");
  assert.equal(normalizeRoomCode(" abc def ghi "), "ABCDEF");
  assert.equal(normalizeRoomCode("방코드!"), "");
});

test("matchSlotId puts everyone in the same minute into one match", () => {
  const start = Date.UTC(2026, 9, 28, 3, 0, 0);
  assert.equal(matchSlotId(start), matchSlotId(start + 59_999));
  assert.notEqual(matchSlotId(start), matchSlotId(start + 60_000));
  assert.equal(matchSlotId(start), `r-${start / 60_000}`);
});

test("pickForMatch is deterministic per match id and stays inside the pool", () => {
  const pool = ["a", "b", "c"] as const;
  assert.equal(pickForMatch("r-29000000", pool), pickForMatch("r-29000000", pool));
  for (let slot = 0; slot < 200; slot++) {
    assert.ok(pool.includes(pickForMatch(`r-${slot}`, pool)));
  }
  // Negative hashes (32-bit overflow) must still index the pool.
  const long = "r-aaaaaaaa";
  assert.ok(hashStr(long) < 0);
  assert.ok(pool.includes(pickForMatch(long, pool)));
});

test("membersFromPresence keys members by device id and collapses a device's tabs", () => {
  const members = membersFromPresence({
    d_alpha: [{ name: "여우-a1" }, { name: "여우-a1 (tab 2)" }],
    d_beta: [{}],
  });
  assert.deepEqual(members, [
    { id: "d_alpha", name: "여우-a1" },
    { id: "d_beta", name: "익명" },
  ]);
});

test("racersFromPresence sorts finished racers by time and leaves unfinished last", () => {
  const racers = racersFromPresence({
    slow: [{ name: "B", finishedMs: 9_000 }],
    pending: [{ name: "C" }],
    fast: [{ name: "A", finishedMs: 4_200 }],
  });
  assert.deepEqual(
    racers.map((r) => r.id),
    ["fast", "slow", "pending"]
  );
});

test("raceRank counts finishes at or below mine; 0 until presence echoes my finish", () => {
  const racers = racersFromPresence({
    a: [{ name: "A", finishedMs: 4_200 }],
    me: [{ name: "me", finishedMs: 9_000 }],
    b: [{ name: "B", finishedMs: 9_000 }],
    c: [{ name: "C" }],
  });
  assert.equal(raceRank(racers, 9_000), 3);
  assert.equal(raceRank(racers, 4_200), 1);
  assert.equal(raceRank([], 5_000), 0);
});

test("chat text is trimmed and clipped; history keeps the newest lines", () => {
  assert.equal(clipChatText("   "), "");
  assert.equal(clipChatText(` ${"가".repeat(250)} `).length, 200);
  let lines: number[] = [];
  for (let i = 0; i < CHAT_HISTORY_LIMIT + 5; i++) lines = appendChat(lines, i);
  assert.equal(lines.length, CHAT_HISTORY_LIMIT);
  assert.equal(lines[0], 5);
  assert.equal(lines.at(-1), CHAT_HISTORY_LIMIT + 4);
});

test("acceptSolved ignores a peer's solve for a different challenge (late joiner)", () => {
  const solved = { by: "d_peer", name: "수달-x9", at: 0, challengeId: "C-plan-1" };
  assert.equal(acceptSolved("C-plan-1", solved), true);
  assert.equal(acceptSolved("C-goal-1", solved), false);
});
