# Roadmap

This roadmap keeps the greenfield repository focused and honest.

## Phase 0: Repo Foundation

Status: complete.

Acceptance criteria:

- doctrine exists
- product brief exists
- security model exists
- responsible-use guidance exists
- Supabase boundary exists
- onboarding direction exists
- Codex prompts exist
- validation scripts pass
- no runtime code is added
- initial runtime stack is documented in `docs/DECISIONS/ADR-0002-runtime-stack.md`

## M1 Runtime Direction

Initial stack: TypeScript local package first.

The first runtime PR should add pure local status logic only. It should not add UI, real network probing, I2P transport, Supabase, private key storage, contact syncing, or message transport.

## Phase 1: Local App Skeleton

Status: in progress.

Goal: create a minimal local-first TypeScript package before any UI shell.

Deliverables:

- selected runtime stack: complete
- build and test pipeline: initial skeleton added
- pure local status model: expanded with severity and unknown fallback
- clear mode labels: expanded with beginner-safe status copy
- sanitized diagnostics foundation: expanded with advanced diagnostics and redaction utility

## Phase 2: Local I2P Status

Goal: measure local I2P readiness.

Deliverables:

- router reachable check: initial localhost-only contract mapping added
- SAM or selected transport readiness check: initial localhost-only SAM contract mapping added
- selected transport readiness check: initial localhost-only contract mapping added
- aggregate local readiness composer: initial router-plus-SAM-plus-selected-transport composition added
- localhost-only connection defaults
- beginner setup states
- tests for reachable, unreachable, and misconfigured states: initial contract tests added

## Phase 3: Identity And Contacts

Status: in progress.

Goal: create local identity and verified invite foundations.

Deliverables:

- local identity metadata model: initial implementation added
- local persistence: interface contracts added, no backend implementation yet
- contact invite format: initial versioned public payload added
- verification UX: trust warning decision model and acknowledgement states added, UI not implemented
- backup/export warnings: warning state modeled, UI not implemented

## Phase 4: Private Message MVP

Status: in progress.

Goal: send a first private message after storage, transport, and cryptographic boundaries are implemented and tested.

Deliverables:

- message queue: outbox queue and worker state transitions modeled with DI-based SAM stream contract and timeouts, no real socket integration yet
- local message store: interface contracts and test doubles added, no backend implementation yet
- app-layer envelope: explicit non-cryptographic placeholder boundary checks added, no real encryption yet
- sanitized logging tests: redacted message view tests added
- delivery/readiness states: local states modeled, no delivery claim

## Phase 5: Audio Message Prototype

Goal: explore asynchronous audio notes as an experimental feature.

Deliverables:

- local audio capture prompt
- explicit permission copy
- local audio note storage
- experimental send flow
- real-time video is not promised

## Phase 6: Optional Non-Sensitive Integrations

Status: planned.

Goal: add optional cloud-backed metadata only where safe.

Allowed examples:

- public docs index
- release dashboard
- sanitized opt-in metrics
- onboarding mission catalog
- community resources
- education/workshop metadata

Forbidden examples are listed in `docs/SUPABASE_BOUNDARY.md`.

The optional Supabase extension plan is documented in `docs/SUPABASE_EXTENSION_PLAN.md`. No Supabase project, live migrations, policies, functions, seed data, credentials, or runtime integration exist yet.

## Foundation Hardening

Status: complete.

Deliverables:

- GitHub validation workflows run on push and pull requests
- release-claim guardrails documented in `docs/CLAIMS_REGISTER.md`
- validation process documented in `docs/VALIDATION.md`
- PR checklist added to `CONTRIBUTING.md`

## 10-Phase Execution Checklist

Legend: ![Complete](https://img.shields.io/badge/Complete-2ea043) complete, ![In Progress](https://img.shields.io/badge/In%20Progress-f59e0b) in progress, ![Planned](https://img.shields.io/badge/Planned-2563eb) planned.

| Phase | Status | Focus |
| --- | --- | --- |
| 1 | ![Complete](https://img.shields.io/badge/Complete-2ea043) | Repo foundation and doctrine |
| 2 | ![In Progress](https://img.shields.io/badge/In%20Progress-f59e0b) | Local app skeleton completion |
| 3 | ![In Progress](https://img.shields.io/badge/In%20Progress-f59e0b) | Local I2P status model completion |
| 4 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Identity and contacts completion |
| 5 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Private message MVP completion |
| 6 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Audio message prototype completion |
| 7 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Optional non-sensitive integrations |
| 8 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Runtime security hardening and regression guardrails |
| 9 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Host integration and local UX shell wiring |
| 10 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Release candidate readiness and final claims review |

## Near-Term Roadmap Queue

Use this queue to execute the next PR-sized changes in order.

1. Phase 2: Add a beginner-facing local readiness summary formatter for composed status outcomes.
2. Phase 2: Add explicit typed status reasons for fail-closed router, SAM, and transport misconfiguration paths.
3. Phase 3: Introduce local identity persistence interface contracts with no storage backend implementation.
4. Phase 3: Add invite verification decision model for trust warnings and user acknowledgement states.
5. Phase 4: Add local message store interface contracts and test doubles (no runtime transport).
6. Phase 4: Add envelope boundary checks that keep placeholder encryption clearly non-cryptographic.
7. Phase 5: Add audio note domain model and consent-state transitions with local-only constraints.
8. Phase 6: Define optional integration metadata schemas that exclude sensitive classes by contract.
9. Phase 8: Add regression tests for route policy coverage drift and fail-closed startup behavior.
10. Phase 10: Add release-candidate claim evidence checklist tied to validation outputs and docs.
