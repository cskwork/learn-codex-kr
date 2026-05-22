# learn-codex-kr

> OpenAI Codex CLI를 한국어로 인터랙티브하게 배우는 멀티플레이어 학습 사이트.
> 모바일 친화, 회원가입 없이 5분에 시작. 목표는 **동시 접속자 100명 유지**.

라이브: <https://cskwork.github.io/learn-codex-kr/>

## 기능

- **싱글플레이 레슨 5개** — `codex`, `/goal`, `/plan`, `/verify`, 실전 워크플로
- **인터랙티브 시뮬레이터** — 실제로 명령을 쳐 보고 즉시 피드백
- **코업(co-op) 멀티플레이** — 5자리 방 코드로 2명이 같은 챌린지 해결, 방 채팅 포함
- **레이스 멀티플레이** — 1분 단위 매치, 가장 빠른 정답이 상위 랭킹
- **오늘의 챌린지 + 스트릭** — KST 자정 단위로 새 챌린지, 연속 학습 카운터
- **주간 리더보드** — 최근 7일 최고 기록
- **실시간 동접자 카운터** — `lck:global` presence 채널
- **익명 device-id 세션** — 회원가입 없이 진행도 저장, 모든 데이터는 디바이스 단위

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프론트엔드 | Next.js 16 (App Router) + TypeScript + Tailwind v4 |
| 빌드 | `next build` 정적 export (`output: "export"`) |
| 배포 | GitHub Pages (`/learn-codex-kr` 서브패스) |
| 인증/저장 | Supabase (anon JS client) + localStorage fallback |
| 실시간 | Supabase Realtime (presence + broadcast) |
| 분석 | Vercel Analytics 또는 GA (선택) |

## 아키텍처 핵심 결정

- **서버리스 정적 export**: API 라우트, 미들웨어, 서버 액션 없음. 모든 동적 동작은
  Supabase JS 클라이언트로 브라우저에서 직접 호출. anon key 만 사용하므로 안전.
- **Supabase 미연결 시도 fully degradable**: `.env.local` 없이도 모든 페이지가 동작.
  레슨/일일챌린지/레이스는 localStorage 로 진행, 실시간 멀티플레이만 비활성.
- **device-id 세션**: 회원가입 없이 익명 ID 로 진행도 추적. 동물 이름 + ID tail 로 표시명 자동 생성.

## 로컬 개발

```bash
pnpm install
cp .env.local.example .env.local   # 선택: Supabase 키 채우기
pnpm dev        # http://localhost:3000
pnpm build      # 정적 export 검증
pnpm lint
```

Node 22, pnpm 10 기준.

## 디렉터리 구조

```
src/
  app/
    page.tsx                  # 랜딩
    lessons/page.tsx          # 레슨 라이브러리 인덱스
    lessons/[slug]/page.tsx   # 개별 레슨 (SSG)
    coop/page.tsx             # 코업 로비 + 방
    race/page.tsx             # 레이스 로비 + 매치
    daily/page.tsx            # 오늘의 챌린지
    leaderboard/page.tsx      # 주간 랭킹
    layout.tsx, globals.css
  components/
    Header.tsx                # 네비 + presence badge
    LessonSimulator.tsx       # intro/prompt/choice/terminal/summary 5종 step 렌더
    PresenceBadge.tsx         # Supabase presence sync (or 추정값)
    StreakBadge.tsx           # localStorage 스트릭 표시
    ShareButton.tsx           # navigator.share + clipboard fallback
  lib/
    lessons.ts                # 5개 레슨 콘텐츠 (정적)
    challenges.ts             # 코업/레이스/일일 챌린지
    storage.ts                # localStorage + Supabase sync
    supabase.ts               # 클라이언트 싱글톤 (env 없으면 null)
    device-id.ts              # 익명 ID + 표시명
    paths.ts                  # basePath 헬퍼

supabase/migrations/0001_init.sql   # DB 스키마 (lesson_progress, race_scores, daily_challenge_completions, weekly_leaderboard view)
.github/workflows/deploy.yml        # GitHub Pages 배포
LAUNCH.md                           # G010+G011 운영 플레이북 (사람 액션)
```

## Supabase 켜기

`LAUNCH.md` 1번 섹션 참고. 요약:

1. <https://supabase.com> 프로젝트 생성
2. `supabase/migrations/0001_init.sql` 을 SQL Editor 에서 실행
3. `.env.local` + GitHub Actions secrets 에 두 값 추가
4. 재배포

## 진행 상태

이 프로젝트는 [`omc ultragoal`](https://github.com/cskwork/oh-my-claudecode) 워크플로로
11개 스토리로 쪼개져 있음.

- 스토리 정의: `.omc/ultragoal/goals.json`
- 체크포인트 이벤트: `.omc/ultragoal/ledger.jsonl`
- 컨셉/타깃: `.omc/ultragoal/brief.md`

현재까지: G001~G009 코드 구현 완료. G010(Reddit 런칭) + G011(100 CCU) 는 사람 액션 — `LAUNCH.md` 참고.

## 기여

피드백은 GitHub Issues 환영. 콘텐츠 (레슨/챌린지) PR 도 환영.

## 라이선스

MIT.
