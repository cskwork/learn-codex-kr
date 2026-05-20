---
id: TASK-005
identifier: TASK-005
title: 익명 device-id 세션 + 진도 서버 동기화
state: Todo
priority: 2
labels:
- backend
- auth
- ws-server
created_at: '2026-05-20T00:00:04Z'
updated_at: '2026-05-20T00:00:04Z'
---

## 목표

Fly.io에 호스팅할 자체 백엔드(WS + 가벼운 HTTP) 첫 버전을 만들고, 익명 device-id 기반 세션과 레슨 진도 영속화를 붙인다.

## Acceptance Criteria

- [ ] `server/` 디렉토리에 Node + TypeScript 백엔드 (간단한 Fastify 또는 Hono)
- [ ] 엔드포인트: `POST /api/session` (device-id로 anon 세션 + JWT 발급), `GET /api/me/progress`, `PUT /api/me/progress`
- [ ] 저장소: SQLite + better-sqlite3 (Fly.io volume), 추후 litestream 백업 가능
- [ ] Next.js 프론트에서 localStorage를 서버 진도와 머지(서버 우선, 로컬은 fallback)
- [ ] Fly.io에 1차 배포 + `fly.toml` 커밋
- [ ] CORS 화이트리스트는 vercel.app 도메인 + localhost
- [ ] JWT 시크릿은 환경 변수로만, 코드에 하드코딩 금지

## 비목표

- 매직링크 / 이메일 인증 (다음 이터레이션)
- 멀티플레이 룸 (TASK-007)
- 리더보드 (TASK-009)

## 참고

- 서버는 가능한 작고 단단하게. ws 서버는 같은 프로세스에서 마운트 권장.
- Fly.io free tier 한도 안에서 100 CCU 목표 — 메모리/디스크 사용을 시작부터 측정
