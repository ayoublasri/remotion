#!/usr/bin/env python3.13
# Rebuilds the SOREC roll-up banner as vector art: the background swooshes
# and photo traced as smooth colour shapes, the badge redrawn (circles, real
# type on arcs, the horse head and heart traced), the headline set in real
# type, the SOREC mark traced and its wordmark set in type. Emits an outlined
# SVG (all paths), an editable SVG (live text with embedded fonts) and a
# preview-ready HTML for the PDF.
import base64, io, json, math, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter
import vtracer
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.varLib import instancer
from fontTools import subset

ROOT = os.path.dirname(os.path.abspath(__file__)) + "/.."
os.makedirs(f"{ROOT}/work", exist_ok=True)
SRC = f"{ROOT}/src/banner.jpg"
WORK = f"{ROOT}/work"
OUT = sys.argv[1] if len(sys.argv) > 1 else f"{ROOT}/out"
os.makedirs(OUT, exist_ok=True)
W, H = 533, 1280
NAVY, GOLD, CREAM = "#0a3153", "#b28e50", "#f7f2eb"
PAL = [(10, 49, 83), (178, 142, 80), (250, 247, 241)]
BADGE = dict(cx=265.75, cy=236.5, R=155.5, r=139.0)

# ---------------- fonts ----------------
class Face:
    def __init__(self, path, wght=None, name=""):
        tt = TTFont(path)
        if wght is not None and "fvar" in tt:
            tt = instancer.instantiateVariableFont(tt, {"wght": wght})
        buf = io.BytesIO(); tt.save(buf); self.data = buf.getvalue()
        self.tt = TTFont(io.BytesIO(self.data))
        self.upem = self.tt["head"].unitsPerEm
        self.cap = (self.tt["OS/2"].sCapHeight or int(0.7 * self.upem)) / self.upem
        self.glyphset = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()
        self.hbfont = hb.Font(hb.Face(self.data))
        self.name = name
    def shape(self, text, size, tracking=0.0):
        buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
        hb.shape(self.hbfont, buf, {"kern": True, "liga": True})
        s = size / self.upem; x = 0.0; out = []
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            g = self.order[info.codepoint]
            adv = pos.x_advance * s
            out.append((g, x + pos.x_offset * s, -pos.y_offset * s, adv))
            x += adv + tracking
        return out, x - tracking
    def path(self, g, size):
        s = size / self.upem
        pen = SVGPathPen(self.glyphset)
        self.glyphset[g].draw(TransformPen(pen, (s, 0, 0, -s, 0, 0)))
        return pen.getCommands()
    def size_for_cap(self, cap_px):
        return cap_px / self.cap

FONTS = f"{ROOT}/fonts"
anton = Face(f"{FONTS}/Anton-Regular.ttf", name="Anton")
oswald = Face(f"{FONTS}/Oswald[wght].ttf", 600, name="Oswald")
mont_b = Face(f"{FONTS}/Montserrat[wght].ttf", 700, name="Montserrat")
mont_x = Face(f"{FONTS}/Montserrat[wght].ttf", 800, name="Montserrat")
mont_k = Face(f"{FONTS}/Montserrat[wght].ttf", 900, name="Montserrat")

def fmt(v): return f"{v:.2f}".rstrip("0").rstrip(".")

def fit_tracking(face, text, size, target):
    glyphs, nat = face.shape(text, size, 0)
    n = max(1, len(glyphs) - 1)
    return (target - nat) / n

# Straight text as outlines: baseline at (x, y), rotated by `rot` degrees about that point.
def text_paths(face, text, size, x, y, fill, tracking=0.0, rot=0.0, anchor="start", skew=0.0, sx=1.0):
    glyphs, length = face.shape(text, size, tracking)
    dx = {"start": 0, "middle": -length / 2, "end": -length}[anchor]
    parts = []
    for g, gx, gy, adv in glyphs:
        d = face.path(g, size)
        if not d: continue
        parts.append(f'<path d="{d}" transform="translate({fmt(gx + dx)},{fmt(gy)})"/>')
    sk = f" skewX({fmt(skew)})" if skew else ""
    sc = f" scale({fmt(sx)},1)" if sx != 1 else ""
    return f'<g fill="{fill}" transform="translate({fmt(x)},{fmt(y)}) rotate({fmt(rot)}){sk}{sc}">' + "".join(parts) + "</g>", length

