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

/* The files land at the capture viewport's own scale, not at the size the
   screenshot preview reported — so each pair carries the geometry measured
   at the moment it was taken. The first two posters were shot in a 1249x671
   viewport with the sheet at 949x1342; the third in a 1745x937 viewport
   that saved down by 0.7875, putting the sheet at 1043x1476. */
const works = [
  {
    slug: 'poolside',
    slices: ['screenshot-1785901839604-6.jpg', 'screenshot-1785901856733-7.jpg'],
    cropW: 949, sliceH: 671,
  },
  {
    slug: 'papernotes',
    slices: ['screenshot-1785901922154-8.jpg', 'screenshot-1785901973925-9.jpg'],
    cropW: 949, sliceH: 671,
  },
  {
    slug: 'lightwidget',
    slices: ['screenshot-1785902091772-11.jpg', 'screenshot-1785902166502-12.jpg'],
    cropW: 1043, sliceH: 738,
  },
];

for (const w of works) {
  const halves = [];
  for (const f of w.slices) {
    const src = `${SHOTS}/${f}`;
    const meta = await sharp(src).metadata();
    const h = Math.min(w.sliceH, meta.height);
    const cw = Math.min(w.cropW, meta.width);
    halves.push(await sharp(src).extract({ left: 0, top: 0, width: cw, height: h }).toBuffer());
  }
  const full = w.sliceH * 2;
  const info = await sharp({
    create: { width: w.cropW, height: full, channels: 3, background: '#F1EEE6' },
  })
    .composite([
      { input: halves[0], top: 0, left: 0 },
      { input: halves[1], top: w.sliceH, left: 0 },
    ])
    .resize({ width: HERO_W, height: HERO_H, fit: 'fill' })
    .webp({ quality: 90 })
    .toFile(`${OUT}/${w.slug}-poster.webp`);

  console.log(
    `${OUT}/${w.slug}-poster.webp`.padEnd(44) +
    `${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB` +
    `  ratio ${(info.width / info.height).toFixed(4)}`
  );
}
