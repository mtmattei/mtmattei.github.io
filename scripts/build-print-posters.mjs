/* Posters for the two print works.

   Vino, Amici & Trallallà is already a finished poster, so it is not
   redesigned — it is seated on the series' sheet ratio (1100 x 1556) over
   its own stock, sampled from the artwork's border so the pad is
   invisible. Cropping it to the ratio would cut the artist's margin off,
   which is the one thing you must not do to a print. */
import sharp from 'sharp';

const OUT = 'public/projects';
const HERO_W = 1100;
const HERO_H = Math.round(HERO_W * (1980 / 1400));   // 1556

const SRC = 'work/tralala.png';

/* the stock: read from a pixel well inside the paper margin */
const { data } = await sharp(SRC)
  .extract({ left: 8, top: 8, width: 6, height: 6 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const stock = { r: data[0], g: data[1], b: data[2] };
const hex = '#' + [stock.r, stock.g, stock.b].map((v) => v.toString(16).padStart(2, '0')).join('');

const meta = await sharp(SRC).metadata();
/* fit the whole artwork inside the sheet, with its own stock either side */
const scale = Math.min(HERO_W / meta.width, HERO_H / meta.height);
const w = Math.round(meta.width * scale);
const h = Math.round(meta.height * scale);

const art = await sharp(SRC).resize({ width: w, height: h }).toBuffer();
const info = await sharp({
  create: { width: HERO_W, height: HERO_H, channels: 3, background: stock },
})
  .composite([{ input: art, top: Math.round((HERO_H - h) / 2), left: Math.round((HERO_W - w) / 2) }])
  .webp({ quality: 92 })
  .toFile(`${OUT}/trallala-poster.webp`);

console.log(
  `${OUT}/trallala-poster.webp`.padEnd(44) +
  `${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB` +
  `  art ${w}x${h}  stock ${hex}`
);