def text_live(face, text, size, x, y, fill, tracking=0.0, rot=0.0, anchor="start", skew=0.0, weight=None, sx=1.0):
    sk = (f" skewX({fmt(skew)})" if skew else "") + (f" scale({fmt(sx)},1)" if sx != 1 else "")
    ta = {"start": "start", "middle": "middle", "end": "end"}[anchor]
    wt = f' font-weight="{weight}"' if weight else ""
    return (f'<text font-family="{face.name}"{wt} font-size="{fmt(size)}" letter-spacing="{fmt(tracking)}" fill="{fill}" '
            f'text-anchor="{ta}" transform="translate({fmt(x)},{fmt(y)}) rotate({fmt(rot)}){sk}">{text}</text>')

# Text on a circle: centred at `center_deg` (SVG degrees, 0 = right, 90 = down),
# letters upright with their tops outward (outward=True, reads clockwise) or
# inward (bottom arcs, reads counter-clockwise).
def arc_paths(face, text, size, cx, cy, r, center_deg, fill, tracking=0.0, outward=True, colors=None):
    glyphs, length = face.shape(text, size, tracking)
    direction = 1 if outward else -1
    start = math.radians(center_deg) - direction * (length / 2) / r
    parts = []
    for i, (g, gx, gy, adv) in enumerate(glyphs):
        d = face.path(g, size)
        if not d: continue
        th = start + direction * (gx + adv / 2) / r
        px, py = cx + r * math.cos(th), cy + r * math.sin(th)
        rot = math.degrees(th) + (90 if outward else -90)
        col = colors(text, i) if colors else fill
        parts.append(f'<path d="{d}" fill="{col}" transform="translate({fmt(px)},{fmt(py)}) rotate({fmt(rot)}) translate({fmt(-adv / 2)},{fmt(gy)})"/>')
    return "".join(parts), length

def arc_live(face, text, size, cx, cy, r, center_deg, fill, tracking, outward, pid, weight=None):
    # A half circle path through the centre angle, in the reading direction.
    a0 = math.radians(center_deg - 100 * (1 if outward else -1)); a1 = math.radians(center_deg + 100 * (1 if outward else -1))
    x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0); x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
    sweep = 1 if outward else 0
    wt = f' font-weight="{weight}"' if weight else ""
    path = f'<path id="{pid}" d="M{fmt(x0)} {fmt(y0)} A{fmt(r)} {fmt(r)} 0 1 {sweep} {fmt(x1)} {fmt(y1)}" fill="none"/>'
    txt = (f'<text font-family="{face.name}"{wt} font-size="{fmt(size)}" letter-spacing="{fmt(tracking)}" fill="{fill}">'
           f'<textPath href="#{pid}" startOffset="50%" text-anchor="middle">{text}</textPath></text>')
    return path + txt

# ---------------- tracing ----------------
def classify(arr, pal):
    a = arr.astype(float); navy, gold, cream = [np.array(c, float) for c in pal]
    v = cream - navy; vv = (v * v).sum()
    t = np.clip(((a - navy) * v).sum(axis=2) / vv, 0, 1)
    proj = navy + t[..., None] * v
    d_nc = np.sqrt(((a - proj) ** 2).sum(axis=2))
    d_g = np.sqrt(((a - gold) ** 2).sum(axis=2))
    out = np.where(t[..., None] < 0.5, navy, cream)
    out = np.where((d_g < 48)[..., None] & (d_g < d_nc)[..., None], gold, out)
    far = (d_nc >= 60) & ~((d_g < 48) & (d_g < d_nc))
    d_all = np.stack([np.sqrt(((a - c) ** 2).sum(axis=2)) for c in (navy, gold, cream)], axis=2)
    nearest = np.array(pal)[d_all.argmin(axis=2)]
    out = np.where(far[..., None], nearest, out)
    return out.astype(np.uint8)

