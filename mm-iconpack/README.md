# M.M — Website Icon Pack

Specimen № 3 · harmonic monogram. Every mark is generated from one equation:

    y = sin(4·π·t − π/2 + δ),   t ∈ [0, 1]

The primary initial is drawn at δ = 0; the echo at δ = 0.42 rad, 42 % ink.

---

## Install

Copy every file to your site root, then add this to `<head>`:

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1C1B17">

<!-- social card (Open Graph / Twitter) -->
<meta property="og:image" content="/og-card.png">
<meta name="twitter:card" content="summary_large_image">
```

Modern browsers prefer `favicon.svg` (scales to any density); `.ico` and the
PNGs are fallbacks for older clients.

---

## Contents

| File                          | Size        | Purpose                                   |
|-------------------------------|-------------|-------------------------------------------|
| favicon.svg                   | scalable    | Primary — vector, transparent             |
| favicon.ico                   | 16/32/48    | Legacy multi-resolution                   |
| favicon-16x16.png             | 16          | Tab · single M for legibility             |
| favicon-32x32.png             | 32          | Tab / bookmark · single M                 |
| favicon-48x48.png             | 48          | Windows site tile · double trace          |
| favicon-96x96.png             | 96          | High-density tab                          |
| apple-touch-icon.png          | 180         | iOS home screen (paper field, iOS rounds) |
| android-chrome-192x192.png    | 192         | Android / PWA                             |
| android-chrome-512x512.png    | 512         | Android splash / PWA                      |
| maskable-192x192.png          | 192         | Android adaptive (40 % safe zone, on ink) |
| maskable-512x512.png          | 512         | Android adaptive                          |
| og-card.png                   | 1200 × 630  | Open Graph / social preview               |
| site.webmanifest              | —           | PWA manifest (theme #1C1B17)              |

---

## Rules carried from the specimen

- Below 32 px the mark drops to a single M; the second initial lives in the filename.
- Registration red (#B3372B) appears only on the wordmark separator — never inside the icon field.
- No gradients, shadows, or outlines. One ink, one paper.
- Regenerate any size from `build_iconpack.py` — the mark is math, not an asset.
