// Centerline extraction of the signature mask into plotted SVG strokes.
// Pipeline validated in-browser first: 4x cubic upscale -> threshold ->
// Zhang-Suen thinning -> junction-component collapse -> corridor trace ->
// continuity merge at junctions -> RDP -> Catmull-Rom beziers.
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const SRC = 'C:/Users/Platform006/portfolio-instrument/scripts/sig-mask.png';
const OUT = process.argv[2] || 'sig-paths.json';
const S = 4;

const meta = await sharp(SRC).metadata();
const W = meta.width * S, H = meta.height * S;
const buf = await sharp(SRC).resize(W, H, { kernel: 'cubic' }).ensureAlpha().raw().toBuffer();

let g = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) if (buf[i * 4 + 3] > 120) g[i] = 1;
const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? 0 : g[y * W + x];

function pass(step) {
  const kill = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!at(x, y)) continue;
    const p = [at(x,y-1),at(x+1,y-1),at(x+1,y),at(x+1,y+1),at(x,y+1),at(x-1,y+1),at(x-1,y),at(x-1,y-1)];
    const B = p.reduce((a,b)=>a+b,0);
    if (B < 2 || B > 6) continue;
    let A = 0; for (let k = 0; k < 8; k++) if (!p[k] && p[(k+1)%8]) A++;
    if (A !== 1) continue;
    if (step === 0) { if (p[0]*p[2]*p[4] !== 0 || p[2]*p[4]*p[6] !== 0) continue; }
    else { if (p[0]*p[2]*p[6] !== 0 || p[0]*p[4]*p[6] !== 0) continue; }
    kill.push(y * W + x);
  }
  kill.forEach(i => g[i] = 0);
  return kill.length;
}
let changed = 1, guard = 0;
while (changed && guard++ < 400) changed = pass(0) + pass(1);

const deg = new Int8Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (!at(x, y)) continue;
  let d = 0;
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) d += at(x+dx, y+dy);
  deg[y * W + x] = d;
}
const isNodePx = i => g[i] && (deg[i] === 1 || deg[i] >= 3);

const comp = new Int32Array(W * H).fill(-1);
const centroids = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x;
  if (!isNodePx(i) || comp[i] >= 0) continue;
  const id = centroids.length;
  let q = [i], sx = 0, sy = 0, n = 0;
  comp[i] = id;
  while (q.length) {
    const c = q.pop();
    const cx = c % W, cy = (c / W) | 0;
    sx += cx; sy += cy; n++;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const X = cx + dx, Y = cy + dy;
      if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
      const j = Y * W + X;
      if (isNodePx(j) && comp[j] < 0) { comp[j] = id; q.push(j); }
    }
  }
  centroids.push([sx / n, sy / n]);
}

const used = new Uint8Array(W * H);
const raw = [];
const pairSeen = new Set();
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x;
  if (!isNodePx(i)) continue;
  const A = comp[i];
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    if (!dx && !dy) continue;
    const X = x + dx, Y = y + dy;
    if (!at(X, Y)) continue;
    const j = Y * W + X;
    if (isNodePx(j)) {
      const B = comp[j];
      if (B === A) continue;
      const k = Math.min(A, B) + ':' + Math.max(A, B);
      if (pairSeen.has(k)) continue;
      pairSeen.add(k);
      raw.push({ pts: [centroids[A].slice(), centroids[B].slice()], a: A, b: B });
      continue;
    }
    if (used[j]) continue;
    const pts = [centroids[A].slice(), [X, Y]];
    used[j] = 1;
    let cx0 = X, cy0 = Y, prevx = x, prevy = y, endComp = -1;
    while (true) {
      let nx = -1, ny = -1;
      for (let dy2 = -1; dy2 <= 1; dy2++) for (let dx2 = -1; dx2 <= 1; dx2++) {
        if (!dx2 && !dy2) continue;
        const X2 = cx0 + dx2, Y2 = cy0 + dy2;
        if (!at(X2, Y2)) continue;
        if (X2 === prevx && Y2 === prevy) continue;
        const j2 = Y2 * W + X2;
        if (isNodePx(j2)) { endComp = comp[j2]; nx = -2; break; }
        if (used[j2]) continue;
        nx = X2; ny = Y2;
      }
      if (nx === -2 || nx === -1) break;
      used[ny * W + nx] = 1;
      pts.push([nx, ny]);
      prevx = cx0; prevy = cy0; cx0 = nx; cy0 = ny;
    }
    if (endComp >= 0) pts.push(centroids[endComp].slice());
    raw.push({ pts, a: A, b: endComp });
  }
}
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x;
  if (!at(x, y) || used[i] || isNodePx(i)) continue;
  let pts = [[x, y]]; used[i] = 1;
  let prevx = -9, prevy = -9, cx0 = x, cy0 = y;
  while (true) {
    let nx = -1, ny = -1;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const X = cx0 + dx, Y = cy0 + dy;
      if (!at(X, Y) || used[Y * W + X]) continue;
      if (X === prevx && Y === prevy) continue;
      nx = X; ny = Y; break;
    }
    if (nx < 0) break;
    used[ny * W + nx] = 1; pts.push([nx, ny]); prevx = cx0; prevy = cy0; cx0 = nx; cy0 = ny;
  }
  if (pts.length > 8) { pts.push([pts[0][0], pts[0][1]]); raw.push({ pts, a: -1, b: -1 }); }
}