def trace_flat(crop_box, k, name, speckle=10, keep=(0, 1)):
    x0, y0, x1, y1 = crop_box
    im = Image.open(SRC).convert("RGB").crop(crop_box).resize(((x1 - x0) * k, (y1 - y0) * k), Image.LANCZOS)
    im = im.filter(ImageFilter.GaussianBlur(0.8))
    post = classify(np.asarray(im), PAL)
    pp = f"{WORK}/{name}-post.png"; Image.fromarray(post).save(pp)
    sv = f"{WORK}/{name}.svg"
    vtracer.convert_image_to_svg_py(pp, sv, colormode="color", hierarchical="stacked", mode="spline", filter_speckle=speckle,
        color_precision=8, layer_difference=8, corner_threshold=50, length_threshold=3.5, max_iterations=10, splice_threshold=45, path_precision=3)
    paths = []
    for m in re.finditer(r'<path d="([^"]+)" fill="#([0-9A-Fa-f]{6})"(?: transform="translate\(([\d.-]+),([\d.-]+)\)")?', open(sv).read()):
        d, col, tx, ty = m.group(1), m.group(2).lower(), m.group(3) or "0", m.group(4) or "0"
        rgb = tuple(int(col[i:i + 2], 16) for i in (0, 2, 4))
        dist = [sum((rgb[j] - PAL[c][j]) ** 2 for j in range(3)) for c in range(3)]
        c = int(np.argmin(dist))
        if c == 2 or c not in keep: continue
        fill = NAVY if c == 0 else GOLD
        paths.append(f'<path d="{d}" fill="{fill}" transform="translate({tx},{ty})"/>')
    return f'<g transform="translate({x0},{y0}) scale({fmt(1 / k)})">' + "".join(paths) + "</g>"

def clean_background():
    # Paint out the headline and the logo (ffmpeg delogo), then the badge disc.
    tmp = f"{WORK}/bg-delogo.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-vf",
        "delogo=x=118:y=415:w=288:h=558,delogo=x=160:y=1096:w=300:h=66", tmp], check=True)
    im = Image.open(tmp).convert("RGB")
    a = np.asarray(im).astype(float)
    bl = np.asarray(im.filter(ImageFilter.GaussianBlur(2))).astype(float)
    cx, cy, R = BADGE["cx"], BADGE["cy"], BADGE["R"] + 4
    yy, xx = np.mgrid[0:H, 0:W]
    rho = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2); ang = np.arctan2(yy - cy, xx - cx)
    ring = np.zeros((360, 3))
    for i in range(360):
        th = math.radians(i - 180)
        px, py = int(round(cx + (R + 4) * math.cos(th))), int(round(cy + (R + 4) * math.sin(th)))
        ring[i] = bl[min(H - 1, max(0, py)), min(W - 1, max(0, px))]
    mean = ring.mean(axis=0)
    inside = rho < R
    idx = ((np.degrees(ang) + 180) % 360).astype(int)
    opp = (idx + 180) % 360
    w = (rho / R)[..., None]
    fill = ring[idx] * (0.5 + 0.5 * w) + ring[opp] * (0.5 - 0.5 * w) * 0.5 + mean * (0.5 - 0.5 * w) * 0.5
    a[inside] = fill[inside]
    Image.fromarray(a.astype(np.uint8)).save(f"{WORK}/bg-clean.png")
    big = Image.fromarray(a.astype(np.uint8)).resize((W * 2, H * 2), Image.LANCZOS).filter(ImageFilter.GaussianBlur(float(os.environ.get("BG_BLUR", "1.4"))))
    big.save(f"{WORK}/bg-clean2x.png")

