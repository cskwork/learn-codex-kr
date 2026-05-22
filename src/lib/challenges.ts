export type Challenge = {
  id: string;
  prompt: string;
  hint: string;
  /** Regex source strings (case-insensitive at match time). */
  expected: string[];
  successNote: string;
};

export const COOP_CHALLENGES: Challenge[] = [
  {
    id: "C-goal-1",
    prompt:
      "팀이 함께 다음 시나리오를 해결합니다: 'Reddit 광고에서 100명 동시 접속 만들기'. Codex 세션에서 가장 먼저 박을 명령은?",
    hint: "장기 목표를 적는 슬래시 명령 + 한 줄 목표.",
    expected: ["^\\s*/goal\\s+.{10,}"],
    successNote: "둘 다 정답에 합의했어요. /goal 로 장기 목표를 영속화했습니다.",
  },
  {
    id: "C-plan-1",
    prompt: "다음 단계로, 이 목표를 단계로 쪼개 달라고 시키는 명령은?",
    hint: "/plan",
    expected: ["^\\s*/plan(\\s+|$)"],
    successNote: "잘했어요. 다음은 단계별 실행과 /verify 입니다.",
  },
];

export const RACE_CHALLENGES: Challenge[] = [
  {
    id: "R-verify-1",
    prompt: "에이전트가 '다 됐다'고 우길 때 사람이 마지막에 강제로 돌리는 명령은?",
    hint: "/verify",
    expected: ["^\\s*/verify(\\s+|$)"],
    successNote: "OK. /verify PASS 가 진짜 완료의 기준입니다.",
  },
  {
    id: "R-goal-1",
    prompt: "여러 세션을 거쳐도 같은 목표를 다시 읽게 만드는 슬래시 명령은?",
    hint: "/goal",
    expected: ["^\\s*/goal(\\s+|$)"],
    successNote: "정답. /goal 로 영속화된 목표는 다음 세션이 다시 읽습니다.",
  },
  {
    id: "R-plan-1",
    prompt: "현재 goal 을 단계 리스트로 분해하는 슬래시 명령은?",
    hint: "/plan",
    expected: ["^\\s*/plan(\\s+|$)"],
    successNote: "맞아요. /plan 이 단계 분해의 시작.",
  },
];

/** Deterministic daily challenge picker, KST date-based. */
export function getDailyChallenge(date: Date = new Date()): Challenge {
  const kstMs = date.getTime() + 9 * 60 * 60 * 1000;
  const kstDay = Math.floor(kstMs / 86_400_000);
  const pool = [...RACE_CHALLENGES, ...COOP_CHALLENGES];
  return pool[kstDay % pool.length];
}

export function matchesChallenge(c: Challenge, value: string): boolean {
  const v = value.trim();
  return c.expected.some((src) => new RegExp(src, "i").test(v));
}
