#!/usr/bin/env python3
"""Generate a design catalog from the AstroPlanet theme + component system.

Produces a markdown reference that agents can query to understand
available design resources across all tools in the framework.

Usage:
  python3 scripts/generate-design-catalog.py
  python3 scripts/generate-design-catalog.py --format json
"""

import json
import os
import sys
from pathlib import Path

ASTRO_TOOL = Path("website generators/astroplanet-with-codex/local_null_ai_astro-for-ai")

THEME_KEYS_DOC = """
| Token | Light Example | Dark Example | Description |
|-------|--------------|--------------|-------------|
| `bg` | `#f5fbf7` | `#0d1b16` | Page background |
| `text` | `#10281d` | `#d9f2e7` | Body text color |
| `accent` | `#2b9c6b` | `#43c588` | Primary accent / CTAs |
| `surface` | `#e8f5ee` | `#122620` | Card/surface backgrounds |
| `surfaceElevated` | `#ddf0e5` | `#183129` | Elevated surfaces (modals) |
| `border` | `#98d0b2` | `#2f6650` | Border and divider colors |
| `textMuted` | `#365546` | `#9acdb3` | Secondary/muted text |
| `textInverse` | `#ffffff` | `#070f0c` | Text on accent backgrounds |
| `accentContrast` | `#0d3b27` | `#07331f` | Text on accent (readability) |
| `font` | Manrope | Manrope | Primary font family |
| `fontBody` | Manrope | Manrope | Body text font |
| `fontDisplay` | Fraunces | Fraunces | Heading/display font |
"""


def collect_themes(base: Path) -> list[dict]:
    """Read all theme JSON files from a tool's themes directory."""
    themes_dir = base / "src" / "configs" / "themes"
    if not themes_dir.exists():
        return []
    
    themes = []
    for f in sorted(themes_dir.glob("*.json")):
        try:
            data = json.loads(f.read_text())
            name = f.stem
            themes.append({
                "name": name,
                "file": str(f.relative_to(base.parent.parent)),
                "mode": data.get("mode", "system"),
                "active_theme": data.get("activeTheme", "light"),
                "fonts": list(set(
                    [data.get("themes", {}).get("light", {}).get("font", ""),
                     data.get("themes", {}).get("dark", {}).get("font", "")]
                )),
                "has_light": "light" in data.get("themes", {}),
                "has_dark": "dark" in data.get("themes", {}),
                "light_preview": {k: data["themes"]["light"].get(k, "") 
                                  for k in ["bg", "text", "accent", "surface"] 
                                  if "light" in data.get("themes", {})},
            })
        except (json.JSONDecodeError, KeyError) as e:
            print(f"  ⚠ Error reading {f.name}: {e}", file=sys.stderr)
    
    return themes


def collect_components(base: Path) -> list[dict]:
    """Scan component files and extract props/documentation."""
    components_dir = base / "src" / "components"
    if not components_dir.exists():
        return []
    
    components = []
    for f in sorted(components_dir.rglob("*.astro")):
        rel = f.relative_to(base)
        text = f.read_text()
        
        # Extract component name from filename
        name = f.stem
        
        # Determine category from directory structure
        category = str(f.parent.relative_to(components_dir)) if f.parent != components_dir else "Core"
        
        # Look for interface/props definition
        props = []
        in_interface = False
        for line in text.split("\n"):
            if "interface" in line and "{" in line:
                in_interface = True
                continue
            if in_interface:
                if "}" in line:
                    break
                stripped = line.strip()
                if stripped and not stripped.startswith("//") and not stripped.startswith("/*"):
                    # Extract prop name and type
                    if ":" in stripped and not stripped.startswith("import"):
                        parts = stripped.split(":", 1)
                        pname = parts[0].strip().split("?")[0].strip()
                        ptype = parts[1].strip().rstrip(",").rstrip(";")
                        props.append({"name": pname, "type": ptype})
        
        # Count variants from cvariant references
        variants = []
        for line in text.split("\n"):
            if "cvariant" in line and "=" in line and not line.strip().startswith("//"):
                v = line.split("=")[1].strip().strip('"').strip("'")
                if v and v not in variants:
                    variants.append(v)
        
        components.append({
            "name": name,
            "path": str(rel),
            "category": category,
            "has_props": len(props) > 0,
            "props": props[:15],  # limit to 15 to keep output manageable
            "variants": variants[:5],
            "lines": len(text.split("\n")),
        })
    
    return components


