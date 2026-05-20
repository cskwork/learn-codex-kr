# learn-codex-kr — Ultragoal Brief

## What
한국어로 OpenAI Codex CLI를 인터랙티브하게 배우는 멀티플레이어 학습 사이트.
모바일 친화. 회원가입 없이도 1차 체험 가능. 동접자 100명 유지가 최종 성공 지표.

## Audience
- 한국어 개발자 / 학습자
- Codex CLI를 처음 접하거나, /goal·plan·verify 같은 워크플로를 손에 익히고 싶은 사용자
- 모바일에서 짧게 학습하거나, 친구와 함께 챌린지 풀고 싶은 사람

## Modes
- 싱글플레이 레슨: Codex 핵심 개념을 5-10분짜리 인터랙티브 시뮬레이션으로 학습
  - 키 입력 시뮬레이션 + 즉시 피드백
  - 한국어 설명 + 영문 명령어 병기
- 코업(co-op) 멀티플레이: 2명이 짝코딩 형태로 Codex 챌린지 해결
- 레이스(race) 멀티플레이: 최단 시간/최적 프롬프트로 챌린지 정답 도달
- 리더보드 + 일일 챌린지 + 스트릭(연속 학습일)

## Tech (chosen for free-tier deployability + speed of iteration)
- 프론트엔드: Next.js 15 (App Router) + TypeScript + Tailwind v4
- 프론트 배포: Vercel free tier (vercel.app 서브도메인 시작)
- 백엔드/멀티플레이 WS 서버: Self-hosted on Fly.io free tier (Node + ws + 가벼운 in-memory + SQLite/Postgres litestream)
- 인증: 익명 device-id 세션이 기본 (서버에서 발급 + JWT). 진도 영구화 시 이메일 매직링크 옵션 추가 (Resend free tier 검토)
- 분석: Vercel Analytics + 서버 자체 presence/CCU counter

## Constraints
- 모바일 우선 디자인. 데스크톱은 보너스.
- 회원가입 없이 첫 레슨 체험 가능. 진도 저장하려면 매직링크/익명 세션 업그레이드.
- 콘텐츠는 한국어 기본. 영어 토글은 후순위.
- 비용은 free tier에서 100 CCU 유지 가능한 범위.

## Success Metric
**동시 접속자 100명 이상 지속 유지** (5분 평균, 24시간 중 1회 이상 도달).
Reddit / 커뮤니티 피드백 루프를 통해 콘텐츠와 UX를 반복 개선하며 도달.

## Strategy
1. 빠르게 MVP (landing + 첫 싱글플레이 레슨) → 친구·소규모 커뮤니티 베타
2. 멀티플레이 코업 추가 → 짝 학습 자랑 가능한 공유 가능 경험
3. 레이스 + 리더보드 → Reddit 등에 공유할 강력한 후크
4. r/Korea, r/programming, r/learnprogramming, r/OpenAI, 디스코드/페이스북 그룹 등 채널 배포
5. 피드백 → 콘텐츠 추가, 버그 픽스, 성능 개선
6. 100 CCU 달성까지 위 사이클 반복
