# Asset register

Raster assets shipped by the site. Generated images were made with GPT Image 2
(ChatGPT Images 2.0) through the local Codex CLI (`gpt-image-2` skill) on
2026-09-24, then optimized with ImageMagick. Exact prompts are embedded in each
file (JPEG comment) or in the `.json` sidecar next to it.

| File | Use | Source | Size | Alt text |
|---|---|---|---|---|
| `public/og.jpg` | Open Graph / Twitter card | GPT Image 2, prompt p2 (OMR card overhead photo), cropped to 1200x630, q84 | 191 KB | 분홍색으로 인쇄된 OMR 답안지 위에 몇 개의 답이 검은 사인펜으로 칠해져 있고, 사인펜 한 자루가 놓여 있다. |
| `public/art/marker-pen.webp` | Home hero, lies across the answer card | GPT Image 2, prompt p1 (black sign pen on white), trimmed, whites levelled, 1100w webp | ~11 KB | decorative (`alt=""`) |
| `public/art/empty-answer-strip.webp` | Leaderboard empty state | GPT Image 2, prompt p3 (empty oval strip + capped pen), whites levelled, 640px webp | ~7 KB | 아직 아무것도 칠하지 않은 빈 답안 칸 다섯 개와 뚜껑이 닫힌 사인펜 |

Images contain no text, logos or people. Both inline rasters sit on the white
paper ground with `mix-blend-mode: multiply`.
