---
name: codex-tutorial (learn-codex-kr)
description: A Korean Codex CLI practice ground dressed as a machine-graded OMR answer card.
colors:
  paper: "#fdfdfb"
  paper-2: "#fbf1f4"
  ink: "#c7255b"
  ink-strong: "#a3163f"
  ink-line: "#ec9bb6"
  ink-hair: "#f6cdda"
  ink-tint: "#fde9ef"
  marker: "#141214"
  text: "#221c1f"
  text-2: "#5b4b52"
  pen: "#2447b3"
  pen-tint: "#e9eefc"
typography:
  display:
    fontFamily: "Nanum Myeongjo, AppleMyungjo, serif"
    fontSize: "clamp(2.6rem, 6vw, 4.1rem)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Nanum Myeongjo, AppleMyungjo, serif"
    fontSize: "2.4rem"
    fontWeight: 800
    lineHeight: 1.2
  title:
    fontFamily: "Nanum Myeongjo, AppleMyungjo, serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.35
  body:
    fontFamily: "Noto Sans KR, Apple SD Gothic Neo, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "Noto Sans KR, Apple SD Gothic Neo, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.4
  code:
    fontFamily: "Nanum Gothic Coding, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: "0px"
  oval: "999px"
spacing:
  module: "8px"
  sm: "12px"
  md: "20px"
  lg: "28px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.marker}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink-strong}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
    height: "44px"
  sheet-band:
    backgroundColor: "{colors.ink-tint}"
    textColor: "{colors.ink-strong}"
    typography: "{typography.label}"
    padding: "6px 12px"
  answer-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.marker}"
    typography: "{typography.code}"
    rounded: "{rounded.none}"
    height: "48px"
  verdict-hint:
    backgroundColor: "{colors.pen-tint}"
    textColor: "{colors.pen}"
    padding: "12px 16px"
---

# Design System: codex-tutorial

## Overview

**Creative North Star: "The machine-graded answer card"**

Every surface is an OMR 답안지, the sheet every Korean learner has filled with a 컴퓨터용 사인펜. The product grades typed Codex commands, so the interface borrows the one artifact whose whole job is being read and graded: printed pink-red structure, black marker marks, a timing track down the edge. Lessons are 문항, modes are 교시, the leaderboard is a 성적표, and notes are 수험생 유의사항.

Density is exam-paper density: ruled tables, tight label bands, generous white paper around them. The page is light because the card is paper and the scene is a phone on a commute or a desk in daylight. There are no rounded cards, glows, gradients or glass; the incumbent neon-on-black terminal look was deliberately retired (2026-09 redesign).

**Key Characteristics:**
- Pink-red printed rules (1.5px) carry all structure; black is reserved for what the learner "marks".
- Ovals fill with a marker wipe when an answer is correct or a lesson is done.
- Myeongjo display like a 수능 paper; Nanum Gothic Coding for every command, time and number.
- Ballpoint blue is the only third colour, used for hints and offline notices.

## Colors

Committed two-ink print on white paper, plus one ballpoint accent.

