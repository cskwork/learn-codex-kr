---
id: TASK-010
identifier: TASK-010
title: Reddit 소프트 런칭 + 피드백 1차 반영
state: Todo
priority: 3
labels:
- launch
- reddit
- iteration
created_at: '2026-05-20T00:00:09Z'
updated_at: '2026-05-20T00:00:09Z'
---

## 목표

소프트 런칭 게시 4건 + 피드백을 받아 적어도 한 라운드의 이슈 수정 / 콘텐츠 추가를 끝낸다. **이 티켓은 외부 게시를 포함하므로 In Progress로 들어가기 전 운영자(사용자) 명시적 승인 필수**.

## Acceptance Criteria

- [ ] 4개 서브레딧에 한 게시물씩(자기-홍보 규칙과 톤 가이드 준수):
  - r/Korea — 한국어
  - r/programming — 영어
  - r/learnprogramming — 영어
  - r/OpenAI — 영어
- [ ] 각 게시물 본문은 `docs/launch/reddit/<sub>.md` 에 미리 초안 작성 → 사용자 검토 → 사용자 본인 계정으로 직접 업로드
- [ ] 첫 24시간 동안 댓글 모니터링 후 `docs/launch/feedback.md`에 인사이트 정리
- [ ] 인사이트 중 우선 1개 이상에 대해 별도 patch 티켓을 추가 후 처리
- [ ] 게시 전 repo public 전환(TASK-001) + 라이브 URL 도달 확인

## 비목표

- 유료 광고
- 인플루언서 협찬

## 가이드

- "Reddit Responsible Builder Policy" 준수: 정직한 작성자 표기, AI 도움 사용 사실 명시, 셀프-홍보 비중 조절
- 한 서브레딧에 동일 본문 중복 금지(필요 시 톤/길이만 조절)
- 부정적 댓글에는 24시간 안에 정중한 응답
