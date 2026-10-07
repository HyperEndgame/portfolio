"""Draws the 16x16 pixel icons and emits src/icons.js (+ a preview sheet).
Run: python scripts/icons.py   (needs Pillow)
"""
import json, math, random, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
N = 16


def hexc(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (255,)


class C:
    def __init__(self, n=N):
        self.n = n
        self.im = Image.new('RGBA', (n, n), (0, 0, 0, 0))

    def px(self, x, y, c):
        if 0 <= x < self.n and 0 <= y < self.n:
            self.im.putpixel((x, y), hexc(c) if isinstance(c, str) else c)

    def rect(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.px(x, y, c)

    def rows(self, x0, y0, rows, pal):
        """Paint ascii rows; '.' = skip."""
        for j, r in enumerate(rows):
            for i, ch in enumerate(r):
                if ch in pal:
                    self.px(x0 + i, y0 + j, pal[ch])

    def disc(self, cx, cy, r, c):
        for y in range(self.n):
            for x in range(self.n):
                if (x + .5 - cx) ** 2 + (y + .5 - cy) ** 2 <= r * r:
                    self.px(x, y, c)

    def get(self, x, y):
        if 0 <= x < self.n and 0 <= y < self.n:
            return self.im.getpixel((x, y))
        return (0, 0, 0, 0)

    def outline(self, c='#1a1210'):
        add = []
        for y in range(self.n):
            for x in range(self.n):
                if self.get(x, y)[3]:
                    continue
                if any(self.get(x + dx, y + dy)[3] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    add.append((x, y))
        for x, y in add:
            self.px(x, y, c)


def shade(c, f):
    r, g, b, a = hexc(c)
    return (min(255, int(r * f)), min(255, int(g * f)), min(255, int(b * f)), 255)


def noise_fill(cv, pts, base, seed, spread=.12):
    rnd = random.Random(seed)
    for x, y in pts:
        cv.px(x, y, shade(base, 1 + rnd.uniform(-spread, spread)))


def iso_cube(top, left, right, fringe=None, seed=1):
    """Isometric block: top diamond rows 0-7, sides rows 4-15."""
    cv = C()
    rnd = random.Random(seed)
    for y in range(8):
        half = y + 1 if y < 4 else 8 - y
        for x in range(8 - 2 * half, 8 + 2 * half):
            cv.px(x, y, shade(top, rnd.choice((.9, 1, 1.1))))
    for x in range(16):
        top_y = 4 + (x // 2 if x < 8 else (15 - x) // 2)
        for y in range(top_y, min(16, top_y + 9)):
            base = left if x < 8 else right
            col = fringe if fringe and y - top_y < 2 + (x % 3 == 0) else base
            cv.px(x, y, shade(col, (1 if x < 8 else .78) * rnd.choice((.88, 1, 1.1))))
    return cv


icons = {}

# --- hotbar -----------------------------------------------------------------
icons['grass'] = iso_cube('#6fb83f', '#8a5a35', '#8a5a35', fringe='#5e9e34', seed=3)

c = C()
c.rows(2, 1, [
    "....oooooo..",
    "..ooPPPPPPoo",
    ".oPPPPpPPPPw",
    ".oPGGPPPPPPw",
    ".oPGPPPPpPPw",
    ".oPPPPPPPPPw",
    ".oPPPpPPPPPw",
    ".oPPPPPPGGPw",
    ".oPPPPPPPGPw",
    ".oPpPPPPPPPw",
    ".oPPPPPPpPPw",
    ".ooPPPPPPPPw",
    "..oowwwwwwww",
], {'o': '#2c1446', 'P': '#6b33a8', 'p': '#c47cff', 'G': '#e8c25a', 'w': '#ece4d4'})
c.outline('#160a24')
icons['book'] = c

c = C()
c.rows(1, 2, [
    "dddddddddddddd",
    "dWWWWWWWWWWWWd",
    "dwwwwwwwwwwwwd",
    "dWWWWWWWWWWWWd",
    "dddddddddddddd",
    "ddddddLLdddddd",
    "dWWWWWLlWWWWWd",
    "dwwwwwwwwwwwwd",
    "dWWWWWWWWWWWWd",
    "dwwwwwwwwwwwwd",
    "dWWWWWWWWWWWWd",
    "dddddddddddddd",
], {'d': '#3b240f', 'W': '#b07434', 'w': '#8c5826', 'L': '#d8d8d8', 'l': '#8a8a8a'})
icons['chest'] = c

c = C()
c.disc(8, 8, 7, '#9a7420')
c.disc(8, 8, 6, '#e3b54a')
c.disc(8, 8, 5, '#2a2a33')
c.rows(4, 3, [
    "....r...",
    "...rr...",
    "...rR...",
    "..rRR...",
    "...WW...",
    "...gg...",
    "..gg....",
    "..g.....",
], {'r': '#ff4040', 'R': '#b81e1e', 'W': '#ffffff', 'g': '#9aa0b8'})
c.outline()
icons['compass'] = c

c = C()
c.rows(0, 0, [
    ".......w........",
    ".......w........",
    "......wWw.......",
    "......wWw.......",
    ".....wWYWw......",
    "....wWYYYWw.....",
    "..wwWYYYYYWww...",
    "wwWWYYYYYYYWWww.",
    "..wwWYYYYYWww...",
    "....wWYYYWw.....",
    ".....wWYWw......",
    "......wWw.......",
    "......wWw.......",
    ".......w........",
    ".......w........",
], {'w': '#a9b4e0', 'W': '#e8ecff', 'Y': '#fffbe0'})
icons['star'] = c

c = C()
c.rows(3, 1, [
    "...gGGGg..",
    "..gGLLGGg.",
    ".gGLLGGGGg",
    "gGLGGGGGGd",
    "gGLGGGGGdd",
    "gGGGGGGGdd",
    "gGGGGGGddd",
    ".gGGGGGdd.",
    "..gGGGdd..",
    "...gGdd...",
    "....gd....",
], {'g': '#0b6b2c', 'G': '#1fd15a', 'L': '#c6ffd6', 'd': '#12963e'})
c.outline('#04310f')
icons['emerald'] = c

c = C()
c.rows(1, 1, [
    "...........wW.",
    "..........wWg.",
    ".........wWg..",
    "........wWg...",
    "bbbbbbbwWgbb..",
    "bBBBBBwWgBBb..",
    "bBBBBwWgBBBb..",
    "bBBBkkgBBBBb..",
    "bBBBkBBBBBBb..",
    "bBBBBBBBBBBb..",
    "bBBBBBBBBBBb..",
    "bppppppppppb..",
    "bbbbbbbbbbbb..",
], {'b': '#3a210d', 'B': '#8f5428', 'w': '#ffffff', 'W': '#d4d4d4', 'g': '#9a9a9a', 'k': '#1c1c1c', 'p': '#efe6cf'})
icons['quill'] = c

c = C()
c.disc(8, 8, 6, '#0e4a46')
c.disc(8, 8, 5, '#1f8f7f')
c.disc(8.6, 8.6, 2.5, '#0b3e38')
c.rows(5, 4, ["LL.", "L.."], {'L': '#aefff0'})
c.outline('#062421')
icons['pearl'] = c

# --- projects / items --------------------------------------------------------
c = C()
c.rows(1, 2, [
    "kkkkkkkkkk.TTT",
    "kbbbbbbbbk.TRT",
    "kbLbbbbbbk.TTT",
    "kbbbbgbbbk.TGT",
    "kbbbbbbbbk.TTT",
    "kbbrbbbbbk.TBT",
    "kkkkkkkkkk.TTT",
    "....kk.....TTT",
    "...kkkk....TTT",
], {'k': '#2a2a2e', 'b': '#2563d9', 'L': '#a8d4ff', 'g': '#40e080', 'r': '#ff4f7a',
    'T': '#3a3a40', 'R': '#ff4f7a', 'G': '#40e080', 'B': '#4f9bff'})
c.outline('#0e0e10')
icons['pc'] = c

c = C()
c.rows(2, 1, [
    "......r.....",
    "......k.....",
    "..kkkkkkkk..",
    ".kggggggggk.",
    ".kgCCggCCgk.",
    ".kgCcggCcgk.",
    ".kggggggggk.",
    ".kgkkkkkkgk.",
    ".kggggggggk.",
    "..kkkkkkkk..",
    "..kk....kk..",
], {'r': '#ff3b3b', 'k': '#2b2b30', 'g': '#9aa0a8', 'C': '#4ae6ff', 'c': '#ffffff'})
c.outline('#0e0e10')
icons['bot'] = c

c = C()
for a in range(8):
    ang = a * math.pi / 4
    cx, cy = 8 + 5.6 * math.cos(ang), 8 + 5.6 * math.sin(ang)
    c.rect(round(cx - 1), round(cy - 1), round(cx), round(cy), '#8a8f98')
c.disc(8, 8, 5, '#b8bec8')
c.disc(8, 8, 4, '#8a8f98')
c.disc(8, 8, 2, (0, 0, 0, 0))
c.px(6, 5, '#e8ecf2'); c.px(5, 6, '#e8ecf2')
c.outline('#2a2d33')
icons['gear'] = c

c = C()
c.rows(4, 0, [
    "rr..bb..",
    ".rrbb...",
    "..rb....",
    "..rb....",
], {'r': '#d63a3a', 'b': '#2e5bd6'})
c.disc(8, 10, 4.6, '#b8861c')
c.disc(8, 10, 3.6, '#f0c040')
c.rows(6, 8, ["Y.", "YY"], {'Y': '#fff4b0'})
c.outline('#3a2a08')
icons['medal'] = c

c = C()
c.rows(2, 1, [
    "..........kk",
    ".........kk.",
    "........kk..",
    "......BBk...",
    ".....BBBB...",
    "....BbBBB...",
    "...BBBBB....",
    "..BBbkBBB...",
    ".BBBBBBBB...",
    "BBbBBBBB....",
    "BBBBBBB.....",
    ".BBBBB......",
    "..BBB.......",
], {'k': '#1e1e1e', 'B': '#a8561e', 'b': '#e09050'})
c.outline('#2a1406')
icons['viola'] = c

c = C()
c.rows(2, 1, [
    "GGGGGGGGGGGG",
    "gGYGGGGGGGGg",
    "gGYGGGGGGGGg",
    ".gGYGGGGGGg.",
    ".gGGGGGGGGg.",
    "..gGGGGGGg..",
    "...gGGGGg...",
    ".....GG.....",
    ".....gg.....",
    "....GGGG....",
    "...kkkkkk...",
    "...kWWWWk...",
    "...kkkkkk...",
], {'G': '#f2c23a', 'g': '#b88a14', 'Y': '#fff6c8', 'k': '#4a3020', 'W': '#d8b070'})
c.outline('#3a2808')
icons['trophy'] = c

c = C()
c.rows(2, 2, [
    ".pppppppppp.",
    "pPPPPPPPPPPp",
    "pPkkkkkkkPPp",
    "pPPPPPPPPPPp",
    "pPkkkkkkPPPp",
    "pPPPPPPPPPPp",
    "pPkkkkkPPPPp",
    "pPPPPPPPrrPp",
    "pPPPPPPrRRrp",
    "pPPPPPPPrrPp",
    ".pppppppppp.",
], {'p': '#b89a64', 'P': '#f2e6c4', 'k': '#7a6a4a', 'r': '#c82828', 'R': '#ff5050'})
c.outline('#3a2c14')
icons['scroll'] = c

c = C()
c.rows(2, 1, [
    ".....y......",
    "....yYy.....",
    "....yYYy....",
    "...yYOYy.y..",
    "..yYOOOYyYy.",
    "..yOOrOOYy..",
    "..yOrrrOOy..",
    "...OrrrrO...",
    "LLLLLLLLLLLL",
    "lLLLlLLLlLLl",
    "..LLLLLLLL..",
    ".llllllllll.",
], {'y': '#ffd23a', 'Y': '#ffe98a', 'O': '#ff8a1e', 'r': '#e8401a', 'L': '#7a4a22', 'l': '#4e2e14'})
c.outline('#2a1606')
icons['campfire'] = c

c = C()
c.disc(8, 8, 6.5, '#2f6fd6')
c.rows(3, 3, [
    "..gg......",
    ".gggg..g..",
    "gggggggg..",
    ".ggggg....",
    "..ggg..gg.",
    "...g..ggg.",
    "......gg..",
    "..........",
], {'g': '#3fbf5a'})
c.rows(5, 3, ["W"], {'W': '#bfe2ff'})
c.outline('#0e2448')
icons['globe'] = c

c = C()
c.rows(4, 0, [
    "..kkkk..",
    "..kWWk..",
    "...ww...",
    "...ww...",
    "..wwww..",
], {'k': '#6a4a2a', 'W': '#a87a4a', 'w': '#d8eef8'})
c.disc(8, 10.5, 4.6, '#d8eef8')
c.disc(8, 11, 3.6, '#c04ae8')
c.rows(6, 8, ["W"], {'W': '#ffffff'})
c.rows(9, 12, ["p"], {'p': '#ff9cff'})
c.outline('#2a1e3a')
icons['flask'] = c

c = C()
for a in range(5):
    ang = -math.pi / 2 + a * 2 * math.pi / 5
    c.disc(8 + 3.6 * math.cos(ang), 8 + 3.6 * math.sin(ang), 2.7, '#ffb3d1')
c.disc(8, 8, 2, '#ff7fae')
c.px(7, 7, '#fff0a0'); c.px(8, 8, '#fff0a0')
c.outline('#6a2846')
icons['blossom'] = c

c = C()
c.rows(1, 3, [
    "wwwwwwwwwwwwww",
    "wWwwwwwwwwwwWw",
    "wwWwwwwwwwwWww",
    "wwwWwwwwwwWwww",
    "wwwwWWwwWWwwww",
    "wwwwwwWWwwwwww",
    "wwwwwwwwwwwwww",
    "wwwwwwwwwwwwww",
    "wwwwwwwwwwwwww",
], {'w': '#f2ecdc', 'W': '#b8ae94'})
c.outline('#4a3e28')
icons['envelope'] = c

c = C()
c.disc(8, 6, 4.6, '#e83030')
c.rows(6, 9, ["RRRR", ".RR.", ".RR.", "..R."], {'R': '#e83030'})
c.disc(8, 6, 1.8, '#ffffff')
c.outline('#4a0c0c')
icons['pin'] = c

c = C()
c.rows(1, 3, [
    ".....hhhh.....",
    ".....h..h.....",
    "BBBBBBBBBBBBBB",
    "BbbbbbbbbbbbbB",
    "BbbbbbGGbbbbbB",
    "BBBBBBGGBBBBBB",
    "BbbbbbbbbbbbbB",
    "BbbbbbbbbbbbbB",
    "BbbbbbbbbbbbbB",
    "BBBBBBBBBBBBBB",
], {'h': '#3a2410', 'B': '#5a3418', 'b': '#9a5e2c', 'G': '#e8c25a'})
c.outline('#22140a')
icons['briefcase'] = c

c = C()
c.rows(1, 3, [
    "...kkkk.......",
    "kkkkkkkkkkkkkk",
    "kgggggggggggRk",
    "kggggLLLLggggk",
    "kgggLbbbbLgggk",
    "kgggLbBbbLgggk",
    "kgggLbbbbLgggk",
    "kggggLLLLggggk",
    "kgggggggggggggk"[:14],
    "kkkkkkkkkkkkkk",
], {'k': '#2a2a2e', 'g': '#d0567a', 'L': '#f0f0f0', 'b': '#2a2a40', 'B': '#8ab0ff', 'R': '#ffd23a'})
c.outline('#121214')
icons['camera'] = c

c = C()
c.disc(8, 8.5, 6.2, '#c8955a')
c.disc(10.5, 11, 1.6, (0, 0, 0, 0))
c.disc(5, 6, 1.2, '#e83a3a')
c.disc(8, 4.8, 1.2, '#3a8ae8')
c.disc(11.2, 6.2, 1.2, '#3ac85a')
c.disc(4.8, 9.8, 1.2, '#f0d040')
c.outline('#3a2410')
icons['palette'] = c

c = C()
c.rows(1, 2, [
    "...cccccccc...",
    "..cLLCCCCCCc..",
    ".cLLCCCCCCCCc.",
    "cLCCCCCCCCCCdc",
    ".cCCCCCCCCCdc.",
    "..cCCCCCCCdc..",
    "...cCCCCCdc...",
    "....cCCCdc....",
    ".....cCdc.....",
    "......cc......",
], {'c': '#0f6e6e', 'C': '#4fe8e8', 'L': '#d6ffff', 'd': '#26a8a8'})
c.outline('#05302f')
icons['diamond'] = c

c = C()
c.rows(1, 1, [
    "....cccccc....",
    "..ccCCCCCCcc..",
    ".cCC......CCc.",
    "cC....ws....Cc",
    "c.....ws.....c",
    "......ws......",
    "......ws......",
    "......ws......",
    "......ws......",
    "......ws......",
    "......ws......",
    "......ws......",
    "......SS......",
], {'c': '#127070', 'C': '#4ae0e0', 'w': '#a0703a', 's': '#6a4420', 'S': '#4a2e14'})
c.outline('#0a1e1e')
icons['pickaxe'] = c

c = C()
c.rows(1, 1, [
    "YYYYYYYYYYYYYY",
    "YyyyyyyyyyyyyY",
    "YyyyWWWWWWyyyY",
    "YyyWWyyyyWWyyY",
    "YyyyyyyyyWWyyY",
    "YyyyyyyWWWyyyY",
    "YyyyyyWWyyyyyY",
    "YyyyyyWWyyyyyY",
    "YyyyyyyyyyyyyY",
    "YyyyyyWWyyyyyY",
    "YyyyyyWWyyyyyY",
    "YyyyyyyyyyyyyY",
    "YYYYYYYYYYYYYY",
], {'Y': '#b07a10', 'y': '#f0c030', 'W': '#ffffff'})
c.outline('#3a2604')
icons['lucky'] = c

c = C()
c.rows(4, 1, [
    ".....YY.",
    "....YY..",
    "...YY...",
    "..YYY...",
    ".YYYYYY.",
    "....YY..",
    "...YY...",
    "..YY....",
    ".YY.....",
    "YY......",
], {'Y': '#ffe14a'})
c.rows(5, 4, ["W"], {'W': '#ffffff'})
c.outline('#5a4204')
icons['bolt'] = c

c = C()
c.rows(1, 2, [
    "kkkkkkkkkkkkkk",
    "kddddddddddddk",
    "kddddddddGdddk",
    "kddGddddGddddk",
    "kdGddddGdddGdk",
    "kGddddGdddddGk",
    "kdGdddGddddGdk",
    "kddGdGddddGddk",
    "kdddGddddddddk",
    "kddddddddddddk",
    "kkkkkkkkkkkkkk",
], {'k': '#3a3f4a', 'd': '#1b1f27', 'G': '#5af07a'})
c.outline('#0a0c10')
icons['github'] = c

# --- hud ---------------------------------------------------------------------
c = C(9)
c.rows(0, 0, [
    ".kk...kk.",
    "kRRk.kRRk",
    "kRWRkRRRk",
    "kRRRRRRRk",
    ".kRRRRRk.",
    "..kRRRk..",
    "...kRk...",
    "....k....",
], {'k': '#2a0000', 'R': '#e8202a', 'W': '#ffb8b8'})
icons['heart'] = c

c = C(9)
c.rows(0, 0, [
    "....kkk..",
    "...kBBBk.",
    "..kBbBBBk",
    "..kBBBBBk",
    "..kBBBBk.",
    ".kwkkkk..",
    "kwwk.....",
    "kwk......",
    ".k.......",
], {'k': '#2a1404', 'B': '#c87a30', 'b': '#f0b070', 'w': '#ece4d0'})
icons['food'] = c


def player_head():
    """8x8 face sampled from the player's own render."""
    src = Image.open(ROOT / 'public/img/player-front.png').convert('RGBA')
    w = src.width
    box = (int(w * .16), int(w * .02), int(w * .84), int(w * .70))
    face = src.crop(box).resize((10, 10), Image.NEAREST)
    cv = C(10)
    cv.im = face
    return cv


icons['head'] = player_head()


def encode(cv):
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@$%^&*()-_=+[]{};:,<>?/~'
    pal, rows = {}, []
    for y in range(cv.n):
        row = ''
        for x in range(cv.n):
            p = cv.get(x, y)
            if p[3] < 128:
                row += '.'
                continue
            h = '#%02x%02x%02x' % p[:3]
            if h not in pal:
                pal[h] = chars[len(pal)]
            row += pal[h]
        rows.append(row)
    return {'pal': {v: k for k, v in pal.items()}, 'map': rows}


out = ['// GENERATED by scripts/icons.py — edit there, then run `python scripts/icons.py`.']
for k, cv in icons.items():
    out.append(f'export const {k} = {json.dumps(encode(cv), separators=(",", ":"))}')
(ROOT / 'src/icons.js').write_text('\n'.join(out) + '\n', encoding='utf-8')

if len(sys.argv) > 1:  # preview sheet
    cols = 8
    sheet = Image.new('RGBA', (cols * 80, ((len(icons) + cols - 1) // cols) * 80), (60, 60, 60, 255))
    for i, (k, cv) in enumerate(icons.items()):
        big = cv.im.resize((64, 64), Image.NEAREST)
        sheet.paste(big, ((i % cols) * 80 + 8, (i // cols) * 80 + 8), big)
    sheet.save(sys.argv[1])
print(len(icons), 'icons')
