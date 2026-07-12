# Claims Register

This register records what I2P Connect may and must not claim in release-facing materials.

## Current Supported Claims

| Area | Supported wording | Evidence |
| --- | --- | --- |
| Foundation | The repository has doctrine, security boundaries, validation scripts, Codex automation, and release-claim guardrails. | Foundation docs, scripts, and workflows. |
| Runtime stack | TypeScript local package first is the accepted initial runtime direction. | `docs/DECISIONS/ADR-0002-runtime-stack.md`. |
| Local status model | The code maps supplied local status values to beginner-friendly copy, severity, advanced diagnostics, and redacted diagnostic helpers. It does not probe I2P services. | `src/status/` and `tests/status/`. |
| Identity model | The code creates and validates local profile metadata only. It does not create private keys or real I2P identities. | `src/identity/` and `tests/identity/`. |
| Contact invites | The code creates versioned public/shareable invite payloads with trust warnings. It does not include private keys, private destinations, router metadata, or contact graphs. | `src/contacts/` and `tests/contacts/`. |
| Message model | The code models local message fields, local status transitions, validation, and redacted views. It does not send messages, does not implement real encryption, does not confirm delivery, and does not claim full E2EE. | `src/messages/` and `tests/messages/`. |
| Route policy contracts | The code defines explicit route security policy contracts, a fail-closed startup policy guard, and a route security matrix builder for future endpoint layers. It does not implement active HTTP/WebSocket/IPC handlers yet. | `src/security/` and `tests/security/`. |
| Local route registry | The code defines a local route metadata registry for future endpoint implementation and startup policy validation. It does not start listeners or expose network services in this phase. | `src/server/routeDefinitions.ts` and `tests/security/startupPolicyGuard.test.ts`. |
| Supabase | Supabase is optional and non-sensitive only. No live Supabase integration exists. | `docs/SUPABASE_BOUNDARY.md` and `docs/SUPABASE_EXTENSION_PLAN.md`. |

## Forbidden Or Unsupported Claims

Release-facing materials must not claim guaranteed anonymity.

Release-facing materials must not claim full E2EE.

Release-facing materials must not claim SASE compliance.

Release-facing materials must not claim zero-trust compliance.

Release-facing materials must not claim Zoom-like real-time video.

Release-facing materials must not claim messages are sent over I2P until transport implementation, tests, and docs support that wording.

Release-facing materials must not claim message delivery confirmation until implementation, tests, and docs support that wording.

Release-facing materials must not claim private keys, private destinations, private messages, contact graphs, raw router logs, or deanonymizing metadata can be stored in Supabase.

## Claim Review Rule

Before adding or changing a release-facing claim, identify:

- the exact wording
- implementation evidence
- test evidence
- docs evidence
- known limitations
- whether `.\scripts\check-release-claims.ps1` passes

If evidence is missing, use planned, future, experimental, local-only, placeholder, or not promised wording.
