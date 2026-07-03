# Codex Task Board

## Ready

- Foundation PR review and merge

## In Progress

- None.

## Done

- Greenfield repository structure proposed.
- Codex automation layer committed.
- 01 runtime stack ADR: TypeScript local package first.
- 02 TypeScript skeleton: pure status mapping package and npm validation.
- 03 local I2P status model: severity, copy, advanced diagnostics, redaction, and fallback tests.
- 04 identity model: local metadata, validation, safe serialization, and secret redaction tests.
- 05 contact invite flow: versioned public invite payload, safe export, trust warnings, and validation tests.
- 06 private message model: local-only message fields, validation, transitions, redacted views, and tests.
- 07 Supabase extension plan: optional non-sensitive tables, RLS, secret rules, rollback, and advisor checklist.
- 08 GitHub release hardening: validation docs, claims register, PR checklist, and required-file gate.

## Rules

- Keep each task PR-sized.
- Preserve local-first security boundaries.
- Avoid unsupported security claims.
- Run validation before completion.
- Use `.codex/commands/` with `scripts/codex/run-codex-task.ps1` for runnable task prompts.
