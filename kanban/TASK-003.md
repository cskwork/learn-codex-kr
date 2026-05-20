---
id: TASK-003
identifier: TASK-003
title: 싱글플레이 레슨 1 — Codex `/goal` 핸즈온
state: Todo
priority: 1
labels:
- frontend
- lesson
- interactive
created_at: '2026-05-20T00:00:02Z'
updated_at: '2026-05-20T00:00:02Z'
---

## 목표

`/lessons/1`에 OpenAI Codex CLI의 `/goal` 워크플로를 처음 접하는 학습자를 위한 5–10분 짜리 인터랙티브 레슨을 만든다.

## Acceptance Criteria

- [ ] 학습 흐름: 도입 카드 → 가짜 터미널에 명령 입력 시뮬레이션 → 즉시 피드백 → 다음 단계
- [ ] 최소 4단계, 최대 6단계
- [ ] 진도는 localStorage에 저장 (서버 연동은 TASK-005에서)
- [ ] 마지막 단계: 완료 화면 + 트위터/카카오톡/링크 공유 버튼 (URL 복사만 동작해도 OK)
- [ ] 모바일 우선 (소프트 키보드 가려도 입력 영역이 보이도록)
- [ ] 한국어 설명, 영문 명령어 (`/goal "..."` 등)는 그대로
- [ ] 키 입력 시뮬레이션은 실제 자판처럼 한 글자씩 표시 (지나친 애니메이션 금지)

## 비목표

- 멀티플레이 요소
- 백엔드 영속화 (TASK-005)
- 실제 Codex CLI 호출 (시뮬레이션만)

## 참고

- 콘텐츠는 `docs/lessons/01-goal.md` 또는 코드 안 상수로 관리. 후속 레슨도 같은 패턴.
- "잘못된 입력" 케이스 1개 이상 포함 — 잘못 치면 부드럽게 정답을 안내
