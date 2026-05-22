# LAUNCH.md — G010 + G011 운영 플레이북

이 파일은 **사람이 직접 해야 하는** 작업의 체크리스트입니다. 코드는 다 들어가 있지만,
외부 인프라(Supabase, GitHub Pages, Reddit)는 코드만으로는 켤 수 없으므로 단계별로 적습니다.

## 1. Supabase 프로젝트 켜기 (G005–G009 실제 동작)

1. <https://supabase.com> 에서 무료 프로젝트 생성 (리전: Tokyo 추천)
2. `Project Settings → API` 에서 두 값을 복사:
   - Project URL
   - anon public key
3. **로컬**: 저장소 루트에 `.env.local` 만들고 채우기
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```
4. **DB 스키마**: Supabase 대시보드 `SQL Editor` 에서
   `supabase/migrations/0001_init.sql` 을 통째로 붙여 넣고 RUN.
   (또는 `supabase db push` — supabase CLI 설치되어 있을 때)
5. **Realtime 활성화**: 기본으로 켜져 있어야 함. presence/broadcast 채널 사용.
6. **GitHub Actions에도 같은 변수 추가**:
   `Settings → Secrets and variables → Actions → New repository secret`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   그리고 `.github/workflows/deploy.yml` 의 `pnpm build` 스텝 `env:` 블록에
   ```yaml
       env:
         NODE_ENV: production
         NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
         NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
   ```
   를 추가. (Next.js는 `NEXT_PUBLIC_` prefix 환경변수를 빌드 타임에 정적 export 번들에 박음.)
7. `git push` 후 GitHub Actions 가 다시 빌드 → 실시간/리더보드/일일챌린지가 실제로 동작.

## 2. 도메인 / SEO

- GitHub Pages 기본 URL: `https://cskwork.github.io/learn-codex-kr/`
- 커스텀 도메인 붙이려면 `public/CNAME` 추가 + DNS A 레코드 (185.199.108.153 외 3개).
- `next.config.ts` 의 `basePath` 와 `assetPrefix` 는 GitHub Pages 서브패스 (`/learn-codex-kr`) 용.
  커스텀 루트 도메인을 쓰면 둘 다 비워야 함.

## 3. G010 — Reddit 소프트 런칭

대상 서브레딧 (한국어/영어 혼합):

- r/Korea — 한국어 학습 사이트로 자연스럽게
- r/programming — 영어 + Korean Codex CLI learning site
- r/learnprogramming — beginner-friendly framing
- r/OpenAI — 코덱스 사용자 풀

런칭 체크리스트:

- [ ] 각 서브 규칙 다시 읽기 (자가 홍보 금지 룰 확인)
- [ ] 첫 코멘트에 본인이 만들었음을 명시
- [ ] 모바일에서 한 번 더 페이지 확인 후 게시
- [ ] Vercel Analytics 또는 GA 가 살아 있는지 확인
- [ ] 페이지 댓글 즉시 응답 가능한 시간대에 게시

샘플 영문 자기소개:
> I built a tiny Korean-first interactive site to learn the OpenAI Codex CLI.
> 5–10 min lessons, no signup, mobile-friendly, with co-op + race multiplayer.
> Feedback welcome — link: https://cskwork.github.io/learn-codex-kr/

## 4. G011 — 100 CCU 도달 운영 루프

- `lck:global` 채널의 presence count 가 곧 동시 접속자 수.
- 5분간 100명 유지를 목표. 한 번에 만들 필요 없음. 평일 저녁 9–11시 KST 푸시.
- 콘텐츠 추가 우선순위:
  1. 레슨 1개 더 (예: 디버깅 시나리오)
  2. 일일 챌린지 풀에 5개 추가
  3. 코업 챌린지 5개 추가
- 인프라 보강:
  - Supabase 무료 티어: 동시 200 connections — 100 CCU는 안전 범위
  - 무료 티어 Realtime 메시지 cap 확인 필요
  - 메시지/Presence sync 빈도가 너무 잦으면 throttle (현재 `eventsPerSecond: 5`)
- 측정:
  - presence count 를 1분마다 sample → spreadsheet 기록
  - 5분 연속 100명 도달 시 ledger 에 `ccu_100_sustained` 이벤트 기록

## 5. 운영 중 비상 체크리스트

- 페이지가 안 뜸 → GitHub Pages Actions 로그 확인
- 인증/저장 안 됨 → 브라우저 콘솔에서 supabase URL/Anon Key 가 박혔는지 확인
- 코업/레이스 채널이 비어 보임 → Supabase 대시보드 Realtime 로그 확인
- 비용 알람 → Supabase 무료 티어 한도 확인 (DB egress, Realtime msg)

## 6. 끝나면

`.omc/ultragoal/ledger.jsonl` 에 다음 이벤트 추가:

```jsonl
{"ts":"...","event":"goal_complete","goalId":"G010-...","message":"reddit launch posted, N comments"}
{"ts":"...","event":"goal_complete","goalId":"G011-...","message":"100 CCU sustained for 5 min"}
```

그리고 `goals.json` 의 해당 항목 status 를 `done` 으로 업데이트.
