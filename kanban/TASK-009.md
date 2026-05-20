---
id: TASK-009
identifier: TASK-009
title: 리더보드 + 일일 챌린지 + 스트릭 + 공유
state: Todo
priority: 3
labels:
- retention
- frontend
- backend
created_at: '2026-05-20T00:00:08Z'
updated_at: '2026-05-20T00:00:08Z'
---

## 목표

Retention loop를 만든다 — 매일 한 번 새로 도는 일일 챌린지, 연속 학습일 스트릭, 주간 리더보드, 공유 카드.

## Acceptance Criteria

- [ ] `/daily` — 그날의 챌린지 1개 노출, 클리어 시 스트릭 +1
- [ ] 스트릭 표시: 헤더의 작은 뱃지 (`🔥 N일`)
- [ ] `/leaderboard` — 주간 상위 20명(닉네임 또는 device-id 마지막 6자리)
- [ ] 챌린지 클리어 시 공유 카드 OG 이미지 생성 (`/api/og?...` Next 16 ImageResponse)
- [ ] Vercel Analytics + 자체 이벤트 (`lesson_completed`, `race_won`, `coop_solved`) wired
- [ ] 일일 챌린지 콘텐츠는 데이터 파일 (`src/content/daily/*.ts`) — 30일 분량 시드

## 비목표

- 시즌제/소셜 그래프 / 친구 시스템
- 결제

## 운영

- 일일 챌린지 게이트는 UTC 기준 자정 리셋. 한국 사용자 편의 위해 KST 자정 옵션도 토글 가능.
- 스트릭 데이터는 서버에서만 신뢰 — 클라이언트 위변조 방지