function plen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]); return L; }
let chains = raw.filter(s => !(s.a === s.b && s.a >= 0 && plen(s.pts) < 10));

function endDir(c, tail) {
  const n = c.length;
  const a = tail ? c[Math.max(0, n - 5)] : c[Math.min(n - 1, 4)];
  const b = tail ? c[n - 1] : c[0];
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  return [dx / L, dy / L];
}
let improved = true, safety = 0;
merge:
while (improved && safety++ < 3000) {
  improved = false;
  for (let i = 0; i < chains.length; i++) {
    for (const tailI of [1, 0]) {
      const myComp = tailI ? chains[i].b : chains[i].a;
      if (myComp < 0) continue;
      const dirI = endDir(chains[i].pts, !!tailI);
      let best = -1, bestTail = 0, bestScore = -1e9;
      for (let j = 0; j < chains.length; j++) {
        if (j === i) continue;
        for (const tailJ of [0, 1]) {
          const oComp = tailJ ? chains[j].b : chains[j].a;
          if (oComp !== myComp) continue;
          const dirJ = endDir(chains[j].pts, !!tailJ);
          const dot = -(dirI[0] * dirJ[0] + dirI[1] * dirJ[1]);
          if (dot > bestScore) { bestScore = dot; best = j; bestTail = tailJ; }
        }
      }
      if (best >= 0 && bestScore > -0.35) {
        const o = chains[best];
        let apts = chains[i].pts, aOther = tailI ? chains[i].a : chains[i].b;
        if (!tailI) apts = apts.slice().reverse();
        let bpts = o.pts, bOther = bestTail ? o.a : o.b;
        if (bestTail) bpts = bpts.slice().reverse();
        chains[i] = { pts: apts.concat(bpts.slice(1)), a: aOther, b: bOther };
        chains.splice(best, 1);
        improved = true;
        continue merge;
      }
    }
  }
}

function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  let dmax = 0, k = 0;
  const [x1, y1] = pts[0], [x2, y2] = pts[pts.length - 1];
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
    if (d > dmax) { dmax = d; k = i; }
  }
  if (dmax <= eps) return [pts[0], pts[pts.length - 1]];
  return rdp(pts.slice(0, k + 1), eps).slice(0, -1).concat(rdp(pts.slice(k), eps));
}
const clean = chains
  .filter(c => plen(c.pts) > 8)
  .map(c => rdp(c.pts, 2.4).map(p => [p[0] / S, p[1] / S]));
clean.sort((a, b) => Math.min(...a.map(p => p[0])) - Math.min(...b.map(p => p[0])));

function catmull(pts) {
  const f = n => (Math.round(n * 10) / 10);
  if (pts.length === 2) return 'M ' + f(pts[0][0]) + ' ' + f(pts[0][1]) + ' L ' + f(pts[1][0]) + ' ' + f(pts[1][1]);
  let d = 'M ' + f(pts[0][0]) + ' ' + f(pts[0][1]);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i-1)], p1 = pts[i], p2 = pts[i+1], p3 = pts[Math.min(pts.length-1, i+2)];
    d += ' C ' + f(p1[0] + (p2[0]-p0[0])/6) + ' ' + f(p1[1] + (p2[1]-p0[1])/6) + ', '
      + f(p2[0] - (p3[0]-p1[0])/6) + ' ' + f(p2[1] - (p3[1]-p1[1])/6) + ', ' + f(p2[0]) + ' ' + f(p2[1]);
  }
  return d;
}
const mattSegs = clean.filter(s => Math.min(...s.map(p => p[0])) < 236);
const matteiSegs = clean.filter(s => Math.min(...s.map(p => p[0])) >= 236);
const out = {
  viewBox: `0 0 ${meta.width} ${meta.height}`,
  chains: clean.length, matt: mattSegs.length, mattei: matteiSegs.length,
  mattPath: mattSegs.map(catmull).join(' '),
  matteiPath: matteiSegs.map(catmull).join(' ')
};
writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(`chains=${out.chains} matt=${out.matt} mattei=${out.mattei} -> ${OUT}`);
