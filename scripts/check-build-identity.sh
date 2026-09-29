#!/usr/bin/env bash
# Verifies the live site is serving the build that origin/main says it should.
# Usage: check-build-identity.sh <site-base-url> [repo-url]
# Exit 0 = /health, the page meta tag and origin/main all agree.
# Exit 1 = a signal is missing or disagrees for longer than the deploy window.
set -euo pipefail

BASE="${1%/}"
REPO="${2:-https://github.com/davidrydberg/davidrydberg.dev}"
WINDOW_SECONDS="${WINDOW_SECONDS:-360}"
SLEEP_SECONDS="${SLEEP_SECONDS:-30}"
CURL=(curl -fsSL --max-time 15 --retry 2 --retry-delay 3)

deadline=$((SECONDS + WINDOW_SECONDS))
while true; do
  reason=""
  health="$("${CURL[@]}" "$BASE/health" || true)"
  live="$(printf '%s' "$health" | sed -n 's/.*"commit": *"\([0-9a-f]\{7,40\}\)".*/\1/p' | head -n1)"
  status="$(printf '%s' "$health" | sed -n 's/.*"status": *"\([a-z]*\)".*/\1/p' | head -n1)"
  meta="$("${CURL[@]}" "$BASE/" | grep -o '<meta name="build-commit" content="[^"]*"' | sed 's/.*content="//; s/"$//' || true)"
  want="$(git ls-remote "$REPO" refs/heads/main | cut -c1-7)"

  if [ "$status" != "ok" ]; then reason="/health missing or status != ok (got: '${health:0:120}')"
  elif [ -z "$live" ]; then reason="/health has no commit"
  elif [ -z "$want" ]; then reason="could not resolve origin/main"
  elif [ "$meta" != "$live" ]; then reason="page meta build-commit '$meta' != /health commit '$live'"
  elif [ "$live" != "$want" ]; then reason="live commit '$live' != origin/main '$want'"
  fi

  if [ -z "$reason" ]; then
    echo "OK: /health commit=$live, page meta=$meta, origin/main=$want"
    exit 0
  fi
  echo "MISMATCH: $reason"
  if [ "$SECONDS" -ge "$deadline" ]; then
    echo "FAIL: still mismatched after ${WINDOW_SECONDS}s (longer than a normal deploy)"
    exit 1
  fi
  sleep "$SLEEP_SECONDS"
done
