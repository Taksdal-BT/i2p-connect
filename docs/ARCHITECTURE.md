# Architecture

I2P Connect is currently documentation-only. This file defines the intended architecture before runtime code is added.

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
   - Detects whether a local I2P router is reachable.
   - Uses localhost-bound router integration.
   - Never exposes router/admin/control ports publicly.
   - Reports measured states such as "router reachable" or "SAM session ready" only after implementation.

3. Local identity model
   - Stores identity material locally.
   - Supports backup/export only with explicit warnings.
   - Does not upload private keys or private destinations.

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
