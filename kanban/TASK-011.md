---
id: TASK-011
identifier: TASK-011
title: 동시 접속자 100명 도달까지 콘텐츠/인프라/홍보 사이클
state: Todo
priority: 3
labels:
- growth
- ops
- retention
created_at: '2026-05-20T00:00:10Z'
updated_at: '2026-05-20T00:00:10Z'
---

## 목표

5분 평균 동시 접속자 100명을 1회 이상 달성하고, 그 시점의 CCU 그래프를 캡처한다. 이 티켓은 여러 turn에 걸친 운영 사이클을 포함하므로 finalize 전에 사용자(운영자)의 confirm을 요구한다.

## Acceptance Criteria

- [ ] CCU 측정 대시보드 또는 cron-export — 매분 측정값 저장
- [ ] 100 CCU 도달까지 콘텐츠 추가 / 버그 수정 / SNS 푸시 사이클 반복:
  - 신규 콘텐츠 1개/주 이상 추가
  - 트위터·디스코드·페북 그룹·해커뉴스 등 적어도 1개 추가 채널 시도
  - 핫픽스 평균 24시간 이내
- [ ] 100 CCU 도달 직후 30분 동안 인프라 안정성 점검 (Fly.io 리소스, latency)
- [ ] `docs/launch/ccu-100-evidence.md` — 도달 시각, 스크린샷, latency 데이터, 어떤 채널이 기여했는지

## 비목표

- 200/500/1000 CCU 목표 — 별도 후속 이니셔티브
- 결제/구독

## 운영

- 100 CCU 미도달 상태에서 Symphony 이 티켓을 close하지 말 것. 진척 보고만 누적.
- 한국 시간대 저녁 8–11시가 도달 가장 가능성 큰 시간대 — 푸시 타이밍 의식
