/* Stitch the captured poster slices into one hero per work.

   Each poster was captured in two vertical slices with the sheet pinned at
   a known offset (position:fixed, no scrolling), so the two halves butt
   together exactly. The browser window changed size between the first two
   posters and the third, so each pair carries its own crop geometry; every
   hero is then normalised to the SAME final size, which is the whole point
   — the relay is the navigation and the cards have to pose identically. */
import sharp from 'sharp';

const SHOTS = 'C:/Users/PLATFO~1/AppData/Local/Temp/claude-chrome-screenshots-Z3qdq9';
const OUT = 'public/projects';

/* the sheet is 1400 x 1980, so every hero lands on that ratio */
const HERO_W = 1100;
const HERO_H = Math.round(HERO_W * (1980 / 1400));   // 1556

/* All six slices were taken at one rig this time — a 1745x886 viewport
   saving down to 1556x790 (x0.8917), with each sheet pinned at 1253x1772.
   So every pair shares the same crop, and the three posters come off the
   press at identical size without any per-work fudging. */
const CROP_W = Math.round(1253 * (1556 / 1745));   // 1117
const SLICE_H = Math.round(886 * (790 / 886));     // 790

const works = [
  {
    slug: 'poolside',
    slices: ['screenshot-1785903798118-17.jpg', 'screenshot-1785903812205-18.jpg'],
  },
  {
    slug: 'papernotes',
    slices: ['screenshot-1785903767559-15.jpg', 'screenshot-1785903781805-16.jpg'],
  },
  {
    slug: 'lightwidget',
    slices: ['screenshot-1785903736538-13.jpg', 'screenshot-1785903752530-14.jpg'],
  },
].map((w) => ({ ...w, cropW: CROP_W, sliceH: SLICE_H }));

for (const w of works) {
  const halves = [];
  for (const f of w.slices) {
    const src = `${SHOTS}/${f}`;
    const meta = await sharp(src).metadata();
    const h = Math.min(w.sliceH, meta.height);
    const cw = Math.min(w.cropW, meta.width);
    halves.push(await sharp(src).extract({ left: 0, top: 0, width: cw, height: h }).toBuffer());
  }
  /* Stitch and resize in two passes. sharp runs resize BEFORE composite
     within one pipeline, so chaining them shrinks the canvas first and
     then pastes full-size halves onto it — which either throws or, worse,
     silently lands the halves in the wrong place. */
  const full = w.sliceH * 2;
  const stitched = await sharp({
    create: { width: w.cropW, height: full, channels: 3, background: '#F1EEE6' },
  })
    .composite([
      { input: halves[0], top: 0, left: 0 },
      { input: halves[1], top: w.sliceH, left: 0 },
    ])
    .png()
    .toBuffer();

  const info = await sharp(stitched)
    .resize({ width: HERO_W, height: HERO_H, fit: 'fill' })
    .webp({ quality: 90 })
    .toFile(`${OUT}/${w.slug}-poster.webp`);

  console.log(
    `${OUT}/${w.slug}-poster.webp`.padEnd(44) +
    `${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB` +
    `  ratio ${(info.width / info.height).toFixed(4)}`
  );
}
