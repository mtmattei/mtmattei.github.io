#!/usr/bin/env python3
"""M.M harmonic monogram -> full website icon pack.
One equation, y = sin(4*pi*t - pi/2 + delta), rendered at every standard size.
"""
import math, os, io
import cairosvg
from PIL import Image

OUT = "/home/claude/computational-editorial/iconpack"
os.makedirs(OUT, exist_ok=True)

# ---- palette (from the specimen system) ----
INK   = "#1C1B17"
PAPER = "#F7F6F1"
REG   = "#B3372B"

def m_path(x0, x1, y_top, y_base, phase, amp_scale=1.0, samples=140):
    amp = (y_base - y_top) * amp_scale
    pts = []
    for i in range(samples + 1):
        t = i / samples
        x = x0 + (x1 - x0) * t
        y = y_base - amp * (math.sin(4 * math.pi * t - math.pi / 2 + phase) + 1) / 2
        pts.append(("M" if i == 0 else "L") + f"{x:.2f} {y:.2f}")
    return "".join(pts)

def mark_svg(size, *, bg=None, ink=INK, single=False, safe=0.14,
             stroke_ratio=0.075, red_dot=False, corner=None):
    """Build one icon SVG.
    safe        : fraction of canvas kept as padding on each side (maskable -> larger)
    stroke_ratio: stroke width as a fraction of the mark's drawn width
    single      : draw only the primary M (for tiny sizes)
    """
    pad = size * safe
    # mark keeps phi:1 aspect ratio, centred in the square
    box_w = size - 2 * pad
    box_h = box_w / 1.618
    x0 = pad
    x1 = size - pad
    y_base = (size + box_h) / 2
    y_top  = (size - box_h) / 2
    sw = max(1.0, box_w * stroke_ratio)
    dot_r = sw * 0.9

    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">']
    if bg:
        if corner:
            parts.append(f'<rect x="0" y="0" width="{size}" height="{size}" rx="{corner}" fill="{bg}"/>')
        else:
            parts.append(f'<rect x="0" y="0" width="{size}" height="{size}" fill="{bg}"/>')
    # echo trace (42% ink) - skipped for single/tiny
    if not single:
        parts.append(f'<path d="{m_path(x0,x1,y_top,y_base,0.42)}" fill="none" '
                     f'stroke="{ink}" stroke-width="{sw:.2f}" stroke-linecap="round" opacity="0.42"/>')
    # primary trace
    prim_sw = sw * (1.35 if single else 1.0)
    parts.append(f'<path d="{m_path(x0,x1,y_top,y_base,0.0)}" fill="none" '
                 f'stroke="{ink}" stroke-width="{prim_sw:.2f}" stroke-linecap="round"/>')
    # baseline endpoints
    parts.append(f'<circle cx="{x0:.2f}" cy="{y_base:.2f}" r="{dot_r:.2f}" fill="{ink}"/>')
    parts.append(f'<circle cx="{x1:.2f}" cy="{y_base:.2f}" r="{dot_r:.2f}" fill="{ink}"/>')
    if red_dot:  # separator point, registration red, centred
        parts.append(f'<circle cx="{size/2:.2f}" cy="{y_base:.2f}" r="{dot_r*0.85:.2f}" fill="{REG}"/>')
    parts.append('</svg>')
    return "\n".join(parts)

def render_png(svg, size, path, scale=4):
    """Rasterize at high scale then downsample for clean anti-aliasing."""
    big = cairosvg.svg2png(bytestring=svg.encode(), output_width=size*scale, output_height=size*scale)
    im = Image.open(io.BytesIO(big)).convert("RGBA")
    im = im.resize((size, size), Image.LANCZOS)
    im.save(path)
    return im

manifest_icons = []

# ---------- 1. Master scalable favicon (transparent, ink mark) ----------
svg_master = mark_svg(64, bg=None, single=False, safe=0.12)
with open(f"{OUT}/favicon.svg", "w") as f:
    f.write(svg_master)

# ---------- 2. PNG favicons ----------
# 16 & 32 -> single M for legibility; 48 -> double
png_specs = [
    (16, dict(single=True,  safe=0.10, stroke_ratio=0.10)),
    (32, dict(single=True,  safe=0.12, stroke_ratio=0.085)),
    (48, dict(single=False, safe=0.12, stroke_ratio=0.075)),
    (96, dict(single=False, safe=0.12, stroke_ratio=0.07)),
]
ico_imgs = []
for size, kw in png_specs:
    svg = mark_svg(size, bg=None, **kw)
    im = render_png(svg, size, f"{OUT}/favicon-{size}x{size}.png")
    if size in (16, 32, 48):
        ico_imgs.append(im)

