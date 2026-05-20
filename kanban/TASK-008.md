---
id: TASK-008
identifier: TASK-008
title: 멀티플레이 레이스(race) + 공개 로비 + 매칭
state: Todo
priority: 2
labels:
- multiplayer
- race
- ws-server
created_at: '2026-05-20T00:00:07Z'
updated_at: '2026-05-20T00:00:07Z'
---

## 목표

`/race` 공개 로비에서 자동 매칭으로 2–4명을 묶어 같은 챌린지를 푸는 레이스 모드. 가장 빠르게 정답에 도달한 사람이 승리.

## Acceptance Criteria

- [ ] `/race` 페이지 — `매칭 시작` 버튼, 대기 중인 인원 수 표시
- [ ] 매칭 큐: 2–4명 모이면 자동 시작 (3초 카운트다운)
- [ ] 1개 이상의 race-mode 챌린지(짧고 명확, ~60초 클리어 목표)
- [ ] 결과 화면: 순위, 시간, 시도 횟수 + 공유 카드
- [ ] 룸 내 라이브 진행률 broadcast(다른 플레이어가 어디까지 갔는지)
- [ ] 모바일 UX 무리 없음 (가독성 우선, 화려한 애니메이션 자제)
- [ ] 한 사람이 나가도 나머지 끝까지 진행 가능

## 비목표

- 랭킹 시즌제 (TASK-009)
- 친구 초대 매칭 (TASK-007이 코업 측면을 커버)

## 운영

- 큐는 메모리. 재시작 시 사라짐 OK.
- presence broadcast와 race broadcast는 별도 채널 구독으로 분리
