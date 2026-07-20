/* The key SkSL passages from Poolside's PoolWater.sksl, shared between the
   /poolside/ case study and the landing's walk-through world. */

export const DISPERSION_SRC = `// The warp is linear in its scale, so one evaluation
// gives all three dispersion channels: s(k) = suv + k*disp.
float2 sg = waterUv(suv, 1.00);
float2 disp = sg - suv;
float2 sr = sg + disp * 0.06;
float2 sb = sg - disp * 0.06;
float3 col = float3(
    tileColor(float2(sr.x, 1.0 - sr.y)).r,
    tileColor(float2(sg.x, 1.0 - sg.y)).g,
    tileColor(float2(sb.x, 1.0 - sb.y)).b);`;

export const CAUSTIC_SRC = `// Caustic web: warped-sine interference. Organic because the
// domain is rotated off-grid, warped by slow value noise, and a
// third rotated layer breaks the symmetry.
float caustic(float2 suv) {
  float t = iTime * 0.6;
  float2 p = rot(suv, 0.47) * 9.0;
  p += 2.8 * float2(
      vnoise(p * 0.35 + t * 0.25) - 0.5,
      vnoise(p * 0.35 + 7.3 - t * 0.21) - 0.5);
  float a = sin(p.x + sin(p.y + t * 1.3) * 1.6 + t);
  float b = sin(p.y + sin(p.x - t * 1.1) * 1.7 - t * 0.8);
  float2 q = rot(p, 1.9) * 0.57;
  float c = sin(q.x + sin(q.y * 1.3 - t * 0.7) * 1.8 + t * 0.5);
  float web = pow(clamp(1.0 - abs(a + b + 0.8 * c) * 0.5, 0.0, 1.0), 6.0);
  web *= 0.55 + 0.9 * vnoise(p * 0.8 + t * 0.15);
  return web;
}`;
