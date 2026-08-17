#!/usr/bin/env python3
"""
Nexus 3D Studio - High Quality 3D Asset Generator
Generates clean, detailed OBJ/MTL models for the 3D Asset Library.
Categories:
- weapons (Cyberpunk Katana, Plasma Rifle, EMP Grenade, Railgun, Smart Pistol, Cyber Dagger, Energy Shield, Thermal Blade)
- scifi (SciFi Crate, Hologram Projector, Quantum Reactor, Comm Tower, Energy Pylon, Cryo Chamber, Gravity Generator)
- vehicles (Hover Speeder, Interceptor Fighter, Lunar Rover, Cyber Recon Drone, Heavy Mech Carrier)
- architecture (Cyber Skyscraper, SciFi Corridor, Habitation Dome, Landing Pad, Observation Deck, Data Vault, Neon Gateway)
- characters (Cyber Android, Mech Sentinel, Drone Bot, Synth Combatant, Nano Scout)
"""

import os
import math

MODELS_DIR = "/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/13-creative-media/zoth/public/assets/models"

class MeshBuilder:
    def __init__(self):
        self.vertices = []
        self.normals = []
        self.uvs = []
        self.faces = [] # (material_name, [(v_idx, vt_idx, vn_idx), ...])

    def add_vertex(self, x, y, z):
        self.vertices.append((float(x), float(y), float(z)))
        return len(self.vertices)

    def add_normal(self, nx, ny, nz):
        l = math.sqrt(nx*nx + ny*ny + nz*nz) or 1.0
        self.normals.append((nx/l, ny/l, nz/l))
        return len(self.normals)

    def add_uv(self, u, v):
        self.uvs.append((float(u), float(v)))
        return len(self.uvs)

    def add_box(self, w, h, d, center=(0,0,0), rot_y=0, mat="Default"):
        cx, cy, cz = center
        cos_r, sin_r = math.cos(rot_y), math.sin(rot_y)
        hw, hh, hd = w / 2.0, h / 2.0, d / 2.0

        def transform(lx, ly, lz):
            rx = lx * cos_r - lz * sin_r + cx
            ry = ly + cy
            rz = lx * sin_r + lz * cos_r + cz
            return rx, ry, rz

        # 8 corners
        corners = [
            (-hw, -hh,  hd), ( hw, -hh,  hd), ( hw,  hh,  hd), (-hw,  hh,  hd),
            (-hw, -hh, -hd), ( hw, -hh, -hd), ( hw,  hh, -hd), (-hw,  hh, -hd)
        ]
        v_ids = [self.add_vertex(*transform(*c)) for c in corners]

        # 6 face normals
        face_dirs = [
            (0, 0, 1), (1, 0, 0), (0, 0, -1), (-1, 0, 0), (0, 1, 0), (0, -1, 0)
        ]
        n_ids = []
        for nx, ny, nz in face_dirs:
            rnx = nx * cos_r - nz * sin_r
            rny = ny
            rnz = nx * sin_r + nz * cos_r
            n_ids.append(self.add_normal(rnx, rny, rnz))

        uv_ids = [
            self.add_uv(0, 0), self.add_uv(1, 0), self.add_uv(1, 1), self.add_uv(0, 1)
        ]

        # Quads -> 2 tris
        f_defs = [
            # Front (+Z)
            (v_ids[0], v_ids[1], v_ids[2], v_ids[3], n_ids[0]),
            # Right (+X)
            (v_ids[1], v_ids[5], v_ids[6], v_ids[2], n_ids[1]),
            # Back (-Z)
            (v_ids[5], v_ids[4], v_ids[7], v_ids[6], n_ids[2]),
            # Left (-X)
            (v_ids[4], v_ids[0], v_ids[3], v_ids[7], n_ids[3]),
            # Top (+Y)
            (v_ids[3], v_ids[2], v_ids[6], v_ids[7], n_ids[4]),
            # Bottom (-Y)
            (v_ids[4], v_ids[5], v_ids[1], v_ids[0], n_ids[5]),
        ]

        for p0, p1, p2, p3, nid in f_defs:
            self.faces.append((mat, [
                (p0, uv_ids[0], nid), (p1, uv_ids[1], nid), (p2, uv_ids[2], nid)
            ]))
            self.faces.append((mat, [
                (p0, uv_ids[0], nid), (p2, uv_ids[2], nid), (p3, uv_ids[3], nid)
            ]))

    def add_cylinder(self, r_top, r_bot, height, center=(0,0,0), segs=16, mat="Default"):
        cx, cy, cz = center
        y_bot = cy - height / 2.0
        y_top = cy + height / 2.0

        bot_v = []
        top_v = []
        side_n = []
        uvs = []

        for i in range(segs):
            u = i / segs
            theta = u * 2 * math.pi
            cos_t, sin_t = math.cos(theta), math.sin(theta)

            bx = cx + r_bot * cos_t
            bz = cz + r_bot * sin_t
            bot_v.append(self.add_vertex(bx, y_bot, bz))

            tx = cx + r_top * cos_t
            tz = cz + r_top * sin_t
            top_v.append(self.add_vertex(tx, y_top, tz))

            side_n.append(self.add_normal(cos_t, 0, sin_t))
            uvs.append((self.add_uv(u, 0), self.add_uv(u, 1)))

        n_top = self.add_normal(0, 1, 0)
        n_bot = self.add_normal(0, -1, 0)
        uv_center = self.add_uv(0.5, 0.5)

        # Sides
        for i in range(segs):
            ni = (i + 1) % segs
            p_b0, p_t0 = bot_v[i], top_v[i]
            p_b1, p_t1 = bot_v[ni], top_v[ni]
            norm = side_n[i]
            u0_b, u0_t = uvs[i]
            u1_b, u1_t = uvs[ni]

            self.faces.append((mat, [(p_b0, u0_b, norm), (p_b1, u1_b, norm), (p_t1, u1_t, norm)]))
            self.faces.append((mat, [(p_b0, u0_b, norm), (p_t1, u1_t, norm), (p_t0, u0_t, norm)]))

        # Top cap
        if r_top > 0.001:
            c_top = self.add_vertex(cx, y_top, cz)
            for i in range(segs):
                ni = (i + 1) % segs
                self.faces.append((mat, [
                    (c_top, uv_center, n_top),
                    (top_v[i], uvs[i][1], n_top),
                    (top_v[ni], uvs[ni][1], n_top)
                ]))

        # Bottom cap
        if r_bot > 0.001:
            c_bot = self.add_vertex(cx, y_bot, cz)
            for i in range(segs):
                ni = (i + 1) % segs
                self.faces.append((mat, [
                    (c_bot, uv_center, n_bot),
                    (bot_v[ni], uvs[ni][0], n_bot),
                    (bot_v[i], uvs[i][0], n_bot)
                ]))

    def add_sphere(self, radius, center=(0,0,0), rings=8, segs=12, mat="Default"):
        cx, cy, cz = center
        v_grid = []
        for r in range(rings + 1):
            theta = r * math.pi / rings
            sin_t, cos_t = math.sin(theta), math.cos(theta)
            row = []
            v_val = r / rings
            for s in range(segs + 1):
                phi = s * 2 * math.pi / segs
                u_val = s / segs
                x = radius * sin_t * math.cos(phi)
                y = radius * cos_t
                z = radius * sin_t * math.sin(phi)
                vid = self.add_vertex(cx + x, cy + y, cz + z)
                nid = self.add_normal(x / radius if radius > 0 else 0, y / radius if radius > 0 else 1, z / radius if radius > 0 else 0)
                uvid = self.add_uv(u_val, v_val)
                row.append((vid, uvid, nid))
            v_grid.append(row)

        for r in range(rings):
            for s in range(segs):
                p00 = v_grid[r][s]
                p01 = v_grid[r][s+1]
                p10 = v_grid[r+1][s]
                p11 = v_grid[r+1][s+1]

                self.faces.append((mat, [p00, p10, p11]))
                self.faces.append((mat, [p00, p11, p01]))

    def write_to_files(self, obj_path, obj_name="Model", materials=None):
        os.makedirs(os.path.dirname(obj_path), exist_ok=True)
        mtl_filename = os.path.splitext(os.path.basename(obj_path))[0] + ".mtl"
        mtl_path = os.path.splitext(obj_path)[0] + ".mtl"

        with open(obj_path, "w") as f:
            f.write(f"# Nexus 3D Studio Asset Pipeline\n")
            f.write(f"# Model: {obj_name}\n")
            f.write(f"mtllib {mtl_filename}\n")
            f.write(f"o {obj_name}\n\n")

            for v in self.vertices:
                f.write(f"v {v[0]:.4f} {v[1]:.4f} {v[2]:.4f}\n")
            f.write("\n")

            for vn in self.normals:
                f.write(f"vn {vn[0]:.4f} {vn[1]:.4f} {vn[2]:.4f}\n")
            f.write("\n")

            for vt in self.uvs:
                f.write(f"vt {vt[0]:.4f} {vt[1]:.4f}\n")
            f.write("\n")

            current_mat = None
            for mat, face_verts in self.faces:
                if mat != current_mat:
                    current_mat = mat
                    f.write(f"usemtl {mat}\n")
                f.write("f " + " ".join(f"{v}/{vt}/{vn}" for v, vt, vn in face_verts) + "\n")

        if materials:
            with open(mtl_path, "w") as f:
                f.write("# Material definitions\n")
                for mat_name, props in materials.items():
                    f.write(f"newmtl {mat_name}\n")
                    for k, val in props.items():
                        f.write(f"{k} {val}\n")
                    f.write("\n")