def trace_background(opts):
    sv = f"{WORK}/bg.svg"
    vtracer.convert_image_to_svg_py(f"{WORK}/bg-clean2x.png", sv, colormode="color", hierarchical="stacked", mode="spline",
        filter_speckle=opts.get("filter_speckle", 10), color_precision=opts.get("color_precision", 7), layer_difference=opts.get("layer_difference", 14),
        corner_threshold=opts.get("corner_threshold", 70), length_threshold=opts.get("length_threshold", 5.0), max_iterations=10,
        splice_threshold=opts.get("splice_threshold", 55), path_precision=2)
    body = re.findall(r"<path[^>]*/>", open(sv).read())
    return f'<g transform="scale(0.5)">' + "".join(body) + "</g>", len(body)

# ---------------- the layers ----------------
def badge(live=False):
    cx, cy, R, r = BADGE["cx"], BADGE["cy"], BADGE["R"], BADGE["r"]
    g = [f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(R)}" fill="none" stroke="{NAVY}" stroke-width="1.7"/>',
         f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(r)}" fill="none" stroke="{NAVY}" stroke-width="1.4"/>']
    for deg in (27, 153):
        g.append(f'<circle cx="{fmt(cx + 147 * math.cos(math.radians(deg)))}" cy="{fmt(cy + 147 * math.sin(math.radians(deg)))}" r="2.4" fill="{GOLD}"/>')
    size = 11.6
    top = "INNOVATION  •  ESPRIT SOREC  •  EXCELLENCE  •  ORIENTATION CLIENT"
    bot = "UN CHEVAL. PLUSIEURS UNIVERS."
    r_top, r_bot = 142.6, 152.0
    tr_top = fit_tracking(mont_b, top, size, math.radians(196) * r_top)
    tr_bot = fit_tracking(mont_b, bot, size, math.radians(104) * r_bot)
    colors = lambda text, i: GOLD if text[i] == "•" else NAVY
    if live:
        g.append(arc_live(mont_b, top, size, cx, cy, r_top, -93, NAVY, tr_top, True, "arcTop", 700))
        g.append(arc_live(mont_b, bot, size, cx, cy, r_bot, 87.5, NAVY, tr_bot, False, "arcBot", 700))
    else:
        g.append(arc_paths(mont_b, top, size, cx, cy, r_top, -93, NAVY, tr_top, True, colors)[0])
        g.append(arc_paths(mont_b, bot, size, cx, cy, r_bot, 87.5, NAVY, tr_bot, False)[0])
    # Horse head and heart, traced from the source at 6x.
    g.append(trace_flat((190, 121, 346, 301), 6, "horse"))
    s1 = mont_x.size_for_cap(11.2); s2 = mont_k.size_for_cap(16.2)
    t1 = fit_tracking(mont_x, "TEAMBUILDING", s1, 152); t2 = fit_tracking(mont_k, "FILIÈRE", s2, 126)
    if live:
        g.append(text_live(mont_x, "TEAMBUILDING", s1, 266, 313.5, NAVY, t1, 0, "middle", weight=800))
        g.append(text_live(mont_k, "FILIÈRE", s2, 268, 338.5, NAVY, t2, 0, "middle", weight=900))
    else:
        g.append(text_paths(mont_x, "TEAMBUILDING", s1, 266, 313.5, NAVY, t1, 0, "middle")[0])
        g.append(text_paths(mont_k, "FILIÈRE", s2, 268, 338.5, NAVY, t2, 0, "middle")[0])
    return '<g id="badge">' + "".join(g) + "</g>"

