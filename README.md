# I2P Connect

I2P Connect is a greenfield project for a secure, beginner-friendly, local-first, I2P-native communication platform for digital autonomy.

This repository contains the foundation docs plus minimal TypeScript local status and identity metadata models. The runtime code is pure local domain logic only: it does not probe routers, open network connections, generate private keys, send messages, add UI, or integrate with cloud services.

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
- `src/status/`: pure TypeScript status mapping and safe diagnostic helpers.
- `src/identity/`: local profile metadata, validation, and safe identity views.
- `tests/status/`: TypeScript status mapping tests.
- `tests/identity/`: TypeScript identity metadata tests.

## Validation

Run local verification:

```powershell
.\scripts\local-release-verify.ps1
```

The current verification checks whitespace, release claims, required files, onboarding mission JSON validity, and npm validation when `package.json` exists.
