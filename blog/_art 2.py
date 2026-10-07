"""Generates the blog cover illustrations (one per article) in the site's
palette. Run:  python3 blog/_art.py
Outputs assets/blog/<name>.jpg (1400x875), <name>.webp + <name>-sm.webp
(1400 and 800 wide, used by the pages) and <name>-og.jpg (1200x630).
"""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "blog")

INK = (23, 23, 21)
PAPER = (238, 238, 234)
STONE = (228, 226, 219)
BLUE = (74, 84, 255)
TEAL = (94, 200, 184)
LILAC = (178, 164, 236)
CORAL = (244, 102, 76)


def canvas(w, h, color):
    return np.ones((h, w, 3), dtype=np.float32) * np.array(color, dtype=np.float32)


def glow(img, cx, cy, radius, color, strength=1.0):
    h, w, _ = img.shape
    y, x = np.ogrid[:h, :w]
    d2 = ((x - cx) ** 2 + (y - cy) ** 2) / (radius ** 2)
    a = np.exp(-d2 * 2.2)[..., None] * strength
    img[:] = img * (1 - a) + np.array(color, dtype=np.float32) * a


def grain(img, amount=5.0, seed=1):
    rng = np.random.default_rng(seed)
    img += rng.normal(0, amount, img.shape[:2])[..., None]


def to_pil(img):
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")


def overlay(base, layer):
    base.alpha_composite(layer)
    return base


