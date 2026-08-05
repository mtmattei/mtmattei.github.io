/* Bring the two new projects' real screens into public/projects/ at web
   sizes. The sources are the apps' own captures — nothing is redrawn. */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const OUT = 'public/projects';
await mkdir(OUT, { recursive: true });

const jobs = [
  {
    src: 'C:/Users/Platform006/OneDrive - Uno Platform/Desktop/unOS/AI-builds/PaperNotes/Screenshot 2026-08-04 205655.png',
    out: `${OUT}/papernotes-sheet.webp`,
    width: 1240,
  },
  {
    /* the three-city board: Tokyo daylight, New York dusk, London night.
       Cropped to the app's own canvas, dropping the OS title bar. */
    src: 'C:/Users/Platform006/LightWidget/upscaled_1785889457387.jpg',
    out: `${OUT}/lightwidget-cities.webp`,
    width: 1600,
    crop: { leftPct: 0.104, topPct: 0.028, rightPct: 0.118, bottomPct: 0.0 },
  },
];

for (const j of jobs) {
  let img = sharp(j.src);
  const meta = await img.metadata();
  if (j.crop) {
    const left = Math.round(meta.width * j.crop.leftPct);
    const top = Math.round(meta.height * j.crop.topPct);
    const width = Math.round(meta.width * (1 - j.crop.leftPct - j.crop.rightPct));
    const height = Math.round(meta.height * (1 - j.crop.topPct - j.crop.bottomPct));
    img = img.extract({ left, top, width, height });
  }
  const info = await img
    .resize({ width: j.width, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(j.out);
  console.log(`${j.out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
