# Product

<!-- impeccable:product-schema 1 -->

> Provenance: written 2026-09-24 during an unattended redesign run. No interview
> was possible; every fact below is inferred from the repository (README.md,
> LAUNCH.md, .omc/ultragoal/brief.md, src/) and the owner's standing approval to
> revamp. Items marked **(inferred)** should be confirmed by the owner.

## Platform

web

## Users

- Korean-speaking developers and learners meeting OpenAI Codex CLI for the first
  time, or who want the `/goal` → `/plan` → `/verify` habit in their hands.
- They often study in short bursts on a phone (commute, break) and sometimes
  with a friend. **(inferred from brief: "모바일 우선", "친구와 함께")**

## Product Purpose

A Korean, no-signup, browser-based practice ground for Codex CLI. The visitor
types real commands into a simulated terminal, gets instant feedback, and leaves
each lesson with a reusable routine: a goal sentence, a small plan, and a
verification checklist. Success for the project is sustained concurrent
learners (brief target: 100 CCU); success for a visitor is finishing the first
lesson in about five minutes.

## Positioning

Not a translated docs site: it rehearses the actual Codex workflow in Korean,
with typed commands checked against expected answers, and wraps it in daily,
co-op and race loops so people come back. **(inferred)**

## Operating Context

- Five static lessons (`src/lib/lessons.ts`): intro, /goal, /plan, /verify,
  real-world cycle. Step kinds: intro, prompt, choice, terminal, summary.
- Daily challenge (KST day rotation), streak, race (1-minute match slots),
  co-op rooms (5-char code), weekly leaderboard.
- Progress lives in `localStorage` per device; Supabase (optional) adds cloud
  sync, realtime presence, co-op and race. Production on Vercel currently has
  **no** Supabase variables, so realtime features run in their offline modes.

## Capabilities and Constraints

- Next.js 16 App Router, static export (`output: "export"`), Tailwind v4.
- Deployed twice: GitHub Pages under `/learn-codex-kr` basePath, and Vercel
  (`learn-codex-kr.vercel.app`) at the root.
- No backend, no accounts, no analytics SDKs to be added.
- Display brand in UI: "codex-tutorial"; repository/URL name: learn-codex-kr.

## Brand Commitments

- Korean first; English only for commands and product names.
- Name shown to visitors: codex-tutorial (introduced 2026-05-23 commit 42d4b84).

## Evidence on Hand

- Real: lesson content, challenge content, terminal output examples.
- Absent (must not be fabricated): user counts, testimonials, completion
  statistics, ratings. The presence counter must never show invented numbers.

## Product Principles

1. First success in five minutes beats completeness.
2. Practice the real command, not a description of it.
3. Every "done" is verified; the product models the `/verify` habit it teaches.
4. Honest about what is offline or local-only.
5. Works one-handed on a phone.

## Accessibility & Inclusion

- Korean text at comfortable reading size; terminal inputs usable with mobile
  keyboards (no autocorrect/autocapitalize).
- Feedback must be perceivable without colour alone and announced to assistive
  tech. **(inferred)**
