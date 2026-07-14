# I2P Connect

I2P Connect is a greenfield project for a secure, beginner-friendly, local-first, I2P-native communication platform for digital autonomy.

[![Validation](https://github.com/Taksdal-BT/i2p-connect/actions/workflows/validation.yml/badge.svg)](https://github.com/Taksdal-BT/i2p-connect/actions/workflows/validation.yml)
[![Release Claims](https://github.com/Taksdal-BT/i2p-connect/actions/workflows/release-claims.yml/badge.svg)](https://github.com/Taksdal-BT/i2p-connect/actions/workflows/release-claims.yml)
![TypeScript](https://img.shields.io/badge/runtime-TypeScript-blue)
![Local First](https://img.shields.io/badge/architecture-local--first-2f855a)
![Security Boundaries](https://img.shields.io/badge/security-honest%20claims%20only-red)
![Status](https://img.shields.io/badge/status-greenfield%20foundation-informational)

[![Run Local Verify](https://img.shields.io/badge/launcher-local--verify-111827)](scripts/local-release-verify.ps1)
[![Run Claim Check](https://img.shields.io/badge/launcher-claim--check-374151)](scripts/check-release-claims.ps1)
[![Open Roadmap](https://img.shields.io/badge/plan-roadmap-1d4ed8)](ROADMAP.md)
[![Open Contributing](https://img.shields.io/badge/contribute-guide-7c3aed)](CONTRIBUTING.md)
[![Open Security Model](https://img.shields.io/badge/security-model-b91c1c)](docs/SECURITY_MODEL.md)

This repository contains the foundation docs plus minimal TypeScript local status, localhost-only router, SAM, and selected transport readiness contract mapping, an aggregate local readiness composer, identity metadata, contact invite, and private message domain models. The runtime code is pure local domain logic only: it does not probe routers, open network connections, generate private keys, implement real encryption, send messages, create contact directories, add UI, or integrate with cloud services.

## Current Scope Snapshot

- Implemented now: local status contracts, local identity metadata, contact invite payload model, local-only message domain model, and fail-closed route policy contracts.
- Not implemented yet: active router probing, active SAM/transport probing, message delivery transport, real encryption, UI shell, cloud-backed sensitive storage.
- Security posture: local-first sensitive data handling, explicit limits on release claims, and validation-first contribution flow.

## Quick Launchers

Use these PowerShell launchers for common local workflows:

```powershell
# 1) Full local release gate
.\scripts\local-release-verify.ps1

# 2) TypeScript check, build, and tests
npm run check
npm run build
npm test

# 3) List codex prompts
.\scripts\codex\list-prompts.ps1

# 4) Run a codex task prompt (preview by default)
.\scripts\codex\run-codex-task.ps1 -Prompt .codex\commands\03_local_i2p_status_model.md
```

Launcher files:

- [Local release verify](scripts/local-release-verify.ps1)
- [Claim checker](scripts/check-release-claims.ps1)
- [Codex prompt list](scripts/codex/list-prompts.ps1)
- [Codex task runner](scripts/codex/run-codex-task.ps1)

## Quick Navigation

- [I2P Connect](#i2p-connect)
  - [Current Scope Snapshot](#current-scope-snapshot)
  - [Quick Launchers](#quick-launchers)
  - [Quick Navigation](#quick-navigation)
  - [First Run](#first-run)
  - [Project Highlights](#project-highlights)
  - [10-Phase To-Do](#10-phase-to-do)
  - [What I2P Connect Is](#what-i2p-connect-is)
  - [What I2P Connect Is Not](#what-i2p-connect-is-not)
  - [MVP Direction](#mvp-direction)
  - [Security Boundaries](#security-boundaries)
  - [Local-First Privacy Model](#local-first-privacy-model)
  - [Optional Future Integrations](#optional-future-integrations)
  - [Relationship To I2P\_knoks](#relationship-to-i2p_knoks)
  - [Repository Map](#repository-map)
  - [Validation](#validation)

## First Run

From a fresh clone:

```powershell
npm ci
.\scripts\local-release-verify.ps1
```

If Node.js is missing, install Node.js 22 or newer and reopen the shell.

## Project Highlights

| Area | Current state | Where to look |
| --- | --- | --- |
| Runtime style | Pure TypeScript local domain logic, no active network probing | [src/status/statusMapper.ts](src/status/statusMapper.ts) |
| I2P readiness modeling | Loopback-only router, SAM, and selected transport contract mapping with aggregate composition | [tests/status/statusMapper.test.ts](tests/status/statusMapper.test.ts) |
| Security boundaries | Honest claim gate, local-first sensitive data posture, fail-closed route policy contracts | [docs/SECURITY_MODEL.md](docs/SECURITY_MODEL.md) |
| Validation gate | Local release verify script runs claim checks, required-file checks, and npm checks | [scripts/local-release-verify.ps1](scripts/local-release-verify.ps1) |
| Contributor workflow | PR-sized changes, explicit validation evidence, no unsupported claims | [CONTRIBUTING.md](CONTRIBUTING.md) |

## 10-Phase To-Do

Legend: ![Complete](https://img.shields.io/badge/Complete-2ea043) complete, ![In Progress](https://img.shields.io/badge/In%20Progress-f59e0b) in progress, ![Planned](https://img.shields.io/badge/Planned-2563eb) planned.

| Phase | Status | Focus |
| --- | --- | --- |
| 1 | ![Complete](https://img.shields.io/badge/Complete-2ea043) | Repository foundation and doctrine baseline |
| 2 | ![In Progress](https://img.shields.io/badge/In%20Progress-f59e0b) | Local app skeleton completion and package ergonomics |
| 3 | ![In Progress](https://img.shields.io/badge/In%20Progress-f59e0b) | Local I2P readiness model completion for beginner-safe states |
| 4 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Identity and verified contact invite foundations |
| 5 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Private message MVP with storage and transport boundaries |
| 6 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Experimental audio message prototype with explicit consent UX |
| 7 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Optional non-sensitive integration layer only |
| 8 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Runtime security hardening pass and regression guardrails |
| 9 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Host integration and local UX shell wiring |
| 10 | ![Planned](https://img.shields.io/badge/Planned-2563eb) | Release candidate readiness, docs evidence, and final claim review |

## What I2P Connect Is

I2P Connect is planned as a calm communication layer for people who want private, user-controlled communication over I2P.

The product direction prioritizes:

- simple local setup
- measured I2P readiness
- local identity and contact control
- private messages after implementation and tests exist
- encrypted audio notes after implementation and tests exist
- responsible-use guidance before risky actions
- open-source trust and reviewable releases

## What I2P Connect Is Not

I2P Connect is not a Zoom clone. Real-time video is not promised.

Guaranteed anonymity, full E2EE, SASE, and zero-trust compliance are not promised in this foundation phase.

I2P Connect is not an emergency communication system, phone-network replacement, or enterprise compliance product.

## MVP Direction

The MVP should move in this order:

1. Local app shell and measured local status.
2. I2P router readiness checks using localhost-bound integration.
3. Local identity model and verified contact invites.
4. Private message MVP after storage, transport, and cryptographic boundaries are implemented and tested.
5. Audio message prototype as an experimental, measured feature.
6. Optional non-sensitive integration layer only after the local-first foundation is stable.

## Security Boundaries

The first release-facing security rule is honesty. A feature may be described as active, private, encrypted, routed, or release-ready only when implementation and validation support that wording.

I2P Connect must not:

- expose I2P router/admin/control ports publicly
- commit or log secrets
- store private I2P keys in cloud services
- store private destinations in cloud services
- store private messages in cloud services
- store raw router logs in cloud services
- store contact graphs in cloud services
- route sensitive diagnostics into third-party systems by default

## Local-First Privacy Model

Core communication state belongs on the user's device by default. Identity material, destinations, contacts, message bodies, router diagnostics, and exports should remain local unless a future feature explicitly documents a safer user-approved path.

Logs and diagnostics must be sanitized. The product should prefer measured local status such as "router reachable" or "SAM session ready" over broad privacy claims.

## Optional Future Integrations

Future integrations may support non-sensitive data only, such as public documentation indexes, release dashboards, sanitized opt-in metrics, onboarding mission catalogs, community resources, and workshop metadata.

Supabase, if used later, is optional and non-sensitive only. See `docs/SUPABASE_BOUNDARY.md`.

## Relationship To I2P_knoks

`I2P_knoks` may become a future host, Android integration, or companion repository. This repository remains the clean greenfield product foundation for I2P Connect and must not copy old `product/i2p-connect` paths from `I2P_knoks`.

## Repository Map

- `AGENTS.md`: persistent operating instructions for Codex and other agents.
- `PRODUCT_BRIEF.md`: product intent, audience, and boundaries.
- `ROADMAP.md`: safe PR-sized roadmap.
- `docs/`: architecture, security, integrations, responsible use, host setup, and ADRs.
- `product/`: MVP scope and onboarding missions.
- `.codex/`: task board and implementation prompts.
- `src/status/`: pure TypeScript status mapping, localhost-only router, SAM, and selected transport readiness contract mapping, aggregate local readiness composition, and safe diagnostic helpers.
- `src/identity/`: local profile metadata, validation, and safe identity views.
- `src/contacts/`: versioned public/shareable contact invite payloads.
- `src/messages/`: local-only private message domain model and redacted views.
- `tests/status/`: TypeScript status mapping tests.
- `tests/identity/`: TypeScript identity metadata tests.
- `tests/contacts/`: TypeScript contact invite tests.
- `tests/messages/`: TypeScript private message domain tests.

## Validation

Local TypeScript validation requires Node.js 22 or newer with `npm` on `PATH`.

Run local verification:

```powershell
.\scripts\local-release-verify.ps1
```

Run `npm ci` first on a fresh clone. The current verification checks whitespace, release claims, required files, onboarding mission JSON validity, and npm validation when `package.json` exists.
