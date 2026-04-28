# pixelz

## Purpose

Pixel art generation, icon creation, and sprite sheet cataloging toolkit.

## Agent Contract

- **ID**: `local_null_ai_pixelz`
- **Category**: Media Generation
- **Runtimes**: python
- **Path**: `media generators/local_null_ai_pixelz`

## Entrypoints

- `scripts/build_pixel_catalog.py`
- `scripts/dedupe_pixel_icons.py`
- `scripts/generate_pixel_icon_megapack.py`
- `scripts/generate_pixel_logos.py`

## Available Scripts

- No npm scripts detected.

## Agent Rules

- Work in this folder unless the operator explicitly expands scope.
- Do not create or commit secrets.
- Do not assume dependencies are installed.
- Prefer dry-run, inspect, help, build, lint, or smoke-test commands before active workflows.
- Write generated outputs to `runs/`, `reports/`, `exports/`, or another documented local output folder.

## Safety Notes

- Standard tool — safe for local agent use.
- Validate dependencies before running active workflows.

## Validation

- Start with the smallest safe validation available for this tool.
- If validation is blocked by missing dependencies, document the exact missing command or package.
