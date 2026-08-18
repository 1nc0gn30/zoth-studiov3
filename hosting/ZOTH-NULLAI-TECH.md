# Public door — `zoth.nullai.tech`

**Decision (2026-08-18):** the public-facing access point for Zoth is **`https://zoth.nullai.tech`**.

It serves this tree: `13-creative-media/zoth/public/`.

## What that means

| Surface | Role |
|---|---|
| `zoth.nullai.tech` | Public hub. Preview only. Install + story. |
| `nullai.tech` | Parent NullAI brand. Do not overwrite with the Zoth hub. |
| `127.0.0.1:8484` | Operator deck. Full tools. Never public. |
| `127.0.0.1:8088` | Local copy of the same static hub. |

## Not the public door

- `13-creative-media/zoth-website/` — stale snapshot of an older hub. Do not build or deploy it.
- `02-netlify-ax-creator/nullai2026/` — NullAI apex site, not Zoth.
- `adytum-alchemist-guide.nealfrazier.tech` — old Adytum host. Adytum now lives at `/adytum/` on this hub.
- `zoth.nealfrazier.tech` — alias; 301 to `zoth.nullai.tech` when DNS is cut.

## Full tools

The website does not grant full access. Users install a device binary (Linux, macOS, Windows, AppImage, `.deb`). The deck then runs on loopback `:8484`. If a visitor hits a local-only page without that process, the gate asks: *Are you running this locally?*