# -------------------------------------------------------------
# BUILDERS FOR EACH SPECIFIC ASSET
# -------------------------------------------------------------

def build_cyberpunk_katana():
    b = MeshBuilder()
    # Blade
    b.add_box(0.04, 1.8, 0.08, center=(0, 1.0, 0), mat="NeonEdgeBlade")
    b.add_box(0.02, 1.82, 0.03, center=(0, 1.0, 0.03), mat="CyberEnergyCore")
    # Guard (Tsuba)
    b.add_box(0.25, 0.04, 0.18, center=(0, 0.1, 0), mat="CarbonMatte")
    # Grip / Hilt (Tsuka)
    b.add_cylinder(0.04, 0.04, 0.55, center=(0, -0.2, 0), segs=12, mat="SyntheticLeather")
    # Pommel (Kashira)
    b.add_cylinder(0.05, 0.03, 0.1, center=(0, -0.5, 0), segs=8, mat="CarbonMatte")
    # Power Cell
    b.add_sphere(0.035, center=(0, -0.52, 0), rings=6, segs=8, mat="CyberEnergyCore")

    mats = {
        "NeonEdgeBlade": {"Kd": "0.1 0.1 0.15", "Ks": "0.95 0.95 1.0", "Ns": "250.0", "Ke": "0.1 0.6 0.9"},
        "CyberEnergyCore": {"Kd": "0.0 0.8 1.0", "Ks": "1.0 1.0 1.0", "Ns": "500.0", "Ke": "0.2 0.9 1.0"},
        "CarbonMatte": {"Kd": "0.15 0.15 0.18", "Ks": "0.3 0.3 0.3", "Ns": "40.0"},
        "SyntheticLeather": {"Kd": "0.25 0.15 0.1", "Ks": "0.1 0.1 0.1", "Ns": "15.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/weapons/cyberpunk_katana.obj", "CyberpunkKatana", mats)

def build_plasma_rifle():
    b = MeshBuilder()
    # Main Body
    b.add_box(0.2, 0.35, 1.4, center=(0, 0.1, 0), mat="ChassisDark")
    # Barrel Top & Bottom
    b.add_cylinder(0.06, 0.06, 1.0, center=(0, 0.15, 0.9), segs=12, mat="GunMetal")
    b.add_cylinder(0.04, 0.04, 0.8, center=(0, 0.03, 0.8), segs=12, mat="PlasmaGlow")
    # Stock
    b.add_box(0.16, 0.4, 0.6, center=(0, -0.05, -0.9), mat="PolymerGrip")
    # Pistol Grip
    b.add_box(0.12, 0.45, 0.18, center=(0, -0.3, -0.3), rot_y=0.2, mat="PolymerGrip")
    # Scope / Optics
    b.add_cylinder(0.05, 0.05, 0.5, center=(0, 0.35, 0.1), segs=12, mat="GunMetal")
    b.add_box(0.08, 0.12, 0.05, center=(0, 0.35, 0.36), mat="HoloLens")
    # Plasma Mag
    b.add_box(0.14, 0.4, 0.25, center=(0, -0.25, 0.2), mat="PlasmaGlow")

    mats = {
        "ChassisDark": {"Kd": "0.1 0.12 0.15", "Ks": "0.6 0.6 0.7", "Ns": "80.0"},
        "GunMetal": {"Kd": "0.3 0.32 0.35", "Ks": "0.9 0.9 0.95", "Ns": "180.0"},
        "PlasmaGlow": {"Kd": "0.1 0.9 0.4", "Ks": "1.0 1.0 1.0", "Ns": "400.0", "Ke": "0.2 1.0 0.5"},
        "PolymerGrip": {"Kd": "0.05 0.05 0.06", "Ks": "0.2 0.2 0.2", "Ns": "20.0"},
        "HoloLens": {"Kd": "0.1 0.7 1.0", "Ks": "1.0 1.0 1.0", "Ns": "300.0", "d": "0.8"}
    }
    b.write_to_files(f"{MODELS_DIR}/weapons/plasma_rifle.obj", "PlasmaRifle", mats)

def build_emp_grenade():
    b = MeshBuilder()
    # Core Sphere
    b.add_sphere(0.2, center=(0, 0, 0), rings=12, segs=16, mat="EMPBody")
    # Outer Tech Rings
    b.add_cylinder(0.23, 0.23, 0.06, center=(0, 0, 0), segs=16, mat="AlloyRing")
    b.add_cylinder(0.21, 0.21, 0.18, center=(0, 0, 0), segs=16, mat="BlueLEDGlow")
    # Cap / Detonator Pin
    b.add_cylinder(0.08, 0.08, 0.12, center=(0, 0.22, 0), segs=10, mat="AlloyRing")
    b.add_box(0.03, 0.15, 0.1, center=(0, 0.26, 0.08), mat="EMPBody")

    mats = {
        "EMPBody": {"Kd": "0.18 0.2 0.22", "Ks": "0.8 0.8 0.85", "Ns": "120.0"},
        "AlloyRing": {"Kd": "0.7 0.72 0.75", "Ks": "0.95 0.95 0.95", "Ns": "220.0"},
        "BlueLEDGlow": {"Kd": "0.0 0.6 1.0", "Ks": "1.0 1.0 1.0", "Ns": "450.0", "Ke": "0.1 0.7 1.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/weapons/emp_grenade.obj", "EMPGrenade", mats)

def build_railgun():
    b = MeshBuilder()
    # Twin Rail Core
    b.add_box(0.08, 0.08, 2.2, center=(-0.12, 0.1, 0.6), mat="MagneticRail")
    b.add_box(0.08, 0.08, 2.2, center=(0.12, 0.1, 0.6), mat="MagneticRail")
    # Capacitor Rings along barrel
    for z in [0.0, 0.4, 0.8, 1.2, 1.6]:
        b.add_cylinder(0.24, 0.24, 0.12, center=(0, 0.1, z), segs=12, mat="CapacitorRing")
    # Receiver / Power Generator
    b.add_box(0.35, 0.45, 1.0, center=(0, 0, -0.4), mat="HeavyFrame")
    # Handle & Battery Pack
    b.add_box(0.18, 0.4, 0.22, center=(0, -0.35, -0.2), mat="RubberGrip")
    b.add_box(0.28, 0.3, 0.35, center=(0, -0.25, -0.6), mat="EnergyCell")

    mats = {
        "MagneticRail": {"Kd": "0.85 0.7 0.2", "Ks": "0.95 0.8 0.3", "Ns": "300.0", "Ke": "0.3 0.2 0.0"},
        "CapacitorRing": {"Kd": "0.0 0.75 1.0", "Ks": "1.0 1.0 1.0", "Ns": "350.0", "Ke": "0.2 0.8 1.0"},
        "HeavyFrame": {"Kd": "0.12 0.14 0.16", "Ks": "0.7 0.7 0.75", "Ns": "90.0"},
        "RubberGrip": {"Kd": "0.06 0.06 0.07", "Ks": "0.15 0.15 0.15", "Ns": "15.0"},
        "EnergyCell": {"Kd": "0.1 0.6 0.2", "Ks": "0.8 0.9 0.8", "Ns": "150.0", "Ke": "0.1 0.7 0.2"}
    }
    b.write_to_files(f"{MODELS_DIR}/weapons/railgun.obj", "HeavyRailgun", mats)

def build_smart_pistol():
    b = MeshBuilder()
    # Barrel & Slide
    b.add_box(0.12, 0.18, 0.7, center=(0, 0.12, 0.1), mat="TitaniumAlloy")
    # Smart Optic HUD sensor
    b.add_box(0.08, 0.08, 0.25, center=(0, 0.24, 0.05), mat="TargetingOptic")
    # Lower receiver & grip
    b.add_box(0.1, 0.28, 0.16, center=(0, -0.12, -0.15), rot_y=0.15, mat="PolymerFrame")
    b.add_cylinder(0.03, 0.03, 0.4, center=(0, 0.12, 0.35), segs=10, mat="TitaniumAlloy")

    mats = {
        "TitaniumAlloy": {"Kd": "0.4 0.42 0.45", "Ks": "0.85 0.85 0.9", "Ns": "160.0"},
        "TargetingOptic": {"Kd": "0.9 0.1 0.1", "Ks": "1.0 1.0 1.0", "Ns": "300.0", "Ke": "0.8 0.0 0.0"},
        "PolymerFrame": {"Kd": "0.1 0.1 0.12", "Ks": "0.3 0.3 0.35", "Ns": "40.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/weapons/smart_pistol.obj", "SmartPistol", mats)

def build_cyber_dagger():
    b = MeshBuilder()
    b.add_box(0.02, 0.6, 0.08, center=(0, 0.4, 0), mat="MonoMolecularEdge")
    b.add_box(0.04, 0.03, 0.12, center=(0, 0.08, 0), mat="CarbonGuard")
    b.add_cylinder(0.025, 0.025, 0.25, center=(0, -0.06, 0), segs=8, mat="GripMatte")
    mats = {
        "MonoMolecularEdge": {"Kd": "0.0 0.8 0.9", "Ks": "1.0 1.0 1.0", "Ns": "400.0", "Ke": "0.2 0.7 0.9"},
        "CarbonGuard": {"Kd": "0.15 0.15 0.15", "Ks": "0.5 0.5 0.5", "Ns": "80.0"},
        "GripMatte": {"Kd": "0.08 0.08 0.08", "Ks": "0.2 0.2 0.2", "Ns": "20.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/weapons/cyber_dagger.obj", "CyberDagger", mats)

def build_energy_shield():
    b = MeshBuilder()
    # Hex emitter center
    b.add_cylinder(0.3, 0.3, 0.08, center=(0, 0, 0), segs=6, mat="ShieldFrame")
    # Outer guard struts
    b.add_box(0.9, 0.08, 0.04, center=(0, 0, 0.02), mat="ShieldFrame")
    b.add_box(0.08, 0.9, 0.04, center=(0, 0, 0.02), mat="ShieldFrame")
    # Forcefield Disc
    b.add_cylinder(0.8, 0.8, 0.01, center=(0, 0, 0.04), segs=16, mat="ForceFieldGrid")
    mats = {
        "ShieldFrame": {"Kd": "0.2 0.22 0.25", "Ks": "0.8 0.8 0.85", "Ns": "150.0"},
        "ForceFieldGrid": {"Kd": "0.1 0.5 1.0", "Ks": "1.0 1.0 1.0", "Ns": "300.0", "Ke": "0.2 0.6 1.0", "d": "0.7"}
    }
    b.write_to_files(f"{MODELS_DIR}/weapons/energy_shield.obj", "EnergyShield", mats)

def build_thermal_blade():
    b = MeshBuilder()
    b.add_box(0.03, 1.2, 0.12, center=(0, 0.7, 0), mat="ThermalCore")
    b.add_box(0.08, 0.06, 0.16, center=(0, 0.08, 0), mat="HeatShield")
    b.add_cylinder(0.035, 0.035, 0.35, center=(0, -0.12, 0), segs=10, mat="HeatShield")
    mats = {
        "ThermalCore": {"Kd": "1.0 0.3 0.0", "Ks": "1.0 0.8 0.2", "Ns": "350.0", "Ke": "1.0 0.4 0.0"},
        "HeatShield": {"Kd": "0.12 0.12 0.14", "Ks": "0.6 0.6 0.6", "Ns": "70.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/weapons/thermal_blade.obj", "ThermalBlade", mats)

# ----------------- SCI-FI ASSETS -----------------
def build_scifi_crate():
    b = MeshBuilder()
    # Main Box
    b.add_box(1.2, 1.2, 1.2, center=(0, 0.6, 0), mat="CratePanel")
    # Reinforced Bevel Edges
    b.add_box(1.26, 0.15, 1.26, center=(0, 1.15, 0), mat="ReinforcedSteel")
    b.add_box(1.26, 0.15, 1.26, center=(0, 0.05, 0), mat="ReinforcedSteel")
    # Tech Lock / Status Indicator
    b.add_box(0.3, 0.2, 0.04, center=(0, 0.6, 0.62), mat="NeonStatusLight")
    b.add_box(0.3, 0.2, 0.04, center=(0, 0.6, -0.62), mat="NeonStatusLight")

    mats = {
        "CratePanel": {"Kd": "0.3 0.35 0.4", "Ks": "0.5 0.5 0.5", "Ns": "60.0"},
        "ReinforcedSteel": {"Kd": "0.15 0.16 0.18", "Ks": "0.85 0.85 0.9", "Ns": "140.0"},
        "NeonStatusLight": {"Kd": "0.0 0.9 0.8", "Ks": "1.0 1.0 1.0", "Ns": "400.0", "Ke": "0.1 0.9 0.8"}
    }
    b.write_to_files(f"{MODELS_DIR}/scifi/scifi_crate.obj", "SciFiCrate", mats)

def build_quantum_reactor():
    b = MeshBuilder()
    # Base Platform
    b.add_cylinder(1.5, 1.6, 0.3, center=(0, 0.15, 0), segs=16, mat="ReactorHousing")
    # Magnetic Containment Coils (3 pillars)
    for i in range(3):
        ang = i * 2 * math.pi / 3
        px = 0.9 * math.cos(ang)
        pz = 0.9 * math.sin(ang)
        b.add_cylinder(0.12, 0.12, 1.8, center=(px, 1.05, pz), segs=10, mat="CoilAlloy")
    # Plasma Core
    b.add_sphere(0.5, center=(0, 1.05, 0), rings=12, segs=16, mat="SingularityCore")
    # Top Emitter
    b.add_cylinder(1.3, 1.4, 0.25, center=(0, 1.95, 0), segs=16, mat="ReactorHousing")

    mats = {
        "ReactorHousing": {"Kd": "0.2 0.22 0.25", "Ks": "0.7 0.75 0.8", "Ns": "110.0"},
        "CoilAlloy": {"Kd": "0.8 0.6 0.2", "Ks": "0.95 0.85 0.4", "Ns": "220.0"},
        "SingularityCore": {"Kd": "0.5 0.1 1.0", "Ks": "1.0 1.0 1.0", "Ns": "500.0", "Ke": "0.7 0.2 1.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/scifi/quantum_reactor.obj", "QuantumReactor", mats)

def build_hologram_projector():
    b = MeshBuilder()
    b.add_cylinder(0.8, 0.9, 0.2, center=(0, 0.1, 0), segs=16, mat="ProjectorBase")
    b.add_cylinder(0.4, 0.5, 0.15, center=(0, 0.25, 0), segs=12, mat="EmitterLens")
    b.add_sphere(0.2, center=(0, 0.35, 0), rings=8, segs=12, mat="EmitterLens")
    mats = {
        "ProjectorBase": {"Kd": "0.15 0.17 0.2", "Ks": "0.6 0.6 0.7", "Ns": "90.0"},
        "EmitterLens": {"Kd": "0.0 0.8 1.0", "Ks": "1.0 1.0 1.0", "Ns": "350.0", "Ke": "0.3 0.8 1.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/scifi/hologram_projector.obj", "HologramProjector", mats)

def build_scifi_comm_tower():
    b = MeshBuilder()
    b.add_cylinder(0.6, 0.9, 0.4, center=(0, 0.2, 0), segs=12, mat="TowerSteel")
    b.add_cylinder(0.2, 0.4, 3.2, center=(0, 2.0, 0), segs=10, mat="TowerSteel")
    # Radar Dish
    b.add_cylinder(0.8, 0.1, 0.3, center=(0.4, 3.2, 0.3), segs=12, mat="DishMat")
    # Antenna Spike
    b.add_cylinder(0.02, 0.05, 1.2, center=(0, 3.8, 0), segs=6, mat="DishMat")
    mats = {
        "TowerSteel": {"Kd": "0.25 0.28 0.3", "Ks": "0.8 0.8 0.8", "Ns": "100.0"},
        "DishMat": {"Kd": "0.8 0.82 0.85", "Ks": "0.9 0.9 0.9", "Ns": "150.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/scifi/scifi_comm_tower.obj", "SciFiCommTower", mats)

def build_energy_pylon():
    b = MeshBuilder()
    b.add_box(1.0, 0.3, 1.0, center=(0, 0.15, 0), mat="PylonBase")
    b.add_cylinder(0.25, 0.4, 2.5, center=(0, 1.4, 0), segs=8, mat="PylonBase")
    b.add_sphere(0.35, center=(0, 2.8, 0), rings=10, segs=12, mat="PlasmaCrystal")
    mats = {
        "PylonBase": {"Kd": "0.2 0.2 0.24", "Ks": "0.6 0.6 0.7", "Ns": "80.0"},
        "PlasmaCrystal": {"Kd": "0.0 0.9 0.7", "Ks": "1.0 1.0 1.0", "Ns": "450.0", "Ke": "0.2 0.9 0.8"}
    }
    b.write_to_files(f"{MODELS_DIR}/scifi/energy_pylon.obj", "EnergyPylon", mats)

def build_cryo_chamber():
    b = MeshBuilder()
    b.add_box(0.9, 0.3, 0.9, center=(0, 0.15, 0), mat="CryoChamberMetal")
    b.add_cylinder(0.38, 0.38, 1.8, center=(0, 1.15, 0), segs=14, mat="CryoGlass")
    b.add_box(0.85, 0.3, 0.85, center=(0, 2.15, 0), mat="CryoChamberMetal")
    mats = {
        "CryoChamberMetal": {"Kd": "0.75 0.78 0.82", "Ks": "0.9 0.9 0.9", "Ns": "160.0"},
        "CryoGlass": {"Kd": "0.1 0.6 0.8", "Ks": "1.0 1.0 1.0", "Ns": "300.0", "d": "0.6", "Ke": "0.0 0.3 0.5"}
    }
    b.write_to_files(f"{MODELS_DIR}/scifi/scifi_cryo_chamber.obj", "CryoChamber", mats)

def build_gravity_generator():
    b = MeshBuilder()
    b.add_cylinder(1.2, 1.4, 0.4, center=(0, 0.2, 0), segs=16, mat="GenAlloy")
    b.add_cylinder(0.8, 0.8, 0.6, center=(0, 0.7, 0), segs=16, mat="GravField")
    b.add_cylinder(1.0, 1.0, 0.2, center=(0, 1.1, 0), segs=16, mat="GenAlloy")
    mats = {
        "GenAlloy": {"Kd": "0.18 0.2 0.22", "Ks": "0.75 0.75 0.8", "Ns": "120.0"},
        "GravField": {"Kd": "0.8 0.2 0.9", "Ks": "1.0 0.5 1.0", "Ns": "400.0", "Ke": "0.6 0.1 0.8"}
    }
    b.write_to_files(f"{MODELS_DIR}/scifi/gravity_generator.obj", "GravityGenerator", mats)

# ----------------- VEHICLES -----------------
def build_hover_speeder():
    b = MeshBuilder()
    # Sleek Main Fuselage
    b.add_box(0.9, 0.35, 2.6, center=(0, 0.4, 0), mat="AeroCarbon")
    # Cockpit Canopy
    b.add_box(0.6, 0.3, 1.0, center=(0, 0.65, -0.1), mat="TintedCanopy")
    # Twin Repulsor Thrusters
    b.add_cylinder(0.2, 0.25, 1.4, center=(-0.65, 0.4, 0.2), segs=12, mat="ThrusterAlloy")
    b.add_cylinder(0.2, 0.25, 1.4, center=(0.65, 0.4, 0.2), segs=12, mat="ThrusterAlloy")
    # Thruster Glow
    b.add_cylinder(0.16, 0.16, 0.1, center=(-0.65, 0.4, -0.55), segs=10, mat="IonExhaust")
    b.add_cylinder(0.16, 0.16, 0.1, center=(0.65, 0.4, -0.55), segs=10, mat="IonExhaust")
    # Aerodynamic Winglets
    b.add_box(0.6, 0.04, 0.8, center=(-0.9, 0.4, -0.2), mat="AeroCarbon")
    b.add_box(0.6, 0.04, 0.8, center=(0.9, 0.4, -0.2), mat="AeroCarbon")

    mats = {
        "AeroCarbon": {"Kd": "0.85 0.15 0.1", "Ks": "0.9 0.85 0.85", "Ns": "180.0"},
        "TintedCanopy": {"Kd": "0.1 0.12 0.15", "Ks": "1.0 1.0 1.0", "Ns": "300.0", "d": "0.85"},
        "ThrusterAlloy": {"Kd": "0.2 0.22 0.25", "Ks": "0.8 0.8 0.8", "Ns": "120.0"},
        "IonExhaust": {"Kd": "0.1 0.7 1.0", "Ks": "1.0 1.0 1.0", "Ns": "500.0", "Ke": "0.2 0.8 1.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/vehicles/hover_speeder.obj", "HoverSpeeder", mats)

def build_interceptor_fighter():
    b = MeshBuilder()
    # Fuselage
    b.add_box(0.8, 0.5, 3.4, center=(0, 0.5, 0), mat="FighterStealth")
    # Delta Wings
    b.add_box(2.8, 0.08, 1.4, center=(0, 0.45, -0.2), mat="FighterStealth")
    # Twin Vertical Stabilizers
    b.add_box(0.06, 0.7, 0.8, center=(-0.7, 0.85, -1.1), mat="FighterStealth")
    b.add_box(0.06, 0.7, 0.8, center=(0.7, 0.85, -1.1), mat="FighterStealth")
    # Cockpit Glass
    b.add_box(0.5, 0.35, 1.1, center=(0, 0.75, 0.5), mat="CockpitGold")
    # Twin Engines
    b.add_cylinder(0.24, 0.28, 1.2, center=(-0.35, 0.5, -1.4), segs=12, mat="EngineAlloy")
    b.add_cylinder(0.24, 0.28, 1.2, center=(0.35, 0.5, -1.4), segs=12, mat="EngineAlloy")

    mats = {
        "FighterStealth": {"Kd": "0.12 0.14 0.18", "Ks": "0.6 0.6 0.7", "Ns": "100.0"},
        "CockpitGold": {"Kd": "0.9 0.7 0.2", "Ks": "1.0 0.9 0.4", "Ns": "250.0", "d": "0.9"},
        "EngineAlloy": {"Kd": "0.3 0.32 0.35", "Ks": "0.9 0.9 0.9", "Ns": "150.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/vehicles/interceptor_fighter.obj", "InterceptorFighter", mats)

def build_lunar_rover():
    b = MeshBuilder()
    # Chassis
    b.add_box(1.4, 0.6, 2.0, center=(0, 0.8, 0), mat="RoverArmor")
    # 4 Heavy Wheels
    for wx in [-0.9, 0.9]:
        for wz in [-0.7, 0.7]:
            b.add_cylinder(0.4, 0.4, 0.3, center=(wx, 0.4, wz), segs=12, mat="TireTread")
    # Solar array & sensors
    b.add_box(1.2, 0.05, 0.8, center=(0, 1.2, -0.4), mat="SolarPanel")
    b.add_cylinder(0.06, 0.06, 0.6, center=(0.4, 1.4, 0.5), segs=8, mat="RoverArmor")

    mats = {
        "RoverArmor": {"Kd": "0.85 0.88 0.9", "Ks": "0.7 0.7 0.7", "Ns": "90.0"},
        "TireTread": {"Kd": "0.1 0.1 0.1", "Ks": "0.2 0.2 0.2", "Ns": "20.0"},
        "SolarPanel": {"Kd": "0.05 0.1 0.3", "Ks": "0.9 0.9 1.0", "Ns": "300.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/vehicles/lunar_rover.obj", "LunarRover", mats)

def build_cyber_drone():
    b = MeshBuilder()
    # Core Body
    b.add_box(0.5, 0.2, 0.6, center=(0, 0.5, 0), mat="DroneCore")
    # 4 Rotor Arms
    b.add_box(1.4, 0.06, 0.08, center=(0, 0.5, 0), rot_y=0.785, mat="DroneCore")
    b.add_box(1.4, 0.06, 0.08, center=(0, 0.5, 0), rot_y=-0.785, mat="DroneCore")
    # Rotors
    for rx in [-0.5, 0.5]:
        for rz in [-0.5, 0.5]:
            b.add_cylinder(0.25, 0.25, 0.02, center=(rx, 0.56, rz), segs=10, mat="RotorDisc")
    # Sensor Eye
    b.add_sphere(0.12, center=(0, 0.45, 0.32), rings=8, segs=10, mat="SensorEye")

    mats = {
        "DroneCore": {"Kd": "0.15 0.17 0.2", "Ks": "0.8 0.8 0.85", "Ns": "130.0"},
        "RotorDisc": {"Kd": "0.2 0.8 1.0", "Ks": "1.0 1.0 1.0", "Ns": "200.0", "d": "0.5"},
        "SensorEye": {"Kd": "1.0 0.1 0.1", "Ks": "1.0 1.0 1.0", "Ns": "400.0", "Ke": "0.9 0.1 0.1"}
    }
    b.write_to_files(f"{MODELS_DIR}/vehicles/cyber_recon_drone.obj", "CyberReconDrone", mats)

def build_heavy_mech_carrier():
    b = MeshBuilder()
    # Massive Track Chassis
    b.add_box(2.2, 0.8, 4.0, center=(0, 0.6, 0), mat="ArmoredHull")
    # Armored Cockpit Cab
    b.add_box(1.6, 0.7, 1.2, center=(0, 1.35, 1.2), mat="ArmoredHull")
    # Mech Docking Clamp Platform
    b.add_box(1.8, 0.2, 2.0, center=(0, 1.1, -0.7), mat="DockPlatform")
    mats = {
        "ArmoredHull": {"Kd": "0.25 0.3 0.26", "Ks": "0.5 0.5 0.5", "Ns": "50.0"},
        "DockPlatform": {"Kd": "0.7 0.6 0.1", "Ks": "0.8 0.8 0.8", "Ns": "100.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/vehicles/heavy_mech_carrier.obj", "HeavyMechCarrier", mats)

# ----------------- ARCHITECTURE -----------------
def build_cyber_skyscraper():
    b = MeshBuilder()
    # Multi-tier skyscraper
    b.add_box(2.4, 2.0, 2.4, center=(0, 1.0, 0), mat="TowerConcrete")
    b.add_box(1.8, 3.5, 1.8, center=(0, 3.75, 0), mat="GlassCurtain")
    b.add_box(1.2, 3.0, 1.2, center=(0, 7.0, 0), mat="GlassCurtain")
    # Crown Spire
    b.add_cylinder(0.08, 0.3, 2.5, center=(0, 9.75, 0), segs=8, mat="SpireNeon")
    mats = {
        "TowerConcrete": {"Kd": "0.2 0.22 0.25", "Ks": "0.4 0.4 0.4", "Ns": "40.0"},
        "GlassCurtain": {"Kd": "0.1 0.3 0.5", "Ks": "0.95 0.95 1.0", "Ns": "250.0"},
        "SpireNeon": {"Kd": "1.0 0.0 0.5", "Ks": "1.0 1.0 1.0", "Ns": "500.0", "Ke": "1.0 0.0 0.5"}
    }
    b.write_to_files(f"{MODELS_DIR}/architecture/cyberpunk_skyscraper.obj", "CyberpunkSkyscraper", mats)

def build_modular_scifi_corridor():
    b = MeshBuilder()
    # Floor & Ceiling
    b.add_box(2.6, 0.2, 3.0, center=(0, 0.1, 0), mat="CorridorFloor")
    b.add_box(2.6, 0.2, 3.0, center=(0, 2.7, 0), mat="CorridorPanel")
    # Left & Right Wall Modules
    b.add_box(0.2, 2.4, 3.0, center=(-1.2, 1.4, 0), mat="CorridorPanel")
    b.add_box(0.2, 2.4, 3.0, center=(1.2, 1.4, 0), mat="CorridorPanel")
    # Neon Light Strips along ceiling
    b.add_box(0.1, 0.05, 2.8, center=(-0.8, 2.58, 0), mat="CyanLightStrip")
    b.add_box(0.1, 0.05, 2.8, center=(0.8, 2.58, 0), mat="CyanLightStrip")
    mats = {
        "CorridorFloor": {"Kd": "0.18 0.18 0.2", "Ks": "0.6 0.6 0.6", "Ns": "60.0"},
        "CorridorPanel": {"Kd": "0.35 0.38 0.42", "Ks": "0.7 0.7 0.7", "Ns": "90.0"},
        "CyanLightStrip": {"Kd": "0.0 0.9 1.0", "Ks": "1.0 1.0 1.0", "Ns": "500.0", "Ke": "0.1 0.9 1.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/architecture/modular_scifi_corridor.obj", "ModularSciFiCorridor", mats)

def build_hab_dome():
    b = MeshBuilder()
    b.add_cylinder(2.2, 2.3, 0.4, center=(0, 0.2, 0), segs=16, mat="DomeFoundation")
    b.add_sphere(2.0, center=(0, 0.4, 0), rings=10, segs=16, mat="GeodesicGlass")
    mats = {
        "DomeFoundation": {"Kd": "0.3 0.32 0.35", "Ks": "0.5 0.5 0.5", "Ns": "50.0"},
        "GeodesicGlass": {"Kd": "0.2 0.5 0.7", "Ks": "0.9 0.95 1.0", "Ns": "300.0", "d": "0.75"}
    }
    b.write_to_files(f"{MODELS_DIR}/architecture/hab_dome.obj", "HabitationDome", mats)

def build_landing_pad():
    b = MeshBuilder()
    b.add_cylinder(3.0, 3.2, 0.3, center=(0, 0.15, 0), segs=16, mat="PadConcrete")
    b.add_cylinder(2.4, 2.4, 0.05, center=(0, 0.32, 0), segs=16, mat="PadMarking")
    mats = {
        "PadConcrete": {"Kd": "0.25 0.26 0.28", "Ks": "0.4 0.4 0.4", "Ns": "30.0"},
        "PadMarking": {"Kd": "1.0 0.75 0.0", "Ks": "0.8 0.8 0.8", "Ns": "100.0", "Ke": "0.3 0.2 0.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/architecture/landing_pad.obj", "LandingPad", mats)

def build_data_vault():
    b = MeshBuilder()
    b.add_box(2.0, 2.4, 1.2, center=(0, 1.2, 0), mat="VaultArmored")
    b.add_cylinder(0.5, 0.5, 0.1, center=(0, 1.2, 0.62), segs=16, mat="VaultLock")
    mats = {
        "VaultArmored": {"Kd": "0.15 0.17 0.2", "Ks": "0.8 0.85 0.9", "Ns": "140.0"},
        "VaultLock": {"Kd": "0.0 0.8 0.9", "Ks": "1.0 1.0 1.0", "Ns": "350.0", "Ke": "0.1 0.7 0.8"}
    }
    b.write_to_files(f"{MODELS_DIR}/architecture/data_vault.obj", "DataVault", mats)

def build_neon_gateway():
    b = MeshBuilder()
    b.add_box(0.5, 3.2, 0.5, center=(-1.5, 1.6, 0), mat="PillarMat")
    b.add_box(0.5, 3.2, 0.5, center=(1.5, 1.6, 0), mat="PillarMat")
    b.add_box(3.5, 0.5, 0.5, center=(0, 3.45, 0), mat="PillarMat")
    b.add_box(2.8, 0.15, 0.05, center=(0, 3.1, 0), mat="NeonSign")
    mats = {
        "PillarMat": {"Kd": "0.12 0.12 0.15", "Ks": "0.7 0.7 0.7", "Ns": "80.0"},
        "NeonSign": {"Kd": "1.0 0.1 0.8", "Ks": "1.0 1.0 1.0", "Ns": "500.0", "Ke": "1.0 0.1 0.8"}
    }
    b.write_to_files(f"{MODELS_DIR}/architecture/neon_gateway.obj", "NeonGateway", mats)

def build_observation_deck():
    b = MeshBuilder()
    b.add_cylinder(0.6, 0.9, 4.0, center=(0, 2.0, 0), segs=12, mat="ColumnSteel")
    b.add_cylinder(2.5, 2.0, 0.8, center=(0, 4.4, 0), segs=16, mat="DeckGlass")
    mats = {
        "ColumnSteel": {"Kd": "0.2 0.22 0.25", "Ks": "0.7 0.7 0.75", "Ns": "90.0"},
        "DeckGlass": {"Kd": "0.1 0.5 0.7", "Ks": "0.95 0.95 1.0", "Ns": "280.0", "d": "0.8"}
    }
    b.write_to_files(f"{MODELS_DIR}/architecture/observation_deck.obj", "ObservationDeck", mats)

# ----------------- CHARACTERS -----------------
def build_cyber_android():
    b = MeshBuilder()
    # Torso
    b.add_box(0.6, 0.7, 0.35, center=(0, 1.3, 0), mat="AndroidChassis")
    # Head
    b.add_box(0.3, 0.35, 0.3, center=(0, 1.85, 0), mat="AndroidChassis")
    b.add_box(0.24, 0.08, 0.04, center=(0, 1.88, 0.16), mat="VisorGlow")
    # Limbs
    b.add_cylinder(0.08, 0.08, 0.7, center=(-0.42, 1.25, 0), segs=8, mat="AndroidJoint")
    b.add_cylinder(0.08, 0.08, 0.7, center=(0.42, 1.25, 0), segs=8, mat="AndroidJoint")
    b.add_cylinder(0.1, 0.09, 0.9, center=(-0.2, 0.45, 0), segs=8, mat="AndroidJoint")
    b.add_cylinder(0.1, 0.09, 0.9, center=(0.2, 0.45, 0), segs=8, mat="AndroidJoint")

    mats = {
        "AndroidChassis": {"Kd": "0.85 0.87 0.9", "Ks": "0.9 0.9 0.95", "Ns": "180.0"},
        "VisorGlow": {"Kd": "0.0 0.9 1.0", "Ks": "1.0 1.0 1.0", "Ns": "450.0", "Ke": "0.1 0.9 1.0"},
        "AndroidJoint": {"Kd": "0.15 0.15 0.18", "Ks": "0.6 0.6 0.6", "Ns": "70.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/characters/cyber_android.obj", "CyberAndroid", mats)

def build_mech_warrior():
    b = MeshBuilder()
    # Heavy Mech Torso
    b.add_box(1.2, 1.0, 0.9, center=(0, 2.0, 0), mat="MechArmor")
    b.add_box(0.5, 0.4, 0.5, center=(0, 2.6, 0.1), mat="MechCockpit")
    # Heavy Shoulder Cannons
    b.add_cylinder(0.15, 0.15, 1.2, center=(-0.85, 2.4, 0.2), segs=10, mat="CannonAlloy")
    b.add_cylinder(0.15, 0.15, 1.2, center=(0.85, 2.4, 0.2), segs=10, mat="CannonAlloy")
    # Bipedal Legs
    b.add_box(0.35, 1.4, 0.4, center=(-0.5, 0.7, 0), mat="MechArmor")
    b.add_box(0.35, 1.4, 0.4, center=(0.5, 0.7, 0), mat="MechArmor")

    mats = {
        "MechArmor": {"Kd": "0.3 0.35 0.28", "Ks": "0.5 0.5 0.5", "Ns": "60.0"},
        "MechCockpit": {"Kd": "0.9 0.5 0.1", "Ks": "1.0 0.8 0.4", "Ns": "250.0"},
        "CannonAlloy": {"Kd": "0.18 0.18 0.2", "Ks": "0.85 0.85 0.9", "Ns": "150.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/characters/mech_warrior.obj", "MechWarrior", mats)

def build_scifi_drone_bot():
    b = MeshBuilder()
    b.add_sphere(0.4, center=(0, 1.2, 0), rings=10, segs=14, mat="BotPlates")
    b.add_sphere(0.15, center=(0, 1.2, 0.35), rings=6, segs=8, mat="BotEye")
    mats = {
        "BotPlates": {"Kd": "0.8 0.82 0.85", "Ks": "0.9 0.9 0.95", "Ns": "200.0"},
        "BotEye": {"Kd": "1.0 0.2 0.0", "Ks": "1.0 1.0 1.0", "Ns": "400.0", "Ke": "1.0 0.2 0.0"}
    }
    b.write_to_files(f"{MODELS_DIR}/characters/scifi_drone_bot.obj", "SciFiDroneBot", mats)

def build_synth_sentinel():
    b = MeshBuilder()
    b.add_cylinder(0.3, 0.4, 1.5, center=(0, 1.0, 0), segs=10, mat="SynthArmor")
    b.add_cylinder(0.2, 0.25, 0.4, center=(0, 1.9, 0), segs=8, mat="SynthVisor")
    mats = {
        "SynthArmor": {"Kd": "0.15 0.16 0.2", "Ks": "0.7 0.7 0.8", "Ns": "100.0"},
        "SynthVisor": {"Kd": "0.2 0.9 0.3", "Ks": "1.0 1.0 1.0", "Ns": "350.0", "Ke": "0.2 0.9 0.3"}
    }
    b.write_to_files(f"{MODELS_DIR}/characters/synth_sentinel.obj", "SynthSentinel", mats)

def build_nano_scout():
    b = MeshBuilder()
    b.add_box(0.4, 0.2, 0.4, center=(0, 0.3, 0), mat="NanoCarbon")
    b.add_cylinder(0.04, 0.04, 0.3, center=(-0.25, 0.15, -0.25), segs=6, mat="NanoCarbon")
    b.add_cylinder(0.04, 0.04, 0.3, center=(0.25, 0.15, -0.25), segs=6, mat="NanoCarbon")
    b.add_cylinder(0.04, 0.04, 0.3, center=(-0.25, 0.15, 0.25), segs=6, mat="NanoCarbon")
    b.add_cylinder(0.04, 0.04, 0.3, center=(0.25, 0.15, 0.25), segs=6, mat="NanoCarbon")
    mats = {
        "NanoCarbon": {"Kd": "0.1 0.1 0.12", "Ks": "0.8 0.8 0.9", "Ns": "150.0", "Ke": "0.0 0.3 0.6"}
    }
    b.write_to_files(f"{MODELS_DIR}/characters/nano_scout.obj", "NanoScout", mats)

def main():
    print("Generating Weapons...")
    build_cyberpunk_katana()
    build_plasma_rifle()
    build_emp_grenade()
    build_railgun()
    build_smart_pistol()
    build_cyber_dagger()
    build_energy_shield()
    build_thermal_blade()

    print("Generating SciFi...")
    build_scifi_crate()
    build_quantum_reactor()
    build_hologram_projector()
    build_scifi_comm_tower()
    build_energy_pylon()
    build_cryo_chamber()
    build_gravity_generator()

    print("Generating Vehicles...")
    build_hover_speeder()
    build_interceptor_fighter()
    build_lunar_rover()
    build_cyber_drone()
    build_heavy_mech_carrier()

    print("Generating Architecture...")
    build_cyber_skyscraper()
    build_modular_scifi_corridor()
    build_hab_dome()
    build_landing_pad()
    build_data_vault()
    build_neon_gateway()
    build_observation_deck()

    print("Generating Characters...")
    build_cyber_android()
    build_mech_warrior()
    build_scifi_drone_bot()
    build_synth_sentinel()
    build_nano_scout()

    print("Successfully generated all procedural 3D models!")

if __name__ == "__main__":
    main()
