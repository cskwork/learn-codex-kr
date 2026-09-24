---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/lessons","src/app/daily","src/app/race","src/app/coop","src/app/leaderboard"]
---

# Surface brief: home + learning surfaces (src/app/page.tsx and lesson/daily/race/coop/leaderboard routes)

Scope: whole site redesign (replacement visual world). Mode: Persuade on `/`; Operate on lesson, daily, race, coop, leaderboard.
Audience/job: Korean learners meeting Codex CLI, often on a phone; finish lesson 1 in ~5 minutes.
Proof/content: real lesson + challenge content only; no invented counts or testimonials.
Constraints: static export, GitHub Pages basePath + Vercel root; localStorage progress; Supabase optional (absent in Vercel prod).
Decision note: run was unattended; the assigned direction was built without a user round (disclosed in the run report).

## Direction contract

THESIS: The site is a machine-graded exam answer card (OMR 답안지) for Codex CLI. Every typed command is "marked" and "read" like a 컴퓨터용 사인펜 answer. It refuses the category default of a neon-on-black fake terminal with glowing cards.

OWN-WORLD: Bright answer-sheet white paper, everything structural printed in OMR pink-red ink (rules, column heads, tinted header bands, hollow answer ovals); user marks in dense marker black; a black timing-mark track runs down the card edge. Myeongjo display type like a 수능 paper, Noto Sans KR body, Nanum Gothic Coding for commands, numerals and times. No rounded cards, no glow, no gradients.

STORY: Visitor recognizes the 답안지 instantly, understands "you answer, it grades you", sees their own progress as filled ovals, starts 1교시 (lesson 1).

FIRST VIEWPORT: Desktop two columns: left, exam-paper header band ("Codex CLI 실전 연습 · 제1교시"), myeongjo headline at display scale, lede, black primary action "5분 만에 첫 작업 성공하기" + secondary. Right, a live answer card: 문항 1-5 = lessons with step ovals filled from localStorage, a 주관식 답란 showing a graded demo command, timing marks on the edge, and the pen object. Mobile: header, headline, action above the fold; card follows.

FORM: OMR answer card (list position 7 of 7; seed key 7459d415). Raises: from forging, one step per full-width 문항 row; from the anime wall, monumental Nanum Gothic Coding numerals for times; from the oscilloscope, all layout snaps to the card's grid module and the timing track measures progress; from tensegrity, graded answers carry pinned 판독 annotations.
SIGNATURE INTERACTION: marking an oval fills it with a marker stroke (clip-path wipe) and the timing track advances; reduced motion fills instantly.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