# ---------- 3. Multi-resolution .ico ----------
ico_imgs[0].save(f"{OUT}/favicon.ico", format="ICO",
                 sizes=[(16, 16), (32, 32), (48, 48)])

# ---------- 4. Apple touch icon (opaque paper bg, ink mark, iOS rounds corners) ----------
svg_apple = mark_svg(180, bg=PAPER, ink=INK, single=False, safe=0.20, stroke_ratio=0.07)
render_png(svg_apple, 180, f"{OUT}/apple-touch-icon.png")

# ---------- 5. Android / PWA icons (opaque, normal + maskable safe zone) ----------
for size in (192, 512):
    svg = mark_svg(size, bg=PAPER, ink=INK, single=False, safe=0.18, stroke_ratio=0.06)
    render_png(svg, size, f"{OUT}/android-chrome-{size}x{size}.png")
    manifest_icons.append({"src": f"/android-chrome-{size}x{size}.png",
                           "sizes": f"{size}x{size}", "type": "image/png"})
    # maskable: 40% safe zone -> larger padding, full-bleed ink field for punch
    svg_m = mark_svg(size, bg=INK, ink=PAPER, single=False, safe=0.30, stroke_ratio=0.055)
    render_png(svg_m, size, f"{OUT}/maskable-{size}x{size}.png")
    manifest_icons.append({"src": f"/maskable-{size}x{size}.png",
                           "sizes": f"{size}x{size}", "type": "image/png", "purpose": "maskable"})

# ---------- 6. Social / OG card (1200x630, dark tile) ----------
og_w, og_h = 1200, 630
box_w = 520; box_h = box_w / 1.618
cx0 = (og_w - box_w) / 2; cx1 = (og_w + box_w) / 2
yb = (og_h + box_h) / 2 - 20; yt = (og_h - box_h) / 2 - 20
sw = box_w * 0.05
og = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {og_w} {og_h}" width="{og_w}" height="{og_h}">
<rect width="{og_w}" height="{og_h}" fill="{INK}"/>
<line x1="60" y1="60" x2="60" y2="78" stroke="{REG}" stroke-width="2"/>
<line x1="60" y1="60" x2="78" y2="60" stroke="{REG}" stroke-width="2"/>
<line x1="{og_w-60}" y1="60" x2="{og_w-60}" y2="78" stroke="{REG}" stroke-width="2"/>
<line x1="{og_w-60}" y1="60" x2="{og_w-78}" y2="60" stroke="{REG}" stroke-width="2"/>
<path d="{m_path(cx0,cx1,yt,yb,0.42)}" fill="none" stroke="{PAPER}" stroke-width="{sw:.1f}" stroke-linecap="round" opacity="0.42"/>
<path d="{m_path(cx0,cx1,yt,yb,0.0)}" fill="none" stroke="{PAPER}" stroke-width="{sw:.1f}" stroke-linecap="round"/>
<circle cx="{cx0:.1f}" cy="{yb:.1f}" r="{sw*0.9:.1f}" fill="{PAPER}"/>
<circle cx="{cx1:.1f}" cy="{yb:.1f}" r="{sw*0.9:.1f}" fill="{PAPER}"/>
<text x="{og_w/2}" y="{yb+90}" font-family="Georgia, serif" font-size="46" font-weight="500"
  fill="{PAPER}" text-anchor="middle" letter-spacing="4">M<tspan fill="{REG}">.</tspan>M</text>
<text x="{og_w/2}" y="{yb+140}" font-family="monospace" font-size="17" fill="#A3A097"
  text-anchor="middle" letter-spacing="6">ONE EQUATION · TWO INITIALS</text>
</svg>'''
render_png(og, og_w, f"{OUT}/og-card.png", scale=1)  # already large
# fix aspect for og (render_png forces square) -> re-render properly
big = cairosvg.svg2png(bytestring=og.encode(), output_width=og_w*2, output_height=og_h*2)
Image.open(io.BytesIO(big)).convert("RGB").resize((og_w, og_h), Image.LANCZOS).save(f"{OUT}/og-card.png")

# ---------- 7. web manifest ----------
import json
manifest = {
    "name": "M.M", "short_name": "M.M",
    "icons": manifest_icons,
    "theme_color": INK, "background_color": PAPER,
    "display": "standalone"
}
with open(f"{OUT}/site.webmanifest", "w") as f:
    json.dump(manifest, f, indent=2)

print("generated files:")
for fn in sorted(os.listdir(OUT)):
    sz = os.path.getsize(os.path.join(OUT, fn))
    print(f"  {fn:34s} {sz:>7d} B")
