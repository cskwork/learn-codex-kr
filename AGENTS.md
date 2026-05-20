# AGENTS.md — Operator + worker entry point for learn-codex-kr

<!-- BEGIN:project-context -->
## Project: learn-codex-kr

OpenAI Codex CLI를 한국어로 인터랙티브하게 배우는 멀티플레이어 학습 사이트.
모바일 친화. 회원가입 없이 1차 체험 가능. 동시 접속자 100명 유지가 최종 목표.

- 프론트엔드: **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind v4
  — Next 16은 학습 데이터의 Next.js와 API/관례가 다를 수 있다. 코드를 쓰기 전
  `node_modules/next/dist/docs/`의 해당 가이드를 읽고 deprecation 경고에 주의.
- 멀티플레이 WS 서버: Self-hosted on Fly.io (Story 6+)
- 인증: 익명 device-id 세션 기본 + 매직링크 옵션 (Story 5+)
- 배포: Vercel (프론트), Fly.io (WS 서버)
- 패키지 매니저: **pnpm** (Node 22). `pnpm install`, `pnpm dev`, `pnpm build`,
  `pnpm lint`. `npm`/`yarn` 명령은 쓰지 말 것.
- 언어: 사용자 보이는 모든 UI/문서/티켓 응답은 **한국어 기본**. 코드 식별자와
  영문 명령어는 그대로.
- 모바일 우선. 데스크톱은 보너스. 모든 UI 변경은 모바일 viewport(375x812 기준)
  에서 검증할 것.

전체 컨셉/타깃/성공 지표는 `.omc/ultragoal/brief.md` 참고. 11개 story 단위로
잘게 나뉘어 있으며 ledger는 `.omc/ultragoal/ledger.jsonl`.
<!-- END:project-context -->

## Symphony 운영 (operator)

This repo runs **Symphony**, a polling orchestrator that dispatches coding
agents (Codex / Claude Code / Gemini / Pi) at a Kanban board. This file is
the discovery point that Codex (and any other `AGENTS.md`-respecting CLI)
reads on startup so the **operator** — the human or agent running
`symphony` — has the same skill guidance Claude Code gets from
`.claude/skills/`.

## Source of truth: `skills/`

All operator-side skills live in `skills/<name>/`. Each skill has a
`SKILL.md` with YAML frontmatter (`name`, `description`, optional triggers)
and a `reference/` folder of deep-dive pages. `.claude/skills/` is a thin
symlink layer for Claude Code's native discovery — do not edit through it,
edit the canonical files under `skills/`.

## Available skills (operator-facing)

Load `skills/<name>/SKILL.md` and follow it when the user's request matches
the trigger description below. Open `skills/<name>/reference/<page>.md` only
when the SKILL.md decision table tells you to.

### `using-symphony`

> Use when the user wants to dispatch coding agents (Codex / Claude Code /
> Gemini / Pi) against a Kanban board via this `oh-my-symphony` repo
> — adding/listing/transitioning tickets, launching the TUI, inspecting
> orchestrator state, customizing the workflow (lanes, per-state prompts),
> delegating sub-tasks to free up context, or diagnosing dispatch failures.
> Triggers on phrases like "add a symphony task", "run symphony", "dispatch
> this ticket", "symphony board", "WORKFLOW.md", "symphony tui won't start",
> "ticket failed with worker_exit", "customize kanban states", "deploy
> pipeline workflow", "delegate to symphony", "agent.kind: pi", "agent
> silent for N seconds".

Entry: `skills/using-symphony/SKILL.md`

### `symphony-oneshot`

> Use when the user wants a single prompt — a feature, a bugfix, a
> refactor, or a whole product — driven end-to-end through a rigorous
> decompose-build-verify-QA-deliver pipeline with a shared `.oneshot/vault/`
> for cross-agent knowledge and mechanical bash gates that refuse to close
> without proof. For browser apps, the QA gate produces Playwright +
> screenshots + a signed PDF report. Distinct from `using-symphony` (which
> is the bare CLI for ad-hoc tickets). Triggers on phrases like "one-shot
> this", "OneShot pattern", "decompose and dispatch with proof", "build
> with verification gates", "Playwright sign-off PDF", "fix this bug
> end-to-end", "ship this feature with QA evidence".

Entry: `skills/symphony-oneshot/SKILL.md`

## Worker-side guidance

Dispatched workers (the agent CLI running inside a per-ticket workspace) do
**not** consume these operator skills. Worker behavior is driven by
`WORKFLOW.md`'s `prompts.base` + `prompts.stages` map, which renders stage
prompts from `docs/symphony-prompts/<flavor>/`. That layer is already
cross-platform — codex/claude/gemini/pi workers all receive the same
rendered prompt for a given ticket state.

## Conventions for this repo

- Read `WORKFLOW.md` and a couple of `kanban/*.md` files before any
  recommendation — settings vary per fork.
- Run `symphony doctor ./WORKFLOW.md` before launching anything.
- See `skills/using-symphony/SKILL.md` "Bootstrapping" for the full file
  set required when copying Symphony into another project.
