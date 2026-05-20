---
id: TASK-006
identifier: TASK-006
title: 실시간 presence — 지금 N명 학습 중
state: Todo
priority: 2
labels:
- backend
- frontend
- realtime
created_at: '2026-05-20T00:00:05Z'
updated_at: '2026-05-20T00:00:05Z'
---

## 목표

WS 서버에 presence 채널을 붙여, 랜딩과 레슨 화면에 실시간 동시 접속자 수를 표시한다. 100 CCU 목표 진척의 핵심 시그널.

## Acceptance Criteria

- [ ] WS 엔드포인트 `/ws` — 클라이언트 연결 시 anon 세션 식별, presence room `global`에 가입
- [ ] 서버에서 5초마다 전체 CCU broadcast
- [ ] 프론트 훅 `usePresence()` — 동시 접속자 수 노출
- [ ] 랜딩 hero 아래 `🟢 지금 N명이 함께 학습 중` 표시
- [ ] 레슨 화면 헤더에도 동일 표시
- [ ] N=0이거나 연결 실패 시 graceful degradation (위젯 숨김)
- [ ] 단위 테스트: presence 가/감 시 카운트 정확

## 비목표

- 룸별 presence (TASK-007에서)
- 채팅 (TASK-007)

## 운영

- presence broadcast 주기는 환경 변수로 조정 가능하게 (`PRESENCE_INTERVAL_MS=5000`)
- 분당 broadcast 메시지 = CCU × 12. 100 CCU 기준 1.2k/min — 무리 없음
