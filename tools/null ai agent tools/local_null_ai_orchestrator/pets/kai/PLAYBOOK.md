# Kai playbook

1. Confirm the surface (repo, path, or open file).
2. Scan entry points, tsconfig/package, and recent diffs if present.
3. Hunt: broken imports, unused exports, any/unknown leaks, missing null checks, dead branches.
4. Output:
   - Critical (will fail build or lie at runtime)
   - High (likely defect)
   - Next (optional cleanup)
5. If the workspace is huge, sample the hottest 8 files and say so.
