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

- router reachable check
- SAM or selected transport readiness check
- localhost-only connection defaults
- beginner setup states
- tests for reachable, unreachable, and misconfigured states

## Phase 3: Identity And Contacts

Goal: create local identity and verified invite foundations.

Deliverables:

- local identity model
- local persistence
- contact invite format
- verification UX
- backup/export warnings

## Phase 4: Private Message MVP

Goal: send a first private message after storage, transport, and cryptographic boundaries are implemented and tested.

Deliverables:

- message queue
- local message store
- app-layer envelope
- sanitized logging tests
- delivery/readiness states

## Phase 5: Audio Message Prototype

Goal: explore asynchronous audio notes as an experimental feature.

Deliverables:

- local audio capture prompt
- explicit permission copy
- local audio note storage
- experimental send flow
- real-time video is not promised

## Phase 6: Optional Non-Sensitive Integrations

Goal: add optional cloud-backed metadata only where safe.

Allowed examples:

- public docs index
- release dashboard
- sanitized opt-in metrics
- onboarding mission catalog
- community resources
- education/workshop metadata

Forbidden examples are listed in `docs/SUPABASE_BOUNDARY.md`.
