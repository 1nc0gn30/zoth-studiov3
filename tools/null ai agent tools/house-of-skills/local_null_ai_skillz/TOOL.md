# skillz

## Purpose

Composable skill definitions for agent task execution and workflow chaining.

## Agent Contract

- **ID**: `local_null_ai_skillz`
- **Category**: Agent Skills
- **Runtimes**: python
- **Path**: `house-of-skills/local_null_ai_skillz`

## Entrypoints

- `agent-fetch-client/scripts/fetch_pack.py`
- `agent-manifest-designer/scripts/validate_agent_manifest.py`
- `agent-pack-abuse-response/scripts/classify_report.py`
- `agent-pack-analytics/scripts/summarize_events.py`
- `agent-pack-docs-generator/scripts/manifest_to_markdown.py`
- `agent-pack-evals/scripts/score_eval.py`
- `agent-pack-governance/scripts/governance_check.py`
- `agent-pack-local-cache/scripts/cache_put.py`
- `agent-pack-migrations/scripts/migrate_manifest.py`
- `agent-pack-observability/scripts/validate_event.py`
- `agent-pack-policy-linter/scripts/lint_pack.py`
- `agent-pack-search-seo/scripts/build_search_index.py`
- `agent-pack-signer/scripts/checksum_tree.py`
- `agent-pack-template-factory/scripts/new_pack.py`
- `agent-permission-modeler/scripts/model_permissions.py`
- `agent-persona-compiler/scripts/compile_persona.py`
- `agent-runtime-adapter/scripts/adapt_manifest.py`
- `command-parameterizer/scripts/validate_params.py`
- `hosted-agent-registry/scripts/build_registry.py`
- `hosted-pack-publisher/scripts/package_pack.py`
- `remote-skill-security/scripts/static_skill_audit.py`
- `skill-compatibility-harness/scripts/run_harness.py`

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
