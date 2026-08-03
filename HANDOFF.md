# HANDOFF — Relay navigation landing
Updated: 2026-08-03 (session 2 revisions)

## Where we are

The landing is now fully prototype-shaped, committed on main @ a1dd53a:

1. **Opening**: M² monogram docked centre-top from the first frame (NameIntro.astro static; M cloned from the signature's opening stroke). **Hover easter egg**: the pen finishes the autograph out of the M (cyan *Matt* then red *Mattei*, dashoffset draw, composition glides to stay centred, ²ei yields). **Reverse mirrors forward**: red retracts 0–.6s, cyan .2–.75s, and ²ei + the mark's own strokes return only at the end (.62s/.68s delays) — verified via computed styles.
2. **Masthead** (fixed, difference-blended): **INDEX** alone at right — the monogram is the brand (no MATT MATTEI text, no DESIGN × DEVELOPMENT labels anywhere; removed @ 352f0f7). Hidden while walked into a world.
3. **Hero** (230vh): copy top-left, single centred live frame (Poolside water, chrome-cropped `scale(1.55)`) expanding to full bleed.
4. **Relay** (five 235vh sections, last 175vh): recede → label → next rises. Projects' own media (video / Plate / braille shimmer / two live lab embeds). Cards walk into `#/p/slug` worlds.
5. **Closing**: BROWSE SLOWLY / JUMP QUICKLY + the featured five + VIEW ALL WORK (→ /program/) + REPLAY SEQUENCE. **No ledger at the bottom anymore.**
6. **Index overlay** (`#indexPanel`, z20): opened from the masthead — ledger rows left (all 25 INDEX_ROWS, same .prow grammar), the previewer (.ppv, z21) as the right pane, lit while open, featured card default, hover cross-fades, row click closes + walks in. ESC/CLOSE dismiss; body scroll locks; the landing wheel-glide yields while open.
7. **Worlds arrive as overlays now**: the camera walk-through was retired with the stage — detail fades/settles in over wherever the relay stood, and exit lands back there. Deep links open directly. Removed: camera/fit/push machinery, dock loop, scratch heading, room tone, WindRun usage.

## Last verified state

- Build: `astro build` passes (16 pages).
- Runtime (Chrome MCP; tab OS-occluded, so rAF/compositing frozen — verified what's verifiable): no console errors; full interaction chain asserted via JS (panel open→preview lit→ESC close→world enter overlay→exit); easter-egg forward/reverse delays confirmed by computed styles; relay/hero pose geometry verified earlier by the numbers. **Feel pass in a visible window still owed** (scroll rhythm, panel fade, easter-egg draw, mark step-aside).
- Git: main @ a1dd53a, tree clean except HANDOFF.md.

## Performance audit (@ 0185af1)

User-reported jitter/fragments/flashes/stale frames → render-path fixes: `.rl-visual` is a constant 100vw×100vh layer the card merely clips (no more per-frame iframe-canvas rebuilds / braille-pre reflow / SVG re-raster); drive loop batches all rect reads before var writes (was up to 6 forced reflows/frame); embeds fade on `load` not `[src]` (blank-iframe flash); hero↔card-1 video clock sync at the handoff (stale-frame pop); relay-live hysteresis .09/.12 (mark strobe); masthead lost `mix-blend-mode: difference` (whole-page compositing group) → relay-live ink/paper swap; bogus `will-change` → `contain: layout style paint`; landing `visibility: hidden` while walked. Note: cards now show a *centre crop* of each visual while small, revealing outward as they grow — intended consequence of the fixed-layer design.

## Session 2 later revisions (@ 161af0a)

- **lrail retired** — masthead is the single header; rail links absorbed into the index overlay (Logo import dropped).
- **Index overlay gains the notes ledger**: NOTES / TEXTS section (WRITING galleys — title, count, SET/COMPOSING accent state, → /texts/) + quiet PROGRAM / ALL TEXTS / CONTACT foot line.
- **Signature close**: composition holds still through the retraction; glide back to centre + monogram + ²ei all return together at .68s.
- **Ledger rows stagger on every panel open** (staggerLedger()); load-time IO removed (never fired below the fold; reduced-motion left rows invisible — both fixed).
- **Archive folds (@ 4203e21)**: the 19 listed-only repos collapse behind an ARCHIVE row (caret + count, 0fr→1fr grid transition, closed on every panel open); six enterable works + notes stay in view.

## Next actions (in order)

1. Live pass, visible window: confirm the jitter/flash symptoms are gone at feel level; easter-egg draw + hold-then-glide close, relay beats, panel open row stagger, notes ledger typography.
2. Mobile + reduced-motion passes (queries written, unverified).
3. Consider clearing lab-embed iframes' src when walking into a world (they keep running behind the overlay).

## Open questions

- The previewer pane is fixed at `left: 53vw` to mirror the panel grid — single source that 53vw if the split changes.
- `?intro=type` query variant is gone with the intro; remove any references elsewhere if found.

## Android

Tried and reverted same-day (added @ 40c44be, removed next commit): the Capacitor wrap was a mistake — the site stays web-only. The app is uninstalled from the Pixel 8. If on-device testing is ever wanted again, prefer `astro dev --host` + phone browser over a wrapper.

## Relaunch

cd C:\Users\Platform006\portfolio-instrument
npx astro dev --background   # http://localhost:4321