# ---------------------------------------------------------------------------
# 1. AI answers: a bright "answer" with a few cited sources on its orbits
# ---------------------------------------------------------------------------
def art_ai(w, h):
    img = canvas(w, h, (16, 16, 18))
    cx, cy = w * 0.58, h * 0.52
    glow(img, cx, cy, h * 0.95, (32, 36, 120), 0.9)
    glow(img, cx, cy, h * 0.42, BLUE, 0.85)
    glow(img, cx, cy, h * 0.12, (220, 224, 255), 0.95)
    grain(img, 4, 11)
    base = to_pil(img).convert("RGBA")
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    rng = random.Random(7)
    radii = [h * r for r in (0.2, 0.3, 0.41, 0.53, 0.66, 0.8)]
    for i, r in enumerate(radii):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(238, 238, 234, 34 if i else 60), width=max(2, w // 900))
        for _ in range(4 + i * 5):
            a = rng.uniform(0, math.tau)
            pr = w / 520
            x, y = cx + r * math.cos(a), cy + r * math.sin(a)
            d.ellipse([x - pr, y - pr, x + pr, y + pr], fill=(238, 238, 234, 70))
    for r, a in ((radii[1], -0.9), (radii[2], 2.4), (radii[3], 0.5)):
        x, y = cx + r * math.cos(a), cy + r * math.sin(a)
        pr = w / 150
        d.ellipse([x - pr * 2.4, y - pr * 2.4, x + pr * 2.4, y + pr * 2.4], outline=(238, 238, 234, 110), width=max(2, w // 1000))
        d.ellipse([x - pr, y - pr, x + pr, y + pr], fill=(246, 246, 242, 255))
    return overlay(base, lay)


# ---------------------------------------------------------------------------
# 2. Signs a site pushes clients away: eight pages on a lilac field, the
#    first one sharp (with its coral button), the rest receding and fading
# ---------------------------------------------------------------------------
def art_signs(w, h):
    img = canvas(w, h, (214, 203, 236))
    glow(img, w * 0.18, h * 0.2, h * 1.1, (240, 236, 250), 0.85)
    glow(img, w * 0.95, h * 1.0, h * 0.9, (176, 160, 226), 0.7)
    grain(img, 3.2, 21)
    base = to_pil(img).convert("RGBA")
    n = 8
    x = w * 0.08
    for i in range(n):
        t = i / (n - 1)
        s = 1 - 0.5 * t
        cw, ch = w * 0.13 * s, h * 0.66 * s
        y = h * 0.5 - ch / 2
        alpha = int(255 * (1 - t * 0.7))
        r = w / 110 * s
        # soft shadow
        sh = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle([x + w * .004, y + h * .02, x + cw + w * .004, y + ch + h * .02], radius=r, fill=(60, 40, 110, int(70 * (1 - t * .6))))
        base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(w / 90)))
        lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(lay)
        d.rounded_rectangle([x, y, x + cw, y + ch], radius=r, fill=(248, 247, 243, alpha))
        # browser bar + dots
        d.rectangle([x, y + ch * .075, x + cw, y + ch * .078], fill=(*INK, int(alpha * .18)))
        for k in range(3):
            dx = x + cw * (.1 + k * .07)
            rr = cw * .018
            d.ellipse([dx - rr, y + ch * .04 - rr, dx + rr, y + ch * .04 + rr], fill=(*INK, int(alpha * .35)))
        # headline + lines
        d.rounded_rectangle([x + cw * .12, y + ch * .17, x + cw * .8, y + ch * .24], radius=cw * .02, fill=(*INK, int(alpha * .88)))
        d.rounded_rectangle([x + cw * .12, y + ch * .27, x + cw * .6, y + ch * .31], radius=cw * .02, fill=(*INK, int(alpha * .5)))
        for k in range(4):
            yy = y + ch * (.39 + k * .06)
            d.rounded_rectangle([x + cw * .12, yy, x + cw * (.88 - (k % 3) * .14), yy + ch * .022], radius=cw * .01, fill=(*INK, int(alpha * .22)))
        d.rounded_rectangle([x + cw * .12, y + ch * .77, x + cw * .88, y + ch * .9], radius=cw * .03, fill=(214, 203, 236, int(alpha * .9)))
        if i == 0:
            d.rounded_rectangle([x + cw * .12, y + ch * .64, x + cw * .56, y + ch * .7], radius=ch * .03, fill=(*CORAL, 255))
        blur = (t ** 1.3) * w / 150
        if blur > .4:
            lay = lay.filter(ImageFilter.GaussianBlur(blur))
        base.alpha_composite(lay)
        x += cw * 0.92 + w * 0.012
    return base


# ---------------------------------------------------------------------------
# 3. Local SEO: a dark map with glowing teal contours and one bright pin
# ---------------------------------------------------------------------------
def art_local(w, h):
    img = canvas(w, h, (16, 22, 21))
    glow(img, w * 0.62, h * 0.5, h * 1.0, (20, 52, 48), 0.9)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    x /= w; y /= h
    f = np.zeros_like(x)
    for px, py, s, a in [(0.62, 0.5, 0.2, 1.0), (0.22, 0.28, 0.15, 0.65), (0.3, 0.86, 0.18, 0.55), (0.92, 0.14, 0.14, 0.5), (0.88, 0.85, 0.12, 0.4)]:
        f += a * np.exp(-(((x - px) * 1.6) ** 2 + (y - py) ** 2) / (2 * s * s))
    f += 0.03 * np.sin(x * 21 + y * 8) + 0.02 * np.sin(y * 29 - x * 13)
    frac = np.abs((f * 28) % 1 - 0.5)
    line = np.clip((frac - 0.465) / 0.035, 0, 1)
    near = np.exp(-(((x - .62) * 1.6) ** 2 + (y - .5) ** 2) / (2 * .22 ** 2))
    a = (line * (0.18 + 0.55 * near))[..., None]
    img[:] = img * (1 - a) + np.array(TEAL, np.float32) * a
    glow(img, w * 0.62, h * 0.5, h * 0.2, TEAL, 0.35)
    grain(img, 3.5, 31)
    base = to_pil(img).convert("RGBA")
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    rng = random.Random(9)
    for _ in range(14):
        px, py = rng.uniform(.06, .96) * w, rng.uniform(.08, .92) * h
        if abs(px - w * .62) < w * .12 and abs(py - h * .5) < h * .18:
            continue
        pr = w / 420
        d.ellipse([px - pr, py - pr, px + pr, py + pr], fill=(238, 238, 234, 90))
    cx, cy = w * 0.62, h * 0.5
    for i, r in enumerate((h * .06, h * .11, h * .17, h * .24)):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(*TEAL, 190 - i * 45), width=max(2, w // 700))
    r = h * .03
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(238, 238, 234, 255))
    r2 = r * .45
    d.ellipse([cx - r2, cy - r2, cx + r2, cy + r2], fill=(*TEAL, 255))
    return overlay(base, lay)


# ---------------------------------------------------------------------------
# 4. Visits → enquiries: many visitors flow in, a few come through (warm)
# ---------------------------------------------------------------------------
def art_convert(w, h):
    img = canvas(w, h, (22, 17, 16))
    glow(img, w * 0.72, h * 0.5, h * 0.75, (92, 38, 30), 0.9)
    glow(img, w * 0.72, h * 0.5, h * 0.18, CORAL, 0.6)
    grain(img, 4, 41)
    base = to_pil(img).convert("RGBA")
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    rng = random.Random(3)
    gate_x, cy = w * 0.72, h * 0.5
    for _ in range(1100):
        y0 = rng.uniform(0.04, 0.96) * h
        tt = (rng.random() ** 0.8) * rng.uniform(0.55, 0.98)
        xx = w * 0.04 + tt * (gate_x - w * 0.04)
        pull = tt ** 2.2
        yy = y0 * (1 - pull) + cy * pull + rng.gauss(0, h * 0.004)
        pr = w / 850
        d.ellipse([xx - pr, yy - pr, xx + pr, yy + pr], fill=(246, 226, 214, int(45 + 120 * tt)))
    for i in range(7):
        xx = gate_x + w * (0.035 + i * 0.03)
        yy = cy + rng.gauss(0, h * 0.01)
        pr = w / 240
        d.ellipse([xx - pr, yy - pr, xx + pr, yy + pr], fill=(*CORAL, 255))
    lw = max(2, w // 700)
    d.line([gate_x, cy - h * .22, gate_x, cy - h * .035], fill=(246, 226, 214, 170), width=lw)
    d.line([gate_x, cy + h * .035, gate_x, cy + h * .22], fill=(246, 226, 214, 170), width=lw)
    return overlay(base, lay)


# ---------------------------------------------------------------------------
# 5. Cost vs return: the investment is recovered, then everything is return
# ---------------------------------------------------------------------------
def art_cost(w, h):
    img = canvas(w, h, (232, 229, 221))
    glow(img, w * 0.85, h * 0.1, h * 1.1, (220, 208, 246), 0.9)
    glow(img, w * 0.1, h * 0.95, h * 0.8, (240, 238, 232), 0.7)
    grain(img, 3.2, 51)
    base = to_pil(img).convert("RGBA")
    n = 11
    left, right, floor = w * 0.1, w * 0.9, h * 0.82
    step = (right - left) / n
    bw = step * 0.58
    lw = max(2, w // 800)
    vals = [0.1 + 0.52 * ((i / (n - 1)) ** 1.8) for i in range(n)]
    breakeven = 4
    # shadows
    sh = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ds = ImageDraw.Draw(sh)
    for i, v in enumerate(vals):
        x0 = left + i * step
        ds.rounded_rectangle([x0 + w * .004, floor - v * h + h * .015, x0 + bw + w * .004, floor], radius=bw * .18, fill=(70, 50, 120, 50 if i >= breakeven else 0))
    base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(w / 120)))
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    for i, v in enumerate(vals):
        x0 = left + i * step
        top = floor - v * h
        if i < breakeven:
            d.rounded_rectangle([x0, top, x0 + bw, floor], radius=bw * .18, outline=(*INK, 150), width=lw)
        else:
            k = (i - breakeven) / (n - 1 - breakeven)
            col = tuple(int(a + (b - a) * k) for a, b in zip((150, 132, 222), (88, 82, 232)))
            d.rounded_rectangle([x0, top, x0 + bw, floor], radius=bw * .18, fill=(*col, 255))
    # break-even: dashed line at the level where the investment is recovered
    be_y = floor - vals[breakeven] * h
    xx = left - w * .02
    while xx < right:
        d.line([xx, be_y, min(xx + w * .012, right), be_y], fill=(*INK, 110), width=lw)
        xx += w * .022
    d.line([left - w * .02, floor, right + w * .01, floor], fill=(*INK, 130), width=lw)
    pts = [(left + i * step + bw / 2, floor - v * h - h * .045) for i, v in enumerate(vals)]
    d.line(pts, fill=(*INK, 170), width=lw, joint="curve")
    px, py = pts[-1]
    for rr, a in ((w / 90, 60), (w / 160, 255)):
        d.ellipse([px - rr, py - rr, px + rr, py + rr], fill=(*INK, a))
    return overlay(base, lay)


ARTS = {
    "ia-chatgpt": art_ai,
    "sinais-site": art_signs,
    "seo-local": art_local,
    "visitas-contactos": art_convert,
    "custo-site": art_cost,
}


def render(fn, w, h, ss=2):
    im = fn(w * ss, h * ss).convert("RGB")
    return im.resize((w, h), Image.LANCZOS)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, fn in ARTS.items():
        big = render(fn, 1400, 875)
        big.save(os.path.join(OUT, f"{name}.jpg"), quality=86, optimize=True, progressive=True)
        # WebP copies are what the pages load; the JPGs stay for structured data
        big.convert("RGB").save(os.path.join(OUT, f"{name}.webp"), quality=80, method=6)
        big.convert("RGB").resize((800, 500), Image.LANCZOS).save(os.path.join(OUT, f"{name}-sm.webp"), quality=80, method=6)
        render(fn, 1200, 630).save(os.path.join(OUT, f"{name}-og.jpg"), quality=84, optimize=True)
        print("rendered", name)
