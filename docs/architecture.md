# 아키텍처

learn-codex-kr는 Next.js 16 App Router를 `output: "export"`로 빌드한 **정적 사이트**입니다.
서버 코드는 없고, 상태는 브라우저 localStorage와 (설정했을 때만) Supabase에 있습니다.

## 구성 요소

| 영역 | 경로 | 역할 |
|---|---|---|
| 레슨 | `src/lib/lessons.ts`, `src/app/lessons/[slug]/page.tsx`, `src/components/LessonSimulator.tsx` | 레슨 5개(`intro`, `goal`, `plan`, `verify`, `real-world`)를 `generateStaticParams`로 SSG. 시뮬레이터가 intro/prompt/choice/terminal/summary step을 렌더하고 입력을 정규식으로 채점 |
| 챌린지 | `src/lib/challenges.ts` | 코업 2개·레이스 3개 챌린지, `matchesChallenge`(대소문자 무시 정규식), `getDailyChallenge`(KST 날짜로 결정) |
| 멀티플레이 규칙 | `src/lib/multiplayer.ts` | 방 코드, 1분 매치 슬롯, 매치별 문제 선택, presence → 참가자/순위, 채팅 제한, `acceptSolved`. React·Supabase 의존 없음 |
| 코업 | `src/app/coop/CoopRoom.tsx` | 로비 → 방(`?room=CODE`). Supabase 없으면 `SoloCoop` |
| 레이스 | `src/app/race/RaceMode.tsx` | 로비 → 매치(`?match=r-<분>`). Supabase 없으면 `SoloRace` |
| 동접자 | `src/components/PresenceBadge.tsx` | `lck:global` presence 키 수. Supabase 없으면 아무것도 표시하지 않음(추정값을 지어내지 않음) |
| 진행도·스트릭 | `src/lib/storage.ts`, `src/lib/streak.ts`, `src/lib/useProgress.ts` | localStorage 저장, `lck:progress` window 이벤트로 배지 갱신, Supabase로 best-effort 동기화 |
| 신원 | `src/lib/device-id.ts` | `lck.device-id`(익명 id), `lck.display-name`(동물 이름 + id 끝 3자리) |
| Supabase 클라이언트 | `src/lib/supabase.ts` | 싱글톤. SSR이거나 env가 없으면 `null`. realtime `eventsPerSecond: 5` |
| 스키마 | `supabase/migrations/0001_init.sql` | `lesson_progress`, `race_scores`, `daily_challenge_completions`, `weekly_leaderboard` 뷰, RLS 정책 |
| 배포 경로 | `next.config.ts`, `src/lib/paths.ts` | Vercel이면 basePath 없음, 그 외 production 빌드는 `/learn-codex-kr`. `LCK_BASE_PATH`/`LCK_SITE_URL`로 덮어쓰기 |

## 실시간 멀티플레이 설계

### 전송 (transport)

- Supabase Realtime 채널 하나가 WebSocket 하나 위에서 두 기능을 씁니다.
  - **presence**: 각 클라이언트가 `ch.track(meta)`로 자기 상태를 올리면, 서버가 합친 상태를 `presenceState()`로 모두에게 동기화합니다. 접속이 끊기면 서버가 해당 항목을 지웁니다.
  - **broadcast**: `ch.send({ type: "broadcast", event, payload })`로 같은 채널의 다른 클라이언트에게 메시지를 보냅니다. 저장되지 않고, 기본 설정에서 보낸 사람에게는 되돌아오지 않습니다. 그래서 코드는 보낸 쪽 상태를 직접 갱신합니다(`send`, `attempt`, `next` in `CoopRoom.tsx`).
- 채널 이름: `coop:<ROOM>`, `race:r-<epoch 분>`, `lck:global`.
- presence 키는 `getDeviceId()`입니다. 같은 기기의 탭 여러 개는 같은 키 아래 meta가 여러 개 생기고, `membersFromPresence`/`racersFromPresence`는 첫 meta만 써서 한 명으로 셉니다.

### 상태 동기화

| 모드 | 공유 상태 | 수단 | 규칙 (`src/lib/multiplayer.ts`) |
|---|---|---|---|
| 코업 | 참가자 목록 | presence `{ name, joined_at }` | `membersFromPresence` |
| 코업 | 채팅 | broadcast `chat` | `clipChatText`(200자), `appendChat`(최근 50줄) |
| 코업 | 정답 처리 | broadcast `solved` `{ by, name, at, challengeId }` | `acceptSolved`: 내가 보고 있는 문제의 id와 같을 때만 반영 |
| 코업 | 현재 문제 | broadcast `next` `{ idx }` | 절대 인덱스를 보냄 |
| 레이스 | 참가자·기록 | presence `{ name, finishedMs }` | `racersFromPresence`(완료 시간 오름차순, 미완료는 뒤), `raceRank` |
| 레이스 | 매치·문제 | 없음 (각자 계산) | `matchSlotId`(1분 슬롯), `pickForMatch`(id 해시 % 문제 수) |
| 전역 | 동접자 수 | presence 키 개수 | — |

