#!/usr/bin/env python3
import argparse
import json
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw


CANVAS = 16
SCALE = 8
ICON_SIZE = CANVAS * SCALE
TARGET_COUNT = 360


PALETTES = [
    ["#0D1117", "#58A6FF", "#E6EDF3", "#F778BA", "#3FB950"],
    ["#10141F", "#00D1FF", "#F2F7FF", "#FF5D73", "#7DFF7A"],
    ["#131313", "#FF9E3D", "#FFF4E3", "#FF4D6D", "#FFE66D"],
    ["#0F172A", "#22D3EE", "#ECFEFF", "#FB7185", "#A3E635"],
    ["#18181B", "#C084FC", "#F5F3FF", "#F43F5E", "#2DD4BF"],
    ["#1B1B1B", "#60A5FA", "#DBEAFE", "#F59E0B", "#34D399"],
    ["#1A1024", "#A78BFA", "#F3E8FF", "#F472B6", "#67E8F9"],
    ["#0A0A0A", "#F97316", "#FFEDD5", "#EAB308", "#4ADE80"],
    ["#0B132B", "#5BC0BE", "#E0FBFC", "#F25F5C", "#FFE066"],
    ["#111827", "#10B981", "#D1FAE5", "#F43F5E", "#60A5FA"],
]


def new_grid():
    return [[None for _ in range(CANVAS)] for _ in range(CANVAS)]


def put(g, x, y, c):
    if 0 <= x < CANVAS and 0 <= y < CANVAS:
        g[y][x] = c


def hline(g, x1, x2, y, c):
    for x in range(min(x1, x2), max(x1, x2) + 1):
        put(g, x, y, c)


def vline(g, x, y1, y2, c):
    for y in range(min(y1, y2), max(y1, y2) + 1):
        put(g, x, y, c)


def rect(g, x, y, w, h, c, fill=False):
    if fill:
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                put(g, xx, yy, c)
        return
    hline(g, x, x + w - 1, y, c)
    hline(g, x, x + w - 1, y + h - 1, c)
    vline(g, x, y, y + h - 1, c)
    vline(g, x + w - 1, y, y + h - 1, c)


def circle(g, cx, cy, r, c, fill=False):
    rr = r * r
    for y in range(CANVAS):
        for x in range(CANVAS):
            d = (x - cx) * (x - cx) + (y - cy) * (y - cy)
            if fill and d <= rr:
                put(g, x, y, c)
            elif (not fill) and abs(d - rr) <= r:
                put(g, x, y, c)


def line(g, p1, p2, c):
    x1, y1 = p1
    x2, y2 = p2
    dx = abs(x2 - x1)
    dy = -abs(y2 - y1)
    sx = 1 if x1 < x2 else -1
    sy = 1 if y1 < y2 else -1
    err = dx + dy
    while True:
        put(g, x1, y1, c)
        if x1 == x2 and y1 == y2:
            break
        e2 = 2 * err
        if e2 >= dy:
            err += dy
            x1 += sx
        if e2 <= dx:
            err += dx
            y1 += sy


def poly_fill(g, points, c):
    min_y = max(0, min(y for _, y in points))
    max_y = min(CANVAS - 1, max(y for _, y in points))
    for y in range(min_y, max_y + 1):
        xs = []
        for i in range(len(points)):
            x1, y1 = points[i]
            x2, y2 = points[(i + 1) % len(points)]
            if y1 == y2:
                continue
            if min(y1, y2) <= y < max(y1, y2):
                x = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
                xs.append(x)
        xs.sort()
        for i in range(0, len(xs), 2):
            if i + 1 >= len(xs):
                break
            for x in range(math.ceil(xs[i]), math.floor(xs[i + 1]) + 1):
                put(g, x, y, c)


