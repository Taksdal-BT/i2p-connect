# Architecture

I2P Connect currently contains foundation documentation, a minimal TypeScript local status model, and a local-first identity metadata model. The runtime code is pure local domain logic only; it does not probe routers, open network connections, connect to SAM, inspect I2PTunnel, generate private keys, send messages, add UI, or integrate with cloud services.

## Architecture Goals

- Local-first communication state.
- Measured I2P readiness instead of assumed privacy.
- Beginner-friendly status and recovery paths.
- Least-privilege router integration.
- Optional, non-sensitive integrations only.
- Clear separation between planned, experimental, and implemented behavior.

## Planned Layers

1. Local application shell
   - Shows mode, status, onboarding missions, and local settings.
   - Does not depend on cloud services for core communication.

2. Local I2P status adapter
   - Currently maps supplied local status values to beginner-friendly copy, severity, and safe diagnostics.
   - Future work may detect whether a local I2P router is reachable.
   - Future router integration must use localhost-bound defaults.
   - Never exposes router/admin/control ports publicly.
   - Reports measured states such as "router reachable" or "SAM session ready" only after implementation.

3. Local identity model
   - Currently creates and validates local profile metadata only.
   - Tracks backup warning acknowledgement.
   - Safe views explicitly exclude secret-like fields.
   - Does not create, store, or upload private keys or private destinations.

4. Contact and invite layer
   - Supports verified contact setup.
   - Avoids cloud contact graphs.
   - Makes verification risk visible.

5. Message layer
   - Adds private messages only after storage, transport, and cryptographic boundaries are implemented and tested.
   - Full E2EE is not promised until implementation and tests support that claim.

6. Audio note layer
   - Starts as an experimental prototype after messaging foundations exist.
   - Real-time video is not promised.

7. Optional integration layer
   - May handle public docs, release dashboards, onboarding catalogs, community resources, or sanitized opt-in metrics.
   - Must follow `docs/SUPABASE_BOUNDARY.md`.

## Release Modes

`FOUNDATION_ONLY`

- Documentation, doctrine, validation, and prompts exist.
- No runtime communication code exists.

`LAB_EXPERIMENT`

- Prototype behavior may exist.
- It must be labeled experimental and not promoted as release-real behavior.

`RELEASE_REAL`

- Behavior is implemented, tested, documented, and validated.
- User-facing copy uses measured status and honest limits.

## Future Runtime Gate

Before runtime code is added, create a PR that selects the stack, build system, lint strategy, test strategy, and local storage approach. The PR must keep `.\scripts\local-release-verify.ps1` passing.