def headline(live=False):
    g = []
    lines = [("OCTOBRE 2026", anton, GOLD, 190.5, 937, 447, 64.5), ("TEAMBUILDING", anton, NAVY, 303.5, 965, 424, 68.0)]
    for text, face, fill, baseline_x, y_start, y_end, cap in lines:
        size = face.size_for_cap(cap); tr = fit_tracking(face, text, size, y_start - y_end)
        g.append((text_live if live else lambda *a, **k: text_paths(*a, **k)[0])(face, text, size, baseline_x, y_start, fill, tr, -90, "start"))
    # Third line: FILIÈRE in Anton, SOREC lighter, in Oswald, same cap height.
    cap = 56.0; sa = anton.size_for_cap(cap); so = oswald.size_for_cap(cap)
    len_total = 927 - 449
    # Measured on the source: FILIÈRE runs 927 -> 676, a 27 px space, SOREC 649 -> 449.
    tra = fit_tracking(anton, "FILIÈRE", sa, 251); tro = fit_tracking(oswald, "SOREC", so, 200)
    if live:
        g.append(text_live(anton, "FILIÈRE", sa, 398.5, 927, NAVY, tra, -90, "start"))
        g.append(text_live(oswald, "SOREC", so, 398.5, 649, NAVY, tro, -90, "start", weight=600))
    else:
        g.append(text_paths(anton, "FILIÈRE", sa, 398.5, 927, NAVY, tra, -90, "start")[0])
        g.append(text_paths(oswald, "SOREC", so, 398.5, 649, NAVY, tro, -90, "start")[0])
    for x, y0, y1 in ((214.5, 448, 927), (325.5, 485, 914)):
        g.append(f'<rect x="{fmt(x - 0.9)}" y="{y0}" width="1.8" height="{y1 - y0}" fill="{GOLD}"/>')
    return '<g id="titre">' + "".join(g) + "</g>"

def logo(live=False):
    g = [trace_flat((160, 1098, 262, 1150), 6, "mark", keep=(1,))]
    size = mont_k.size_for_cap(25.0); tr = 2.0
    _, nat = mont_k.shape("SOREC", size, tr)
    sx = (452 - 236) / nat
    if live:
        g.append(text_live(mont_k, "SOREC", size, 236, 1152, NAVY, tr, 0, "start", skew=-12, weight=900, sx=sx))
    else:
        g.append(text_paths(mont_k, "SOREC", size, 236, 1152, NAVY, tr, 0, "start", skew=-12, sx=sx)[0])
    return '<g id="logo-sorec">' + "".join(g) + "</g>"

def font_face_css():
    css = []
    specs = [("Anton", anton, 400), ("Montserrat", mont_b, 700), ("Montserrat", mont_x, 800), ("Montserrat", mont_k, 900), ("Oswald", oswald, 500)]
    text = "INNOVATION•ESPRITSORECEXCELLENCEORIENTATIONCLIENTUNCHEVAL.PLUSIEURSUNIVERSTEAMBUILDINGFILIÈREOCTOBRE2026 "
    for fam, face, wt in specs:
        opt = subset.Options(); opt.layout_features = ["kern"]; opt.name_IDs = ["*"]
        f = TTFont(io.BytesIO(face.data)); sub = subset.Subsetter(opt); sub.populate(text=text); sub.subset(f)
        buf = io.BytesIO(); f.save(buf); b64 = base64.b64encode(buf.getvalue()).decode()
        css.append(f"@font-face{{font-family:'{fam}';font-weight:{wt};src:url(data:font/ttf;base64,{b64}) format('truetype');}}")
    return "<style>" + "".join(css) + "</style>"

def main():
    clean_background()
    bg, n = trace_background({"color_precision": 8, "layer_difference": 8, "filter_speckle": int(os.environ.get("BG_SPECKLE", "6")), "corner_threshold": 60, "length_threshold": 4.0, "splice_threshold": 45})
    print("background paths:", n)
    head = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {W} {H}" width="850mm" height="{fmt(850 * H / W)}mm">'
            f'<title>Teambuilding Filière SOREC — octobre 2026</title>')
    fond = '<g id="fond">' + bg + "</g>"
    outlined = head + fond + badge(False) + headline(False) + logo(False) + "</svg>"
    editable = head + "<defs>" + font_face_css() + "</defs>" + fond + badge(True) + headline(True) + logo(True) + "</svg>"
    open(f"{OUT}/banner-outlined.svg", "w").write(outlined)
    open(f"{OUT}/banner-editable.svg", "w").write(editable)
    print("wrote", f"{OUT}/banner-outlined.svg", len(outlined) // 1024, "KB;", f"{OUT}/banner-editable.svg", len(editable) // 1024, "KB")

if __name__ == "__main__":
    main()
