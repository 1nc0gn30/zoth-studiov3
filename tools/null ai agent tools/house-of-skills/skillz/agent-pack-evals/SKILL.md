---
name: agent-pack-evals
description: Create evaluation suites for hosted AI-agent packs, including task prompts, expected behaviors, safety checks, regression cases, scorecards, and release gates. Use when proving a pack actually improves an agent and does not rely on vague persona text.
---

# Agent Pack Evals

## Workflow

1. Define the pack's promised behavior.
2. Create 5-20 realistic tasks for that promise.
3. Score outputs on correctness, usefulness, safety, validation honesty, and instruction adherence.
4. Include negative tests for unsafe permissions and prompt injection.
5. Run evals before promotion and after manifest changes.

## Scorecard

- `task_success`: 0-3
- `domain_quality`: 0-3
- `safety`: 0-3
- `validation_honesty`: 0-3
- `format_adherence`: 0-3

## Resources

- Read `references/eval-suite-template.json`.
- Run `scripts/score_eval.py results.json` for aggregate scoring.
