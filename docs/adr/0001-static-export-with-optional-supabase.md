# 0001. 서버 없는 정적 export + 선택적 Supabase

- 상태: 채택 (커밋 `11d517b`, `ba4ca6b`, `a0b6b35`)
- 근거 코드: `next.config.ts`, `src/lib/supabase.ts`, `.env.local.example`, `.github/workflows/deploy.yml`

## Context

사이트는 GitHub Pages(정적 호스팅)로 처음 배포됐고(`ba4ca6b`), 나중에 Vercel 루트 경로 배포가 추가됐습니다(`b6355d9`).
GitHub Pages에서는 서버 코드를 실행할 수 없습니다. 동시에 코업·레이스·리더보드처럼 공유 상태가 필요한 기능도 계획에 있었습니다
(`.omc/ultragoal/goals.json`의 G005–G009).

## Decision

- Next.js를 `output: "export"`로 빌드하고 API 라우트·미들웨어·서버 액션을 쓰지 않습니다.
- 공유 상태는 브라우저에서 Supabase JS 클라이언트(anon key)로 직접 다룹니다.
- `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`가 없으면 `getSupabase()`가 `null`을 반환하고, 각 화면이 혼자 모드·로컬 기록으로 내려갑니다.

## Consequences

- 호스팅 비용과 운영 대상이 없습니다. 같은 `out/`을 GitHub Pages와 Vercel 어디든 올릴 수 있습니다.
- env는 **빌드 시점에** 번들로 인라인됩니다. 배포 빌드에 env를 넣지 않으면 실시간 기능이 꺼진 채 배포됩니다. 2026-10-28 기준 두 라이브 빌드가 이 상태입니다(번들에 Supabase URL 없음).
- 서버 측 검증이 없어 쓰기 권한은 RLS와 클라이언트가 주장하는 device id에만 의존합니다. 점수 위조를 막을 수 없습니다.
- 모든 브라우저 API 접근을 `typeof window === "undefined"`로 감싸야 정적 생성 중 깨지지 않습니다.

## Alternatives considered

- **Next.js 서버(Route Handlers) + 자체 WebSocket 서버**: 점수 검증과 상태 저장이 가능하지만 GitHub Pages에 올릴 수 없고 상시 서버가 필요합니다. 커밋 `056449b`(dev 브랜치)의 작업 계획에는 "WS server on Fly.io"가 있었으나 main에는 구현되지 않았습니다.
- **Supabase를 필수로**: 코드가 단순해지지만 env 없는 포크·로컬 실행·현재 배포에서 멀티플레이 페이지가 막다른 길이 됩니다.
