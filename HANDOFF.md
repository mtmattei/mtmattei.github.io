# HANDOFF — the belt landing, five works
Updated: 2026-08-05

## Where we are

The relay landing (hero → five sticky sections → closing → index overlay) was
torn out and replaced with **the belt**. The detail worlds were not touched.
Live at `https://mtmattei.github.io`, deployed from `main` on every push.

**The five works, in belt order:**

| # | Work | Medium | What it is |
|---|---|---|---|
| 01 | POOLSIDE | APPLICATION | Pool chemistry app; water is a runtime SkSL shader on SkiaSharp |
| 02 | PAPERNOTES | APPLICATION | A note as a ruled sheet; Uno Platform, desktop + Android |
| 03 | LIGHT | AMBIENT OBJECT | Ambient daylight clock; solar model, no interaction at all |
| 04 | MISREGISTRATION | INTERACTIVE CARD | Two plates walk into register. Exhibit, no repo |
| 05 | TRALLALLÀ | PRINT | *Vino, Amici & Trallallà* — an illustrated print |

## The landing

The page does not scroll. `html, body { overflow: hidden }` — the belt is the
only thing that moves.

1. **The belt.** The five posters travel right to left on a loop with no
   beginning. Slot `k` shows project `k % 5`; positions are
   `cx + wrap(k*pitch − off)`, so the sequence has no seam and a visitor can
   never reach an end. Drift is 58 px/s; drag, wheel and swipe all write the
   same `off`, and momentum decays at 2.4/s back into the drift.
2. **The threshold.** Screen centre is a lens column every sheet passes
   through. See below — this is the load-bearing idea.
3. **The readout.** Number, medium, name, tag, under the centre. It swaps as
   the belt hands the threshold from one work to the next.
4. **The index** (masthead, right; the button reads CAROUSEL while open).
   The belt freezes, every sheet collapses inward, the five stack, the stack
   flies to centre-right, the ledger arrives on the left. Hovering or focusing
   a row brings that sheet to the front of the stack and swaps the note under
   the ledger. Closing redistributes the stack back onto the belt. ESC exits.
5. **Selecting a work.** The chosen sheet glides to the threshold, the rest
   part outward, it expands to full bleed — and at 55% of that expansion the
   hash is written, so the existing detail world fades in **over a sheet that
   is still growing.** Exit reverses it: `animExit` un-hides the belt *before*
   the detail surface fades, so the world recedes onto its own poster.
6. **Worlds** (`#/p/slug`) are exactly as they were: the horizontal rail, the
   panel kinds, the timeline ruler. Deep links still open directly.

## The threshold — the thing to understand first

One WebGL surface draws **every** sheet. The belt, the index stack and the
walk into a work are the same handful of animated rectangles, which is why
they can hand off to each other at all. The anchors above the canvas carry
the link, the label and the keyboard; the `<img>` inside each one is the
no-WebGL fallback (verified: same poses, no effect).

A sheet's effect weight is `uW`, from how far **its own centre** stands from
screen centre — never from hover. Within the sheet, `col` weights by distance
from the centre line. Four parts:

- **lens** — a cylindrical column, sampling pulled toward the axis
- **liquid** — Poolside's own `hash`/`vnoise`/`fbm`, verbatim, drifting
- **fringe** — red and blue sampled either side of green. Poolside disperses
  at `disp × ±0.06` and a press misregisters for the same reason; both of
  those works are on this belt
- **smear** — directional blur peaking half-in, resolving at dead centre

**`uCalm` is not optional.** It rises over the last stretch of the approach
(`smoothstep(0.82, 1.0, uW)`) and takes the drifting field and the smear back
out. The first cut ran the animated warp at full strength on the centred
sheet — the one you are trying to read — and it was genuinely painful within
seconds. What survives at dead centre is **still**: the lens bend, a hairline
of misregistration, a little light in the core. Full expression, held.
If you ever raise these numbers, look at the centred sheet for thirty seconds
before you commit.

Current amplitudes: lens `0.030`, liquid `0.011 × live`, fringe `0.0026`,
smear `0.014 × live`, core light `0.050`, shoulder `0.055`.

## Traps that have already cost time

- **rAF is frozen when the Chrome window is occluded** — about one frame per
  twelve seconds, and `setTimeout` is throttled to roughly 2/s too. Every
  animation therefore runs in slow motion under tooling, and a screenshot
  forces exactly one frame. To verify, shim
  `window.requestAnimationFrame = f => setTimeout(() => f(performance.now()), 16)`
  **and then force one native frame** (take a screenshot) — the engine is
  already sitting on a native rAF it scheduled before the shim existed, and
  will not pick the shim up until that one fires. End states are trustworthy;
  motion quality is not observable this way.
- **Selecting a work while the index is still opening** used to leave the
  stack assembling itself behind a sheet already expanding. `enter()` now
  freezes `idx.to = idx.t`, and `toIndex()` refuses to snap while `ent.to === 1`.
- **`.gitignore` had a blanket `*.mp4`.** The misregistration encode lives in
  `public/projects/`, built into `dist` locally, passed every audit, and 404'd
  in production. The exemption is now `public/**/*.mp4`. Only hitting the live
  URL catches this class of bug.
- **Class-name collisions on the shared poster sheet.** `.plates` and `.rule`
  are Poolside's. Scope new sheet classes.

## Posters

Unchanged. Every sheet is the same 1100 × 1556 stock, written in its own
project's design language, built by `poster/work-posters.html` +
`scripts/build-poster-heroes.mjs` (capture rig) and
`scripts/build-print-posters.mjs` (Trallallà). **sharp runs `resize` BEFORE
`composite` in one pipeline** — the stitcher does two passes; keep it that way.

That every poster is the same sheet is what makes the belt read even, the
stack read as a stack of prints, and the expansion land on a known aspect.

## Last verified state

- Build: `astro build` passes, 7 pages, 17 assets referenced, 0 missing.
- Belt: 10 slots at 1745 × 886, seamless loop, drag/wheel/momentum.
- Threshold: fringe is a hairline at centre; centred sheet is still.
- Index: stack lands tight (`pw × 1.05`, 8px/6px offsets, per-sheet rotation),
  one card lifted by hover/focus, note swaps.
- Enter: verified from the belt (LIGHT) and from the ledger (TRALLALLÀ);
  both land in the horizontal world. Exit returns to the belt with the sheet
  you walked into standing at the threshold.
- Easter egg: pointing at the mark still draws the full autograph.
- Fallback: canvas off + `.gl` removed → the `<img>`s pose identically.
- Mobile geometry: under 760px the sheet takes 62% of the width instead of
  34%, so one sheet dominates rather than shrinking to a stamp.

## Next actions

1. **Watch the belt on a visible screen.** Everything above is DOM, geometry
   and end states — rAF stays frozen in an occluded tab, so the motion itself
   (drift pace, drag feel, the collapse, the expansion) has never been seen at
   speed. This is the one real gap, and it is the same gap the relay left.
2. Exercise the reduced-motion path (drift 0, time frozen, blends snap) and
   a real narrow viewport — both are written, neither has been run.
3. Bump `actions/checkout@v4`, `setup-node@v4`, `upload-artifact@v4` to v5.

## Relaunch

```
cd C:\Users\Platform006\portfolio-instrument
npx astro dev --background     # http://localhost:4321
```