def mirror_x(g):
    for y in range(CANVAS):
        for x in range(CANVAS // 2):
            c = g[y][x]
            if c is not None:
                g[y][CANVAS - 1 - x] = c


def add_background(g, rng, p):
    bg, c1, c2, c3, c4 = p
    mode = rng.choice(["solid", "dots", "grid", "diag", "frame"])
    for y in range(CANVAS):
        for x in range(CANVAS):
            if mode == "solid":
                g[y][x] = bg
            elif mode == "dots":
                g[y][x] = c1 if (x % 4 == 0 and y % 4 == 0) else bg
            elif mode == "grid":
                g[y][x] = c2 if (x % 4 == 0 or y % 4 == 0) else bg
            elif mode == "diag":
                g[y][x] = c3 if (x + y) % 6 == 0 else bg
            else:
                d = min(x, y, CANVAS - 1 - x, CANVAS - 1 - y)
                g[y][x] = c4 if d < 1 else bg


def motif_arcade_ghost(g, c1, c2, c3):
    rect(g, 4, 4, 8, 8, c1, fill=True)
    circle(g, 8, 5, 4, c1, fill=True)
    for x in [4, 6, 8, 10]:
        put(g, x, 12, c1)
        put(g, x + 1, 11, c1)
    rect(g, 6, 7, 2, 2, c2, fill=True)
    rect(g, 9, 7, 2, 2, c2, fill=True)
    put(g, 7, 8, c3)
    put(g, 9, 8, c3)


def motif_space_invader(g, c1, c2, c3):
    pts = [(7, 3), (8, 3), (6, 4), (9, 4), (5, 5), (10, 5), (4, 6), (11, 6), (4, 7), (11, 7), (5, 8), (10, 8), (6, 9), (9, 9), (6, 10), (9, 10), (4, 11), (5, 11), (10, 11), (11, 11)]
    for x, y in pts:
        put(g, x, y, c1)
    put(g, 6, 7, c2)
    put(g, 9, 7, c2)
    put(g, 6, 8, c3)
    put(g, 9, 8, c3)


def motif_robot_head(g, c1, c2, c3):
    rect(g, 3, 4, 10, 8, c1, fill=True)
    rect(g, 4, 5, 8, 6, c2, fill=True)
    rect(g, 5, 6, 2, 2, c3, fill=True)
    rect(g, 9, 6, 2, 2, c3, fill=True)
    hline(g, 5, 10, 9, c1)
    vline(g, 8, 2, 3, c1)
    put(g, 8, 1, c3)


def motif_skull(g, c1, c2, c3):
    circle(g, 8, 7, 5, c1, fill=True)
    rect(g, 5, 10, 6, 4, c1, fill=True)
    rect(g, 6, 7, 2, 2, c2, fill=True)
    rect(g, 9, 7, 2, 2, c2, fill=True)
    hline(g, 7, 9, 10, c3)
    vline(g, 7, 11, 12, c3)
    vline(g, 9, 11, 12, c3)


def motif_alien(g, c1, c2, c3):
    poly_fill(g, [(8, 2), (4, 5), (3, 9), (8, 13), (13, 9), (12, 5)], c1)
    rect(g, 5, 7, 3, 2, c2, fill=True)
    rect(g, 8, 7, 3, 2, c2, fill=True)
    put(g, 6, 8, c3)
    put(g, 9, 8, c3)


def motif_cat_face(g, c1, c2, c3):
    poly_fill(g, [(4, 7), (8, 3), (12, 7), (12, 12), (4, 12)], c1)
    poly_fill(g, [(4, 7), (3, 4), (6, 5)], c1)
    poly_fill(g, [(12, 7), (13, 4), (10, 5)], c1)
    rect(g, 6, 8, 2, 2, c2, fill=True)
    rect(g, 9, 8, 2, 2, c2, fill=True)
    put(g, 7, 9, c3)
    put(g, 10, 9, c3)
    put(g, 8, 10, c3)


def motif_fox_head(g, c1, c2, c3):
    poly_fill(g, [(8, 2), (3, 6), (5, 12), (11, 12), (13, 6)], c1)
    poly_fill(g, [(8, 6), (5, 10), (11, 10)], c2)
    rect(g, 6, 7, 2, 2, c3, fill=True)
    rect(g, 9, 7, 2, 2, c3, fill=True)


def motif_panda(g, c1, c2, c3):
    circle(g, 8, 8, 5, c1, fill=True)
    circle(g, 5, 4, 2, c2, fill=True)
    circle(g, 11, 4, 2, c2, fill=True)
    rect(g, 6, 7, 2, 3, c2, fill=True)
    rect(g, 9, 7, 2, 3, c2, fill=True)
    put(g, 7, 8, c3)
    put(g, 10, 8, c3)


def motif_wizard_hat(g, c1, c2, c3):
    poly_fill(g, [(8, 2), (4, 10), (12, 10)], c1)
    rect(g, 3, 10, 10, 3, c2, fill=True)
    put(g, 8, 5, c3)
    put(g, 6, 8, c3)
    put(g, 10, 7, c3)


def motif_ninja_mask(g, c1, c2, c3):
    rect(g, 3, 5, 10, 7, c1, fill=True)
    rect(g, 4, 7, 8, 2, c2, fill=True)
    put(g, 6, 8, c3)
    put(g, 9, 8, c3)
    line(g, (3, 6), (1, 4), c1)
    line(g, (12, 6), (14, 4), c1)


def motif_knight_helm(g, c1, c2, c3):
    poly_fill(g, [(8, 2), (4, 5), (4, 12), (12, 12), (12, 5)], c1)
    rect(g, 6, 6, 4, 2, c2, fill=True)
    vline(g, 8, 8, 11, c3)
    hline(g, 6, 10, 10, c3)


def motif_dragon(g, c1, c2, c3):
    poly_fill(g, [(3, 9), (6, 4), (11, 3), (13, 6), (10, 10), (6, 11)], c1)
    poly_fill(g, [(11, 3), (13, 2), (12, 5)], c1)
    put(g, 9, 6, c2)
    put(g, 10, 6, c3)
    line(g, (5, 10), (3, 13), c1)


def motif_bat_symbol(g, c1, c2, c3):
    circle(g, 8, 8, 6, c1, fill=True)
    poly_fill(g, [(2, 8), (5, 6), (8, 8), (11, 6), (14, 8), (11, 10), (8, 9), (5, 10)], c2)
    put(g, 8, 8, c3)


def motif_super_mushroom(g, c1, c2, c3):
    circle(g, 8, 6, 5, c1, fill=True)
    rect(g, 5, 9, 6, 4, c2, fill=True)
    rect(g, 6, 5, 2, 2, c3, fill=True)
    rect(g, 9, 5, 2, 2, c3, fill=True)
    rect(g, 7, 10, 2, 2, c3, fill=True)


def motif_monster_ball(g, c1, c2, c3):
    circle(g, 8, 8, 6, c1, fill=True)
    for y in range(9, CANVAS):
        for x in range(CANVAS):
            if g[y][x] == c1:
                g[y][x] = c2
    hline(g, 2, 13, 8, c3)
    circle(g, 8, 8, 2, c3, fill=True)
    circle(g, 8, 8, 1, c2, fill=True)


def motif_web_mask(g, c1, c2, c3):
    poly_fill(g, [(8, 2), (4, 5), (3, 9), (8, 13), (13, 9), (12, 5)], c1)
    poly_fill(g, [(5, 6), (7, 7), (6, 9), (4, 8)], c2)
    poly_fill(g, [(11, 6), (9, 7), (10, 9), (12, 8)], c2)
    for i in range(3):
        line(g, (8, 4 + i * 2), (4 + i, 10), c3)
        line(g, (8, 4 + i * 2), (12 - i, 10), c3)


def motif_lightning(g, c1, c2, c3):
    pts = [(8, 2), (5, 8), (8, 8), (6, 13), (11, 7), (8, 7)]
    poly_fill(g, pts, c1)
    line(g, (8, 2), (6, 13), c2)
    put(g, 8, 7, c3)


def motif_flame(g, c1, c2, c3):
    poly_fill(g, [(8, 2), (5, 6), (4, 10), (8, 13), (12, 10), (11, 6)], c1)
    poly_fill(g, [(8, 5), (6, 8), (8, 11), (10, 8)], c2)
    put(g, 8, 8, c3)


def motif_shield(g, c1, c2, c3):
    poly_fill(g, [(4, 3), (12, 3), (12, 10), (8, 14), (4, 10)], c1)
    poly_fill(g, [(6, 5), (10, 5), (10, 9), (8, 11), (6, 9)], c2)
    vline(g, 8, 5, 11, c3)


def motif_crown(g, c1, c2, c3):
    poly_fill(g, [(2, 11), (4, 5), (7, 9), (8, 4), (9, 9), (12, 5), (14, 11)], c1)
    rect(g, 2, 11, 13, 2, c2, fill=True)
    put(g, 4, 6, c3)
    put(g, 8, 5, c3)
    put(g, 12, 6, c3)


def motif_diamond(g, c1, c2, c3):
    poly_fill(g, [(8, 2), (13, 8), (8, 14), (3, 8)], c1)
    poly_fill(g, [(8, 4), (11, 8), (8, 12), (5, 8)], c2)
    line(g, (8, 2), (8, 14), c3)


def motif_star(g, c1, c2, c3):
    points = [(8, 2), (10, 6), (14, 6), (11, 9), (12, 13), (8, 10), (4, 13), (5, 9), (2, 6), (6, 6)]
    poly_fill(g, points, c1)
    put(g, 8, 7, c2)
    put(g, 7, 8, c3)
    put(g, 9, 8, c3)


def motif_heart(g, c1, c2, c3):
    circle(g, 6, 5, 3, c1, fill=True)
    circle(g, 10, 5, 3, c1, fill=True)
    poly_fill(g, [(3, 6), (13, 6), (8, 13)], c1)
    put(g, 8, 8, c2)
    put(g, 8, 10, c3)


def motif_chat(g, c1, c2, c3):
    rect(g, 2, 3, 12, 8, c1, fill=True)
    poly_fill(g, [(6, 10), (9, 10), (7, 13)], c1)
    rect(g, 4, 5, 8, 4, c2, fill=True)
    put(g, 5, 6, c3)
    put(g, 8, 6, c3)
    put(g, 11, 6, c3)


def motif_camera(g, c1, c2, c3):
    rect(g, 2, 5, 12, 8, c1, fill=True)
    rect(g, 4, 4, 4, 2, c1, fill=True)
    circle(g, 8, 9, 3, c2, fill=True)
    circle(g, 8, 9, 1, c3, fill=True)
    rect(g, 11, 6, 2, 1, c3, fill=True)


def motif_gamepad(g, c1, c2, c3):
    poly_fill(g, [(3, 7), (5, 5), (11, 5), (13, 7), (12, 11), (4, 11)], c1)
    vline(g, 6, 7, 9, c2)
    hline(g, 5, 7, 8, c2)
    put(g, 10, 8, c3)
    put(g, 11, 9, c3)


def motif_sword(g, c1, c2, c3):
    line(g, (8, 2), (8, 11), c1)
    line(g, (7, 3), (7, 10), c1)
    line(g, (9, 3), (9, 10), c1)
    hline(g, 5, 11, 11, c2)
    rect(g, 7, 12, 3, 2, c3, fill=True)


def motif_potion(g, c1, c2, c3):
    rect(g, 6, 2, 4, 2, c1, fill=True)
    poly_fill(g, [(5, 4), (11, 4), (12, 11), (8, 13), (4, 11)], c1)
    rect(g, 6, 7, 4, 3, c2, fill=True)
    put(g, 7, 8, c3)
    put(g, 9, 8, c3)


def motif_planet(g, c1, c2, c3):
    circle(g, 8, 8, 4, c1, fill=True)
    line(g, (2, 8), (14, 6), c2)
    line(g, (2, 9), (14, 7), c2)
    put(g, 6, 7, c3)
    put(g, 9, 9, c3)


def motif_rocket(g, c1, c2, c3):
    poly_fill(g, [(8, 2), (11, 6), (10, 12), (6, 12), (5, 6)], c1)
    circle(g, 8, 7, 1, c2, fill=True)
    poly_fill(g, [(6, 12), (5, 14), (7, 12)], c3)
    poly_fill(g, [(10, 12), (11, 14), (9, 12)], c3)


def motif_eye(g, c1, c2, c3):
    poly_fill(g, [(2, 8), (8, 4), (14, 8), (8, 12)], c1)
    circle(g, 8, 8, 3, c2, fill=True)
    circle(g, 8, 8, 1, c3, fill=True)


def motif_wifi(g, c1, c2, c3):
    for r in [6, 4, 2]:
        for a in range(210, 331, 10):
            x = int(round(8 + r * math.cos(math.radians(a))))
            y = int(round(12 + r * math.sin(math.radians(a))))
            put(g, x, y, c1 if r > 2 else c2)
    rect(g, 7, 12, 2, 2, c3, fill=True)


def motif_music(g, c1, c2, c3):
    vline(g, 6, 4, 10, c1)
    vline(g, 10, 3, 9, c1)
    hline(g, 6, 10, 3, c1)
    circle(g, 5, 11, 2, c2, fill=True)
    circle(g, 9, 10, 2, c3, fill=True)


def motif_headphones(g, c1, c2, c3):
    for a in range(180, 361, 10):
        x = int(round(8 + 5 * math.cos(math.radians(a))))
        y = int(round(9 + 5 * math.sin(math.radians(a))))
        put(g, x, y, c1)
    rect(g, 3, 8, 2, 4, c2, fill=True)
    rect(g, 11, 8, 2, 4, c2, fill=True)
    hline(g, 6, 10, 11, c3)


def motif_lock(g, c1, c2, c3):
    rect(g, 4, 7, 8, 7, c1, fill=True)
    circle(g, 8, 6, 3, c2, fill=False)
    rect(g, 7, 10, 2, 2, c3, fill=True)


def motif_key(g, c1, c2, c3):
    circle(g, 4, 8, 3, c1, fill=True)
    circle(g, 4, 8, 1, c2, fill=True)
    hline(g, 6, 13, 8, c1)
    rect(g, 10, 8, 1, 2, c3, fill=True)
    rect(g, 12, 8, 1, 2, c3, fill=True)


def motif_target(g, c1, c2, c3):
    circle(g, 8, 8, 6, c1, fill=False)
    circle(g, 8, 8, 4, c2, fill=False)
    circle(g, 8, 8, 2, c3, fill=True)
    vline(g, 8, 2, 14, c1)
    hline(g, 2, 14, 8, c1)


def motif_power(g, c1, c2, c3):
    circle(g, 8, 8, 5, c1, fill=False)
    vline(g, 8, 2, 8, c2)
    rect(g, 7, 2, 2, 2, c3, fill=True)


def motif_check(g, c1, c2, c3):
    line(g, (3, 9), (7, 13), c1)
    line(g, (7, 13), (13, 4), c1)
    line(g, (4, 9), (7, 12), c2)
    put(g, 10, 8, c3)


def motif_infinity(g, c1, c2, c3):
    circle(g, 5, 8, 3, c1, fill=False)
    circle(g, 11, 8, 3, c1, fill=False)
    line(g, (7, 6), (9, 10), c2)
    line(g, (7, 10), (9, 6), c2)
    put(g, 8, 8, c3)


def motif_leaf(g, c1, c2, c3):
    poly_fill(g, [(3, 9), (8, 3), (13, 9), (8, 13)], c1)
    line(g, (8, 3), (8, 13), c2)
    line(g, (8, 8), (5, 10), c3)
    line(g, (8, 8), (11, 10), c3)


def motif_wave(g, c1, c2, c3):
    for x in range(2, 14):
        y = 8 + int(round(2 * math.sin((x - 2) / 2)))
        put(g, x, y, c1)
        put(g, x, y + 1, c2)
    rect(g, 2, 11, 12, 2, c3, fill=True)


def motif_mountain(g, c1, c2, c3):
    poly_fill(g, [(2, 13), (6, 5), (10, 13)], c1)
    poly_fill(g, [(7, 13), (11, 4), (14, 13)], c2)
    poly_fill(g, [(10, 6), (11, 4), (12, 6)], c3)


def motif_sun(g, c1, c2, c3):
    circle(g, 8, 8, 3, c1, fill=True)
    for p1, p2 in [((8, 1), (8, 3)), ((8, 13), (8, 15)), ((1, 8), (3, 8)), ((13, 8), (15, 8)), ((3, 3), (4, 4)), ((12, 12), (13, 13)), ((12, 4), (13, 3)), ((3, 13), (4, 12))]:
        line(g, p1, p2, c2)
    put(g, 8, 8, c3)


def motif_moon(g, c1, c2, c3):
    circle(g, 8, 8, 5, c1, fill=True)
    circle(g, 10, 7, 4, c2, fill=True)
    put(g, 5, 5, c3)
    put(g, 4, 8, c3)


def motif_snowflake(g, c1, c2, c3):
    vline(g, 8, 2, 13, c1)
    hline(g, 2, 13, 8, c1)
    line(g, (3, 3), (12, 12), c2)
    line(g, (12, 3), (3, 12), c2)
    put(g, 8, 8, c3)


MOTIFS = [
    ("arcade_ghost", motif_arcade_ghost),
    ("space_invader", motif_space_invader),
    ("robot_head", motif_robot_head),
    ("skull", motif_skull),
    ("alien_face", motif_alien),
    ("cat_face", motif_cat_face),
    ("fox_head", motif_fox_head),
    ("panda_face", motif_panda),
    ("wizard_hat", motif_wizard_hat),
    ("ninja_mask", motif_ninja_mask),
    ("knight_helm", motif_knight_helm),
    ("dragon_head", motif_dragon),
    ("bat_symbol", motif_bat_symbol),
    ("super_mushroom", motif_super_mushroom),
    ("monster_ball", motif_monster_ball),
    ("web_mask", motif_web_mask),
    ("lightning_logo", motif_lightning),
    ("flame_logo", motif_flame),
    ("shield_badge", motif_shield),
    ("crown_badge", motif_crown),
    ("diamond_logo", motif_diamond),
    ("star_logo", motif_star),
    ("heart_logo", motif_heart),
    ("chat_bubble", motif_chat),
    ("camera_icon", motif_camera),
    ("gamepad_icon", motif_gamepad),
    ("sword_icon", motif_sword),
    ("potion_icon", motif_potion),
    ("planet_icon", motif_planet),
    ("rocket_icon", motif_rocket),
    ("eye_icon", motif_eye),
    ("wifi_icon", motif_wifi),
    ("music_note", motif_music),
    ("headphones", motif_headphones),
    ("lock_icon", motif_lock),
    ("key_icon", motif_key),
    ("target_icon", motif_target),
    ("power_logo", motif_power),
    ("check_logo", motif_check),
    ("infinity_logo", motif_infinity),
    ("leaf_logo", motif_leaf),
    ("wave_logo", motif_wave),
    ("mountain_logo", motif_mountain),
    ("sun_icon", motif_sun),
    ("moon_icon", motif_moon),
    ("snowflake_icon", motif_snowflake),
]


def sprinkle_fx(g, rng, c1, c2):
    if rng.random() < 0.45:
        for _ in range(rng.randint(4, 14)):
            put(g, rng.randint(1, 14), rng.randint(1, 14), c1 if rng.random() < 0.7 else c2)
    if rng.random() < 0.35:
        y = rng.randint(2, 13)
        hline(g, 2, 13, y, c1)


def grid_to_image(g):
    img = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    px = img.load()
    for y in range(CANVAS):
        for x in range(CANVAS):
            c = g[y][x]
            if c:
                c = c.lstrip("#")
                px[x, y] = tuple(int(c[i : i + 2], 16) for i in (0, 2, 4)) + (255,)
    return img.resize((ICON_SIZE, ICON_SIZE), Image.Resampling.NEAREST)


def make_icon(icon_id, out_dir, seed_offset=0):
    rng = random.Random((icon_id + seed_offset) * 1299827 + 33)
    palette = rng.choice(PALETTES)
    bg, c1, c2, c3, c4 = palette
    name, drawer = MOTIFS[icon_id % len(MOTIFS)]

    g = new_grid()
    add_background(g, rng, palette)

    color_sets = [
        (c1, c2, c3),
        (c2, c1, c4),
        (c3, c2, c1),
        (c4, c2, c1),
    ]
    dc1, dc2, dc3 = rng.choice(color_sets)
    drawer(g, dc1, dc2, dc3)

    if rng.random() < 0.30:
        mirror_x(g)
    if rng.random() < 0.75:
        sprinkle_fx(g, rng, c2, c4)

    image = grid_to_image(g)
    filename = f"icon_{icon_id:03d}_{name}.png"
    image.save(out_dir / filename)

    return {
        "id": icon_id,
        "name": name,
        "file": filename,
        "palette": palette,
    }


def make_contact_sheet(out_dir, icons):
    cols = 20
    rows = (len(icons) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * ICON_SIZE, rows * ICON_SIZE), (16, 16, 20, 255))
    draw = ImageDraw.Draw(sheet)

    for i, icon in enumerate(icons):
        img = Image.open(out_dir / icon["file"])
        x = (i % cols) * ICON_SIZE
        y = (i // cols) * ICON_SIZE
        sheet.paste(img, (x, y))
        draw.rectangle((x, y, x + ICON_SIZE - 1, y + ICON_SIZE - 1), outline=(38, 38, 50, 255), width=1)

    sheet.save(out_dir / "icons_contact_sheet.png")


def main():
    parser = argparse.ArgumentParser(description="Generate a large pixel icon megapack.")
    parser.add_argument("--count", type=int, default=TARGET_COUNT, help="Number of icons to generate.")
    parser.add_argument(
        "--out-dir",
        type=str,
        default=None,
        help="Output directory for generated assets. Defaults to output/pixel-icon-megapack.",
    )
    parser.add_argument(
        "--start-id",
        type=int,
        default=1,
        help="Starting icon id used in filenames and metadata.",
    )
    parser.add_argument(
        "--seed-offset",
        type=int,
        default=0,
        help="Additional seed offset to force different variants.",
    )
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    out_dir = Path(args.out_dir) if args.out_dir else (root / "output" / "pixel-icon-megapack")
    out_dir.mkdir(parents=True, exist_ok=True)

    ids = range(args.start_id, args.start_id + args.count)
    icons = [make_icon(icon_id, out_dir, seed_offset=args.seed_offset) for icon_id in ids]
    make_contact_sheet(out_dir, icons)
    (out_dir / "metadata.json").write_text(json.dumps(icons, indent=2), encoding="utf-8")
    print(f"Generated {len(icons)} icons in {out_dir}")


if __name__ == "__main__":
    main()
