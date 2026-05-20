---
id: TASK-004
identifier: TASK-004
title: 레슨 라이브러리 + 추가 4개 레슨
state: Todo
priority: 2
labels:
- frontend
- lesson
- content
created_at: '2026-05-20T00:00:03Z'
updated_at: '2026-05-20T00:00:03Z'
---

## 목표

`/lessons` 인덱스 페이지 + 레슨 2–5(`/plan`, `/verify`, 멀티스텝 실전 워크플로, "내 첫 PR 만들기")를 한국어로 추가한다.

## Acceptance Criteria

- [ ] `/lessons` 페이지: 5개 카드 (제목, 1줄 요약, 예상 시간, 완료 표시)
- [ ] 각 레슨 페이지: TASK-003과 같은 인터랙티브 패턴
- [ ] 진도/완료는 localStorage 기반 (TASK-005에서 서버 동기)
- [ ] 콘텐츠는 별도 모듈(`src/content/lessons/*.ts` 또는 markdown)로 분리, 페이지 컴포넌트는 데이터 의존
- [ ] 모바일에서 카드 그리드 정상 정렬

## 비목표

- 무한 레슨 시스템 / CMS
- 인증/서버 진도 (TASK-005)
- 멀티플레이 (TASK-007/008)

## 콘텐츠 가이드

- 레슨 2 `/plan`: 작업을 잘게 쪼개는 사고법
- 레슨 3 `/verify`: 끝났다고 말하기 전 증명 모으기
- 레슨 4 멀티스텝: 실전 PR 시나리오 한 사이클
- 레슨 5: "내 첫 PR 만들기" 체크리스트 형식
