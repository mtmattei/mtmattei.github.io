# HANDOFF — the relay landing, five works
Updated: 2026-08-05

## Where we are

The board was cleared to Poolside alone and rebuilt to five works. Live at
`https://mtmattei.github.io`, deployed from `main` on every push.

**The five works, in relay order:**

| # | Work | What it is |
|---|---|---|
| 01 | POOLSIDE | Pool chemistry app; water is a runtime SkSL shader on SkiaSharp |
| 02 | PAPERNOTES | A note as a ruled sheet; Uno Platform, desktop + Android |
| 03 | LIGHT | Ambient daylight clock; solar model, no interaction at all |
| 04 | MISREGISTRATION | A card where two plates walk into register. Exhibit, no repo |
| 05 | TRALLALLÀ | *Vino, Amici & Trallallà* — an illustrated print |

## The landing

1. **Opening**: M² monogram docked centre-top, INDEX at right. Headline top-left,
   two lines. A single centred frame holds the Favalanciata anaglyph engraving.
2. **Hero** (230vh): the frame expands to full bleed and becomes card 01.
3. **Relay**: one section per work. Card holds the frame → recedes to reveal its
   title and lede → hands off to the next. The last card closes onto the closing.
4. **Closing**: BROWSE SLOWLY / JUMP QUICKLY, the five works, VIEW ALL WORK.
5. **Index overlay** (`#indexPanel`): five ledger rows left, previewer right.
   Opened from the masthead. ESC or CLOSE dismisses.
6. **Worlds**: clicking any card walks into `#/p/slug`, an overlay that fades in
   over wherever the relay stood. Deep links open directly.

## Posters — the thing to understand first

**Every relay card is that work's poster, and every poster is the same
1100 × 1556 sheet.** That is load-bearing: the relay *is* the navigation, and
when the cards were different shapes the walk read as uneven. All five cards
measure identically (verified 1745 × 886 at a 1745px viewport).

Each poster is written in **its own project's design language**, not a shared
house style:

- **Poolside** — a press separation proof. Its subject is a shader, so the four
  stages print as separations. The conceit is exact: the shader samples red and
  blue at `disp × ±0.06`, which is chromatic dispersion in the app and
  *misregistration* on a press. Set in Sarpanch + Yantramanav.
- **PaperNotes** — a page of the app. 28px ruled grid at poster scale, gutter
  numerals, copy typed onto the rules, asides in red Newsreader italic. Set in
  the app's real faces: Martian Mono + Newsreader.
- **Light** — the panel. Daylight wash, one hairline arc, one warm disc at 05:21,
  type at weight 200, most of the sheet deliberately empty.
- **Misregistration** — the card enlarged. Cream stock, black plate window,
  italic serif title, wide-tracked caps.
- **Trallallà** — the print itself, seated on the sheet over its own stock
  (sampled from the border so the pad is invisible). Not redesigned.

### How posters are made

1. `poster/work-posters.html` — all four *designed* sheets in one file, fonts
   inlined as base64 (~1.8 MB). Open it directly; it prints to A2.
2. Capture rig: pin each sheet with `position: fixed` at a known offset and
   screenshot two slices. **Do not scroll to position them** — the browser window
   resizes between calls and the geometry drifts.
3. `scripts/build-poster-heroes.mjs` — stitches the slices and normalises to
   1100 × 1556. Slice geometry is hardcoded per capture session; update it when
   you re-shoot.
4. `scripts/build-print-posters.mjs` — Trallallà only (no capture needed).
5. `scripts/import-project-media.mjs` — pulls project screens into
   `public/projects/` at web sizes.

**sharp runs `resize` BEFORE `composite` in one pipeline.** Chaining them pastes
full-size halves onto an already-shrunk canvas. The stitcher does two passes;
keep it that way.

## Traps that have already cost time

- **`.gitignore` had a blanket `*.mp4`** with one exemption for `public/videos/`.
  The misregistration encode lives in `public/projects/`, so it built into `dist`
  locally, passed every build and asset audit, and **404'd in production.** The
  exemption is now `public/**/*.mp4`. A build-time check cannot catch this class
  of bug — only hitting the live URL does.
- **The hero image is late to paint.** It rides a constant 100vw × 100vh layer
  that the card crops, and on a cold load that layer can come up unpainted,
  leaving the opening frame a flat `#A49275` slab. Mitigated with a 102-byte
  blurred LQIP as the card's background, so the worst case is a soft version of
  the right image. Root cause not identified; `contain` was investigated and
  ruled out.
- **Class-name collisions on the shared poster sheet.** `.plates` and `.rule` are
  Poolside's; its `left` beat another sheet's `right`. Scope new sheet classes.
- **The relay pose is rAF-driven**, so it freezes when the Chrome tab is
  occluded. Any style mutation forces a repaint, which makes screenshot debugging
  confounding — a mutation can look like a fix. Verify from cold loads.

## Last verified state

- Build: `astro build` passes, 7 pages.
- Assets: 15 referenced from the built landing (including JS-built world panels),
  0 missing. All five posters + the card video serve 200 live.
- Runtime: five relay sections, five ledger rows, five previewer cards, five
  billboard panels; every world builds its panels; all cards identical size.
- Git: `main`, clean, level with `origin/main`.

## Next actions

1. **Watch the relay on a visible screen.** Everything verified so far is DOM and
   geometry — the motion itself has never been seen, because rAF stays frozen in
   an occluded tab. This is the one real gap.
2. Mobile + reduced-motion passes (queries written, never exercised).
3. Bump `actions/checkout@v4`, `setup-node@v4`, `upload-artifact@v4` to v5 —
   the runner warns they target deprecated Node 20.

## Relaunch

```
cd C:\Users\Platform006\portfolio-instrument
npx astro dev --background     # http://localhost:4321
```