### Primary
- **OMR Ink** (#c7255b): printed structure: rules, oval outlines, band text, numerals, highlighted words. 5.3:1 on paper, safe for text.
- **OMR Ink Strong** (#a3163f): band labels, link hover, primary-button hover.

### Secondary
- **Marker Black** (#141214): anything the learner produced or should press: filled ovals, timing marks, primary buttons, active nav tab, correct verdict badge.

### Tertiary
- **Ballpoint Blue** (#2447b3 on #e9eefc): hints, wrong-answer verdicts, offline/server notices. Never decorative.

### Neutral
- **Answer Paper** (#fdfdfb): page ground. **Paper Blush** (#fbf1f4): current/next row, `<보기>` passages.
- **Ink Tint** (#fde9ef): header bands and table heads. **Ink Line** (#ec9bb6) / **Ink Hair** (#f6cdda): dividers and faint grid.
- **Text** (#221c1f) body; **Text 2** (#5b4b52) secondary copy.

### Named Rules
**The Two Inks Rule.** Structure is printed in pink; action is marked in black. A black element means "you did this" or "do this".
**The Honest Card Rule.** No invented numbers print on the card: presence counts appear only from a live server.

## Typography

**Display Font:** Nanum Myeongjo 800 (AppleMyungjo, serif)
**Body Font:** Noto Sans KR (Apple SD Gothic Neo)
**Label/Mono Font:** Nanum Gothic Coding

**Character:** An exam paper's myeongjo headline over a clean gothic body, with the Korean coding face for everything typed or measured.

### Hierarchy
- **Display** (800, 2.6rem → 4.1rem, 1.12): home headline only.
- **Headline** (800, 1.9–2.7rem): page titles (레슨 라이브러리, 오늘의 챌린지).
- **Title** (800, 1.3–1.7rem): question text and section heads.
- **Body** (400, 1rem, line-height 1.9, max ~40rem): lesson narration, ledes.
- **Label** (700, 0.72–0.8rem): band labels, column heads, step kind (주관식/객관식/보기).
- **Code/Numerals** (Nanum Gothic Coding 400/700): commands, times (monumental 3.75–4.5rem for results), counts.

### Named Rules
**The Typed-Is-Coded Rule.** Anything a learner types or a machine measures is set in Nanum Gothic Coding; prose never is.

## Layout

Max width 72rem (home) and 48rem (task pages), 16px/24px gutters. Home first viewport: two columns at ≥1024px (headline + actions left, the answer card right), stacked on mobile with the primary action above the fold. Tables collapse to stacked rows under 768px. Header nav becomes a full-width 5-column tab strip on mobile. Spacing snaps to an 8px module; faint grid is 32px.

## Elevation & Depth

Flat paper. Depth comes from ruling and tint, not shadow. Two soft shadows exist: the answer card (`0 18px 40px -24px rgba(163,22,63,0.45)`) and primary-button hover (`0 6px 14px -6px rgba(163,22,63,0.55)`); the answer field gains `0 4px 12px -6px rgba(20,18,20,0.35)` on focus.

## Shapes

Square corners everywhere. The only curve is the answer oval (999px radius, 4:5 aspect). Borders are 1.5px ink; hairlines 1px ink-line; dashed ink-line for 비고 notes; 2.5px for completion stamps.

## Components

### Buttons
- **Shape:** square (0px), min-height 44px.
- **Primary:** marker black, paper text, bold 0.85rem; hover lifts 1px, turns ink-strong with a soft shadow.
- **Secondary:** paper with 1.5px ink border and ink-strong text; hover fills ink-tint.

### Inputs / Fields
- **답란 (AnswerField):** 1.5px ink frame, a pink "답란" label cell, `$` prompt in ink, Nanum Gothic Coding 16px. Focus turns the frame marker black with a soft shadow.

### Navigation
- Bordered tabs in ink-strong; the active tab is solid marker black (`aria-current="page"`). Mobile: full-width 5-column strip under the brand row.

### Oval (signature)
- Hollow ink outline; filling wipes black left to right via `clip-path` (420ms, expo-out). Wrong picks get an ink slash on ink tint. Reduced motion fills instantly.

### Timing track
- Printed black bars; done = black, current = ink, pending = outlined. Doubles as lesson progress (`role="progressbar"`).

### Verdict (판독)
- Correct: marker frame with a black "정답" badge. Hint/wrong: ballpoint blue frame and tint with an outlined "힌트" badge. Always `role="status"`.

### Sheet band
- Ink-tint strip with 1.5px ink rules top and bottom; left label bold, right meta in code face.

## Do's and Don'ts

### Do:
- **Do** print structure in OMR ink (#c7255b) at 1.5px and keep black for marks and actions.
- **Do** render lesson progress as ovals or timing marks, never as rings or bars with rounded ends.
- **Do** keep hints and offline states in ballpoint blue with plain Korean recovery copy.
- **Do** use the generated rasters in `public/art/` on white with `mix-blend-mode: multiply`.

### Don't:
- **Don't** reintroduce the dark neon terminal, glow shadows, gradient text or glass cards.
- **Don't** round corners on containers or buttons; only ovals curve.
- **Don't** show simulated or estimated learner counts.
- **Don't** add kickers/eyebrows above headings; sheet bands are headers of the sheet, not labels over a heading.
