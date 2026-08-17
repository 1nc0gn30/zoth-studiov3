#!/usr/bin/env bash
# ==============================================================================
# ZOTH STUDIO — PII SCRUBBER (pre-release)
# Replaces personal-info tokens about Neal Frazier with neutral equivalents so
# release artifacts carry NO operator PII. Safe to run on tracked source; all
# edits are plain-text substitutions and reversible via git.
#
# Usage: ./scrub-pii.sh [--dry-run] [path...]
#   default path set: public/ tools/ (excludes node_modules/.git via grep -v)
# ==============================================================================
set -uo pipefail
DRY="${1:-}"
TARGETS=("${@:1}")
if [[ "$DRY" == "--dry-run" ]]; then DRY="--dry-run"; TARGETS=("${@:2}"); fi
if [[ ${#TARGETS[@]} -eq 0 ]]; then TARGETS=(public tools); fi

# Token -> replacement map (order matters; most specific first)
declare -A MAP=(
  ["NealFrazierTech"]="DemoAgentOrg"
  ["nealfrazier.tech"]="nullai.tech"
  ["Neal Frazier"]="Zoth Studio Team"
  ["NealFrazier"]="DemoAgent"
  ["nealfrazier"]="nullai"
  ["/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/13-creative-media/zoth"]="."
  ["/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908"]="."
  ["/media/neo"]="."
  ["/home/neo"]="~"
)

changed=0
for root in "${TARGETS[@]}"; do
  [[ -d "$root" ]] || continue
  # find candidate files (text), skip node_modules/.git
  while IFS= read -r f; do
    hit=0
    for key in "${!MAP[@]}"; do
      if grep -qF -- "$key" "$f" 2>/dev/null; then hit=1; break; fi
    done
    [[ "$hit" -eq 0 ]] && continue
    if [[ "$DRY" == "--dry-run" ]]; then
      echo "WOULD EDIT: $f"
      changed=$((changed+1))
    else
      for key in "${!MAP[@]}"; do
        # sed in-place, only matching lines
        if grep -qF -- "$key" "$f" 2>/dev/null; then
          sed -i "s#$(printf '%s' "$key" | sed 's/[][\.*^$/]/\\&/g')#${MAP[$key]}#g" "$f"
        fi
      done
      echo "EDITED: $f"
      changed=$((changed+1))
    fi
  done < <(grep -rln -F -- "Neal Frazier" "NealFrazierTech" "nealfrazier" "/media/neo" "/home/neo" "$root" 2>/dev/null | grep -v node_modules | grep -v '/.git/')
done

echo "PII scrubber: $changed file(s) ${DRY:+[dry-run]}"