def generate_markdown(themes: list[dict], components: list[dict]) -> str:
    """Generate the full design catalog markdown."""
    
    lines = [
        "# Design Catalog — AstroPlanet Framework",
        "",
        f"Generated from {len(themes)} themes × {len(components)} components",
        "",
        "---",
        "",
        "## Theme System",
        "",
        f"**{len(themes)} themes** available, each with light + dark mode.",
        "Themes define colors, fonts, and surfaces for the entire design system.",
        "",
        "### Theme Token Reference",
        "",
        "Each theme JSON provides these tokens:",
        THEME_KEYS_DOC.strip(),
        "",
        "### Available Themes",
        "",
        "| # | Theme | Mode | Light BG | Light Text | Accent | Surface |",
        "|---|-------|------|----------|------------|--------|---------|",
    ]
    
    for i, t in enumerate(themes, 1):
        lp = t.get("light_preview", {})
        mode_icon = "☀️+🌙" if t.get("has_light") and t.get("has_dark") else ("☀️" if t.get("has_light") else "🌙")
        lines.append(
            f"| {i} | `{t['name']}` | {mode_icon} | "
            f"`{lp.get('bg','')}` | `{lp.get('text','')}` | "
            f"`{lp.get('accent','')}` | `{lp.get('surface','')}` |"
        )
    
    lines += [
        "",
        "### Fonts Used",
        "",
    ]
    
    all_fonts = set()
    for t in themes:
        for f in t.get("fonts", []):
            if f:
                all_fonts.add(f)
    for f in sorted(all_fonts):
        lines.append(f"- `{f}`")
    
    lines += [
        "",
        "---",
        "",
        "## Component Library",
        "",
        f"**{len(components)} components** organized by category.",
        "",
        "### Components by Category",
        "",
    ]
    
    # Group by category
    by_cat: dict[str, list[dict]] = {}
    for c in components:
        cat = c["category"]
        if cat not in by_cat:
            by_cat[cat] = []
        by_cat[cat].append(c)
    
    for cat, comps in sorted(by_cat.items()):
        lines.append(f"#### {cat} ({len(comps)} components)\n")
        lines.append("| Component | File | Props | Variants | Lines |")
        lines.append("|-----------|------|-------|----------|-------|")
        for c in comps:
            props_str = ", ".join(p["name"] for p in c.get("props", [])[:5])
            if len(c.get("props", [])) > 5:
                props_str += " ..."
            variants_str = ", ".join(c.get("variants", [])) or "—"
            lines.append(
                f"| `{c['name']}` | `{c['path']}` | "
                f"{props_str or '—'} | {variants_str} | {c['lines']} |"
            )
        lines.append("")
    
    lines += [
        "---",
        "",
        "## Quick Reference for Agents",
        "",
        "When building a page with AstroPlanet:",
        "",
        "1. Choose a **theme** from the table above",
        "2. Set `themeVariant` in your page config to the theme name",
        "3. Compose **sections** using components from the library",
        "4. Each section can specify a `cvariant` for visual variation",
        "5. Set `seo` metadata (title, description, ogImage) in the page config",
        "",
        "### Page Config Structure",
        "",
        "```json",
        '{',
        '  "weight": 1,',
        '  "themeVariant": "forest-mist",',
        '  "seo": {',
        '    "title": "Page Title (<70 chars)",',
        '    "description": "Meta description (<160 chars)",',
        '    "ogImage": "/assets/og.png",',
        '    "keywords": ["keyword1", "keyword2"]',
        '  },',
        '  "sections": [',
        '    {',
        '      "type": "hero",',
        '      "id": "page-hero",',
        '      "cvariant": "default",',
        '      "heading": "Headline",',
        '      "subtext": "Supporting text",',
        '      "buttons": [...]',
        '    }',
        '  ]',
        '}',
        "```",
        "",
    ]
    
    return "\n".join(lines)


def generate_json(themes: list[dict], components: list[dict]) -> str:
    """Generate the catalog as JSON for programmatic use."""
    catalog = {
        "schema": "design-catalog/v1",
        "theme_count": len(themes),
        "component_count": len(components),
        "themes": themes,
        "components": components,
        "token_reference": {
            "description": "Each theme has light+dark mode with these tokens",
            "tokens": [
                "bg", "text", "accent", "surface", "surfaceElevated",
                "border", "textMuted", "textInverse", "accentContrast",
                "font", "fontBody", "fontDisplay"
            ]
        }
    }
    return json.dumps(catalog, indent=2)


def main():
    output_format = "markdown"
    if "--format" in sys.argv:
        idx = sys.argv.index("--format")
        if idx + 1 < len(sys.argv):
            output_format = sys.argv[idx + 1]
    
    # Resolve base directory
    known_path = Path("/home/neo/Desktop/NULL AI AGENT FRAMEWORK/tools/null ai agent tools/website generators/astroplanet-with-codex/local_null_ai_astro-for-ai")
    if known_path.exists():
        base = known_path
    else:
        # Try relative to cwd
        cwd = Path.cwd()
        for p in [cwd.parent, cwd, cwd.parent.parent]:
            candidate = p / "website generators/astroplanet-with-codex/local_null_ai_astro-for-ai"
            if candidate.exists():
                base = candidate
                break
        else:
            print("Tool path not found", file=sys.stderr)
            sys.exit(1)
    
    themes = collect_themes(base)
    components = collect_components(base)
    
    if output_format == "json":
        output = generate_json(themes, components)
    else:
        output = generate_markdown(themes, components)
    
    print(output)
    
    # Save to file
    output_dir = Path("reports")
    output_dir.mkdir(exist_ok=True)
    
    ext = "json" if output_format == "json" else "md"
    out_file = output_dir / f"design-catalog.{ext}"
    out_file.write_text(output)
    print(f"\nCatalog saved to {out_file}", file=sys.stderr)


if __name__ == "__main__":
    main()
