#!/usr/bin/env python3
import json
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw


CANVAS = 16
SCALE = 8
FINAL_SIZE = CANVAS * SCALE
COUNT = 100


PALETTES = [
    ["#0F172A", "#38BDF8", "#E2E8F0", "#F43F5E"],
    ["#111827", "#22C55E", "#DCFCE7", "#84CC16"],
    ["#1F2937", "#F59E0B", "#FEF3C7", "#EF4444"],
    ["#0B1020", "#06B6D4", "#A5F3FC", "#14B8A6"],
    ["#161616", "#FB7185", "#FFE4E6", "#A78BFA"],
    ["#111111", "#60A5FA", "#DBEAFE", "#34D399"],
    ["#0A0A0A", "#F97316", "#FFEDD5", "#EAB308"],
    ["#0C1220", "#818CF8", "#E0E7FF", "#EC4899"],
]


PIXEL_FONT = {
    "A": ["010", "101", "111", "101", "101"],
    "B": ["110", "101", "110", "101", "110"],
    "C": ["011", "100", "100", "100", "011"],
    "D": ["110", "101", "101", "101", "110"],
    "E": ["111", "100", "110", "100", "111"],
    "F": ["111", "100", "110", "100", "100"],
    "G": ["011", "100", "101", "101", "011"],
    "H": ["101", "101", "111", "101", "101"],
    "I": ["111", "010", "010", "010", "111"],
    "J": ["001", "001", "001", "101", "010"],
    "K": ["101", "101", "110", "101", "101"],
    "L": ["100", "100", "100", "100", "111"],
    "M": ["101", "111", "111", "101", "101"],
    "N": ["101", "111", "111", "111", "101"],
    "O": ["111", "101", "101", "101", "111"],
    "P": ["110", "101", "110", "100", "100"],
    "Q": ["111", "101", "101", "111", "001"],
    "R": ["110", "101", "110", "101", "101"],
    "S": ["011", "100", "010", "001", "110"],
    "T": ["111", "010", "010", "010", "010"],
    "U": ["101", "101", "101", "101", "111"],
    "V": ["101", "101", "101", "101", "010"],
    "W": ["101", "101", "111", "111", "101"],
    "X": ["101", "101", "010", "101", "101"],
    "Y": ["101", "101", "010", "010", "010"],
    "Z": ["111", "001", "010", "100", "111"],
}


def new_grid():
    return [[None for _ in range(CANVAS)] for _ in range(CANVAS)]


def put(grid, x, y, color):
    if 0 <= x < CANVAS and 0 <= y < CANVAS:
        grid[y][x] = color


