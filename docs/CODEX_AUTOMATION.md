# Codex Automation

This repository includes a small PowerShell automation layer for running Codex work in reviewable, logged, PR-sized steps.

The automation does not add runtime dependencies and does not change product behavior. It creates local run logs under `.codex/runs/`, which are ignored by git.

## List Prompts

From the repository root:

```powershell
.\scripts\codex\list-prompts.ps1
```

The script verifies the repository root, verifies `.codex/commands/`, creates `.codex/runs/`, writes a timestamped log, and prints the available command prompt names.

## Run One Codex Task

Preview a task prompt and create a timestamped run bundle:

```powershell
.\scripts\codex\run-codex-task.ps1 -Prompt .codex\commands\01_runtime_stack_adr.md
```

Invoke an installed Codex CLI after reviewing the generated task file:

```powershell
.\scripts\codex\run-codex-task.ps1 -Prompt .codex\commands\01_runtime_stack_adr.md -InvokeCodex
```

By default, `-InvokeCodex` pipes the generated task prompt to `codex exec`. If your local Codex CLI uses different arguments, pass them with `-CodexArguments`.

The runner accepts prompt names from `.codex/commands/` with or without `.md`, and it also accepts repo-relative paths under `.codex/commands/`. It rejects paths outside that directory, creates `.codex/runs/`, writes a redacted log, and does not run destructive git operations. The runner does not push, tag, publish, or open pull requests.

## Validate After Task Completion

Run the automation wrapper:

```powershell
.\scripts\codex\run-validation.ps1
```

Or run the repository checks directly:

```powershell
.\scripts\local-release-verify.ps1
.\scripts\check-release-claims.ps1
```

Validation should be run after every Codex task and before any commit. If a task adds a future runtime stack, also run that stack's lint, typecheck, build, or test commands.

## Required Human Review Points

Human review is required before:

- committing changes
- pushing branches
- opening pull requests
- publishing releases or tags
- adding runtime dependencies
- adding cloud services
- changing security boundaries
- introducing identity, contact, message, audio, or I2P transport behavior
- changing release-facing claims

The automation may prepare logs and task prompts, but it does not grant permission to commit, push, publish, or broaden scope.

## OpSec Boundaries

Do not put secrets or sensitive I2P material in Codex prompts, command arguments, logs, issue text, or external tools.

Sensitive material includes private I2P keys, private destinations, private messages, invite secrets, router credentials, signing keys, API keys, service role keys, raw router logs, contact graphs, sensitive headers, unredacted telemetry, and deanonymizing metadata.

The scripts redact common secret-shaped values from console and log output, but redaction is a guardrail, not a substitute for keeping sensitive material out of prompts and logs.

Supabase and other cloud services are optional future layers for non-sensitive metadata only. They must not store private messages, private destinations, private keys, raw router logs, contact graphs, or deanonymizing metadata.

Claim guard: guaranteed anonymity, full E2EE, SASE, zero-trust, and real-time video are not promised.

## Next Command

After this automation layer is reviewed, a safe next planning command is:

```powershell
.\scripts\codex\run-codex-task.ps1 -Prompt .codex\commands\01_runtime_stack_adr.md
```

Recommended task order:

1. `00_commit_foundation`
2. `01_runtime_stack_adr`
3. `02_typescript_skeleton`
4. `03_local_i2p_status_model`
5. `04_identity_model`
6. `05_contact_invite_flow`
7. `06_private_message_model`
8. `07_supabase_extension_plan`
9. `08_github_release_hardening`

## Safe Continuation Prompt

When asking Codex to continue safely, use this operating prompt:

```text
Read AGENTS.md, DIGITAL_AUTONOMY_DOCTRINE.md, ROADMAP.md, docs/SECURITY_MODEL.md, docs/RESPONSIBLE_USE.md, product/MVP_SCOPE.md, and .codex/TASK_BOARD.md.

Choose the next safest PR-sized task.

Rules:
- no secrets
- no runtime dependency unless needed
- no cloud storage for sensitive I2P data
- no public exposure of I2P router/admin/control ports
- no unsupported anonymity, encryption, zero-trust, SASE, or real-time video claims
- update docs when behavior changes
- run validation before final summary

Output:
1. selected task
2. changed files
3. security notes
4. validation commands/results
5. known limitations
6. next PR-sized task
```

## Manual Commit Flow

After human review, the expected manual flow is:

```powershell
git status
git add .
git commit -m "Add Codex automation layer"
git push origin codex/i2p-connect-foundation
```

Do not run the commit or push steps from automation. They are intentional human review points.
