"""Generates the Gato Mago favicon set and Open Graph card.

Usage: python3 design/make-brand-assets.py <font-dir>
  <font-dir> must contain cinzel.ttf (Cinzel Decorative Bold), cormorant.ttf and
  cormorant-italic.ttf (Cormorant Garamond variable) and ogham.ttf (Noto Sans Ogham),
  all from github.com/google/fonts (OFL).
Writes icons and the OG and Twitter images into web/src/app.
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONTS = Path(sys.argv[1])
ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "web" / "src" / "app"
PHOTO = ROOT / "web" / "public" / "gato-mago.jpg"

INK = (20, 22, 29)
VOID = (16, 18, 26)
PARCH = (234, 223, 196)
MUTED = (185, 174, 152)
GOLD = (226, 178, 92)
GOLD_LIGHT = (243, 213, 143)
TEAL = (111, 214, 201)

# One spiral of the triskelion in a -30..30 box; mirrors the site glyph (glyphs.tsx).
ARM_PTS = [(0.0, 0.0), (-1.17, -0.17), (-2.3, -0.45), (-3.4, -0.83), (-4.45, -1.3), (-5.44, -1.85), (-6.36, -2.5), (-7.22, -3.21), (-7.99, -4.0), (-8.69, -4.84), (-9.3, -5.74), (-9.82, -6.67), (-10.24, -7.64), (-10.58, -8.64), (-10.81, -9.65), (-10.96, -10.67), (-11.0, -11.69), (-10.96, -12.69), (-10.82, -13.68), (-10.59, -14.64), (-10.29, -15.56), (-9.9, -16.45), (-9.43, -17.28), (-8.9, -18.06), (-8.31, -18.78), (-7.66, -19.43), (-6.96, -20.01), (-6.22, -20.52), (-5.45, -20.95), (-4.64, -21.31), (-3.82, -21.59), (-2.99, -21.78), (-2.15, -21.9), (-1.32, -21.94), (-0.5, -21.91), (0.31, -21.79), (1.09, -21.61), (1.84, -21.36), (2.55, -21.04), (3.22, -20.67), (3.85, -20.24), (4.42, -19.76), (4.94, -19.24), (5.41, -18.68), (5.81, -18.09), (6.15, -17.47), (6.43, -16.83), (6.64, -16.18), (6.79, -15.52), (6.87, -14.87), (6.89, -14.22), (6.86, -13.58), (6.76, -12.95), (6.61, -12.35), (6.4, -11.78), (6.15, -11.24), (5.85, -10.73), (5.52, -10.26), (5.14, -9.84), (4.74, -9.45), (4.31, -9.12), (3.86, -8.83), (3.39, -8.59), (2.91, -8.41), (2.43, -8.27), (1.95, -8.18), (1.47, -8.14), (1.0, -8.14), (0.54, -8.19), (0.1, -8.28), (-0.32, -8.41), (-0.72, -8.58), (-1.08, -8.78), (-1.42, -9.01), (-1.73, -9.26), (-2.0, -9.54), (-2.24, -9.83), (-2.44, -10.14), (-2.6, -10.45), (-2.73, -10.78), (-2.82, -11.1), (-2.87, -11.42), (-2.9, -11.73), (-2.88, -12.04), (-2.84, -12.33), (-2.77, -12.61), (-2.68, -12.87), (-2.56, -13.11), (-2.42, -13.32), (-2.26, -13.51), (-2.09, -13.68)]


def bezier(p0, p1, p2, p3, n=40):
    pts = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        pts.append(
            (
                u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0],
                u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1],
            )
        )
    return pts


def stroke(draw, pts, width, fill):
    r = width / 2
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        steps = max(2, int(math.hypot(x1 - x0, y1 - y0) / max(r / 2, 1)))
        for i in range(steps + 1):
            x = x0 + (x1 - x0) * i / steps
            y = y0 + (y1 - y0) * i / steps
            draw.ellipse((x - r, y - r, x + r, y + r), fill=fill)


def triskele(draw, cx, cy, k, width, fill):
    """k = pixels per glyph unit; width in pixels."""
    for deg in (0, 120, 240):
        a = math.radians(deg)
        ca, sa = math.cos(a), math.sin(a)
        pts = [(cx + (x * ca - y * sa) * k, cy + (x * sa + y * ca) * k) for x, y in ARM_PTS]
        stroke(draw, pts, width, fill)
    r = width * 0.95
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill)


def spark(draw, cx, cy, r, fill):
    pts = []
    for i in range(8):
        a = math.pi / 4 * i - math.pi / 2
        rad = r if i % 2 == 0 else r * 0.2
        pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
    draw.polygon(pts, fill=fill)


# ---------------------------------------------------------------- favicon
def favicon_master(size=1024):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * 0.22), fill=INK)
    # candle glow behind the glyph
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    m = size * 0.16
    gd.ellipse((m, m, size - m, size - m), fill=(240, 168, 48, 70))
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.09))
    img.alpha_composite(glow)
    d = ImageDraw.Draw(img)
    # thin ring
    rm = size * 0.085
    d.ellipse((rm, rm, size - rm, size - rm), outline=GOLD, width=int(size * 0.028))
    # bold triskele so it survives 16px
    triskele(d, size / 2, size / 2, size * 0.0135, size * 0.062, GOLD_LIGHT)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, size - 1, size - 1), radius=int(size * 0.22), fill=255
    )
    img.putalpha(mask)
    return img


def write_favicons():
    master = favicon_master()
    master.resize((192, 192), Image.LANCZOS).save(APP / "icon.png", optimize=True)
    # Apple touch icon: full-bleed, iOS rounds the corners itself
    flat = Image.new("RGB", master.size, INK)
    flat.paste(master, mask=master.split()[3])
    flat.resize((180, 180), Image.LANCZOS).save(APP / "apple-icon.png", optimize=True)
    master.resize((256, 256), Image.LANCZOS).save(
        APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
    )


# ---------------------------------------------------------------- OG card
def font(name, size, variation=None):
    f = ImageFont.truetype(str(FONTS / name), size)
    if variation:
        f.set_variation_by_axes([variation])
    return f


def spaced(draw, xy, text, fnt, fill, tracking):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return x


def og_card():
    S = 2  # supersample
    W, H = 1200 * S, 630 * S
    img = Image.new("RGB", (W, H), INK)

    # warm candle glow, right side
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((620 * S, -60 * S, 1260 * S, 560 * S), fill=(240, 168, 48, 60))
    ImageDraw.Draw(glow).ellipse((760 * S, 280 * S, 1200 * S, 700 * S), fill=(111, 214, 201, 28))
    glow = glow.filter(ImageFilter.GaussianBlur(70 * S))
    img = Image.alpha_composite(img.convert("RGBA"), glow)

    # arched photo frame
    ax0, ay0, ax1, ay1 = 735 * S, 45 * S, 1140 * S, 585 * S
    pad = 10 * S
    d = ImageDraw.Draw(img)
    arch = lambda box, fill=None, outline=None, width=0: d.rounded_rectangle(
        box, radius=(box[2] - box[0]) // 2, fill=fill, outline=outline, width=width
    )
    # square off the bottom corners
    def arch_shape(box, **kw):
        arch(box, **kw)
        r = 14 * S
        d.rounded_rectangle((box[0], box[1] + (box[3] - box[1]) // 2, box[2], box[3]), radius=r, **kw)

    arch_shape((ax0, ay0, ax1, ay1), outline=GOLD, width=3 * S)
    inner = (ax0 + pad, ay0 + pad, ax1 - pad, ay1 - pad)
    iw, ih = inner[2] - inner[0], inner[3] - inner[1]
    photo = Image.open(PHOTO).convert("RGB")
    ch = 1560
    cw = int(ch * iw / ih)
    cx = 1010
    photo = photo.crop((cx - cw // 2, 110, cx + cw // 2, 110 + ch)).resize((iw, ih), Image.LANCZOS)
    mask = Image.new("L", (iw, ih), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, iw, ih), radius=iw // 2, fill=255)
    md.rounded_rectangle((0, ih // 2, iw, ih), radius=6 * S, fill=255)
    img.paste(photo, (inner[0], inner[1]), mask)
    d = ImageDraw.Draw(img)

    # sparkles + moon
    spark(d, 712 * S, 130 * S, 17 * S, TEAL)
    spark(d, 1168 * S, 210 * S, 10 * S, GOLD)
    spark(d, 1150 * S, 470 * S, 13 * S, TEAL)
    spark(d, 700 * S, 430 * S, 8 * S, GOLD)

    # wordmark
    triskele(d, 100 * S, 92 * S, 0.9 * S, 3.6 * S, GOLD)
    spaced(d, (138 * S, 66 * S), "GATO MAGO", font("cinzel.ttf", 34 * S), PARCH, 3 * S)

    # ogham line
    d.text((82 * S, 140 * S), "ᚌᚐᚈᚑ ᚋᚐᚌᚑ", font=font("ogham.ttf", 44 * S), fill=GOLD)

    # headline
    big = font("cormorant.ttf", 118 * S, 600)
    big_i = font("cormorant-italic.ttf", 118 * S, 600)
    d.text((78 * S, 178 * S), "Discover the", font=big, fill=PARCH)
    d.text((78 * S, 285 * S), "magic", font=big_i, fill=GOLD)

    # supporting line
    sub = font("cormorant.ttf", 33 * S, 500)
    d.text((82 * S, 438 * S), "Essays, charms and field notes from", font=sub, fill=MUTED)
    d.text((82 * S, 477 * S), "the candlelit study of Juan Luis Villaseñor.", font=sub, fill=MUTED)

    # CTA pill + domain
    pill = (82 * S, 544 * S, 316 * S, 592 * S)
    d.rounded_rectangle(pill, radius=24 * S, fill=GOLD)
    cta = font("cormorant.ttf", 28 * S, 700)
    label = "Enter the study"
    tw = d.textlength(label, font=cta)
    d.text((pill[0] + (pill[2] - pill[0] - tw) / 2, pill[1] + 6 * S), label, font=cta, fill=INK)
    d.text((340 * S, 549 * S), "gatomago.dev", font=font("cormorant.ttf", 28 * S, 600), fill=PARCH)

    return img.convert("RGB").resize((1200, 630), Image.LANCZOS)


def main():
    write_favicons()
    card = og_card()
    card.save(APP / "opengraph-image.jpg", quality=90, optimize=True)
    card.save(APP / "twitter-image.jpg", quality=90, optimize=True)
    print("done")


if __name__ == "__main__":
    main()
