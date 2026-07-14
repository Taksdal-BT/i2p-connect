# Codex Task Board

## Ready

- Foundation PR review and merge
- Phase 5: Add audio note domain model and consent-state transitions with local-only constraints.
- Phase 6: Define optional integration metadata schemas that exclude sensitive classes by contract.
- Phase 8: Add regression tests for route policy coverage drift and fail-closed startup behavior.
- Phase 10: Add release-candidate claim evidence checklist tied to validation outputs and docs.

## In Progress

- None.

## Done

- Greenfield repository structure proposed.
- Codex automation layer committed.
- 01 runtime stack ADR: TypeScript local package first.
- 02 TypeScript skeleton: pure status mapping package and npm validation.
- 03 local I2P status model: severity, copy, advanced diagnostics, redaction, and fallback tests.
- 03b local router reachability contract: localhost-only reachable, unreachable, and misconfigured mapping with tests.
- 03c local SAM readiness contract: localhost-only session-ready, session-unavailable, and misconfigured mapping with tests.
- 03d selected transport readiness contract: localhost-only ready, unavailable, and misconfigured mapping with tests.
- 03e aggregate local readiness composer: fail-closed composition across router, SAM, and selected transport contracts.
- 03f beginner-facing local readiness summary formatter: concise ready, blocked, and unknown summary output.
- 03g typed status reasons for fail-closed misconfiguration: explicit router, SAM, and transport reason codes.
- 04b local identity persistence contracts: interface and contract assertion added, no backend implementation.
- 05b invite verification decision model: trust warning acknowledgement states and gate decisions.
- 06b local message store contracts: interface and test doubles added, no runtime transport backend.
- 06c envelope boundary checks: explicit non-cryptographic placeholder validation rules.
- 09b transport wiring and outbox worker: DI-based SAM session contract, polling worker loop, stream ACK timeout, and safe stream failure handling with tests.
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
