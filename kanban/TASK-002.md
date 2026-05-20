---
id: TASK-002
identifier: TASK-002
title: 한국어 랜딩 페이지 (모바일 우선)
state: Todo
priority: 1
labels:
- frontend
- landing
- ko
created_at: '2026-05-20T00:00:01Z'
updated_at: '2026-05-20T00:00:01Z'
---

## 목표

`/` 경로에 모바일 우선 한국어 랜딩 페이지를 만든다. 회원가입 없이 첫 레슨을 곧장 체험할 수 있다는 가치를 30초 안에 전달.

## Acceptance Criteria

- [ ] 모바일 viewport(375x812)에서 첫 화면 안에 hero + CTA 1개 노출
- [ ] hero 카피: 한 줄 가치제안 + 한 줄 보조 설명 (한국어)
- [ ] 3단계 미리보기 카드(레슨 → 코업 → 레이스) — 글자 위주, 이미지 없음 가능
- [ ] CTA: `첫 레슨 무료로 체험하기` 버튼 → `/lessons/1` (TASK-003에서 구현 예정, 일단 dead-link OK)
- [ ] light/dark 자동 (system) 또는 dark-first; 텍스트 대비 WCAG AA
- [ ] Tailwind v4만 사용. 외부 디자인 시스템 도입 금지
- [ ] `pnpm build` 와 `pnpm lint` 통과

## 비목표

- 풀 디자인 시스템 / 컴포넌트 라이브러리 도입
- 다국어 토글 (영어는 후순위)
- 인증/세션 (TASK-005)

## 작업 힌트

- `src/app/page.tsx` 의 placeholder를 교체
- Next 16 metadata API는 학습 데이터와 다를 수 있음 — `node_modules/next/dist/docs/`의 metadata 가이드 확인
- 모바일 viewport 검증은 Playwright 또는 macOS Chrome `--window-size=375,812 --headless`로 스크린샷 캡처
