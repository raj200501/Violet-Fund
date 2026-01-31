#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
USERCONFIG="$ROOT_DIR/.npmrc"

export NPM_CONFIG_USERCONFIG="$USERCONFIG"

if [[ ! -f "$USERCONFIG" ]]; then
  echo "Missing .npmrc at $USERCONFIG" >&2
  exit 1
fi

install_flags=(--frozen-lockfile)

attempt_install() {
  local registry="$1"
  local log_file="$2"

  if [[ -n "$registry" ]]; then
    export npm_config_registry="$registry"
    echo "Attempting pnpm install with registry: $registry"
  else
    unset npm_config_registry
    echo "Attempting pnpm install with registry from $NPM_CONFIG_USERCONFIG"
  fi

  pnpm install "${install_flags[@]}" 2>&1 | tee "$log_file"
}

log_file=$(mktemp)

if attempt_install "" "$log_file"; then
  echo "pnpm install succeeded with default registry."
  rm -f "$log_file"
  exit 0
fi

if grep -E -n "ERR_PNPM_NO_LOCKFILE" "$log_file" >/dev/null 2>&1; then
  echo "pnpm-lock.yaml missing, retrying without frozen lockfile."
  install_flags=(--no-frozen-lockfile)
  log_file=$(mktemp)
  if attempt_install "" "$log_file"; then
    echo "pnpm install succeeded without frozen lockfile."
    rm -f "$log_file"
    exit 0
  fi
fi

if ! grep -E -n "ERR_PNPM_FETCH_403|\\b403\\b" "$log_file" >/dev/null 2>&1; then
  echo "pnpm install failed without 403 registry errors."
  rm -f "$log_file"
  exit 1
fi

fallback_registries=(
  "https://registry.npmmirror.com/"
  "https://registry.yarnpkg.com/"
)

for registry in "${fallback_registries[@]}"; do
  log_file=$(mktemp)
  if attempt_install "$registry" "$log_file"; then
    echo "pnpm install succeeded with fallback registry: $registry"
    rm -f "$log_file"
    exit 0
  fi

  if grep -E -n "ERR_PNPM_NO_LOCKFILE" "$log_file" >/dev/null 2>&1; then
    echo "pnpm-lock.yaml missing, retrying without frozen lockfile on fallback registry: $registry"
    install_flags=(--no-frozen-lockfile)
    log_file=$(mktemp)
    if attempt_install "$registry" "$log_file"; then
      echo "pnpm install succeeded with fallback registry: $registry"
      rm -f "$log_file"
      exit 0
    fi
  fi

  if ! grep -E -n "ERR_PNPM_FETCH_403|\\b403\\b" "$log_file" >/dev/null 2>&1; then
    echo "pnpm install failed for reasons other than 403; stopping retries."
    rm -f "$log_file"
    exit 1
  fi
  rm -f "$log_file"
done

echo "pnpm install failed on all registries." >&2
exit 1
