# Roadmap

This roadmap keeps the greenfield repository focused and honest.

## Phase 0: Repo Foundation

Status: current phase.

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

## Phase 1: Local App Skeleton

Goal: create a minimal local-first application shell.

Deliverables:

- selected runtime stack
- build and test pipeline
- local status surface
- clear mode labels
- sanitized diagnostics foundation

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
