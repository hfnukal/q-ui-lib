---
name: claude-code-headless
description: >-
  Runs Anthropic Claude Code CLI in non-interactive print mode (-p) for one-shot
  tasks, CI-style runs, and scripted workflows. Use when the user asks to run
  Claude Code from the terminal without TTY interaction, headless claude,
  claude -p, or .cursor/claude-once.sh.
---

# Claude Code (headless / print mode)

## When to use

- **One-shot tasks**: single prompt, stdout, process exits (no interactive session).
- **Automation**: wrappers, local batch jobs — not a substitute for the in-editor agent for tiny edits.

Prefer **interactive** `claude` when exploring ambiguous work; use **`-p` / print mode** when the task is explicit and should finish without prompts.

## Prerequisites

- `claude` on `PATH` (Claude Code CLI).
- Auth: `claude auth status` should succeed for the environment where you run.

## Preferred invocation (this repo)

From the repository root (current directory should be the project root):

```bash
./.cursor/claude-once.sh "Your concrete task in one message"
```

Or pass the task via environment:

```bash
CLAUDE_TASK="Refactor X to Y" ./.cursor/claude-once.sh
```

## Manual CLI (same semantics)

```bash
claude -p "Your concrete task"
```

Pipe context when useful:

```bash
cat KNOWN_ISSUES.md | claude -p "Summarize blockers only"
```

Official reference: [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-reference).

## Flags the agent may add (user-approved)

| Need | Example |
|------|---------|
| Faster scripted start | `--bare` (set `CLAUDE_BARE=1` for `claude-once.sh`) |
| Machine-readable output | `--output-format json` (`CLAUDE_OUTPUT_FORMAT=json`) |
| Cost / depth limits | `--max-budget-usd`, `--max-turns` (env `CLAUDE_MAX_TURNS`, `CLAUDE_MAX_BUDGET_USD`) |
| Project rules on top of defaults | `--append-system-prompt-file path/to/rules.md` |
| Permission mode | `--permission-mode acceptEdits` or stricter; avoid `--dangerously-skip-permissions` unless the user explicitly accepts the risk |

## Safety

- **Do not** recommend `--dangerously-skip-permissions` for shared repos or unreviewed automation.
- Headless runs can still edit files and run Bash — scope prompts clearly; use limits when the user wants bounded runs.

## Rate limits (`.cursor/claude-once.sh`)

If the script exits with code **125**, the upstream CLI hit a **rate limit**. Stderr includes:

- **`wait_seconds`** — minimum time before another `claude` / `claude-once.sh` attempt
- A line **`machine: CLAUDE_ONCE_EXIT=rate_limit CLAUDE_ONCE_WAIT_SECONDS=N`**
- If the API output did not contain a parseable delay, **`wait_seconds` uses** `CLAUDE_RATE_LIMIT_FALLBACK_SECONDS` (default **60**).

**Agent behavior:** Do **not** immediately retry `claude` or `./.cursor/claude-once.sh`. **Skip** that tool for **`wait_seconds`** (e.g. `sleep N` in the terminal, or stop and tell the user when they can retry). Only retry after that duration has passed (or after the user confirms the limit cleared).

Other failures use the CLI’s own exit code; stderr shows the full upstream message.

## Limitations

- In `-p` mode, ambiguous tasks may still need clarification; keep prompts **specific** to avoid stalls.
- For permission prompts in non-interactive mode, see `--permission-prompt-tool` in upstream docs if MCP handling is required.
