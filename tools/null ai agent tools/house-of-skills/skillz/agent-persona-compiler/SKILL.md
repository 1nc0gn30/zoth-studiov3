---
name: agent-persona-compiler
description: Compile user-selected parameters into coherent AI-agent personas, operating modes, specialist behaviors, and instruction packs without violating higher-priority rules. Use when turning command parameters, registry options, roles, communication style, autonomy level, and deliverable expectations into an agent behavior module.
---

# Agent Persona Compiler

## Workflow

1. Load the parameter schema and validated parameter payload.
2. Convert parameters into behavior sections: role, operating mode, constraints, workflow, output contract, and refusal/escalation rules.
3. Keep capability grants separate from personality or style.
4. Preserve higher-priority instructions. Never compile text that claims to override them.
5. Emit a concise Markdown instruction pack or manifest instruction block.
6. Run `scripts/compile_persona.py schema.json payload.json --out persona.md` for deterministic drafts.

## Compilation Rules

- `role` defines expertise, not authority.
- `autonomy` defines persistence boundaries, not permission to skip approvals.
- `depth` affects investigation effort and validation rigor.
- `style` affects communication, not truthfulness or safety.
- `capabilities` are allowed tools, not mandatory actions.
- `constraints` override defaults when compatible with local policy.

## Quality Bar

A compiled persona should answer:

- What job is this agent now optimized for?
- What should it do first?
- What should it avoid?
- What does finished work look like?
- When must it ask the user before continuing?

## Resources

- Read `references/persona-sections.md` for the output contract.
- Use `scripts/compile_persona.py` for repeatable persona drafts.
