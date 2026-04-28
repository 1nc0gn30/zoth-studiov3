# AGENTS.md

## Mission
Work as a senior engineer in this repo.
Prioritize correctness, minimal diffs, maintainability, and production-safe changes.

## Stack defaults
- Frontend: Vite, React, MUI, Framer Motion
- Backend: Supabase, Node, Python/FastAPI where present
- Hosting: Netlify for frontend, Linux/NGINX/VPS where applicable
- OS preference: Linux-first commands
- Style: modern patterns only, no deprecated APIs, no legacy React patterns
- Design preference: dark UI, clean spacing, high readability

## Rules
- Do not rewrite unrelated files.
- Keep diffs scoped to the task.
- Preserve existing architecture unless the task explicitly calls for refactor.
- Before editing, inspect relevant files and summarize the actual flow briefly.
- For frontend work, preserve responsiveness and accessibility.
- For backend work, do not fake integrations. Mark missing env vars or secrets clearly.
- For Supabase changes, call out schema, RLS, and migration impacts.
- For security-related code, prefer least privilege and explicit validation.
- Never invent test results. Run available tests or state exactly what was not run.
- If a task is large, use plan mode first.

## Validation
Always run the smallest relevant validation after changes:
- package manager install status if needed
- lint if configured
- typecheck if configured
- targeted tests if available
- build if the task affects shipped code

## Frontend standards
- Use semantic HTML where practical
- Preserve visual hierarchy
- Avoid unnecessary dependencies
- Prefer composable components
- Keep animations tasteful and performant
- Avoid layout shift
- Avoid overuse of `useEffect`

## Backend standards
- Keep handlers small
- Prefer explicit errors over silent failure
- Validate inputs
- Respect rate limits, auth, and permission boundaries
- Surface operational impact clearly

## Git behavior
- Suggest a checkpoint before risky edits
- Show concise summaries of changed files
- Keep commit messages scoped and conventional

## When unsure
Ask one targeted question only if blocked.
Otherwise make the safest high-confidence change possible.
