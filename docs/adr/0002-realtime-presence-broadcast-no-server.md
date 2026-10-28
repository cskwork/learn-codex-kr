# 0002. 실시간 상태를 presence + broadcast로만 동기화

- 상태: 채택 (커밋 `a0b6b35`, 규칙 분리 `2710ec2`, 수정 `e730d22`)
- 근거 코드: `src/app/coop/CoopRoom.tsx`, `src/app/race/RaceMode.tsx`, `src/components/PresenceBadge.tsx`, `src/lib/multiplayer.ts`

## Context

[0001](0001-static-export-with-optional-supabase.md)에 따라 판정을 내려 줄 서버가 없습니다.
그래도 코업(2인이 같은 문제 풀기 + 채팅), 레이스(같은 매치에서 빠른 순서), 전역 동접자 수가 필요했습니다.

## Decision

- Supabase Realtime 채널 하나에서 **presence**(누가 있는지, 각자의 완료 시간)와 **broadcast**(채팅, 정답, 다음 문제)를 씁니다. DB 테이블은 실시간 상태에 쓰지 않습니다.
- presence 키 = device id. 같은 기기의 여러 탭은 한 명입니다.
- 레이스 매치 id는 `r-<epoch 분>`(`matchSlotId`)이고, 문제는 id의 32비트 해시 % 문제 수(`pickForMatch`)입니다. 1분 안에 들어온 사람은 협상 없이 같은 매치·같은 문제를 받습니다.
- 각 클라이언트는 **자기 상태만 씁니다**(레이스 `finishedMs`). 순위는 presence 상태에서 매번 다시 계산합니다(`racersFromPresence`, `raceRank`).
- 코업 `next`는 절대 인덱스를 보내 동시 클릭이 같은 결과로 수렴하게 합니다. `solved`는 `challengeId`를 싣고, 받는 쪽은 자기 문제와 같을 때만 반영합니다(`acceptSolved`).

## Consequences

- 서버 코드, 매치메이킹, 락이 없습니다. 쓰기 충돌이 생길 공유 레코드가 없습니다.
- broadcast는 저장되지 않아 늦게 들어온 코업 참가자는 현재 문제와 채팅 기록을 받지 못합니다. `acceptSolved`는 그 상태에서 엉뚱한 문제가 "정답"으로 표시되는 증상만 막습니다.
- 공통 시작 시각이 없어 레이스 시간은 각자 입장 시점부터 잽니다.
- presence 상태는 서버가 접속 종료 시 정리하므로 떠난 사람이 목록에 남지 않습니다.
- 규칙이 순수 함수(`src/lib/multiplayer.ts`)라 `node --test`로 검증하지만, 채널 왕복 자체는 자동 테스트가 없습니다.

## Alternatives considered

- **Postgres 테이블 + Realtime postgres_changes**: 늦은 참가자도 상태를 읽을 수 있지만 방마다 행을 만들고 지워야 하고, anon 쓰기라 RLS 설계가 더 어려워집니다.
- **방장(host) 권위 모델**: 방을 만든 사람이 상태를 broadcast하면 늦은 참가자 동기화가 쉬워지지만, 방장이 나가면 승계 규칙이 필요합니다.
- **레이스 시작 카운트다운 broadcast**: 공정성은 좋아지지만 누가 시작 신호를 보낼지 정해야 합니다(위와 같은 권위 문제).
