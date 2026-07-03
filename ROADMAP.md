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

Status: in progress.

Goal: create local identity and verified invite foundations.

Deliverables:

- local identity metadata model: initial implementation added
- local persistence: not implemented yet
- contact invite format: initial versioned public payload added
- verification UX: trust warning copy modeled, UI not implemented
- backup/export warnings: warning state modeled, UI not implemented

## Phase 4: Private Message MVP

Status: in progress.

Goal: send a first private message after storage, transport, and cryptographic boundaries are implemented and tested.

Deliverables:

- message queue: local status transitions modeled, no transport yet
- local message store: not implemented yet
- app-layer envelope: placeholder only, no real encryption yet
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