def mirror_x(grid):
    for y in range(CANVAS):
        for x in range(CANVAS // 2):
            src = grid[y][x]
            dst_x = CANVAS - 1 - x
            if src is not None:
                grid[y][dst_x] = src


def add_background(grid, rng, palette):
    bg, c1, c2, c3 = palette
    mode = rng.choice(["solid", "checker", "bars_h", "bars_v", "corners"])
    for y in range(CANVAS):
        for x in range(CANVAS):
            if mode == "solid":
                grid[y][x] = bg
            elif mode == "checker":
                grid[y][x] = bg if (x + y) % 2 == 0 else c1
            elif mode == "bars_h":
                grid[y][x] = bg if y % 3 else c2
            elif mode == "bars_v":
                grid[y][x] = bg if x % 3 else c2
            else:
                dist = min(x, y, CANVAS - 1 - x, CANVAS - 1 - y)
                grid[y][x] = c3 if dist < 2 else bg


def draw_diamond(grid, color, fill):
    cx, cy = CANVAS // 2, CANVAS // 2
    radius = 5
    for y in range(CANVAS):
        for x in range(CANVAS):
            d = abs(x - cx) + abs(y - cy)
            if d == radius:
                put(grid, x, y, color)
            if fill and d < radius:
                put(grid, x, y, fill)


def draw_ring(grid, color, inner):
    cx, cy = CANVAS // 2, CANVAS // 2
    for y in range(CANVAS):
        for x in range(CANVAS):
            d2 = (x - cx) ** 2 + (y - cy) ** 2
            if 20 <= d2 <= 34:
                put(grid, x, y, color)
            if 8 <= d2 <= 15:
                put(grid, x, y, inner)


def draw_shield(grid, outline, fill):
    top = 3
    left = 4
    width = 8
    for y in range(top, 11):
        for x in range(left, left + width):
            put(grid, x, y, fill)
    for i in range(4):
        for x in range(left + i, left + width - i):
            put(grid, x, 11 + i, fill)
    for x in range(left, left + width):
        put(grid, x, top, outline)
        put(grid, x, 10, outline)
    for y in range(top, 11):
        put(grid, left, y, outline)
        put(grid, left + width - 1, y, outline)
    for i in range(4):
        put(grid, left + i, 11 + i, outline)
        put(grid, left + width - 1 - i, 11 + i, outline)


def draw_bolt(grid, color):
    pts = [(8, 2), (5, 8), (8, 8), (6, 13), (11, 7), (8, 7)]
    for i in range(len(pts) - 1):
        line(grid, pts[i], pts[i + 1], color)
    flood_fill_polygon(grid, pts, color)


def draw_star(grid, color):
    pts = [(8, 2), (9, 6), (13, 6), (10, 8), (11, 12), (8, 9), (5, 12), (6, 8), (3, 6), (7, 6)]
    for i in range(len(pts)):
        line(grid, pts[i], pts[(i + 1) % len(pts)], color)
    flood_fill_polygon(grid, pts, color)


def draw_orbit(grid, color, accent):
    cx, cy = CANVAS // 2, CANVAS // 2
    for a in range(0, 360, 5):
        rad = math.radians(a)
        x = int(round(cx + 5 * math.cos(rad)))
        y = int(round(cy + 3 * math.sin(rad)))
        put(grid, x, y, color)
    put(grid, cx, cy, accent)
    put(grid, cx + 5, cy, accent)
    put(grid, cx - 5, cy, accent)


def draw_letter(grid, letter, color):
    glyph = PIXEL_FONT.get(letter)
    if not glyph:
        return
    x0 = 6
    y0 = 5
    for gy, row in enumerate(glyph):
        for gx, cell in enumerate(row):
            if cell == "1":
                put(grid, x0 + gx, y0 + gy, color)


def line(grid, p1, p2, color):
    x1, y1 = p1
    x2, y2 = p2
    dx = abs(x2 - x1)
    dy = -abs(y2 - y1)
    sx = 1 if x1 < x2 else -1
    sy = 1 if y1 < y2 else -1
    err = dx + dy
    x, y = x1, y1
    while True:
        put(grid, x, y, color)
        if x == x2 and y == y2:
            break
        e2 = 2 * err
        if e2 >= dy:
            err += dy
            x += sx
        if e2 <= dx:
            err += dx
            y += sy


def flood_fill_polygon(grid, pts, color):
    min_y = max(0, min(y for _, y in pts))
    max_y = min(CANVAS - 1, max(y for _, y in pts))
    for y in range(min_y, max_y + 1):
        intersections = []
        for i in range(len(pts)):
            x1, y1 = pts[i]
            x2, y2 = pts[(i + 1) % len(pts)]
            if y1 == y2:
                continue
            if (y >= min(y1, y2)) and (y < max(y1, y2)):
                x = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
                intersections.append(x)
        intersections.sort()
        for i in range(0, len(intersections), 2):
            if i + 1 >= len(intersections):
                break
            x_start = math.ceil(intersections[i])
            x_end = math.floor(intersections[i + 1])
            for x in range(x_start, x_end + 1):
                put(grid, x, y, color)


def grid_to_image(grid):
    img = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    px = img.load()
    for y in range(CANVAS):
        for x in range(CANVAS):
            c = grid[y][x]
            if c:
                c = c.lstrip("#")
                px[x, y] = tuple(int(c[i : i + 2], 16) for i in (0, 2, 4)) + (255,)
    return img.resize((FINAL_SIZE, FINAL_SIZE), Image.Resampling.NEAREST)


def make_logo(index, out_dir):
    rng = random.Random(index * 8821 + 97)
    palette = rng.choice(PALETTES)
    grid = new_grid()
    add_background(grid, rng, palette)

    primary = palette[1]
    secondary = palette[2]
    accent = palette[3]
    motif = rng.choice(["diamond", "ring", "shield", "bolt", "star", "orbit"])

    if motif == "diamond":
        draw_diamond(grid, primary, secondary)
    elif motif == "ring":
        draw_ring(grid, primary, secondary)
    elif motif == "shield":
        draw_shield(grid, primary, secondary)
    elif motif == "bolt":
        draw_bolt(grid, primary)
    elif motif == "star":
        draw_star(grid, primary)
    elif motif == "orbit":
        draw_orbit(grid, primary, secondary)

    if rng.random() < 0.35:
        draw_letter(grid, chr(ord("A") + (index % 26)), accent)

    if rng.random() < 0.5:
        mirror_x(grid)

    image = grid_to_image(grid)
    filename = f"logo_{index:03d}.png"
    image.save(out_dir / filename)

    return {
        "id": index,
        "file": filename,
        "motif": motif,
        "palette": palette,
    }


def make_contact_sheet(out_dir, logo_count):
    cols = 10
    rows = (logo_count + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * FINAL_SIZE, rows * FINAL_SIZE), (18, 18, 24, 255))
    draw = ImageDraw.Draw(sheet)
    for i in range(logo_count):
        fn = out_dir / f"logo_{i + 1:03d}.png"
        img = Image.open(fn)
        x = (i % cols) * FINAL_SIZE
        y = (i // cols) * FINAL_SIZE
        sheet.paste(img, (x, y))
        draw.rectangle((x, y, x + FINAL_SIZE - 1, y + FINAL_SIZE - 1), outline=(40, 40, 52, 255), width=1)
    sheet.save(out_dir / "logos_contact_sheet.png")


def main():
    root = Path(__file__).resolve().parents[1]
    out_dir = root / "output" / "pixel-logos"
    out_dir.mkdir(parents=True, exist_ok=True)

    metadata = []
    for i in range(1, COUNT + 1):
        metadata.append(make_logo(i, out_dir))

    make_contact_sheet(out_dir, COUNT)
    (out_dir / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(f"Generated {COUNT} logos in {out_dir}")


if __name__ == "__main__":
    main()
