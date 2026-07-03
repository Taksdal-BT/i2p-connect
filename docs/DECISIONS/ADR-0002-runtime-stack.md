# ADR-0002: Runtime Stack

## Status

Accepted.

## Context

I2P Connect needs a first runtime path that can model local status, identity, contacts, messages, and sanitized diagnostics before UI, transport, or optional integrations are added.

The first runtime work must preserve the repository's current constraints:

- local-first communication state
- fast validation on a Windows PowerShell host
- easy Codex iteration in small PRs
- no premature UI complexity
- no public exposure of I2P router/admin/control ports
- no cloud storage for private I2P keys, private destinations, private messages, router logs, or contact graphs
- measured release-facing language only after implementation and tests exist

## Decision

Use a TypeScript local package as the initial M1 runtime path.

The first runtime PR should add a small TypeScript package for pure local status logic only. It should not add UI, I2P network probing, I2P transport, Supabase, private key storage, contact syncing, or message transport.

The first implementation target is:

- `package.json`
- `tsconfig.json`
- minimal test setup
- pure status-domain modules under `src/status/`
- tests under `tests/status/`
- validation hooks so local release verification runs npm checks when `package.json` exists

## Alternatives Considered

| Option | Assessment | Decision |
| --- | --- | --- |
| TypeScript local package first | Smallest safe first step. Fast tests, good domain modeling, simple Codex iteration, and no UI commitment. Can later expose logic to host apps. | Selected. |
| Kotlin/Android first | Useful for future Android integration, but it would bind the first runtime work to app/UI concerns before the core domain model is stable. | Defer. |
| Go service first | Strong future option for a local daemon or status service, but it adds service lifecycle and packaging concerns too early. | Defer. |
| Rust service first | Strong future option for low-level transport or cryptographic components, but it is heavier for the first domain-modeling PR. | Defer. |
| Electron/Tauri shell first | Useful later for desktop UX, but it introduces UI and packaging complexity before the core safety model exists. | Defer. |

## Consequences

- The next PR can add runtime code without choosing a UI shell.
- The first code can stay pure, deterministic, and easy to test.
- Future I2P SAM or I2PTunnel integration remains possible after local status modeling is tested.
- Future `I2P_knoks` integration remains possible through documented local modules instead of copied legacy paths.
- Go, Rust, Kotlin/Android, and Tauri remain available for later focused decisions.

## Validation Expectations

Until `package.json` exists, continue running:

```powershell
.\scripts\local-release-verify.ps1
.\scripts\check-release-claims.ps1
```

After the TypeScript skeleton is added, local validation should include:

```powershell
npm run check
npm run build
npm test
.\scripts\local-release-verify.ps1
.\scripts\check-release-claims.ps1
```

The TypeScript skeleton PR must update `scripts/local-release-verify.ps1` so npm validation runs automatically when `package.json` exists.
