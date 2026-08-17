#!/usr/bin/env python3
"""
Nexus 3D Studio - 3D AI Training Dataset Compiler
=================================================
Automated pipeline for extracting 3D geometry metrics (vertex counts, bounding boxes,
skeletal animation tracks, materials) from GLB/GLTF/OBJ models and synthesizing high-quality
Three.js procedural code training datasets for fine-tuning LLMs (Hermes 3 / Qwen 2.5 Coder).

Author: Nexus 3D Studio AI Team
"""

import os
import sys
import json
import struct
import math
import argparse
from pathlib import Path
from typing import Dict, Any, List, Tuple, Optional

DEFAULT_MODELS_DIR = "/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/13-creative-media/zoth/public/assets/models"
DEFAULT_OUTPUT_DIR = "/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/13-creative-media/zoth/data/3d_ai_training"

SYSTEM_PROMPT_HERMES = (
    "You are an elite 3D WebGL and Three.js graphics engineer. "
    "Your goal is to write high-performance, mathematically accurate, and visually stunning "
    "Three.js procedural 3D generation code. Always follow Three.js (r128+) best practices, "
    "structure meshes with appropriate BufferGeometry, MeshStandardMaterial/MeshPhysicalMaterial, "
    "proper bounding hierarchies, and clean animations."
)

# -------------------------------------------------------------
# 3D Model Parsers
# -------------------------------------------------------------

