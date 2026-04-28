# Registry Contract

## Required Fields

- `schema_version`: Use `agent-registry/v1` for this skill pack.
- `name`: Human-readable registry name.
- `updated_at`: ISO 8601 UTC timestamp.
- `packs`: Array of published packs.

## Required Pack Fields

- `id`: Stable lowercase identifier.
- `name`: Human-readable label.
- `version`: Semantic version.
- `summary`: One-sentence function of the pack.
- `manifest_url`: HTTPS URL for the pack manifest.
- `checksum_sha256`: SHA-256 checksum of the manifest or release archive.
- `compatibility`: Runtime labels such as `codex-skill`, `openai-app`, `claude-project`, `generic-agent`.
- `tags`: Short searchable labels.

## Recommended HTTP Paths

- `/registry.json`: Current registry index.
- `/packs/<pack-id>/latest/manifest.json`: Mutable pointer to latest stable pack.
- `/packs/<pack-id>/<version>/manifest.json`: Immutable versioned manifest.
- `/packs/<pack-id>/<version>/pack.zip`: Optional archive.
- `/packs/<pack-id>/<version>/checksums.txt`: Optional checksums.
