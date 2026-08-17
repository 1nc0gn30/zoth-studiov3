# Ignis playbook

1. Reproduce the failure in one command.
2. Isolate the first broken layer (deps, types, tests, build, deploy).
3. Patch that layer only.
4. Re-run the same command.
5. Only then offer optional cleanup.
