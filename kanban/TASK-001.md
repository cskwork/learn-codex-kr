---
id: TASK-001
identifier: TASK-001
title: Vercel 프로덕션 배포 + public 전환
state: Todo
priority: 1
labels:
- bootstrap
- deploy
created_at: '2026-05-20T00:00:00Z'
updated_at: '2026-05-20T00:00:00Z'
---

## 목표

Story 1 Bootstrap의 잔여 작업 — `learn-codex-kr` Next.js 앱을 Vercel free tier로 프로덕션 배포하고, GitHub repo를 public으로 전환한다.

## 배경

repo `https://github.com/cskwork/learn-codex-kr` 는 이미 생성됨 (private). `pnpm build`는 로컬에서 통과. `next.config.ts`에 `turbopack.root`가 잡혀 있어 워크스페이스 경고 없음. Vercel 배포만 남았음.

## Acceptance Criteria

- [ ] `vercel link` (또는 동등한 절차)로 cskwork 계정 아래 프로젝트 생성
- [ ] `vercel --prod`로 첫 프로덕션 배포 완료
- [ ] 배포 URL이 모바일(375x812)에서 한국어 hero를 정상 렌더
- [ ] `gh repo edit cskwork/learn-codex-kr --visibility public --accept-visibility-change-consequences` 로 public 전환
- [ ] README에 라이브 URL 한 줄 추가
- [ ] QA 단계에서 `curl -I <prod-url>` 200 응답 캡처

## 비목표

- 커스텀 도메인 연결 (후순위)
- Analytics 설치 (TASK-009)
- 인증 / DB 연결 (TASK-005)

## 참고

- 환경 변수는 아직 필요 없음 (Story 5에서 추가)
- `pnpm-workspace.yaml`이 root에 있음 — Vercel CLI가 모노레포로 오해하지 않도록 주의