class ModelParser:
    @staticmethod
    def parse_glb(file_path: str) -> Dict[str, Any]:
        """Parses binary GLB 2.0 container and extracts geometry, hierarchy, skins, anims."""
        metrics = {
            "format": "glb",
            "vertex_count": 0,
            "face_count": 0,
            "mesh_count": 0,
            "node_count": 0,
            "material_count": 0,
            "materials": [],
            "bounding_box": {"min": [0.0, 0.0, 0.0], "max": [0.0, 0.0, 0.0]},
            "dimensions": {"width": 0.0, "height": 0.0, "depth": 0.0},
            "center": [0.0, 0.0, 0.0],
            "bounding_sphere_radius": 0.0,
            "animations": [],
            "skins": [],
            "joint_count": 0
        }

        with open(file_path, "rb") as f:
            header = f.read(12)
            if len(header) < 12:
                return metrics
            magic, version, length = struct.unpack("<4sII", header)
            if magic != b"glTF":
                return metrics

            chunk_len, chunk_type = struct.unpack("<II", f.read(8))
            if chunk_type != 0x4E4F534A: # JSON
                return metrics

            json_bytes = f.read(chunk_len)
            gltf = json.loads(json_bytes.decode("utf-8", errors="ignore"))

            accessors = gltf.get("accessors", [])
            meshes = gltf.get("meshes", [])
            nodes = gltf.get("nodes", [])
            mats = gltf.get("materials", [])
            anims = gltf.get("animations", [])
            skins = gltf.get("skins", [])

            metrics["mesh_count"] = len(meshes)
            metrics["node_count"] = len(nodes)
            metrics["material_count"] = len(mats)

            # Materials
            for m in mats:
                mat_info = {
                    "name": m.get("name", "unnamed_mat"),
                    "pbr": m.get("pbrMetallicRoughness", {}),
                    "emissive": m.get("emissiveFactor", [0, 0, 0]),
                    "alpha_mode": m.get("alphaMode", "OPAQUE")
                }
                metrics["materials"].append(mat_info)

            # Vertex and Bounding Box
            min_b = [float("inf"), float("inf"), float("inf")]
            max_b = [float("-inf"), float("-inf"), float("-inf")]
            total_verts = 0
            total_faces = 0

            for mesh in meshes:
                for prim in mesh.get("primitives", []):
                    # Position
                    pos_idx = prim.get("attributes", {}).get("POSITION")
                    if pos_idx is not None and pos_idx < len(accessors):
                        acc = accessors[pos_idx]
                        total_verts += acc.get("count", 0)
                        if "min" in acc and "max" in acc:
                            for i in range(3):
                                min_b[i] = min(min_b[i], float(acc["min"][i]))
                                max_b[i] = max(max_b[i], float(acc["max"][i]))

                    # Indices
                    idx_idx = prim.get("indices")
                    if idx_idx is not None and idx_idx < len(accessors):
                        acc = accessors[idx_idx]
                        total_faces += acc.get("count", 0) // 3
                    elif pos_idx is not None and pos_idx < len(accessors):
                        total_faces += accessors[pos_idx].get("count", 0) // 3

            metrics["vertex_count"] = total_verts
            metrics["face_count"] = total_faces

            if min_b[0] != float("inf"):
                metrics["bounding_box"]["min"] = [round(x, 4) for x in min_b]
                metrics["bounding_box"]["max"] = [round(x, 4) for x in max_b]
                dim_x = max_b[0] - min_b[0]
                dim_y = max_b[1] - min_b[1]
                dim_z = max_b[2] - min_b[2]
                metrics["dimensions"] = {
                    "width": round(dim_x, 4),
                    "height": round(dim_y, 4),
                    "depth": round(dim_z, 4)
                }
                center = [
                    round((min_b[0] + max_b[0]) / 2.0, 4),
                    round((min_b[1] + max_b[1]) / 2.0, 4),
                    round((min_b[2] + max_b[2]) / 2.0, 4)
                ]
                metrics["center"] = center
                radius = math.sqrt(dim_x**2 + dim_y**2 + dim_z**2) / 2.0
                metrics["bounding_sphere_radius"] = round(radius, 4)

            # Animations
            for anim in anims:
                channels = anim.get("channels", [])
                samplers = anim.get("samplers", [])
                target_paths = list(set(c.get("target", {}).get("path", "unknown") for c in channels))
                metrics["animations"].append({
                    "name": anim.get("name", "Action"),
                    "channels_count": len(channels),
                    "target_paths": target_paths
                })

            # Skins / Bones
            for skin in skins:
                joints = skin.get("joints", [])
                metrics["skins"].append({
                    "name": skin.get("name", "Armature"),
                    "joint_count": len(joints)
                })
                metrics["joint_count"] += len(joints)

        return metrics

    @staticmethod
    def parse_obj(file_path: str) -> Dict[str, Any]:
        """Parses Wavefront OBJ file and companion MTL file."""
        metrics = {
            "format": "obj",
            "vertex_count": 0,
            "face_count": 0,
            "mesh_count": 1,
            "node_count": 1,
            "material_count": 0,
            "materials": [],
            "bounding_box": {"min": [0.0, 0.0, 0.0], "max": [0.0, 0.0, 0.0]},
            "dimensions": {"width": 0.0, "height": 0.0, "depth": 0.0},
            "center": [0.0, 0.0, 0.0],
            "bounding_sphere_radius": 0.0,
            "animations": [],
            "skins": [],
            "joint_count": 0
        }

        min_b = [float("inf"), float("inf"), float("inf")]
        max_b = [float("-inf"), float("-inf"), float("-inf")]
        verts = 0
        faces = 0
        mtl_files = []
        used_materials = set()

        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                tokens = line.split()
                if tokens[0] == "v" and len(tokens) >= 4:
                    verts += 1
                    try:
                        x, y, z = float(tokens[1]), float(tokens[2]), float(tokens[3])
                        min_b[0] = min(min_b[0], x)
                        min_b[1] = min(min_b[1], y)
                        min_b[2] = min(min_b[2], z)
                        max_b[0] = max(max_b[0], x)
                        max_b[1] = max(max_b[1], y)
                        max_b[2] = max(max_b[2], z)
                    except ValueError:
                        pass
                elif tokens[0] == "f":
                    faces += 1
                elif tokens[0] == "mtllib" and len(tokens) > 1:
                    mtl_files.append(tokens[1])
                elif tokens[0] == "usemtl" and len(tokens) > 1:
                    used_materials.add(tokens[1])

        metrics["vertex_count"] = verts
        metrics["face_count"] = faces

        if min_b[0] != float("inf"):
            metrics["bounding_box"]["min"] = [round(x, 4) for x in min_b]
            metrics["bounding_box"]["max"] = [round(x, 4) for x in max_b]
            dim_x = max_b[0] - min_b[0]
            dim_y = max_b[1] - min_b[1]
            dim_z = max_b[2] - min_b[2]
            metrics["dimensions"] = {
                "width": round(dim_x, 4),
                "height": round(dim_y, 4),
                "depth": round(dim_z, 4)
            }
            center = [
                round((min_b[0] + max_b[0]) / 2.0, 4),
                round((min_b[1] + max_b[1]) / 2.0, 4),
                round((min_b[2] + max_b[2]) / 2.0, 4)
            ]
            metrics["center"] = center
            radius = math.sqrt(dim_x**2 + dim_y**2 + dim_z**2) / 2.0
            metrics["bounding_sphere_radius"] = round(radius, 4)

        # Parse MTL files if present
        base_dir = os.path.dirname(file_path)
        for mtl_file in mtl_files:
            mtl_path = os.path.join(base_dir, mtl_file)
            if os.path.exists(mtl_path):
                current_mat = {}
                with open(mtl_path, "r", encoding="utf-8", errors="ignore") as mf:
                    for mline in mf:
                        mline = mline.strip()
                        if not mline or mline.startswith("#"):
                            continue
                        mtok = mline.split()
                        if mtok[0] == "newmtl" and len(mtok) > 1:
                            if current_mat:
                                metrics["materials"].append(current_mat)
                            current_mat = {"name": mtok[1]}
                        elif mtok[0] == "Kd" and len(mtok) >= 4:
                            current_mat["diffuse"] = [float(mtok[1]), float(mtok[2]), float(mtok[3])]
                        elif mtok[0] == "Ks" and len(mtok) >= 4:
                            current_mat["specular"] = [float(mtok[1]), float(mtok[2]), float(mtok[3])]
                        elif mtok[0] == "Ke" and len(mtok) >= 4:
                            current_mat["emissive"] = [float(mtok[1]), float(mtok[2]), float(mtok[3])]
                        elif mtok[0] == "Ns" and len(mtok) >= 2:
                            current_mat["shininess"] = float(mtok[1])
                if current_mat:
                    metrics["materials"].append(current_mat)

        metrics["material_count"] = len(metrics["materials"]) or len(used_materials)
        return metrics

