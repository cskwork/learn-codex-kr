# learn-codex-kr

> OpenAI Codex CLI를 한국어로 인터랙티브하게 배우는 멀티플레이어 학습 사이트.
> 모바일 친화. 회원가입 없이 1차 체험 가능. 목표는 **동시 접속자 100명 유지**.

## 무엇을 만드나

- **싱글플레이 레슨** — `/goal`, `/plan`, `/verify` 같은 Codex CLI 핵심 워크플로를 5–10분 짜리 시뮬레이션으로 익힘
- **코업(co-op) 멀티플레이** — 2명이 짝을 이뤄 같은 Codex 챌린지를 함께 해결
- **레이스(race) 멀티플레이** — 가장 빠른/좋은 프롬프트로 챌린지 정답 도달
- **리더보드 + 일일 챌린지 + 스트릭** — 다시 오게 만드는 retention loop

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프론트엔드 | Next.js 16 (App Router) + TypeScript + Tailwind v4 |
| 프론트 배포 | Vercel free tier |
| 멀티플레이 WS 서버 | Self-hosted on Fly.io free tier (예정, Story 6+) |
| 인증 | 익명 device-id 세션 기본 + 매직링크 옵션 (예정, Story 5) |
| 분석 | Vercel Analytics + 서버 자체 presence/CCU 카운터 |

## 로컬 개발

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # 프로덕션 빌드 검증
pnpm lint
```

Node 22, pnpm 10 기준. 다른 버전은 동작은 하지만 보증하지 않음.

## 진행 상태

이 프로젝트는 [`omc ultragoal`](https://github.com/cskwork/oh-my-claudecode) 워크플로로
다세션에 걸쳐 점진적으로 빌드됩니다.

- 11개 story로 분할된 plan: `.omc/ultragoal/goals.json`
- 시작/체크포인트/블로커 이벤트: `.omc/ultragoal/ledger.jsonl`
- 컨셉/타깃/성공 지표: `.omc/ultragoal/brief.md`

현재 Story: **G001 Bootstrap** — repo + Next.js scaffold + Vercel deploy.

## 기여

지금은 초기 단계입니다. Reddit/이슈에서 피드백 환영.

## 라이선스

MIT.
