#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT_DIR"

if git remote get-url origin >/dev/null 2>&1; then
  git fetch origin main --depth=1 >/dev/null 2>&1 || true
fi

base_ref=""
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  base_ref="origin/main"
elif git rev-parse --verify main >/dev/null 2>&1; then
  base_ref="main"
else
  base_ref=$(git rev-list --max-parents=0 HEAD | tail -n 1)
fi

paths=(
  "packages/ui"
  "apps/web/app"
  "apps/web/components"
  "apps/web/styles"
  "apps/web/storybook"
  "apps/web/tests"
  "docs/screenshots"
)

diff_output=$(git diff --numstat "$base_ref"...HEAD -- "${paths[@]}")

if [[ -z "$diff_output" ]]; then
  echo "No UI changes detected between $base_ref and HEAD."
  exit 1
fi

declare -A added_lines
 declare -A deleted_lines

net_total=0

while IFS=$'\t' read -r added deleted file_path; do
  if [[ "$added" == "-" || "$deleted" == "-" ]]; then
    continue
  fi

  if [[ "$file_path" =~ (pnpm-lock\.yaml|package-lock\.json|yarn\.lock) ]]; then
    continue
  fi

  if [[ "$file_path" =~ (node_modules|\.next|dist|build|coverage) ]]; then
    continue
  fi

  key=""
  for path_prefix in "${paths[@]}"; do
    if [[ "$file_path" == "$path_prefix"* ]]; then
      key="$path_prefix"
      break
    fi
  done

  if [[ -z "$key" ]]; then
    continue
  fi

  added_lines[$key]=$(( ${added_lines[$key]:-0} + added ))
  deleted_lines[$key]=$(( ${deleted_lines[$key]:-0} + deleted ))
  net_total=$(( net_total + added - deleted ))
done <<< "$diff_output"

printf "UI LOC changes vs %s:\n" "$base_ref"
for path_prefix in "${paths[@]}"; do
  added=${added_lines[$path_prefix]:-0}
  deleted=${deleted_lines[$path_prefix]:-0}
  net=$(( added - deleted ))
  printf -- "- %-24s +%s / -%s (net %s)\n" "$path_prefix" "$added" "$deleted" "$net"
done

printf "Total net UI LOC: %s\n" "$net_total"

if (( net_total < 7000 )); then
  echo "ERROR: Net new UI LOC must be at least 7000." >&2
  exit 1
fi