# -------------------------------------------------------------
# Three.js Procedural Code & Training Pair Synthesizer
# -------------------------------------------------------------

class DatasetSynthesizer:
    @staticmethod
    def generate_threejs_procedural_code(asset_name: str, category: str, metrics: Dict[str, Any]) -> str:
        """Generates realistic, modular, and optimized Three.js code corresponding to the asset."""
        w = metrics["dimensions"]["width"] or 1.0
        h = metrics["dimensions"]["height"] or 1.0
        d = metrics["dimensions"]["depth"] or 1.0
        c_x, c_y, c_z = metrics["center"]
        anims = metrics.get("animations", [])
        has_anims = len(anims) > 0
        joint_count = metrics.get("joint_count", 0)

        func_name = f"create{asset_name.replace('_', '').replace(' ', '')}"
        
        code = f"""import * as THREE from 'three';

/**
 * Procedurally constructs {asset_name} ({category.upper()})
 * Bounding Box: [{w:.2f}, {h:.2f}, {d:.2f}] | Estimated Vertices: {metrics['vertex_count']}
 */
export function {func_name}(options = {{}}) {{
  const {{
    scale = 1.0,
    wireframe = false,
    emissiveIntensity = 1.5,
    castShadow = true,
    receiveShadow = true
  }} = options;

  const rootGroup = new THREE.Group();
  rootGroup.name = "{asset_name}_Root";

  // Common PBR Materials tailored for {category}
  const primaryMat = new THREE.MeshStandardMaterial({{
    color: options.primaryColor || 0x2a3342,
    roughness: 0.35,
    metalness: 0.85,
    wireframe
  }});

  const accentMat = new THREE.MeshStandardMaterial({{
    color: options.accentColor || 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: emissiveIntensity,
    roughness: 0.2,
    metalness: 0.9,
    wireframe
  }});

  const detailMat = new THREE.MeshStandardMaterial({{
    color: 0x111317,
    roughness: 0.6,
    metalness: 0.4,
    wireframe
  }});

  // Primary geometric structure
  const mainGeo = new THREE.BoxGeometry({w * 0.8:.3f}, {h * 0.8:.3f}, {d * 0.8:.3f});
  const mainMesh = new THREE.Mesh(mainGeo, primaryMat);
  mainMesh.position.set({c_x:.3f}, {c_y:.3f}, {c_z:.3f});
  mainMesh.castShadow = castShadow;
  mainMesh.receiveShadow = receiveShadow;
  rootGroup.add(mainMesh);

  // Accent & functional sub-elements
  const coreGeo = new THREE.CylinderGeometry({(w+d)*0.1:.3f}, {(w+d)*0.12:.3f}, {h * 0.9:.3f}, 16);
  const coreMesh = new THREE.Mesh(coreGeo, accentMat);
  coreMesh.position.set({c_x:.3f}, {c_y:.3f}, {c_z:.3f});
  rootGroup.add(coreMesh);

  // Outer framing details
  const frameGeo = new THREE.TorusGeometry({max(w, d)*0.4:.3f}, 0.05, 8, 24);
  const frameMesh = new THREE.Mesh(frameGeo, detailMat);
  frameMesh.rotation.x = Math.PI / 2;
  frameMesh.position.set({c_x:.3f}, {c_y + h*0.2:.3f}, {c_z:.3f});
  rootGroup.add(frameMesh);
"""
        if has_anims or joint_count > 0:
            code += f"""
  // Animation / Kinematics setup
  const mixer = new THREE.AnimationMixer(rootGroup);
  const trackTimes = [0, 1.0, 2.0];
  const rotValues = [0, 0, 0, 1,  0, 0.707, 0, 0.707,  0, 1, 0, 0];
  const rotTrack = new THREE.QuaternionKeyframeTrack('.quaternion', trackTimes, rotValues);
  const clip = new THREE.AnimationClip('{anims[0]["name"] if anims else "IdleAction"}', 2.0, [rotTrack]);
  const action = mixer.clipAction(clip);
  action.play();

  rootGroup.userData = {{
    mixer,
    update: (delta) => mixer.update(delta),
    dimensions: new THREE.Vector3({w:.3f}, {h:.3f}, {d:.3f}),
    center: new THREE.Vector3({c_x:.3f}, {c_y:.3f}, {c_z:.3f})
  }};
"""
        else:
            code += f"""
  rootGroup.userData = {{
    dimensions: new THREE.Vector3({w:.3f}, {h:.3f}, {d:.3f}),
    center: new THREE.Vector3({c_x:.3f}, {c_y:.3f}, {c_z:.3f}),
    update: (delta) => {{
      // Micro idle rotation animation
      coreMesh.rotation.y += delta * 0.5;
    }}
  }};
"""
        code += f"""
  rootGroup.scale.setScalar(scale);
  return rootGroup;
}}
"""
        return code.strip()

    @staticmethod
    def generate_training_prompts(asset_name: str, category: str, metrics: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generates multiple training sample pairs for fine-tuning LLMs."""
        samples = []
        clean_name = asset_name.replace("_", " ").replace(".glb", "").replace(".obj", "")
        code = DatasetSynthesizer.generate_threejs_procedural_code(clean_name, category, metrics)
        dim_str = f"{metrics['dimensions']['width']}m x {metrics['dimensions']['height']}m x {metrics['dimensions']['depth']}m"

        # Variation 1: Procedural code generation from specification
        p1_user = (
            f"Write a modular Three.js (r128+) JavaScript function `create{clean_name.replace(' ', '')}(options)` "
            f"that procedurally constructs a 3D {clean_name} under the '{category}' category. "
            f"Expected bounding dimensions: ~{dim_str}, with PBR materials, neon emissive accents, "
            f"shadow flags, and an update method on `userData`."
        )
        samples.append({
            "instruction": p1_user,
            "input": f"Category: {category}\nAsset: {clean_name}\nDimensions: {dim_str}\nTarget format: Three.js ESM",
            "output": f"```javascript\n{code}\n```",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT_HERMES},
                {"role": "user", "content": p1_user},
                {"role": "assistant", "content": f"Here is the complete Three.js procedural generator for `{clean_name}`:\n\n```javascript\n{code}\n```"}
            ]
        })

        # Variation 2: Component architecture & scene graph hierarchy
        p2_user = (
            f"How do I architect a clean Three.js component for a {category} asset like '{clean_name}' "
            f"that supports procedural scaling, shadow handling, and runtime animations?"
        )
        p2_assistant = (
            f"To architect a modular Three.js component for **{clean_name}**, implement a factory function "
            f"returning a configured `THREE.Group` with hierarchical mesh parts, standard PBR materials, "
            f"and an animation update cycle registered in `userData`:\n\n```javascript\n{code}\n```\n\n"
            f"### Key Architectural Features:\n"
            f"1. **Hierarchical Composition**: Uses `THREE.Group` as the root node to preserve transform isolation.\n"
            f"2. **PBR Material System**: Employs `MeshStandardMaterial` for realistic metalness ({round(0.85,2)}) and roughness.\n"
            f"3. **Lifecycle API**: Exposes `rootGroup.userData.update(delta)` for seamless integration into the render loop."
        )
        samples.append({
            "instruction": p2_user,
            "input": f"Asset: {clean_name}\nCategory: {category}",
            "output": p2_assistant,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT_HERMES},
                {"role": "user", "content": p2_user},
                {"role": "assistant", "content": p2_assistant}
            ]
        })

        # Variation 3: Bounding box calculation and collider initialization
        p3_user = (
            f"Given a 3D {category} model '{clean_name}' with bounding dimensions {dim_str} and center {metrics['center']}, "
            f"show how to construct a procedural Three.js mesh with an accurate OBB / AABB bounding box."
        )
        p3_assistant = (
            f"```javascript\n"
            f"import * as THREE from 'three';\n\n"
            f"export function get{clean_name.replace(' ', '')}Bounds() {{\n"
            f"  const min = new THREE.Vector3({metrics['bounding_box']['min'][0]}, {metrics['bounding_box']['min'][1]}, {metrics['bounding_box']['min'][2]});\n"
            f"  const max = new THREE.Vector3({metrics['bounding_box']['max'][0]}, {metrics['bounding_box']['max'][1]}, {metrics['bounding_box']['max'][2]});\n"
            f"  const box = new THREE.Box3(min, max);\n"
            f"  const size = new THREE.Vector3();\n"
            f"  box.getSize(size);\n"
            f"  const center = new THREE.Vector3();\n"
            f"  box.getCenter(center);\n"
            f"  return {{ box, size, center, sphereRadius: {metrics['bounding_sphere_radius']} }};\n"
            f"}}\n```"
        )
        samples.append({
            "instruction": p3_user,
            "input": f"Asset: {clean_name}\nBounding Min: {metrics['bounding_box']['min']}\nBounding Max: {metrics['bounding_box']['max']}",
            "output": p3_assistant,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT_HERMES},
                {"role": "user", "content": p3_user},
                {"role": "assistant", "content": p3_assistant}
            ]
        })

        return samples

# -------------------------------------------------------------
# Main Compiler Orchestrator
# -------------------------------------------------------------

def compile_3d_ai_dataset(models_dir: str, output_dir: str, verbose: bool = True) -> Dict[str, Any]:
    os.makedirs(output_dir, exist_ok=True)
    models_path = Path(models_dir)

    print(f"[*] Scanning 3D assets in: {models_dir}")
    all_models = []
    supported_exts = {".glb", ".gltf", ".obj"}

    for root, _, files in os.walk(models_dir):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in supported_exts:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, models_dir)
                category = Path(rel_path).parts[0] if len(Path(rel_path).parts) > 1 else "misc"
                all_models.append((full_path, rel_path, category, f, ext))

    print(f"[*] Found {len(all_models)} 3D models across categories.")

    catalog_entries = []
    chatml_dataset = []
    instruction_dataset = []
    category_counts = {}
    total_vertices = 0
    total_animations = 0
    total_joints = 0

    for full_path, rel_path, category, filename, ext in sorted(all_models, key=lambda x: x[1]):
        asset_base_name = os.path.splitext(filename)[0]
        if ext == ".glb":
            metrics = ModelParser.parse_glb(full_path)
        elif ext == ".obj":
            metrics = ModelParser.parse_obj(full_path)
        else:
            metrics = ModelParser.parse_glb(full_path)

        category_counts[category] = category_counts.get(category, 0) + 1
        total_vertices += metrics.get("vertex_count", 0)
        total_animations += len(metrics.get("animations", []))
        total_joints += metrics.get("joint_count", 0)

        entry = {
            "asset_id": f"{category}_{asset_base_name}".lower(),
            "name": asset_base_name,
            "category": category,
            "relative_path": rel_path,
            "file_size_bytes": os.path.getsize(full_path),
            "metrics": metrics
        }
        catalog_entries.append(entry)

        # Generate prompt pairs
        training_samples = DatasetSynthesizer.generate_training_prompts(asset_base_name, category, metrics)
        for s in training_samples:
            instruction_dataset.append({
                "instruction": s["instruction"],
                "input": s["input"],
                "output": s["output"]
            })
            chatml_dataset.append({
                "messages": s["messages"]
            })

        if verbose:
            print(f"  [+] Parsed [{category.upper():<12}] {filename:<28} | Verts: {metrics['vertex_count']:<7} | Anims: {len(metrics['animations']):<2} | Joints: {metrics['joint_count']}")

    # Save output files
    manifest_path = os.path.join(output_dir, "dataset_manifest.json")
    chatml_path = os.path.join(output_dir, "threejs_procedural_train.jsonl")
    instruction_path = os.path.join(output_dir, "threejs_instruction_tuning.jsonl")

    summary_stats = {
        "total_models": len(all_models),
        "total_vertices": total_vertices,
        "total_animations": total_animations,
        "total_joints": total_joints,
        "total_training_samples": len(chatml_dataset),
        "category_breakdown": category_counts,
        "supported_formats": ["glb", "obj", "gltf"],
        "target_models": ["Hermes 3", "Qwen 2.5 Coder"]
    }

    manifest_data = {
        "compiler_version": "1.0.0",
        "dataset_name": "Nexus 3D Studio Procedural Three.js Dataset",
        "statistics": summary_stats,
        "assets": catalog_entries
    }

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, indent=2)

    with open(chatml_path, "w", encoding="utf-8") as f:
        for item in chatml_dataset:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    with open(instruction_path, "w", encoding="utf-8") as f:
        for item in instruction_dataset:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    print("\n=======================================================")
    print(" 3D AI DATASET COMPILATION COMPLETE")
    print("=======================================================")
    print(f" Total 3D Models Processed : {len(all_models)}")
    print(f" Category Breakdown        : {json.dumps(category_counts)}")
    print(f" Total Vertex Count        : {total_vertices:,}")
    print(f" Total Animation Tracks    : {total_animations}")
    print(f" Total Rigged Joints       : {total_joints}")
    print(f" Training Samples (JSONL)  : {len(chatml_dataset)}")
    print(f" Manifest Path             : {manifest_path}")
    print(f" ChatML Dataset (Qwen/Hermes): {chatml_path}")
    print(f" Instruction Dataset       : {instruction_path}")
    print("=======================================================\n")

    return summary_stats

def main():
    parser = argparse.ArgumentParser(description="Nexus 3D Studio - 3D AI Training Dataset Compiler")
    parser.add_argument("--models-dir", default=DEFAULT_MODELS_DIR, help="Path to models directory")
    parser.add_argument("--output-dir", default=DEFAULT_OUTPUT_DIR, help="Path to output dataset directory")
    parser.add_argument("--quiet", action="store_true", help="Suppress verbose output")

    args = parser.parse_args()
    compile_3d_ai_dataset(args.models_dir, args.output_dir, verbose=not args.quiet)

if __name__ == "__main__":
    main()
