---
name: command-parameterizer
description: Convert natural-language commands into safe, typed, bounded parameters for AI-agent transformations, hosted skill packs, persona modes, workflow presets, and command-driven agent behavior. Use when designing parameter schemas, CLI flags, allowed values, defaults, validation, or command-to-manifest mappings.
---

# Command Parameterizer

## Workflow

1. Extract the user's transformation intent as a small set of typed parameters.
2. Reject ambiguous or unsafe free-form authority. Use enums, bounded numbers, and explicit booleans.
3. Separate style parameters from capability permissions.
4. Define safe defaults and fail-closed validation.
5. Map each parameter to a visible behavior change.
6. Validate sample parameter payloads with `scripts/validate_params.py`.

## Parameter Design Rules

- Use `enum` for modes like `tone`, `depth`, `autonomy`, `risk_level`, and `output_format`.
- Use numeric `minimum` and `maximum` for budgets, counts, depths, and timeouts.
- Use `additionalProperties: false` for command surfaces.
- Require explicit user approval for high-impact capabilities: deploy, payment, delete, credentials, external writes, or network crawling.
- Do not let parameters override system, developer, legal, safety, or approval rules.

## Suggested Core Parameters

- `role`: The specialist identity to adopt.
- `depth`: `fast`, `balanced`, or `deep`.
- `autonomy`: `ask-first`, `bounded`, or `end-to-end`.
- `style`: Communication and output style.
- `capabilities`: Explicit allowed capabilities.
- `constraints`: User-provided hard limits.
- `deliverable`: Expected final artifact.

## Resources

- Read `references/parameter-schema-template.json` for a safe baseline.
- Run `scripts/validate_params.py schema.json payload.json` to check examples.
