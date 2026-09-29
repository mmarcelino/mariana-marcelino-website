"""Generates the blog cover illustrations (one per article) in the site's
palette. Run:  python3 blog/_art.py
Outputs assets/blog/<name>.jpg (1400x875), <name>-sm.jpg (800x500) and
<name>-og.jpg (1200x630).
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
# 2. Signs a site pushes clients away: eight pages, drifting and fading
# ---------------------------------------------------------------------------
def art_signs(w, h):
    img = canvas(w, h, PAPER)
    glow(img, w * 0.2, h * 0.3, h * 0.9, (246, 246, 243), 0.8)
    grain(img, 3.5, 21)
    base = to_pil(img).convert("RGBA")
    n = 8
    card_w, card_h = w * 0.085, h * 0.5
    x = w * 0.1
    weights = [1 + (i / (n - 1)) * 3.2 for i in range(n - 1)]
    gap0 = (w * 0.8 - n * card_w) / sum(weights)
    for i in range(n):
        t = i / (n - 1)
        lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(lay)
        y = h * 0.21 + (t ** 2) * h * 0.08
        alpha = int(255 * (1 - t * 0.82))
        rr = w / 160
        d.rounded_rectangle([x, y, x + card_w, y + card_h], radius=rr, fill=(*PAPER, alpha), outline=(*INK, alpha), width=max(2, w // 700))
        d.line([x, y + card_h * 0.09, x + card_w, y + card_h * 0.09], fill=(*INK, int(alpha * .6)), width=max(1, w // 1200))
        for k in range(3):
            dx = x + card_w * 0.12 + k * card_w * 0.1
            d.ellipse([dx - w / 700, y + card_h * 0.045 - w / 700, dx + w / 700, y + card_h * 0.045 + w / 700], fill=(*INK, int(alpha * .5)))
        d.rectangle([x + card_w * .14, y + card_h * .22, x + card_w * .86, y + card_h * .3], fill=(*INK, int(alpha * .85)))
        for k in range(4):
            yy = y + card_h * (.4 + k * .07)
            d.rectangle([x + card_w * .14, yy, x + card_w * (.86 - (k % 2) * .2), yy + card_h * .018], fill=(*INK, int(alpha * .3)))
        if i == 0:
            bx = x + card_w * .14
            d.rounded_rectangle([bx, y + card_h * .74, bx + card_w * .5, y + card_h * .82], radius=card_h * .04, fill=(*CORAL, 255))
        blur = t * w / 260
        if blur > 0.5:
            lay = lay.filter(ImageFilter.GaussianBlur(blur))
        base.alpha_composite(lay)
        x += card_w + gap0 * (1 + t * 3.2)
    return base


# ---------------------------------------------------------------------------
# 3. Local SEO: topographic map with one place clearly marked
# ---------------------------------------------------------------------------
def art_local(w, h):
    img = canvas(w, h, PAPER)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    x /= w; y /= h
    f = np.zeros_like(x)
    rng = np.random.default_rng(5)
    peaks = [(0.64, 0.5, 0.2, 1.0), (0.25, 0.3, 0.16, 0.7), (0.35, 0.85, 0.2, 0.6), (0.9, 0.15, 0.15, 0.5)]
    for px, py, s, a in peaks:
        f += a * np.exp(-(((x - px) * 1.6) ** 2 + (y - py) ** 2) / (2 * s * s))
    f += 0.03 * np.sin(x * 23 + y * 7) + 0.02 * np.sin(y * 31 - x * 11)
    k = 26
    frac = np.abs((f * k) % 1 - 0.5)
    lw = 0.035
    line = np.clip(1 - (frac - (0.5 - lw)) / lw * -1, 0, 1)
    line = np.clip((frac - (0.5 - lw)) / lw, 0, 1)
    shade = 0.18 + 0.22 * np.clip(f, 0, 1)
    a = (line * shade)[..., None]
    img[:] = img * (1 - a) + np.array(INK, dtype=np.float32) * a
    grain(img, 3.5, 31)
    base = to_pil(img).convert("RGBA")
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    cx, cy = w * 0.64, h * 0.5
    for i, r in enumerate((h * .07, h * .12, h * .18)):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(*TEAL, 200 - i * 60), width=max(2, w // 800))
    r = h * .028
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*INK, 255))
    r2 = r * .42
    d.ellipse([cx - r2, cy - r2, cx + r2, cy + r2], fill=(*TEAL, 255))
    return overlay(base, lay)


# ---------------------------------------------------------------------------
# 4. Visits → enquiries: many visitors flow in, a few come through
# ---------------------------------------------------------------------------
def art_convert(w, h):
    img = canvas(w, h, (18, 18, 17))
    glow(img, w * 0.72, h * 0.5, h * 0.6, (24, 70, 64), 0.9)
    glow(img, w * 0.72, h * 0.5, h * 0.16, TEAL, 0.55)
    grain(img, 4, 41)
    base = to_pil(img).convert("RGBA")
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    rng = random.Random(3)
    gate_x, cy = w * 0.72, h * 0.5
    for _ in range(900):
        y0 = rng.uniform(0.04, 0.96) * h
        t = rng.random() ** 0.8
        passes = rng.random() < 0.035
        tt = t if passes else t * rng.uniform(0.55, 0.98)
        xx = w * 0.04 + tt * (gate_x - w * 0.04) if tt <= 1 else gate_x
        pull = (tt ** 2.2)
        yy = y0 * (1 - pull) + cy * pull + rng.gauss(0, h * 0.004)
        pr = w / 900
        a = int(40 + 110 * tt) if not passes else 0
        if a:
            d.ellipse([xx - pr, yy - pr, xx + pr, yy + pr], fill=(238, 238, 234, a))
    for i in range(7):
        xx = gate_x + w * (0.035 + i * 0.03)
        yy = cy + rng.gauss(0, h * 0.01)
        pr = w / 260
        d.ellipse([xx - pr, yy - pr, xx + pr, yy + pr], fill=(*TEAL, 255))
    lw = max(2, w // 700)
    d.line([gate_x, cy - h * .2, gate_x, cy - h * .035], fill=(238, 238, 234, 160), width=lw)
    d.line([gate_x, cy + h * .035, gate_x, cy + h * .2], fill=(238, 238, 234, 160), width=lw)
    return overlay(base, lay)


# ---------------------------------------------------------------------------
# 5. Cost vs return: a quiet, rising bar chart that pays itself back
# ---------------------------------------------------------------------------
def art_cost(w, h):
    img = canvas(w, h, STONE)
    glow(img, w * 0.78, h * 0.2, h * 0.9, (240, 238, 232), 0.7)
    grain(img, 3.5, 51)
    base = to_pil(img).convert("RGBA")
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    n = 12
    left, right, floor = w * 0.1, w * 0.9, h * 0.8
    bw = (right - left) / n * 0.56
    lw = max(2, w // 900)
    d.line([left - w * .02, floor, right + w * .01, floor], fill=(*INK, 120), width=lw)
    pts = []
    for i in range(n):
        t = i / (n - 1)
        val = 0.1 + 0.5 * (t ** 1.7)
        x0 = left + i * (right - left) / n
        top = floor - val * h
        col = (*LILAC, 255) if i >= n - 4 else (*INK, 235 if i < 3 else 255)
        if i < 3:
            d.rectangle([x0, top, x0 + bw, floor], outline=(*INK, 200), width=lw)
        else:
            d.rectangle([x0, top, x0 + bw, floor], fill=col)
        pts.append((x0 + bw / 2, top - h * 0.05))
    d.line(pts, fill=(*INK, 150), width=lw, joint="curve")
    for x, y in pts[::1]:
        pr = w / 520
        d.ellipse([x - pr, y - pr, x + pr, y + pr], fill=(*INK, 200))
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
        big.resize((800, 500), Image.LANCZOS).save(os.path.join(OUT, f"{name}-sm.jpg"), quality=84, optimize=True, progressive=True)
        render(fn, 1200, 630).save(os.path.join(OUT, f"{name}-og.jpg"), quality=84, optimize=True)
        print("rendered", name)