### 충돌 처리

중앙 서버가 없으므로 "서버가 판정"하는 대신 다음 규칙으로 수렴합니다.

- **코업 `next`는 증가량이 아니라 절대 인덱스**(`(현재 + 1) % 문제 수`)를 보냅니다. 두 사람이 동시에 "다음"을 눌러도 같은 인덱스에서 출발했다면 같은 값을 보내므로 결과가 같습니다(멱등).
- **코업 `solved`는 둘 다 맞혀도 문제없음.** 각자 마지막으로 받은 `solved`를 보여 주며, 표시되는 이름만 다를 수 있습니다. 다른 문제를 가리키는 `solved`는 `acceptSolved`가 버립니다.
- **레이스 순위는 presence 상태에서 매번 다시 계산**합니다. 각 클라이언트는 자기 `finishedMs`만 쓰므로 쓰기 충돌이 없습니다. 내 완료가 presence로 돌아오기 전에는 `raceRank`가 0이고 화면은 "결과 집계 중..."을 보여 줍니다.
- **레이스 문제는 협상하지 않음.** 같은 매치 id면 모든 클라이언트가 같은 해시로 같은 문제를 고릅니다.

### 알려진 동기화 한계

- broadcast는 재전송되지 않습니다. 코업에 늦게 들어온 사람은 채팅 기록과 현재 문제를 모르고 1번 문제에서 시작합니다.
- 레이스 시간은 각 클라이언트가 페이지에 들어온 시각부터 잽니다. 공통 시작 신호가 없습니다.
- 방 인원 제한(UI의 "/ 2명")은 표시만 하고 강제하지 않습니다.

## 데이터 흐름: 레슨 완료

1. `LessonSimulator`가 마지막 step을 통과하면 `markLessonComplete(slug, durationSec)` 호출 (`src/lib/storage.ts`)
2. localStorage `lck.progress`를 갱신하고 `recordLearningDay()`로 KST 기준 스트릭 증가
3. `lck:progress` 이벤트 발생 → `useProgress` 훅(`StreakBadge` 등이 사용)이 다시 읽음
4. Supabase가 설정돼 있으면 `lesson_progress`에 `(device_id, lesson_slug)` 기준 upsert. 실패는 `.catch(() => {})`로 무시

## 외부 의존성

| 의존성 | 버전 (`package.json`) | 용도 |
|---|---|---|
| `next` | 16.2.6 | App Router, 정적 export |
| `react`, `react-dom` | 19.2.4 | UI |
| `@supabase/supabase-js` | ^2.106.1 | Realtime(WebSocket) + PostgREST |
| `tailwindcss`, `@tailwindcss/postcss` | ^4 | 스타일 |
| Supabase 프로젝트 | — | 선택. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 **빌드 시점에** 넣어야 번들에 포함됨 |

## 실패 처리

| 상황 | 동작 | 위치 |
|---|---|---|
| Supabase env 없음 | `getSupabase()` → `null`. 코업/레이스는 혼자 모드, 리더보드는 로컬 최고 기록, 동접자 배지는 숨김 | `supabase.ts`, `CoopRoom.tsx`, `RaceMode.tsx`, `Leaderboard.tsx`, `PresenceBadge.tsx` |
| 클라우드 쓰기 실패 | 무시. localStorage 기록이 기준 | `storage.ts`, `DailyChallenge.tsx` |
| localStorage JSON 손상 | 빈 값으로 시작 | `getProgress`, `getStreak`, `getRaceScores` |
| 리더보드 조회 실패 | 오류 상태 표시 | `Leaderboard.tsx` |
| SSR(빌드 시) | 브라우저 API 접근 함수는 `typeof window === "undefined"`에서 기본값 반환 | `device-id.ts`, `storage.ts`, `supabase.ts` |
| 채널 정리 | 컴포넌트 unmount 시 `ch.unsubscribe()` | 각 실시간 컴포넌트의 `useEffect` cleanup |

## 보안 모델

- 번들에는 anon key만 들어갑니다(정적 export라 서버 비밀값을 둘 곳이 없음).
- RLS는 select를 모두 허용하고, insert/update는 `device_id` 길이(5–64)와 `time_ms > 0`만 확인합니다. 신원은 클라이언트가 주장하는 device id라 위조할 수 있습니다. 리더보드는 신뢰 기반입니다.
- `daily_challenge_completions`에는 update 정책이 없으므로, 같은 날 두 번째 upsert(`onConflict: device_id,challenge_day`)는 RLS에 막힐 가능성이 큽니다. 오류는 무시되며 실제 Supabase에서는 확인하지 않았습니다.

## 빌드·배포

- `.github/workflows/ci.yml`: PR과 `main` push마다 `pnpm install --frozen-lockfile` → `pnpm lint` → `tsc --noEmit` → `pnpm test` → `pnpm build`
- `.github/workflows/deploy.yml`: `main` push 시 `out/`을 GitHub Pages로 배포. 현재 Supabase env를 넘기지 않음
- Vercel: git 연동으로 루트 경로 배포 (설정은 저장소 밖)
