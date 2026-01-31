#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT_DIR"

export NPM_CONFIG_USERCONFIG="$ROOT_DIR/.npmrc"

pnpm --filter web exec playwright install --with-deps
pnpm --filter web build

pnpm --filter web start &
SERVER_PID=$!

echo "Waiting for app server to start..."
server_ready=false
for _ in {1..30}; do
  if curl -sSf "http://localhost:3000" >/dev/null 2>&1; then
    echo "App server is ready."
    server_ready=true
    break
  fi
  sleep 2
done

if [[ "$server_ready" != true ]]; then
  echo "App server failed to start." >&2
  kill "$SERVER_PID" || true
  exit 1
fi

pnpm --filter web screenshots
pnpm --filter web storybook:build

kill "$SERVER_PID"
wait "$SERVER_PID" 2>/dev/null || true
