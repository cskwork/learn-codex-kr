export type LessonStep =
  | {
      kind: "intro";
      title: string;
      body: string;
    }
  | {
      kind: "prompt";
      title: string;
      narration: string;
      placeholder: string;
      /** Regex patterns (case-insensitive). Stored as strings so they can be passed from RSC to client components. */
      expected: string[];
      hint: string;
      success: string;
    }
  | {
      kind: "choice";
      title: string;
      narration: string;
      options: { label: string; correct: boolean; explain: string }[];
    }
  | {
      kind: "terminal";
      title: string;
      narration: string;
      command: string;
      output: string[];
    }
  | {
      kind: "summary";
      title: string;
      bullets: string[];
    };

export type Lesson = {
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  estMinutes: number;
  tags: string[];
  steps: LessonStep[];
};

const lessons: Lesson[] = [
  {
    slug: "intro",
    order: 1,
    title: "Codex CLI 첫 만남",
    subtitle: "코덱스 CLI가 뭐고 왜 쓰는지, 5분 만에 손에 익히기",
    estMinutes: 5,
    tags: ["입문", "필수"],
    steps: [
      {
        kind: "intro",
        title: "오늘 배우는 것",
        body: "Codex CLI는 OpenAI가 만든 터미널용 코딩 에이전트입니다. 평소 쓰던 셸 안에서 `codex` 한 번 치고 자연어로 작업을 시키면, 에이전트가 코드를 읽고, 고치고, 테스트까지 돌립니다. 오늘은 첫 명령을 직접 쳐 보면서 감을 잡습니다.",
      },
      {
        kind: "prompt",
        title: "첫 실행",
        narration: "터미널에 어떤 명령으로 Codex를 시작할까요? 가장 기본형으로 입력해 보세요.",
        placeholder: "codex ...",
        expected: ["^\\s*codex\\s*$", "^\\s*codex\\s+--help"],
        hint: "그냥 `codex` 만 쳐도 시작됩니다.",
        success: "정답. `codex` 한 단어면 인터랙티브 세션이 시작됩니다.",
      },
      {
        kind: "choice",
        title: "Codex가 잘하는 일은?",
        narration: "다음 중 Codex CLI가 가장 잘 맞는 작업을 고르세요.",
        options: [
          {
            label: "이미 있는 코드베이스에서 버그 위치 찾고 작은 수정",
            correct: true,
            explain: "맞아요. 리포지터리를 직접 읽고 패치까지 가는 흐름이 강점입니다.",
          },
          {
            label: "디자인 시안을 PNG로 그려 주기",
            correct: false,
            explain: "이미지 생성은 Codex의 본업이 아닙니다.",
          },
          {
            label: "데이터베이스에 직접 접속해서 사용자 비밀번호 바꿔 주기",
            correct: false,
            explain: "보안상 위험한 작업은 명시적으로 시켜야 하고, CLI의 본업도 아닙니다.",
          },
        ],
      },
      {
        kind: "terminal",
        title: "세션 모습",
        narration: "`codex` 를 치면 대략 이런 화면이 뜹니다.",
        command: "codex",
        output: [
          "Codex CLI v1.x",
          "model: gpt-5-codex",
          "cwd:   ~/work/my-app",
          "",
          "> 한글로 자연스럽게 적어도 됩니다. 어떤 작업을 도와드릴까요?",
        ],
      },
      {
        kind: "summary",
        title: "정리",
        bullets: [
          "`codex` 한 단어로 인터랙티브 세션 시작",
          "현재 디렉터리를 워크스페이스로 인식",
          "한국어 자연어로 그대로 지시 가능",
          "다음 레슨: `/goal` 로 장기 목표 잡기",
        ],
      },
    ],
  },
  {
    slug: "goal",
    order: 2,
    title: "/goal — 장기 목표 잡기",
    subtitle: "여러 세션에 걸쳐 잊지 않고 끝까지 가는 법",
    estMinutes: 7,
    tags: ["워크플로", "핵심"],
    steps: [
      {
        kind: "intro",
        title: "왜 /goal 이 필요해?",
        body: "한 번에 끝나지 않는 일이 있습니다. 예: 'Reddit 광고 → 100 CCU 도달까지 운영'. Codex 세션은 컨텍스트가 흐려질 수 있으니, `/goal` 로 큰 목표를 문서로 박아 놓고 매 세션마다 같은 목표를 다시 읽게 합니다.",
      },
      {
        kind: "prompt",
        title: "목표 시작 명령",
        narration: "장기 목표를 세팅하는 슬래시 명령은 무엇일까요?",
        placeholder: "/...",
        expected: ["^\\s*/goal(\\s+|$)"],
        hint: "`/goal` 입니다.",
        success: "맞습니다. `/goal` 뒤에 목표 문장을 붙이면 됩니다.",
      },
      {
        kind: "prompt",
        title: "구체적인 목표 적기",
        narration: "다음 빈칸을 채워 한 줄 목표를 적어 보세요. 예: '/goal 한국어 코덱스 학습 사이트를 만들고 100명 동시 접속까지 운영한다'.",
        placeholder: "/goal ...",
        expected: ["^\\s*/goal\\s+.{10,}"],
        hint: "/goal 다음에 한 줄짜리 목표를 적으세요. 최소 10자.",
        success: "좋아요. 너무 추상적이거나 너무 길지 않게, 한 줄로 박는 게 핵심입니다.",
      },
      {
        kind: "choice",
        title: "/goal 의 효과는?",
        narration: "다음 중 /goal 의 직접 효과로 옳은 것을 모두 골라도 됩니다 (하나만 선택).",
        options: [
          {
            label: "목표를 ledger / plan 파일에 남겨 다음 세션에서도 같은 목표를 이어 받음",
            correct: true,
            explain: "맞아요. 영속화가 가장 큰 차이입니다.",
          },
          {
            label: "Codex가 자동으로 GitHub Actions 까지 만들어 줌",
            correct: false,
            explain: "그건 별도 지시가 필요합니다.",
          },
          {
            label: "현재 세션의 토큰 사용량을 0으로 리셋",
            correct: false,
            explain: "리셋은 별개 기능입니다.",
          },
        ],
      },
      {
        kind: "summary",
        title: "정리",
        bullets: [
          "/goal 은 장기 목표를 문서/리저에 박아 두는 명령",
          "한 줄짜리 명확한 목표가 좋다",
          "여러 세션을 거쳐도 같은 목표를 다시 읽는다",
          "다음 레슨: `/plan` 으로 목표를 잘게 쪼개기",
        ],
      },
    ],
  },
  {
    slug: "plan",
    order: 3,
    title: "/plan — 목표를 단계로 쪼개기",
    subtitle: "막막한 일도 5분 단위 단계로 줄이면 시작할 수 있다",
    estMinutes: 6,
    tags: ["워크플로", "핵심"],
    steps: [
      {
        kind: "intro",
        title: "/plan 의 자리",
        body: "/goal 이 '어디로 갈 거냐'를 정한다면, /plan 은 '오늘은 어디까지 갈 거냐'를 정합니다. Codex 에게 단계별 작업 리스트를 만들게 시키고, 각 단계가 끝날 때마다 ledger 에 체크포인트가 찍힙니다.",
      },
      {
        kind: "prompt",
        title: "계획 만들기 명령",
        narration: "현재 목표를 단계로 쪼개 달라고 시킬 때 쓰는 명령은?",
        placeholder: "/...",
        expected: ["^\\s*/plan(\\s+|$)"],
        hint: "`/plan` 입니다.",
        success: "정답. `/plan` 만 쳐도 현재 goal 기준으로 자동 분해합니다.",
      },
      {
        kind: "choice",
        title: "좋은 plan 의 모습",
        narration: "다음 중 좋은 plan 한 줄을 고르세요.",
        options: [
          {
            label: "한국어 모바일 랜딩 페이지 1개 만들고 Vercel 에 배포한다",
            correct: true,
            explain: "범위, 산출물, 검증 가능성이 다 들어 있습니다.",
          },
          {
            label: "프로젝트를 완성한다",
            correct: false,
            explain: "너무 추상적이라 단계로 의미가 없습니다.",
          },
          {
            label: "코드 작성",
            correct: false,
            explain: "동사만 있고 결과물이 없습니다.",
          },
        ],
      },
      {
        kind: "terminal",
        title: "plan 출력 예시",
        narration: "/plan 을 치면 보통 이런 식의 단계 리스트가 떨어집니다.",
        command: "/plan",
        output: [
          "1. 한국어 랜딩 페이지 정적 빌드",
          "2. 첫 인터랙티브 레슨 (Codex 소개) 추가",
          "3. 레슨 4개 더 채우기 + 라이브러리 인덱스",
          "4. Supabase 인증 + 진행도 저장",
          "5. 실시간 동접자 카운터",
          "...",
        ],
      },
      {
        kind: "summary",
        title: "정리",
        bullets: [
          "/plan 은 goal 을 단계로 분해하는 명령",
          "각 단계는 '결과물 + 검증 가능' 형태가 좋다",
          "체크포인트가 ledger 에 자동 기록된다",
          "다음 레슨: `/verify` 로 끝났다고 우기지 말고 검증하기",
        ],
      },
    ],
  },
  {
    slug: "verify",
    order: 4,
    title: "/verify — 진짜 끝났는지 확인",
    subtitle: "에이전트가 '완료'라고 우길 때 사람이 마지막에 체크하는 방법",
    estMinutes: 6,
    tags: ["품질", "핵심"],
    steps: [
      {
        kind: "intro",
        title: "/verify 의 자리",
        body: "에이전트는 종종 '다 끝났습니다!' 라고 말합니다. 하지만 빌드가 깨졌거나 테스트가 실패하는데도 그렇게 말할 수 있습니다. `/verify` 는 마지막에 빌드/테스트/스모크를 한 번 더 돌려서 증거 기반으로 완료를 확정하는 단계입니다.",
      },
      {
        kind: "prompt",
        title: "검증 명령",
        narration: "단계가 끝났다고 주장할 때 사람이 한 번 더 강제로 돌리는 명령은?",
        placeholder: "/...",
        expected: ["^\\s*/verify(\\s+|$)"],
        hint: "`/verify` 입니다.",
        success: "정답.",
      },
      {
        kind: "choice",
        title: "/verify 가 점검하는 것",
        narration: "다음 중 /verify 가 점검해 주는 것에 가장 가까운 것은?",
        options: [
          {
            label: "빌드, 린트, 테스트, 가능하면 e2e 까지 실제로 실행하고 결과 보고",
            correct: true,
            explain: "정답. 자가 보고가 아니라 실제 실행 결과로 증명합니다.",
          },
          {
            label: "코드 스타일만 본다",
            correct: false,
            explain: "그건 일부일 뿐입니다.",
          },
          {
            label: "사용자가 좋아할지 마케팅 관점에서 검증한다",
            correct: false,
            explain: "그건 마케팅/UX 검증이고, 코드 verify 와는 다릅니다.",
          },
        ],
      },
      {
        kind: "terminal",
        title: "verify 출력 예시",
        narration: "잘 통과하면 이런 식으로 떨어집니다.",
        command: "/verify",
        output: [
          "pnpm build       ... ok (12s)",
          "pnpm lint        ... ok (4 warnings)",
          "pnpm test        ... ok (24 passed)",
          "smoke /         ... 200 OK",
          "smoke /lessons  ... 200 OK",
          "",
          "verify: PASS",
        ],
      },
      {
        kind: "summary",
        title: "정리",
        bullets: [
          "/verify 는 증거 기반 완료 확인 단계",
          "빌드/린트/테스트/스모크가 다 통과해야 PASS",
          "PASS 가 아니면 단계를 다시 in_progress 로 돌린다",
          "다음 레슨: 실제 워크플로에 /goal /plan /verify 를 묶어서 사용",
        ],
      },
    ],
  },
  {
    slug: "real-world",
    order: 5,
    title: "실전 워크플로: 작은 기능 1개 끝내기",
    subtitle: "/goal → /plan → 코드 작업 → /verify 의 한 사이클",
    estMinutes: 8,
    tags: ["실전", "필수"],
    steps: [
      {
        kind: "intro",
        title: "오늘의 시나리오",
        body: "랜딩 페이지에 '지금 N명 학습 중' 배너를 추가하라는 작은 작업이 들어왔습니다. 한 세션 안에서 Codex CLI 워크플로 한 사이클을 어떻게 도는지 따라가 봅시다.",
      },
      {
        kind: "prompt",
        title: "1단계 — 목표 박기",
        narration: "이 작업의 한 줄 목표를 /goal 명령으로 적어 보세요.",
        placeholder: "/goal ...",
        expected: ["^\\s*/goal\\s+.{10,}"],
        hint: "/goal 다음에 '랜딩 페이지에 실시간 동접자 배너 추가' 같은 한 줄.",
        success: "좋아요. /goal 은 한 번만 박아도 다음 세션이 다시 읽습니다.",
      },
      {
        kind: "prompt",
        title: "2단계 — 단계 쪼개기",
        narration: "이 목표를 단계로 쪼개 달라고 시키는 명령은?",
        placeholder: "/...",
        expected: ["^\\s*/plan(\\s+|$)"],
        hint: "`/plan` 한 단어면 됩니다.",
        success: "OK. 보통 3~7 단계 정도로 떨어집니다.",
      },
      {
        kind: "choice",
        title: "3단계 — 실제 코드 작업 중 갑자기 에러",
        narration: "코드 작성 중 빌드가 깨졌습니다. 좋은 대응은?",
        options: [
          {
            label: "에이전트에게 에러 로그를 그대로 붙여 주고 원인부터 찾게 한다",
            correct: true,
            explain: "맞아요. 증상 무시하고 가지 말고, 원인부터.",
          },
          {
            label: "에러를 무시하고 다음 단계로 넘어간다",
            correct: false,
            explain: "이러면 /verify 에서 결국 막힙니다.",
          },
          {
            label: "에이전트가 알아서 해결할 때까지 기다린다",
            correct: false,
            explain: "정보를 적극적으로 주지 않으면 한참 헤맵니다.",
          },
        ],
      },
      {
        kind: "prompt",
        title: "4단계 — 마지막 확인",
        narration: "다 됐다고 주장하는 상태에서, 사람이 마지막으로 강제 실행시키는 명령은?",
        placeholder: "/...",
        expected: ["^\\s*/verify(\\s+|$)"],
        hint: "/verify",
        success: "정답. 이게 PASS 떨어져야 진짜 끝.",
      },
      {
        kind: "summary",
        title: "정리",
        bullets: [
          "한 사이클: /goal → /plan → 코드 작업 → /verify",
          "에러는 무시 금지, 원인 분석부터",
          "단계가 끝날 때마다 ledger 에 체크포인트가 남는다",
          "이제 코업/레이스 모드에서 다른 학습자와 함께 시도해 보세요",
        ],
      },
    ],
  },
];

export const allLessons = [...lessons].sort((a, b) => a.order - b.order);

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}

export function getLessonSlugs(): string[] {
  return lessons.map((l) => l.slug);
}
