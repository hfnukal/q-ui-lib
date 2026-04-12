#!/usr/bin/env bash
# One-shot Claude Code: non-interactive print mode (-p). No TTY session.
# Run from repository root (cwd = project root so Claude sees the repo).
# Usage:
#   ./.cursor/claude-once.sh "Concrete task for the repo"
#   CLAUDE_TASK="Same as first arg" ./.cursor/claude-once.sh
#
# Exit codes:
#   0   success
#   125 rate limit — stderr includes wait_seconds; do not retry until elapsed
#   127 claude not on PATH
#   other: forwarded from claude
#
# Optional env:
#   CLAUDE_MAX_TURNS       (default: 25)
#   CLAUDE_MAX_BUDGET_USD  (e.g. 2.50; unset = no cap)
#   CLAUDE_OUTPUT_FORMAT   text | json | stream-json (default: text)
#   CLAUDE_APPEND_SYSTEM_PROMPT_FILE  path to extra rules (appended to default prompt)
#   CLAUDE_BARE=1          pass --bare for faster scripted startup
#   CLAUDE_RATE_LIMIT_FALLBACK_SECONDS  when limit is detected but time cannot be parsed (default: 60)

set -euo pipefail

EXIT_RATE_LIMIT=125
EXIT_NOT_FOUND=127
FALLBACK_WAIT="${CLAUDE_RATE_LIMIT_FALLBACK_SECONDS:-60}"

is_rate_limit_output() {
  local t="$1"
  grep -qiE 'rate[_ -]?limit|rate_limit_error' <<<"$t" && return 0
  grep -qE '(^|[^0-9])429([^0-9]|$)' <<<"$t" && return 0
  return 1
}

# Prints integer seconds to stdout, or nothing if unknown.
extract_wait_seconds() {
  local t="$1"
  local s

  # JSON: "retry_after": 45 or "retry_after": "45"
  if [[ "$t" =~ \"retry_after\"[[:space:]]*:[[:space:]]*\"?([0-9.]+) ]]; then
    s="${BASH_REMATCH[1]}"
    printf '%.0f\n' "$s"
    return 0
  fi

  # "Retry after 90s" (informal / one-line CLI text; space, not hyphen)
  if [[ "$t" =~ [Rr]etry[[:space:]]+[Aa]fter[[:space:]]+([0-9]+)[sS]?([^A-Za-z0-9.]|$) ]]; then
    echo "${BASH_REMATCH[1]}"
    return 0
  fi

  # Retry-After: 120 (header-style)
  if [[ "$t" =~ [Rr]etry-[Aa]fter[[:space:]]*:?[[:space:]]*([0-9]+) ]]; then
    echo "${BASH_REMATCH[1]}"
    return 0
  fi

  # "try again in 45 seconds" / Try again after 30s
  if [[ "$t" =~ [Tt]ry[[:space:]]+again[[:space:]]+in[[:space:]]+([0-9]+) ]]; then
    echo "${BASH_REMATCH[1]}"
    return 0
  fi
  if [[ "$t" =~ [Tt]ry[[:space:]]+again[[:space:]]+after[[:space:]]+([0-9]+) ]]; then
    echo "${BASH_REMATCH[1]}"
    return 0
  fi

  # wait N seconds / wait N more seconds
  if [[ "$t" =~ [Ww]ait[[:space:]]+([0-9]+)[[:space:]]+seconds? ]]; then
    echo "${BASH_REMATCH[1]}"
    return 0
  fi

  # ~Xm Ys style: "in 2m 15s" (optional)
  if [[ "$t" =~ [Ii]n[[:space:]]+([0-9]+)m[[:space:]]+([0-9]+)s ]]; then
    echo "$((${BASH_REMATCH[1]} * 60 + ${BASH_REMATCH[2]}))"
    return 0
  fi

  return 1
}

human_duration() {
  local sec="$1"
  local m=$((sec / 60))
  local s=$((sec % 60))
  printf '%dm %02ds' "$m" "$s"
}

if ! command -v claude >/dev/null 2>&1; then
  echo "claude: command not found. Install Claude Code CLI and ensure it is on PATH." >&2
  exit "$EXIT_NOT_FOUND"
fi

prompt="${CLAUDE_TASK:-$*}"
if [[ -z "${prompt// }" ]]; then
  echo "Usage: $0 <prompt>" >&2
  echo "   or: CLAUDE_TASK=\"...\" $0" >&2
  exit 1
fi

args=(
  -p
  --max-turns "${CLAUDE_MAX_TURNS:-25}"
  --output-format "${CLAUDE_OUTPUT_FORMAT:-text}"
)

if [[ -n "${CLAUDE_MAX_BUDGET_USD:-}" ]]; then
  args+=(--max-budget-usd "${CLAUDE_MAX_BUDGET_USD}")
fi

if [[ -n "${CLAUDE_APPEND_SYSTEM_PROMPT_FILE:-}" ]]; then
  args+=(--append-system-prompt-file "${CLAUDE_APPEND_SYSTEM_PROMPT_FILE}")
fi

if [[ "${CLAUDE_BARE:-0}" == "1" ]]; then
  args+=(--bare)
fi

args+=("${prompt}")

tmp=""
tmp="$(mktemp "${TMPDIR:-/tmp}/claude-once.XXXXXX")"
trap 'rm -f "$tmp"' EXIT

set +e
claude "${args[@]}" >"$tmp" 2>&1
code=$?
set -e

if [[ "$code" -eq 0 ]]; then
  cat "$tmp"
  exit 0
fi

body="$(cat "$tmp")"

if is_rate_limit_output "$body"; then
  wait_sec=""
  if ! wait_sec="$(extract_wait_seconds "$body")" || [[ -z "${wait_sec// }" ]]; then
    wait_sec="$FALLBACK_WAIT"
    wait_note=" (exact time not found in output; using fallback CLAUDE_RATE_LIMIT_FALLBACK_SECONDS=${FALLBACK_WAIT})"
  else
    wait_note=""
  fi

  {
    echo "claude-once: rate limit — do not run claude or this script again until the wait has elapsed.${wait_note}"
    echo "  wait_seconds: ${wait_sec}"
    echo "  human_readable: ~$(human_duration "$wait_sec")"
    echo "  machine: CLAUDE_ONCE_EXIT=rate_limit CLAUDE_ONCE_WAIT_SECONDS=${wait_sec}"
    echo "---"
    echo "$body"
  } >&2
  exit "$EXIT_RATE_LIMIT"
fi

echo "$body" >&2
exit "$code"
